const rateLimit = require("express-rate-limit");
// Fix for CommonJS import quirks with this specific package
const RedisStore = require("rate-limit-redis").default || require("rate-limit-redis");
const { client: redisClient } = require("../utils/redisClient");

const globalLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, max: 300 });

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, max: 30,
});

module.exports = {
    globalLimiter,
    authLimiter
};