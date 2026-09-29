import Store from "../models/Store.js";

/**
 * Extracts and returns the storeId for the current request context.
 * Hierarchy:
 * 1. req.user.storeId (authenticated merchant owner or user token)
 * 2. req.storeId / req.store._id (resolved by tenantResolver middleware from domain/host)
 * 3. Headers: x-tenant-id or x-store-id
 */
export const getTenantStoreId = (req) => {
  if (req.user && req.user.storeId) {
    return req.user.storeId;
  }
  if (req.storeId) {
    return req.storeId;
  }
  if (req.store && req.store._id) {
    return req.store._id;
  }
  const headerStoreId = req.headers ? (req.headers["x-tenant-id"] || req.headers["x-store-id"]) : null;
  if (headerStoreId) {
    return headerStoreId;
  }
  return null;
};

/**
 * Helper to build database query filter scoped strictly to a tenant store.
 */
export const withTenantFilter = (req, extraFilter = {}) => {
  const storeId = getTenantStoreId(req);
  if (storeId) {
    return { ...extraFilter, storeId };
  }
  return extraFilter;
};
