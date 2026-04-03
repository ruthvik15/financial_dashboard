const userRepository = require("../repositories/userRepository");
const recordRepository = require("../repositories/recordRepository");
const { invalidateCache, DASHBOARD_KEY } = require("../utils/redisClient");

const getUsers = async (page,limit) => {
    try {
        const offset = (page - 1) * limit;
        return await userRepository.getUsers(offset,limit);
    } catch (error) {
        throw error;
    }
};

const updateRole = async (id,role) => {
    try {
        return await userRepository.updateUser(id,role);
    } catch (error) {
        throw error;
    }
};

const deActivateUser = async (id) => {
    try {
        return await userRepository.deActivateUser(id);
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        return await userRepository.deleteUser(id);
    } catch (error) {
        throw error;
    }
};

const getRecords = async (page, limit) => {
    try {
        const offset = (page - 1) * limit;
        const [rows, total] = await Promise.all([
            recordRepository.getRecords(offset, limit),
            recordRepository.getTotalCount(),
        ]);
        return { records: rows, total, page, limit };
    } catch (error) {
        throw error;
    }
};


const addRecord = async (amount,type,category,date,notes) => {
    try {
        if(notes==null){
            notes = ""
        }
        const record = await recordRepository.addRecord(amount,type,category,date,notes);
        await invalidateCache(DASHBOARD_KEY);
        return record;
    } catch (error) {
        throw error;
    }
};

const updateRecord = async (id,amount,type,category,date,notes) => {
    try {
        
        const record = await recordRepository.updateRecord(id,amount,type,category,date,notes);
        await invalidateCache(DASHBOARD_KEY);
        return record;
    } catch (error) {
        throw error;
    }
};

const deleteRecord = async (id) => {
    try {
        const record = await recordRepository.deleteRecord(id);
        await invalidateCache(DASHBOARD_KEY);
        return record;
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