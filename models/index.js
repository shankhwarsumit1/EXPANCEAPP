const userModel = require('./user');
const expenseModel = require('./expenceModel');

userModel.hasMany(expenseModel,{foreignKey:'userId'});
expenseModel.belongsTo(userModel,{foreignKey:'userId'});

module.exports = {userModel,expenseModel}