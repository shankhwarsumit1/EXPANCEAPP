const mongoose = require('mongoose');


const expenceSchema = new mongoose.Schema({
    amount:{
          type:Number,
          required:[true,'amount is mandatory'],
    },
    description:{
        type:String,  
    },
    category:{
        type:String,
    },
    userId:{
        type:Number,
         required:[true,'userId is mandatory'],
         ref:"Users"
    },
},{timestamps:true});

const expenseModel = new mongoose.model(
    "expenses",
    expenceSchema
)


module.exports = expenseModel;