const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const { protectRoute } = require("../middlewares/auth");

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', protectRoute, AuthController.logoutUser);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;
