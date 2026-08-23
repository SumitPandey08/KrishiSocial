import { createClient } from "redis";

const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redis_url,
});

redisClient.on('connect', () => console.log('🔄 Connecting to Redis...'));
redisClient.on('ready', () => console.log('✅ Redis client ready and connected!'));
redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('end', () => console.log('🔌 Redis client disconnected'));


(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Could not establish Redis connection:', error);
  }
})();

export default redisClient;



