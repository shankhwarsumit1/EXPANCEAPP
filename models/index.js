const User = require('./user');
const Expense = require('./expenceModel');

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Expense };