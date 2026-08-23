import redisClient from "../config/redis.js";

export const cacheMiddleware = async (req, res, next) => {
  if (req.method !== "GET") return next();

  const cacheKey = req.originalUrl;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}`);
    return next();
  } catch (error) {
    console.error("Redis cache error:", error);
    return next();
  }
};