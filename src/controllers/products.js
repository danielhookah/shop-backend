const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const fs = require('fs');
const { deleteImage } = require("../services/upload");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'categories', through: { attributes: [] } },
            ],
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'categories', through: { attributes: [] } },
            ],
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createProduct = async (req, res) => {
    const { name, price, userId, categoryIds } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const categories = await Category.findAll({ where: { id: categoryIds } });

        // Check if image files are present in the request
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map((file) => file.path);
            // Include the imagePaths in the product creation
            const product = await Product.create({ name, price, imagePaths });
            await product.setUser(user);
            await product.setCategories(categories);
            res.status(201).json(product);
        } else {
            // If no image is uploaded, create the product without imagePaths
            const product = await Product.create({ name, price });
            await product.setUser(user);
            await product.setCategories(categories);
            res.status(201).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, availableCount, userId, categoryIds } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (userId && userId !== product.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (categoryIds) {
            const categories = await Category.findAll({ where: { id: categoryIds } });
            if (categories.length !== categoryIds.length) {
                return res.status(404).json({ message: 'One or more categories not found' });
            }
            await product.setCategories(categories);
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.availableCount = availableCount || product.availableCount;

        // Check if new image files are present in the request
        if (req.files && req.files.length > 0) {
            // Delete old image files
            if (product.imagePaths && product.imagePaths.length > 0) {
                for (const imagePath of product.imagePaths) {
                    deleteImage(imagePath);
                }
            }
            // Update the imagePaths with the new file paths
            product.imagePaths = req.files.map((file) => file.path);
        }

        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (req.userId !== product.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Delete image files
        if (product.imagePaths && product.imagePaths.length > 0) {
            for (const imagePath of product.imagePaths) {
                deleteImage(imagePath);
            }
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
