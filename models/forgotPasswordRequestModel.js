const mongoose = require('mongoose');


const forgotpasswordRequestsSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    isactive:{
        type:Boolean,
        default:false
    }
})

const forgotpasswordRequestsModel = new mongoose.model(
    "forgotpasswordRequest",
    forgotpasswordRequestsSchema
)

module.exports = forgotpasswordRequestsModel;