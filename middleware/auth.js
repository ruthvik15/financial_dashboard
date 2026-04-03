const {verifyToken} = require("../utils/auth");

const auth = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};  

const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};

module.exports = { auth, authorize };