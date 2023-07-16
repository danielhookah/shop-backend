const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const Category = require("./category");

const Attribute = db.define('Attribute', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Attribute.belongsTo(Category, {
    foreignKey: 'categoryId'
});
Category.hasMany(Attribute);

module.exports = Attribute;
