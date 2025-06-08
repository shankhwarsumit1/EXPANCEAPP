const { userModel } = require('../models');
const expenseModel = require('../models/expenceModel');
const sequelize = require('../utils/db-connection');
const addExpense = async (req,res)=>{
    try{const transaction = await sequelize.transaction(); 
        const {amount}=req.body;
         const user = await userModel.findByPk(req.user.id);
         const addedExpense = await expenseModel.create({...req.body,userId: req.user.id},{transaction});
         const updatedExpense = parseFloat(user.totalExpense) + parseFloat(amount);          
         await userModel.update(
            {totalExpense:updatedExpense},
            {where:{id:req.user.id},transaction},
         )
         await transaction.commit();
         res.status(201).json(addedExpense);
    }
    catch(err){
        console.log(err);
        await transaction.rollback();
        res.status(500).send('inernal server error');
        }
    }

const isPremium = async(req,res)=>{
    try{
       const user = await userModel.findOne({where:{id:req.user.id}});
       return res.status(200).json({isPremium:user.isPremium});
    }
    catch(err){
       console.log(err);
       res.status(500).send(err.message);
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
    try{const transaction = await sequelize.transaction(); 
      const ExpenseId = req.params.id;
      const userId = req.user.id;
      const expense = await expenseModel.findByPk(ExpenseId);
      const user = await userModel.findByPk(userId);
      const delExp = await expenseModel.destroy({where:{id:req.params.id, userId: req.user.id},transaction});
      if(delExp===0){
        return res.status(401).json({success:false,message:'expense not found or not authorized'})
      }
      const updatedExpense = parseFloat(user.totalExpense) - parseFloat(expense.amount);          
      await userModel.update(
            {totalExpense:updatedExpense},
            {where:{id:req.user.id},transaction}
         )
    await transaction.commit();
      res.status(200).json({success:true,message:'expense deleted'});
    }
    catch(err){
        await transaction.rollback();
        res.status(500).send({success:false,message:'internal server error'});
    }
}

const downloadExpense = async(req,res)=>{
    try{
         const userId = req.user.id;

         const expenses = await expenseModel.findAll({where:{userId}});

         let csv = 'Amount,Description,Category,CretedAt\n';
//This is the header row of the CSV file — the first line in the file that names the columns.
         expenses.forEach(exp=>{
            csv +=`${exp.amount},${exp.description},${exp.category},${exp.createdAt}\n`;
         });
//For each exp (an expense), you add one line of comma-separated values to the CSV.
         res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
//Don’t show this content in the browser — download it as a file, and name it expenses.csv.”
         res.set('Content-Type','text/csv');
         res.status(200).send(csv);
    }
    catch(err){
        console.log(err);
        res.status(500).json({'error':err.message});
    }
}

    module.exports = {addExpense,getExpense,delExpense,isPremium,downloadExpense};
