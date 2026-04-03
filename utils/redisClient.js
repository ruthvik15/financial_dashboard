const Redis = require("ioredis");

const client = new Redis(process.env.REDIS_URL, {
    enableOfflineQueue: true, 
    
    retryStrategy: (times) => {
        if (times > 10) {
            console.error("[Redis] Reconnection attempts exceeded (10 max).");
            return null; 
        }
        return times * 100; 
    },
});

client.on("connect", () => console.log("Redis Connected to Cloud"));
client.on("error", (err) => console.error("Redis Error:", err.message));

const DASHBOARD_KEY = "dashboard:analytics";

const getCache = async (key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("[Redis] getCache failed:", err.message);
        return null;
    }
};

const setCache = async (key, value) => {
    try {
        await client.set(key, JSON.stringify(value), "EX", 3600);
    } catch (err) {
        console.error("[Redis] setCache failed:", err.message);
    }
};

const invalidateCache = async (key) => {
    try {
        await client.del(key);
        console.log(`[Redis] Cache invalidated: ${key}`);
    } catch (err) {
        console.error("[Redis] invalidateCache failed:", err.message);
    }
};

module.exports = {
    client,
    DASHBOARD_KEY,
    getCache,
    setCache,
    invalidateCache,
};