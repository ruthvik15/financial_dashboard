const authService = require("../services/auth");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const {user,token} = await authService.signup(name, email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({user});
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "Email already exists" });
        }
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const {user,token} = await authService.login(email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({user});
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

module.exports = {
    signup,
    login,
};