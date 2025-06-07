const userModel = require('./user');
const expenseModel = require('./expenceModel');
const paymentModel = require('./paymentModel');

userModel.hasMany(expenseModel,{foreignKey:'userId'});
expenseModel.belongsTo(userModel,{foreignKey:'userId'});

userModel.hasMany(paymentModel,{foreignKey:'userId'});
paymentModel.belongsTo(userModel,{foreignKey:'userId'}); 

module.exports = {userModel,expenseModel,paymentModel}