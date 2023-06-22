const bcrypt = require('bcrypt');
const User = require('../models/user');
const Token = require('../models/token');
const {generateAccessToken, generateRefreshToken, refreshTokenCookieOptions} = require("../services/auth");
const {findUserCondition} = require("../models/helpers/conditions");
const {addDays, addMonths} = require("../utils/date");
const {verifyJwt} = require("../utils/jwt");

const registerUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        const existingUser = await User.findOne(findUserCondition(email, username));
        if (existingUser) {
            return res.status(400).json({message: 'Email or username already registered'});
        }

        const user = await User.create({username, email, password, role});
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        const date = new Date()
        const accessExpiresAt = addDays(date, 1)
        const refreshExpiresAt = addMonths(date, 1)
        await Token.create({ userId: user.id, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt });

        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.json({accessToken, user});
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

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        const date = new Date()
        const accessExpiresAt = addDays(date, 1)
        const refreshExpiresAt = addMonths(date, 1)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        const token = await Token.findOne({where: {userId: user.id}});
        if (!token) {
            await Token.create({ userId: user.id, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt });

            return res.json({accessToken, user});
        }

        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.accessExpiresAt = accessExpiresAt
        token.refreshExpiresAt = refreshExpiresAt
        await token.save();

        res.json({accessToken, user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const refreshToken = async (req, res) => {
    try {
        console.log(req.cookies)
        const refreshToken = req.cookies.refreshToken

        const decoded = verifyJwt(refreshToken, process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Could not refresh access token' });
        }

        const token = await Token.findOne({where: {refreshToken}});
        if (!token) {
            return res.status(404).json({ message: 'Token not found' });
        }

        const user = await User.findByPk(token.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken(user.id);
        token.accessToken = accessToken
        await token.save();

        res.status(200).json({accessToken});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const logoutUser = async (req, res) => {
    await Token.destroy({where: {userId: req.userId}});
    res.cookie('refreshToken', '', { maxAge: 1 });
    res.json({message: 'Logout successful'});
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
};
