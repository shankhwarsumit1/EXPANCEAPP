const mongoose = require('mongoose');

const downloadedSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true
    },
    url:{
        type:String,
        require:true,
    }
},{timestamps:true})

const downloadedModel = new mongoose.model(
    "download",
    downloadedSchema
)

module.exports = downloadedModel;