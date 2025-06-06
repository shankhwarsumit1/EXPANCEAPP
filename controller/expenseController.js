const expenseModel = require('../models/expenceModel');
const userModel = require('../models/user');
const db = require('../utils/db-connection'); // Sequelize instance

const addExpense = async (req, res) => {
    const t = await db.transaction();
    try {
        const addedExpense = await expenseModel.create(
            { ...req.body, userId: req.user.id },
            { transaction: t }
        );

        // Update user's totalExpense
        const user = await userModel.findByPk(req.user.id, { transaction: t });
        user.totalExpense += parseFloat(addedExpense.amount);
        await user.save({ transaction: t });

        await t.commit();
        res.status(201).json(addedExpense);
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).send('internal server error');
    }
};

const getExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ expense, success: true });
    } catch (err) {
        res.status(500).send(err);
    }
};

const delExpense = async (req, res) => {
    const t = await db.transaction();
    try {
        const expense = await expenseModel.findOne({
            where: { id: req.params.id, userId: req.user.id },
            transaction: t
        });
        if (!expense) {
            await t.rollback();
            return res.status(401).json({ success: false, message: 'expense not found or not authorized' });
        }

        // Update user's totalExpense
        const user = await userModel.findByPk(req.user.id, { transaction: t });
        user.totalExpense -= parseFloat(expense.amount);
        if (user.totalExpense < 0) user.totalExpense = 0;
        await user.save({ transaction: t });

        await expense.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ success: true, message: 'expense deleted' });
    } catch (err) {
        await t.rollback();
        res.status(500).send({ success: false, message: 'internal server error' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const userId = req.user.id;

        const { count: totalCount, rows: expense } = await expenseModel.findAndCountAll({
            where: { userId },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ expense, totalCount });
    } catch (err) {
        console.error("Pagination fetch error:", err);
        res.status(500).json({ message: "Failed to fetch expenses", error: err });
    }
};

module.exports = { addExpense, getExpense, delExpense };
