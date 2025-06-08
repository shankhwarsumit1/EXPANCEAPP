const userModel = require('./user');
const expenseModel = require('./expenceModel');
const paymentModel = require('./paymentModel');
const forgotpasswordRequestsModel = require('./forgotPasswordRequestModel');

userModel.hasMany(expenseModel,{foreignKey:'userId'});
expenseModel.belongsTo(userModel,{foreignKey:'userId'});

userModel.hasMany(paymentModel,{foreignKey:'userId'});
paymentModel.belongsTo(userModel,{foreignKey:'userId'}); 

userModel.hasMany(forgotpasswordRequestsModel,{foreignKey:'userId'});
forgotpasswordRequestsModel.belongsTo(userModel,{foreignKey:'userId'});

module.exports = {userModel,expenseModel,paymentModel}