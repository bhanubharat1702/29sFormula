import { deleteCachePattern } from "../config/redis.js";

// In-Memory Cache Store with Redis Sync for High-Traffic Scaling
let cachedSettings = null;
let cachedProducts = null;
const cachedProductDetails = new Map(); // id -> product details JSON

// Invalidation helpers
const invalidateSettingsCache = () => {
  cachedSettings = null;
  deleteCachePattern("settings:*").catch(() => {});
};

const invalidateProductsCache = (id = null) => {
  cachedProducts = null;
  if (id) {
    cachedProductDetails.delete(id);
  } else {
    cachedProductDetails.clear();
  }
  deleteCachePattern("products:*").catch(() => {});
};

export const setCachedSettings = (val) => { cachedSettings = val; };
export const setCachedProducts = (val) => { cachedProducts = val; };

export { cachedSettings, cachedProducts, cachedProductDetails, invalidateSettingsCache, invalidateProductsCache };
