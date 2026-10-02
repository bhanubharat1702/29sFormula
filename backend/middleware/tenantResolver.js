import Store from "../models/Store.js";
import { runWithTenant } from "../utils/tenantContext.js";
import jwt from "jsonwebtoken";

// Cache in-memory for fast domain -> storeId resolution
const domainStoreCache = new Map();

/**
 * Invalidates the tenant resolution cache for a given store ID, domain, or clears all.
 * @param {string|null} identifier 
 */
export const invalidateTenantCache = (identifier = null) => {
  domainStoreCache.clear();
};

/**
 * Extracts candidate hostnames from headers in priority order:
 * 1. x-store-domain header
 * 2. Origin header (e.g. "http://demo.localhost:3000" -> "demo.localhost:3000")
 * 3. Referer header (e.g. "http://demo.localhost:3000/admin" -> "demo.localhost:3000")
 * 4. Host header
 */
const extractCandidateHosts = (req) => {
  const candidates = [];

  if (req.headers["x-store-domain"]) {
    candidates.push(req.headers["x-store-domain"]);
  }

  if (req.headers["origin"]) {
    try {
      const url = new URL(req.headers["origin"]);
      if (url.host) candidates.push(url.host);
    } catch (e) { }
  }

  if (req.headers["referer"]) {
    try {
      const url = new URL(req.headers["referer"]);
      if (url.host) candidates.push(url.host);
    } catch (e) { }
  }

  if (req.headers["host"]) {
    candidates.push(req.headers["host"]);
  }

  return candidates;
};

export const tenantResolver = async (req, res, next) => {
  try {
    let storeId = req.headers["x-tenant-id"] || req.headers["x-store-id"] || req.body?.storeId || req.query?.storeId;
    let store = null;

    // Check authorization header if storeId not provided in custom header
    if (!storeId && (req.headers.authorization || req.headers.Authorization)) {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.decode(token);
          if (decoded && decoded.storeId) {
            storeId = decoded.storeId;
          }
        } catch (e) { }
      }
    }

    // 1. Direct storeId from headers or token
    if (storeId) {
      if (domainStoreCache.has(String(storeId))) {
        store = domainStoreCache.get(String(storeId));
      } else {
        store = await Store.findById(storeId).lean();
        if (store) domainStoreCache.set(String(storeId), store);
      }
    }

    // 2. Resolve from Origin / Referer / Host headers (e.g. demo.localhost:3000)
    if (!store) {
      const candidateHosts = extractCandidateHosts(req);

      for (const hostStr of candidateHosts) {
        const cleanHost = hostStr.split(":")[0].toLowerCase();

        // Skip generic localhost/ip without subdomain
        if (!cleanHost || cleanHost === "localhost" || cleanHost === "127.0.0.1") {
          continue;
        }

        if (domainStoreCache.has(cleanHost)) {
          store = domainStoreCache.get(cleanHost);
          break;
        }

        // Subdomain is first part before dot (e.g. "demo" from "demo.localhost")
        const subdomainPart = cleanHost.split(".")[0];

        // Custom domains are stored as the canonical apex host (e.g. "brand.com"),
        // while merchants frequently serve them from the "www." host. Match both.
        const hostNoWww = cleanHost.startsWith("www.") ? cleanHost.slice(4) : cleanHost;

        store = await Store.findOne({
          $or: [
            { customDomain: cleanHost },
            { customDomain: hostNoWww },
            { "domains.domain": cleanHost },
            { "domains.domain": hostNoWww },
            { subdomain: subdomainPart }
          ],
          isActive: true
        }).lean();

        if (store) {
          domainStoreCache.set(cleanHost, store);
          break;
        }
      }
    }

    // 3. Fallback to Default Store if no specific tenant domain matched
    if (!store) {
      if (domainStoreCache.has("default")) {
        store = domainStoreCache.get("default");
      } else {
        store = await Store.findOne({ subdomain: "default" }).lean() || await Store.findOne({ status: "active" }).lean() || await Store.findOne().lean();
        if (store) domainStoreCache.set("default", store);
      }
    }

    if (store) {
      req.storeId = store._id;
      req.store = store;
      req.isStoreSuspended = Boolean(store.status === "suspended" || store.isActive === false);
    }

    const activeStoreId = req.storeId ? String(req.storeId) : null;
    return runWithTenant(activeStoreId, () => {
      next();
    });
  } catch (err) {
    console.error("Tenant Resolution Critical Failure:", err);
    return res.status(500).json({ error: "Internal server error during tenant context resolution." });
  }
};
