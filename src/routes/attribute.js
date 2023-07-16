const express = require('express');
const router = express.Router();
const AttributeController = require('../controllers/attributes');
const { protectRoute } = require("../middlewares/auth");

router.get('/', AttributeController.getAllAttributes);
router.get('/:id', AttributeController.getAttributeById);
router.post('/', AttributeController.createAttribute);
router.put('/:id', AttributeController.updateAttribute);
router.delete('/:id', AttributeController.deleteAttribute);

module.exports = router;
