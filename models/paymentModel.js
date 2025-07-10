const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
      orderId:{
        type:String,
        required:true,
    },
    paymentSessionId:{
        type:String,
        required:true,

    },
    orderAmount:{
        type:Number,
        required:true,
    },
    orderCurrency:{
        type:String,
        required:true,
    },
    paymentStatus:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
},{timestamps:true});

const paymentModel = new mongoose.model(
    "payments",
    paymentSchema
)

module.exports = paymentModel;