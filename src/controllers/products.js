const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const Attribute = require('../models/attribute');
const {deleteImage} = require("../services/upload");

const getAllProducts = async (req, res) => {
    try {
        const where = req.query.categoryId ? {categoryId: req.query.categoryId} : {}
        const include = (req.query?.attributes && req.query?.attributes.length > 0)
            ? [{
                model: Attribute,
                as: 'attributes',
                attributes: ["id", "name", "value"],
                require: true,
                where: {id: req.query.attributes}
            }]
            : [{
                model: Attribute,
                as: 'attributes',
                attributes: ["id", "name", "value"],
                require: true,
            }]

        const products = await Product.findAll({where, include});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const getProductById = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: [
                {model: Attribute, as: "attributes", through: {attributes: []}},
            ],
        });
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const createProduct = async (req, res) => {
    const {
        name,
        description,
        availableCount,
        price,
        attribute,
        categoryId
    } = req.body;
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }

        if (req.files && req.files.length > 0) {
            const filepath = (process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + req.headers.host + '/public/uploads/'
            const imageUrls = req.files.map((file) => filepath + file.filename);
            const product = await Product.create({
                name,
                description,
                availableCount,
                price,
                imageUrls,
                categoryId,
                userId: user.dataValues.id
            }, {
                include: [{model: User, as: 'UserId'}, {model: Category, as: 'CategoryId'}]
            });
            await product.setAttributes(attribute, {status: 'active'});
            res.status(201).json({...product.dataValues, attributes: attribute});
        } else {
            const product = await Product.create({
                name,
                description,
                availableCount,
                price,
                categoryId,
                userId: user.dataValues.id
            }, {
                include: [{model: User, as: 'UserId'}, {model: Category, as: 'CategoryId'}]
            });
            res.status(201).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {
        name,
        description,
        availableCount,
        price,
        attribute,
        categoryId
    } = req.body;
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        if (req.userId !== product.userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const imagesToDelete = product.dataValues?.imageUrls.filter(x => !req.body?.imageUrls?.includes(x)) || [];
        const imagesToSave = req.body?.imageUrls?.filter(x => !imagesToDelete.includes(x)) || [];
        imagesToDelete.forEach(el => {
            deleteImage(el);
        })

        let imageUrls = []
        if (req.files && req.files.length > 0) {
            const filepath = (process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + req.headers.host + '/public/uploads/'
            imageUrls = req.files.map((file) => filepath + file.filename);
        }

        product.name = name
        product.description = description
        product.availableCount = availableCount
        product.price = price
        product.categoryId = categoryId
        product.userId = user.dataValues.id
        product.imageUrls = [...imageUrls, ...imagesToSave]
        await product.setAttributes(attribute, {status: 'active'});

        await product.save();

        res.status(201).json({...product.dataValues, attributes: attribute});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        if (req.userId !== product.userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        if (product.imageUrls && product.imageUrls.length > 0) {
            for (const imageURL of product.imageUrls) {
                deleteImage(imageURL);
            }
        }

        await product.destroy();
        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
