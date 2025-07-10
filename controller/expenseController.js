const User = require('../models/user');
const Expense = require('../models/expenceModel');
const S3Service = require('../services/S3service');
const downloadedModel = require('../models/downloadedModel');
const {
    default: mongoose
} = require('mongoose');

const addExpense = async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    try {
        const {
            amount,
            description,
            note,
            category
        } = req.body;
        const user = await User.findById(req.user._id).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({
                msg: 'user not found'
            });
        }
        const addedExpense = await Expense.create(
            [{
                amount,
                description,
                note,
                category,
                userId: req.user._id
            }, ], {
                session
            });
        const updatedExpense = parseFloat(user.totalExpense) + parseFloat(amount);
        user.totalExpense = updatedExpense;
        await user.save({
            session
        });

        await session.commitTransaction();
        res.status(201).json(addedExpense[0]);
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        res.status(500).send('inernal server error');
    } finally {
        session.endSession();
    }
};

const isPremium = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.user._id
        });
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        return res.status(200).json({
            isPremium: user.isPremium
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

const getExpense = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        let limit = parseInt(req.query.limit) || 5;
        let range = req.query.range;
        const offset = (page - 1) * limit;
        let dataFilter = {};
        const now = new Date();

        if (range === 'daily') {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            dataFilter.createdAt = {
                $gte: start,
                $lte: end
            }
        } else if (range === 'weekly') {
            const start = new Date(now);
            start.setDate(start.getDate() - start.getDay()); //sunday of current week
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            dataFilter.createdAt = {
                $gte: start,
                $lte: end
            }

        } else if (range === 'monthly') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            dataFilter.createdAt = {
                $gte: start,
                $lte: end
            }
        };

        const query = {
            userId: req.user._id,
            ...dataFilter
        };
        const [totalExpenses, content] = await Promise.all([
            Expense.countDocuments(query),
            Expense.find(query).sort({
                createdAt: -1
            }).skip(offset).limit(limit).lean()
        ])

        const totalPages = Math.ceil(totalExpenses / limit);
        const previousPage = page > 1 ? page - 1 : null;

        res.status(200).json({
            success: true,
            data: {
                'totalItems': totalExpenses,
                'totalPages': totalPages,
                'hasNextPage': page < totalPages,
                'hasPreviousPage': page > 1,
                'previousPage': previousPage,
                'limit': limit,
                'content': content
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

const delExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const ExpenseId = req.params._id;
        const userId = req.user._id;
         if (!mongoose.Types.ObjectId.isValid(ExpenseId)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Invalid expense id' });
    }
        const expense = await Expense.findOne({
                    _id: ExpenseId,
                    userId
                },
                "amount userId"
            ).populate("userId", "_id totalExpense")
            .session(session);

        if (!expense) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Expense not found or not authorized'
            });
        }


        const delExp = await Expense.deleteOne({
            _id: ExpenseId,
            userId
        }, {
            session
        });
        if (delExp.deletedCount === 0) {
            await session.abortTransaction();
            return res.status(401).json({
                success: false,
                message: 'expense not found or not authorized'
            })
        }

        const user = expense.userId;

        const updatedExpense = parseFloat(user.totalExpense || 0) - parseFloat(expense.amount || 0);
        user.totalExpense = updatedExpense >= 0 ? updatedExpense : 0;
        await user.save({
            session
        });
        await session.commitTransaction();
        res.status(200).json({
            success: true,
            message: 'expense deleted'
        });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).send({
            success: false,
            message: 'internal server error'
        });
    } finally {
        session.endSession();
    }
}

const downloadExpense = async (req, res) => {
    try {
        const userId = req.user.id;

        const expenses = await Expense.find({
            userId
        });

        let csv = 'Amount,Description,note,Category,CreatedAt\n';
        expenses.forEach(exp => {
            csv += `${exp.amount},${exp.description},${exp.note},${exp.category},${exp.createdAt}\n`;
        });

        const filename = `Expense${userId},${new Date().toISOString}.txt`;
        const fileURL = await S3Service.uploadToS3(csv, filename);
        await downloadedModel.create({
            userId: req.user.id,
            url: fileURL
        })

        res.status(200).json({
            success: true,
            fileURL
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            'error': err.message
        });
    }
}

module.exports = {
    addExpense,
    getExpense,
    delExpense,
    isPremium,
    downloadExpense
};