const mongoose = require('mongoose');


const forgotpasswordRequestsSchema = new mongoose({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true
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