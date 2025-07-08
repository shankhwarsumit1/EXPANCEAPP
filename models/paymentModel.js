const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentSessionId:{
        type:String,
        require:true,

    },
    orderAmount:{
        type:Number,
        require:true,
    },
    orderCurrency:{
        type:String,
        require:true,
    },
    paymentStatus:{
        type:String,
        require:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        require:true
    }
},{timestamps:true});

const paymentModel = new mongoose.model(
    "payments",
    paymentSchema
)

module.exports = paymentModel;