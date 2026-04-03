const pool = require("../utils/dbConnection");
const analystRepository = require("../repositories/analystRepository");

// ANALYST CAN ONLY READ AND PERFORM ANALYSIS BUT IS RESTRICTED FROM UPDATING OR DELETING OR INSERTING OR DROPPING ANY DATA FROM THE DB
const query = async (query) => {
    try {
        if (query.includes("UPDATE") || query.includes("DELETE") || query.includes("INSERT") || query.includes("DROP")) {
            throw new Error("Update, delete, insert, and drop queries are not allowed");
        }
        const result = await analystRepository.queryDB(query)
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    query,
};

