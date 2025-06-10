const { userModel } = require('../models');
const expenseModel = require('../models/expenceModel');
const sequelize = require('../utils/db-connection');
const {Op} = require('sequelize');
const addExpense = async (req,res)=>{
    try{const transaction = await sequelize.transaction(); 
        const {amount,description,note,category}=req.body;
         const user = await userModel.findByPk(req.user.id);
         const addedExpense = await expenseModel.create({amount,description,note,category,userId: req.user.id},{transaction});
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
    try{ let pageInt = parseInt(req.query.page)||1;
         let limit = parseInt(req.query.limit);
         let range = req.query.range;
         if(pageInt > 0){
            page = pageInt;
         }
        const offset = (page-1)*limit;
        let dataFilter = {};
        const now = new Date();

        if(range==='daily'){
            const start = new Date(now);
            start.setHours(0,0,0,0);
            const end = new Date(now);
            end.setHours(23,59,59,999);
            dataFilter = {
                createdAt:{[Op.between]:[start,end]}
            };
        }
        else if(range==='weekly'){
            const start = new Date(now);
            start.setDate(start.getDate()-start.getDay());
            start.setHours(0,0,0,0);
            const end = new Date(start);//sunday of current week
            end.setDate(end.getDate()+6);
            end.setHours(23,59,59,999);
            dataFilter = {
                createdAt:{[Op.between]:[start,end]}
            };
        }
        else if(range==='monthly'){
            const start  = new Date(now.getFullYear(),now.getMonth(),1);
            start.setHours(0,0,0,0);
            const end = new Date(now.getFullYear(),now.getMonth()+1,0);
            end.setHours(23,59,59,999);
            dataFilter = {
                createdAt:{[Op.between]:[start,end]}
            };
        };

        const whereClause = {userId:req.user.id,...dataFilter};
        const result = await expenseModel.findAndCountAll({limit:limit,offset:offset,where:whereClause});
        const totalPages = Math.ceil(result.count/limit);
        const previousPage= page>1?page-1:null;

        res.status(200).json({success: true,data:{
            'totalItems':result.count,
            'totalPages':totalPages,
            'hasNextPage':page<totalPages,
            'hasPreviousPage':page>1,
            'previousPage':previousPage,
            'limit':limit,
            'content':result.rows}});
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
