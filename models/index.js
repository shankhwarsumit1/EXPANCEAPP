const User = require('./user');
const Expense = require('./expenceModel');
const ForgotPasswordRequest = require('./forgotPasswordRequest');

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ForgotPasswordRequest, { foreignKey: 'userId' });
ForgotPasswordRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Expense, ForgotPasswordRequest};