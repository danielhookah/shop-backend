const Attribute = require('../models/attribute');

const getAllAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.findAll();
        res.json(attributes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAttributeById = async (req, res) => {
    const { id } = req.params;
    try {
        const attribute = await Attribute.findByPk(id);
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        res.json(attribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createAttribute = async (req, res) => {
    const { name, value, categoryId } = req.body;
    try {
        console.log(name, value, categoryId)
        const attribute = await Attribute.create({ name, value, categoryId });
        res.status(201).json(attribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateAttribute = async (req, res) => {
    const { id } = req.params;
    const { name, value, categoryId } = req.body;
    try {
        const attribute = await Attribute.findByPk(id);
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        attribute.name = name;
        attribute.value = value;
        attribute.categoryId = categoryId;
        await attribute.save();
        res.json(attribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteAttribute = async (req, res) => {
    const { id } = req.params;
    try {
        const attribute = await Attribute.findByPk(id);
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        await attribute.destroy();
        res.json({ message: 'Attribute deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllAttributes,
    getAttributeById,
    createAttribute,
    updateAttribute,
    deleteAttribute,
};
