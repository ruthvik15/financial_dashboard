const analystService = require("../services/analystService");

const analystController = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }
        const result = await analystService.query(query);
        res.status(200).json(result);
    } catch (error) {
        if (error.code || error.severity === 'ERROR') {
            return res.status(400).json({ message: "Invalid query syntax or logic", details: error.message });
        }
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

module.exports = {
    analystController,
};
