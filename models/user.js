const {DataTypes}=require('sequelize');
const sequelize = require('../utils/db-connection');

const userModel = sequelize.define('user',{
    id:{
        primaryKey:true,
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isPremium:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    totalExpense:{
        type:DataTypes.FLOAT,
        defaultValue:'0'
    }
})

module.exports = userModel;