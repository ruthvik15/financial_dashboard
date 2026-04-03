const { hashPassword, comparePassword, generateToken } = require("../utils/auth");
const userRepository = require("../repositories/userRepository");

const signup = async (name, email, password) => {
    const hashedPassword = await hashPassword(password);
    const role = "Viewer";
    const user = await userRepository.signup(name, email, hashedPassword, role);
    const token = generateToken({ id: user.id, role: user.role });
    return { user, token };
};


const login = async (email, password) => {
    const user = await userRepository.login(email);


    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = generateToken({ id: user.id, role: user.role });
    return {
        user,
        token,
    };
};

module.exports = {
    signup,
    login,
};