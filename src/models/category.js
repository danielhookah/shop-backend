const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const Product = require('./product');

const Category = db.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Category;
