const expenseModel = require('../models/expenceModel');
const userModel = require('../models/user');

const addExpense = async (req,res)=>{
    try{
         const addedExpense = await expenseModel.create({...req.body,userId: req.user.id});

        // Update user's totalExpense
        const user = await userModel.findByPk(req.user.id);
        user.totalExpense += parseFloat(addedExpense.amount);
        await user.save();

         res.status(201).json(addedExpense);
    }
    catch(err){
        console.log(err);
        res.status(500).send('internal server error');
        }
    }

const getExpense = async (req,res)=>{
    try{
        const expense = await expenseModel.findAll({where:{userId:req.user.id}});
        res.status(200).json({expense,success: true});
    }
    catch(err){
        res.status(500).send(err);
    }
}

const delExpense = async(req,res)=>{
    try{
        const expense = await expenseModel.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!expense) {
            return res.status(401).json({ success: false, message: 'expense not found or not authorized' });
        }

        // Update user's totalExpense
        const user = await userModel.findByPk(req.user.id);
        user.totalExpense -= parseFloat(expense.amount);
        if (user.totalExpense < 0) user.totalExpense = 0;
        await user.save();

        await expense.destroy();

      res.status(200).json({success:true,message:'expense deleted'});
    }
    catch(err){
        res.status(500).send({success:false,message:'internal server error'});
    }
}


    module.exports = {addExpense,getExpense,delExpense};
