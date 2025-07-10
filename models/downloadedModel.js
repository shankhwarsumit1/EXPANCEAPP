const mongoose = require('mongoose');

const downloadedSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    url:{
        type:String,
        required:true,
    }
},{timestamps:true})

const downloadedModel = new mongoose.model(
    "download",
    downloadedSchema
)

module.exports = downloadedModel;