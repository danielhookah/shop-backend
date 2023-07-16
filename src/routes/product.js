const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products');
const { upload } = require("../services/upload");
const { protectRoute } = require("../middlewares/auth");

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', protectRoute, upload.array('image[]', 10), ProductController.createProduct);
router.put('/:id', protectRoute, upload.array('image[]', 10), ProductController.updateProduct);
router.delete('/:id', protectRoute, ProductController.deleteProduct);

module.exports = router;
