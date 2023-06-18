const bcrypt = require('bcrypt');
const User = require('../models/user');
const {generateToken} = require("../services/auth");
const {findUserCondition} = require("../models/helpers/conditions");

const registerUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        const existingUser = await User.findOne(findUserCondition(email, username));

        console.log("existingUser", existingUser)
        console.log(username, email, password, role)

        if (existingUser) {
            return res.status(400).json({message: 'Email or username already registered'});
        }

        const user = await User.create({username, email, password, role});
        const token = generateToken(user.id);
        user.token = token;
        await user.save();

        res.json({token, user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = generateToken(user.id);
        user.token = token;
        await user.save();

        res.json({token, user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

// todo
const refreshToken = async (req, res) => {
    try {
        const {refresh_token} = req.body;
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const logoutUser = async (req, res) => {
    const user = await User.findByPk(req.userId);
    if (!user) {
        return res.status(401).json({message: 'Invalid credentials'});
    }

    user.token = '';
    await user.save();

    res.json({message: 'Logout successful'});
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
};
