const {DataTypes, INTEGER} = require('sequelize');
const sequelize = require('../utils/db-connection');

const expenceModel = sequelize.define('expence',{
    id:{ primaryKey:true,
         autoIncrement:true,
         allowNull:false,
         type:DataTypes.INTEGER
    },
    amount:{
          type:DataTypes.INTEGER,
          allowNull:false
    },
    description:{
        type:DataTypes.STRING,  
    },
    category:{
        type:DataTypes.STRING,
    },
    userId:{
        type:INTEGER,
        allowNull:false  
    }
})

module.exports = expenceModel;