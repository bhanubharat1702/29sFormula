import Redis from "ioredis";

let redisClient = null;
let isRedisConnected = false;

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

if (process.env.NODE_ENV !== "test") {
  try {
    redisClient = new Redis(REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 2000,
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop retrying if Redis is not running locally
        }
        return Math.min(times * 100, 1000);
      }
    });

    redisClient.on("connect", () => {
      isRedisConnected = true;
      console.log("Redis Client Connected successfully.");
    });

    redisClient.on("error", (err) => {
      isRedisConnected = false;
      // Silently handle connection refusal without crashing
    });

    // Attempt connection asynchronously
    redisClient.connect().catch(() => {
      isRedisConnected = false;
    });
  } catch (e) {
    isRedisConnected = false;
    redisClient = null;
  }
}

export const getCache = async (key) => {
  if (!redisClient || !isRedisConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisClient || !isRedisConnected) return false;
  try {
    const serialized = JSON.stringify(value);
    await redisClient.set(key, serialized, "EX", ttlSeconds);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteCachePattern = async (pattern) => {
  if (!redisClient || !isRedisConnected) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export { redisClient, isRedisConnected };
