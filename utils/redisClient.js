const Redis = require("ioredis");

const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy: (times) => {
        // Stop retrying after 3 attempts — don't crash the app if Redis is down
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
    },
});

client.on("connect", () => console.log("[Redis] Connected"));
client.on("error", (err) => console.error("[Redis] Error:", err.message));

const DASHBOARD_KEY = "dashboard:analytics";

/**
 * Get cached value for a key. Returns null if not found or Redis is down.
 */
const getCache = async (key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("[Redis] getCache failed:", err.message);
        return null;
    }
};

/**
 * Store a value in cache with no TTL (lives until explicitly invalidated).
 */
const setCache = async (key, value) => {
    try {
        await client.set(key, JSON.stringify(value));
    } catch (err) {
        console.error("[Redis] setCache failed:", err.message);
    }
};

/**
 * Invalidate (delete) a cache key.
 */
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
