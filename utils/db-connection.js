const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(`${process.env.URL}`);
}

module.exports=connectDB;