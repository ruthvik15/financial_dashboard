const adminService = require("../services/adminService");

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await adminService.getUsers(page,limit);
        res.status(200).json({data:users,page,limit});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const id = req.params.id;
        const role = req.body.role;
        if(!id || !role){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await adminService.updateRole(id,role);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deActivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "id is required" });
        }
        const user = await adminService.deActivateUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "id is required" });
        }
        const user = await adminService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const records = await adminService.getRecords(page,limit);
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addRecord = async (req, res) => {
    try {
        const {amount,type,category,date,notes} = req.body;
        if(!amount || !type || !category || !date){
            return res.status(400).json({ message: "All fields are required" });
        }
        const record = await adminService.addRecord(amount,type,category,date,notes);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, date, notes } = req.body;
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }
        const record = await adminService.updateRecord(id, amount, type, category, date, notes);
        res.status(200).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "id is required" });
        }
        const record = await adminService.deleteRecord(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
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
