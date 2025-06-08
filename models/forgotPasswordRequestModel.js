const {DataTypes} = require('sequelize');
const sequalize = require('../utils/db-connection');
const forgotpasswordRequestsModel = sequalize.define('ForgotPasswordRequest',{
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

module.exports = forgotpasswordRequestsModel;