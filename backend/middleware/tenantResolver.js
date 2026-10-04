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
    let store = null;
    const candidateHosts = extractCandidateHosts(req);

    // 1. Resolve tenant primarily from Host / Origin / Referer domain headers (e.g. tenant.29sformula.com or store-a.com)
    for (const hostStr of candidateHosts) {
      const cleanHost = hostStr.split(":")[0].toLowerCase();

      // Skip generic localhost/ip without subdomain or x-store-domain
      if (!cleanHost || cleanHost === "localhost" || cleanHost === "127.0.0.1") {
        continue;
      }

      if (domainStoreCache.has(cleanHost)) {
        store = domainStoreCache.get(cleanHost);
        break;
      }

      const subdomainPart = cleanHost.split(".")[0];
      const hostNoWww = cleanHost.startsWith("www.") ? cleanHost.slice(4) : cleanHost;
      const hostWithWww = cleanHost.startsWith("www.") ? cleanHost : `www.${cleanHost}`;

      // First Priority: Exact custom domain / domain item match
      store = await Store.findOne({
        $or: [
          { customDomain: cleanHost },
          { customDomain: hostNoWww },
          { customDomain: hostWithWww },
          { "domains.domain": cleanHost },
          { "domains.domain": hostNoWww },
          { "domains.domain": hostWithWww }
        ]
      }).lean();

      // Second Priority: Subdomain slug match
      if (!store) {
        store = await Store.findOne({
          subdomain: subdomainPart
        }).lean();
      }

      if (store) {
        domainStoreCache.set(cleanHost, store);
        break;
      }
    }

    // 2. Fallback to token storeId or explicitly authenticated context if domain was generic
    if (!store) {
      let storeId = req.headers["x-tenant-id"] || req.headers["x-store-id"] || req.body?.storeId || req.query?.storeId;

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

      if (storeId) {
        if (domainStoreCache.has(String(storeId))) {
          store = domainStoreCache.get(String(storeId));
        } else {
          store = await Store.findById(storeId).lean();
          if (store) domainStoreCache.set(String(storeId), store);
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
      req.suspensionReason = store.suspensionReason || (req.isStoreSuspended ? "Account suspended by platform administrator." : "");
      req.suspendedAt = store.suspendedAt || null;
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
