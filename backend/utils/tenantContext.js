import { AsyncLocalStorage } from "node:async_hooks";

export const tenantStorage = new AsyncLocalStorage();

/**
 * Runs a callback function within a specific tenant context.
 * @param {string|import("mongoose").Types.ObjectId|null} storeId 
 * @param {Function} callback 
 */
export const runWithTenant = (storeId, callback) => {
  const storeIdStr = storeId ? String(storeId) : null;
  return tenantStorage.run({ storeId: storeIdStr, bypassTenant: false }, callback);
};

/**
 * Runs a callback function bypassing tenant isolation (useful for superadmin platform operations).
 * @param {Function} callback 
 */
export const runWithoutTenant = (callback) => {
  return tenantStorage.run({ storeId: null, bypassTenant: true }, callback);
};

/**
 * Retrieves the current storeId from the AsyncLocalStorage context.
 * @returns {string|null}
 */
export const getTenantStoreIdFromContext = () => {
  const store = tenantStorage.getStore();
  if (!store || store.bypassTenant) {
    return null;
  }
  return store.storeId || null;
};

/**
 * Sets/updates the storeId in the current AsyncLocalStorage context.
 * @param {string|import("mongoose").Types.ObjectId|null} storeId 
 */
export const setTenantStoreId = (storeId) => {
  const store = tenantStorage.getStore();
  if (store) {
    store.storeId = storeId ? String(storeId) : null;
  }
};

/**
 * Checks if tenant filtering is explicitly bypassed in the current context.
 * @returns {boolean}
 */
export const isTenantBypassed = () => {
  const store = tenantStorage.getStore();
  return store ? Boolean(store.bypassTenant) : false;
};
