const pool = require("../utils/dbConnection");

const getRecords = async (offset, limit, filters = {}) => {
    try {
        let query = "SELECT * FROM records WHERE is_deleted = FALSE";
        const values = [];
        let paramIndex = 1;

        if (filters.date) {
            query += ` AND date = $${paramIndex}`;
            values.push(filters.date);
            paramIndex++;
        }
        if (filters.category) {
            query += ` AND category = $${paramIndex}`;
            values.push(filters.category);
            paramIndex++;
        }
        if (filters.type) {
            query += ` AND type = $${paramIndex}`;
            values.push(filters.type);
            paramIndex++;
        }

        query += ` ORDER BY date DESC, id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const getTotalCount = async (filters = {}) => {
    try {
        let query = "SELECT COUNT(*)::int AS total FROM records WHERE is_deleted = FALSE";
        const values = [];
        let paramIndex = 1;

        if (filters.date) {
            query += ` AND date = $${paramIndex}`;
            values.push(filters.date);
            paramIndex++;
        }
        if (filters.category) {
            query += ` AND category = $${paramIndex}`;
            values.push(filters.category);
            paramIndex++;
        }
        if (filters.type) {
            query += ` AND type = $${paramIndex}`;
            values.push(filters.type);
            paramIndex++;
        }

        const result = await pool.query(query, values);
        return result.rows[0].total;
    } catch (error) {
        throw error;
    }
};

const getRecordById = async (id) => {
    try {
        const result = await pool.query(
            "SELECT * FROM records WHERE id = $1 AND is_deleted = FALSE",
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
};

const addRecord = async (amount, type, category, date, notes) => {
    try {
        const result = await pool.query(
            "INSERT INTO records (amount, type, category, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [amount, type, category, date, notes]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateRecord = async (id, amount, type, category, date, notes) => {
    try {
        const fields  = { amount, type, category, date, notes };
        const setClauses = [];
        const values     = [];
        let   paramIndex = 1;

        for (const [col, val] of Object.entries(fields)) {
            if (val !== undefined && val !== null ) {
                setClauses.push(`${col} = $${paramIndex}`);
                values.push(val);
                paramIndex++;
            }
        }

        if (setClauses.length === 0) {
            throw Object.assign(new Error("At least one field (amount, type, category, date, notes) is required to update"), { statusCode: 400 });
        }

        values.push(id);
        const query = `UPDATE records SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = $${paramIndex} AND is_deleted = FALSE RETURNING *`;


        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw Object.assign(new Error("Record not found"), { statusCode: 404 });
        }
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};


const deleteRecord = async (id) => {
    try {
        const result = await pool.query(
            "UPDATE records SET is_deleted = TRUE, deleted_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) throw Object.assign(new Error("Record not found"), { statusCode: 404 });
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getRecords,
    getTotalCount,
    getRecordById,
    addRecord,
    updateRecord,
    deleteRecord,
};
