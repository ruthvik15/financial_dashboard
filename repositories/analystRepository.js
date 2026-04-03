const pool = require("../utils/dbConnection");

const queryDB = async (query) => {
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;    
    }
};

module.exports = {
    queryDB,
};
