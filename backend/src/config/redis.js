import { createClient } from "redis";


function sanitizeRedisUrl(raw) {
  if (!raw) return "redis://localhost:6379";
  let url = String(raw).trim();
  
  // Strip 'redis-cli -u ', 'redis-cli ', or '-u ' prefixes
  url = url.replace(/^redis-cli\s+(-u\s+)?/i, "").replace(/^-u\s+/i, "");
  
  // Strip leading and trailing quotes
  url = url.replace(/^["']|["']$/g, "").trim();
  
  return url || "redis://localhost:6379";
}

const rawRedisUrl = process.env.REDIS_URL;
const redis_url = sanitizeRedisUrl(rawRedisUrl);

let redisClient;

try {
  redisClient = createClient({
    url: redis_url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.warn("⚠️ Redis max reconnect attempts reached. Bypassing cache.");
          return new Error("Redis connection failed");
        }
        return Math.min(retries * 500, 3000);
      },
    },
  });

  redisClient.on("connect", () => console.log("🔄 Connecting to Redis..."));
  redisClient.on("ready", () => console.log("✅ Redis client ready and connected!"));
  redisClient.on("error", (err) => console.warn("⚠️ Redis Client Error (cache will bypass):", err.message));
  redisClient.on("end", () => console.log("🔌 Redis client disconnected"));

  // Connect asynchronously without crashing server startup if Redis is down
  redisClient.connect().catch((error) => {
    console.warn("⚠️ Could not establish initial Redis connection. Server will run without cache fallback:", error.message);
  });
} catch (error) {
  console.warn("⚠️ Failed to initialize Redis client:", error.message);
  // Fallback dummy object so methods don't crash
  redisClient = {
    isOpen: false,
    isReady: false,
    get: async () => null,
    set: async () => {},
    del: async () => {},
    keys: async () => [],
    on: () => {},
  };
}

export default redisClient;
