const pool = require("../utils/dbConnection");

const signup = async (name, email, password, role) => {
    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role, is_active, created_at`,
            [name, email, password, role]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


const login = async (email) =>{
    try{
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE`,
            [email]
        );
        return result.rows[0];
    }catch(error){
        console.error(error);
        throw error;
    }
}

const getUsers = async (offset, limit) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, role, is_active, created_at FROM users WHERE is_deleted = FALSE LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (id, role) => {
    try {
        const result = await pool.query(
            `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 AND is_deleted = FALSE RETURNING *`,
            [role, id]
        );
        if (result.rows.length === 0) throw Object.assign(new Error("User not found"), { statusCode: 404 });
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const deActivateUser = async (id) => {
    try {
        const result = await pool.query(
            `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND is_deleted = FALSE RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) throw Object.assign(new Error("User not found"), { statusCode: 404 });
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const result = await pool.query(
            `UPDATE users SET is_deleted = TRUE, deleted_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) throw Object.assign(new Error("User not found"), { statusCode: 404 });
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    login,
    getUsers,
    updateUser,
    deActivateUser,
    deleteUser,
};