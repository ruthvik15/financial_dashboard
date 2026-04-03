const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

const hashPassword = async (password) => {
    return await bcypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
    return await bcypt.compare(password, hash);
};

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
};