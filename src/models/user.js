const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'vendor', 'user'),
        allowNull: false,
        defaultValue: 'user',
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
});

User.beforeCreate(async (user) => {
    user.password = user.password && user.password !== "" ? bcrypt.hashSync(user.password, 10) : "";
});

module.exports = User;
