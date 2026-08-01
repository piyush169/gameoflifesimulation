// redis.js
const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Standard client for reading/writing state and locking
const redisClient = new Redis(REDIS_URL);

// Dedicated client for Pub/Sub
const redisSubscriber = new Redis(REDIS_URL);

module.exports = { redisClient, redisSubscriber };