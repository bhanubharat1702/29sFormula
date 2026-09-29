import { deleteCachePattern } from "../config/redis.js";

// In-Memory Cache Store keyed by Store ID for High-Traffic Tenant Isolation
const cachedSettingsMap = new Map(); // storeId -> settings JSON
const cachedProductsMap = new Map();  // storeId -> products JSON
const cachedProductDetails = new Map(); // productId -> product details JSON

// Invalidation helpers
const invalidateSettingsCache = (storeId = null) => {
  if (storeId) {
    cachedSettingsMap.delete(String(storeId));
  } else {
    cachedSettingsMap.clear();
  }
  deleteCachePattern("settings:*").catch(() => {});
};

const invalidateProductsCache = (id = null, storeId = null) => {
  if (storeId) {
    cachedProductsMap.delete(String(storeId));
  } else {
    cachedProductsMap.clear();
  }
  if (id) {
    cachedProductDetails.delete(String(id));
  } else {
    cachedProductDetails.clear();
  }
  deleteCachePattern("products:*").catch(() => {});
};

export const getCachedSettingsForStore = (storeId) => {
  return storeId ? cachedSettingsMap.get(String(storeId)) || null : null;
};

export const setCachedSettingsForStore = (storeId, val) => {
  if (storeId) cachedSettingsMap.set(String(storeId), val);
};

export const getCachedProductsForStore = (storeId) => {
  return storeId ? cachedProductsMap.get(String(storeId)) || null : null;
};

export const setCachedProductsForStore = (storeId, val) => {
  if (storeId) cachedProductsMap.set(String(storeId), val);
};

export { 
  cachedProductDetails, 
  invalidateSettingsCache, 
  invalidateProductsCache 
};
