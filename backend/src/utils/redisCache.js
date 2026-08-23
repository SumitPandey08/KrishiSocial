import redisClient from "../config/redis.js";


export const getCache = async (key) => {
  try {
    if (!redisClient?.isOpen) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[Redis] Get Error for key "${key}":`, error.message);
    return null;
  }
};


export const setCache = async (key, data, ttlSeconds = 3600) => {
  try {
    if (!redisClient?.isOpen) return;
    await redisClient.set(key, JSON.stringify(data), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.error(`[Redis] Set Error for key "${key}":`, error.message);
  }
};


export const deleteCache = async (...keys) => {
  try {
    if (!redisClient?.isOpen) return;
    const validKeys = keys.filter(Boolean);
    if (validKeys.length > 0) {
      await redisClient.del(validKeys);
    }
  } catch (error) {
    console.error("[Redis] Delete Error:", error.message);
  }
};


export const deleteCachePattern = async (pattern) => {
  try {
    if (!redisClient?.isOpen) return;
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(`[Redis] Pattern Delete Error for "${pattern}":`, error.message);
  }
};
