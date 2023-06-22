const jwt = require("jsonwebtoken");

const signJwt = (payload, key, options) => {
    const privateKey = Buffer.from(key, 'base64').toString(
        'ascii'
    );

    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};

const verifyJwt = (token, key) => {
    try {
        const publicKey = Buffer.from(key, 'base64').toString(
            'ascii'
        );
        return jwt.verify(token, publicKey);
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    verifyJwt,
    signJwt
}
