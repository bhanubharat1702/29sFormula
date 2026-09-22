import { getCache, setCache } from "../config/redis.js";

/**
 * Middleware for caching JSON responses in Redis with TTL.
 * @param {string} prefix - Key prefix (e.g. 'products', 'settings')
 * @param {number} ttlSeconds - Cache expiry in seconds (default 300 = 5 minutes)
 */
export const redisCache = (prefix = "cache", ttlSeconds = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `${prefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cachedData);
      }
    } catch (err) {
      // Fall through on cache error
    }

    res.setHeader("X-Cache", "MISS");

    // Intercept res.json to populate Redis cache on response send
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && body) {
        setCache(cacheKey, body, ttlSeconds).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
};
