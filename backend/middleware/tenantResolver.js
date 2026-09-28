import Store from "../models/Store.js";

// Cache in-memory for fast domain -> storeId resolution
const domainStoreCache = new Map();

export const tenantResolver = async (req, res, next) => {
  try {
    let storeId = req.headers["x-tenant-id"] || req.headers["x-store-id"];
    let store = null;

    if (storeId) {
      if (domainStoreCache.has(storeId)) {
        store = domainStoreCache.get(storeId);
      } else {
        store = await Store.findById(storeId).lean();
        if (store) domainStoreCache.set(storeId, store);
      }
    }

    if (!store) {
      const host = req.headers["x-store-domain"] || req.headers["host"] || "";
      const cleanHost = host.split(":")[0].toLowerCase();

      if (cleanHost && domainStoreCache.has(cleanHost)) {
        store = domainStoreCache.get(cleanHost);
      } else if (cleanHost) {
        // Search by customDomain or subdomain
        store = await Store.findOne({
          $or: [
            { customDomain: cleanHost },
            { subdomain: cleanHost.split(".")[0] }
          ],
          isActive: true
        }).lean();

        if (store) {
          domainStoreCache.set(cleanHost, store);
        }
      }
    }

    // Fallback to Default Store if not found
    if (!store) {
      if (domainStoreCache.has("default")) {
        store = domainStoreCache.get("default");
      } else {
        store = await Store.findOne({ subdomain: "default" }).lean();
        if (store) domainStoreCache.set("default", store);
      }
    }

    if (store) {
      req.storeId = store._id;
      req.store = store;
    }

    next();
  } catch (err) {
    console.error("Tenant Resolution Error:", err);
    next();
  }
};
