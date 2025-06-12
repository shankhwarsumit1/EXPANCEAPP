const userModel = require('../models/user');
const downloadedModel = require('../models/downloadedModel');
const {fn,col,literal} =require('sequelize');

const showLeaderBoard = async(req,res)=>{
    try{
    const results = await userModel.findAll({order:[['totalExpense','DESC']]});
    res.status(200).json(results);

    }
    catch(error){
        console.log(error.message);
        res.status(500).json({error:error.message,message:'showLeaderBoard failed'});
    }
};

const getDownloadedFiles = async(req,res)=>{
    try{
        console.log(req.user.id);
       const response = await downloadedModel.findAll({where:{userId:req.user.id}});
       if(!res){
        return res.status(404).json({success:false,error:'404 not found'});
       }
       res.status(200).json({success:true,data:response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});
    }
};

module.exports = {showLeaderBoard,getDownloadedFiles};