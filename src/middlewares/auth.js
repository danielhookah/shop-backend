const {verifyJwt} = require("../utils/jwt");
const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const secretKey = process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
        const decoded = verifyJwt(token, secretKey);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    protectRoute
}
