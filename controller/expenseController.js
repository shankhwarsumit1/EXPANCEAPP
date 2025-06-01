const expenseModel = require('../models/expenceModel');

const addExpense = async (req,res)=>{
    try{
         const addedExpense = await expenseModel.create({...req.body});
         res.status(201).json(addedExpense);
    }
    catch(err){
        console.log(err);
        res.status(500).send('inernal server error');
        }
    }

const getExpense = async (req,res)=>{
    try{
        const expense = await expenseModel.findAll();
        res.status(200).json(expense);
    }
    catch(err){
        res.status(500).send(err);
    }
}

    module.exports = {addExpense,getExpense};
