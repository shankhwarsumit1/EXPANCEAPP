const expenseModel = require('../models/expenceModel');

const addExpense = async (req,res)=>{
    try{
         const addedExpense = await expenseModel.create({...req.body,userId: req.user.id});
         res.status(201).json(addedExpense);
    }
    catch(err){
        console.log(err);
        res.status(500).send('inernal server error');
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
      const delExp = await expenseModel.destroy({where:{id:req.params.id, userId: req.user.id}});
      console.log(delExp);
      if(delExp===0){
        return res.status(401).josn({success:false,message:'expense not found or not authorized'})
      }
      res.status(200).json({success:true,message:'expense deleted'});
    }
    catch(err){
        res.status(500).send({success:false,message:'internal server error'});
    }
}


    module.exports = {addExpense,getExpense,delExpense};
