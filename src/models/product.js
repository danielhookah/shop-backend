const { DataTypes, Sequelize} = require('sequelize');
const sequelize = require('../../config/dbConfig');
const User = require('./user');
const Category = require('./category');
const Attribute = require('./attribute');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    availableCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imageUrls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    userId: {
        field: 'userId',
        type: DataTypes.INTEGER
    },
    categoryId: {
        field: 'categoryId',
        type: DataTypes.UUID
    }
});

Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: "CategoryId"
});
Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: "CategoryId"
});

Product.belongsTo(User, {
    foreignKey: 'userId',
    as: 'UserId'
});
User.hasMany(Product, {
    foreignKey: 'userId',
    as: 'UserId'
});

const ProductAttribute = sequelize.define('ProductAttribute', {
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
    AttributeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Attribute,
            key: 'id'
        }
    }
});

Product.belongsToMany(Attribute, { through: ProductAttribute, as: "attributes" });
Attribute.belongsToMany(Product, { through: ProductAttribute, as: "attributes" });

module.exports = Product
