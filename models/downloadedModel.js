const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connection');

const downloadedModel = sequelize.define('filesDownloaded',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = downloadedModel;