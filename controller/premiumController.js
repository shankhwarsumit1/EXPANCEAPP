const userModel = require('../models/user');
const expenseModel = require('../models/expenceModel');
const {fn,col,literal} =require('sequelize');

exports.showLeaderBoard = async(req,res)=>{
    try{
    const results = await userModel.findAll({
        attributes:[
            'name',
            [fn('SUM',col('expences.amount')),'totalExpense']
        ],
        include:[
            {
                model:expenseModel,
                attributes:[],
                required:false
            }],
            group:['user.id','user.name'],
            order:[[literal('totalExpense'),'DESC']]
    });
    res.status(200).json(results);

    }
    catch(error){
        console.log(error.message);
        res.status(500).json({error:error.message,message:'showLeaderBoard failed'});
    }
}