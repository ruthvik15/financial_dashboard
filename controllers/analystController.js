//analyst can hit one route like /analyst/query and have the db access to read only from the db
//analyst cannot update or delete or add any data from the db
//analyst can only read the data from the db
//neeed to take the query from the analyst and execute it in the db and return the result
//if query is update or delete or insert then return error
//if query is select then return result

const analystController = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }
        const result = await analystService.query(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    analystController,
};
