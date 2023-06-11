const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categories');
const { protectRoute } = require("../middlewares/auth");

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', protectRoute, CategoryController.createCategory);
router.put('/:id', protectRoute, CategoryController.updateCategory);
router.delete('/:id', protectRoute, CategoryController.deleteCategory);

module.exports = router;
