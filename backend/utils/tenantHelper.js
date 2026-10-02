import mongoose from "mongoose";
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

export const getTenantStoreIdAsync = async (req) => {
  const syncStoreId = getTenantStoreId(req);
  if (syncStoreId) return syncStoreId;

  if (req.user) {
    const userId = req.user.id || req.user._id;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : null;
    const filterConditions = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) filterConditions.push({ ownerId: userId });
    if (userEmail) filterConditions.push({ ownerEmail: userEmail });

    if (filterConditions.length > 0) {
      const store = await Store.findOne({ $or: filterConditions }).lean();
      if (store) {
        req.user.storeId = store._id;
        req.storeId = store._id;
        return store._id;
      }
    }
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
