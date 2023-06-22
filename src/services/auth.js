const jwt = require("jsonwebtoken");
const {signJwt} = require("../utils/jwt");
const generateAccessToken = (userId) => {
    return signJwt({ id: userId }, process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const generateRefreshToken = (userId) => {
    return signJwt({ id: userId }, process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
};

const month = 1000 * 60 * 60 * 24 * 30
const refreshTokenCookieOptions = {
    expires: new Date(
        Date.now() + month
    ),
    maxAge: month,
    httpOnly: true,
    sameSite: 'lax',
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenCookieOptions
};
