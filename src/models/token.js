const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');
const User = require('./user');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    accessExpiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    refreshExpiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
})

Token.belongsTo(User);

module.exports = Token;
