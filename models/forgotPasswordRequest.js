const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');
const User = require('./user');

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Association: Many requests to one user
User.hasMany(ForgotPasswordRequest, { foreignKey: 'userId' });
ForgotPasswordRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = ForgotPasswordRequest;