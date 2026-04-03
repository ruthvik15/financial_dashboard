const pool = require("../utils/dbConnection");

const getUsers = async (offset,limit) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE is_deleted = FALSE LIMIT $1 OFFSET $2",[limit,offset]);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const updateRole = async (id,role) => {
    try {
        const result = await pool.query("UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 AND is_deleted = FALSE RETURNING *",[role,id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const deActivateUser = async (id) => {
    try {
        const result = await pool.query("UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 AND is_deleted = FALSE RETURNING *",[id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const result = await pool.query("UPDATE users SET is_deleted = TRUE, deleted_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *",[id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const getRecords = async () => {
    try {
        const result = await pool.query("SELECT * FROM records WHERE is_deleted = FALSE");
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const addRecord = async (amount,type,category,date,notes) => {
    try {
        const result = await pool.query("INSERT INTO records (amount,type,category,date,notes) VALUES ($1,$2,$3,$4,$5) RETURNING *",[amount,type,category,date,notes]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateRecord = async (id,amount,type,category,date,notes) => {
    try {
        const result = await pool.query("UPDATE records SET amount = $1,type = $2,category = $3,date = $4,notes = $5, updated_at = NOW() WHERE id = $6 AND is_deleted = FALSE RETURNING *",[amount,type,category,date,notes,id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const deleteRecord = async (id) => {
    try {
        const result = await pool.query("UPDATE records SET is_deleted = TRUE, deleted_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *",[id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUsers,
    updateRole,
    deActivateUser,
    deleteUser,
    getRecords,
    addRecord,
    updateRecord,
    deleteRecord,
};
