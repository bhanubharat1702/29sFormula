import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Store from "../models/Store.js";
import { setTenantStoreId } from "../utils/tenantContext.js";
import { recordAuditLog } from "../services/auditLogService.js";
import {
  getImpersonationTokenFromRequest,
  verifyImpersonationToken,
  isImpersonationSession
} from "../utils/impersonation.js";

const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

/**
 * Helper to resolve store ID for authenticated user if storeId is not in token payload
 */
const resolveUserStoreId = async (user) => {
  if (!user) return null;
  if (user.storeId && mongoose.Types.ObjectId.isValid(user.storeId)) return user.storeId;
  const userId = user.id || user._id;
  const userEmail = user.email ? user.email.toLowerCase() : null;
  const conditions = [];
  if (userId && mongoose.Types.ObjectId.isValid(userId)) conditions.push({ ownerId: userId });
  if (userEmail) conditions.push({ ownerEmail: userEmail });
  if (conditions.length > 0) {
    const store = await Store.findOne({ $or: conditions }).lean();
    if (store) {
      user.storeId = store._id;
      return store._id;
    }
  }
  return null;
};

/**
 * Attach impersonation provenance context to the request when the decoded user
 * payload represents a consented impersonation session.
 */
export const attachImpersonationContext = (req, decoded) => {
  if (!isImpersonationSession(decoded)) return false;
  req.impersonation = {
    isImpersonated: true,
    impersonatorId: decoded.impersonator,
    impersonatorEmail: (decoded.impersonatorEmail || "").toLowerCase(),
    impersonatorName: decoded.impersonatorName || "Platform Super Admin",
    tenantId: decoded.tenant,
    tenantName: decoded.tenantName || "",
    grantId: decoded.grantId || null,
    scopes: decoded.impersonationScopes || ["support"]
  };
  return true;
};

/**
 * Middleware to verify JWT token from Authorization header (Bearer token).
 *
 * Also transparently supports SUPER ADMIN IMPERSONATION: when a valid
 * dual-identity impersonation token is supplied in the `x-impersonation-token`
 * header (see utils/impersonation.js), the merchant identity is adopted for
 * authorization while the real Super Admin identity is preserved in
 * req.impersonation for strict audit attribution.
 */
export const verifyToken = async (req, res, next) => {
  // 1. Prefer an impersonation token when explicitly provided.
  const impersonationToken = getImpersonationTokenFromRequest(req);
  if (impersonationToken) {
    const decoded = verifyImpersonationToken(impersonationToken);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired impersonation token." });
    }
    req.user = decoded;
    attachImpersonationContext(req, decoded);
    const storeId = decoded.tenant;
    if (storeId) {
      req.storeId = storeId;
      setTenantStoreId(storeId);
    }
    return next();
  }

  // 2. Standard merchant/user Bearer-token flow.
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Authorization token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    attachImpersonationContext(req, decoded);
    const storeId = await resolveUserStoreId(req.user);
    if (storeId) {
      req.storeId = storeId;
      setTenantStoreId(storeId);
    }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ error: "Invalid or expired authorization token." });
  }
};

/**
 * Middleware to restrict route access to Admin users only
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  // Merchant store owners carry full admin privileges for their own tenant.
  // Their tokens are issued with role "owner" / isOwner and (for newly
  // provisioned owners) isAdmin; impersonation tokens only carry role "owner",
  // so owner/isOwner must be accepted here. Regular storefront customers are
  // role "user" and remain blocked with 403.
  const userIsAdmin = Boolean(
    req.user.isAdmin ||
    req.user.isOwner ||
    req.user.role === "admin" ||
    req.user.role === "owner" ||
    (process.env.ADMIN_EMAIL && req.user.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase())
  );

  if (!userIsAdmin) {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }

  next();
};

/**
 * Optional authentication middleware - populates req.user if token present, but does not block
 */
export const optionalAuth = async (req, res, next) => {
  const impersonationToken = getImpersonationTokenFromRequest(req);
  if (impersonationToken) {
    const decoded = verifyImpersonationToken(impersonationToken);
    if (decoded) {
      req.user = decoded;
      attachImpersonationContext(req, decoded);
      if (decoded.tenant) {
        req.storeId = decoded.tenant;
        setTenantStoreId(decoded.tenant);
      }
      return next();
    }
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
      attachImpersonationContext(req, decoded);
      const storeId = await resolveUserStoreId(req.user);
      if (storeId) {
        req.storeId = storeId;
        setTenantStoreId(storeId);
      }
    } catch (err) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

/**
 * Record a business-level audit entry for actions performed during an
 * impersonation session, attributed to the Super Admin "on behalf of" the
 * merchant. No-op for regular (non-impersonated) sessions.
 *
 * Setting req._impersonationAuditLogged prevents the generic
 * `impersonationAuditTrail` safety-net from double logging the same request.
 */
export const logImpersonationAction = async (req, details = {}) => {
  if (!isImpersonationSession(req.user) || !req.impersonation) return null;

  const imp = req.impersonation;
  const entry = await recordAuditLog({
    adminUser: imp.impersonatorName,
    adminEmail: imp.impersonatorEmail,
    role: "Super Admin (Impersonating)",
    action: details.action || `${req.method} ${req.originalUrl || req.path}`,
    actionCategory: details.actionCategory || "tenant",
    target: details.target || imp.tenantName || "Store",
    targetId: details.targetId || String(imp.tenantId),
    storeId: imp.tenantId,
    storeName: details.storeName || imp.tenantName,
    beforeValue: details.beforeValue ?? null,
    afterValue: details.afterValue ?? null,
    diff: details.diff ?? null,
    reason: details.reason || `Support access during consented impersonation session${imp.grantId ? ` (grant ${imp.grantId})` : ""}`,
    result: details.result || "success",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
    country: req.headers["cf-ipcountry"] || "India",
    userAgent: req.headers["user-agent"] || "",
    isImpersonated: true,
    impersonatorId: imp.impersonatorId,
    impersonatorEmail: imp.impersonatorEmail,
    impersonatedTenantId: imp.tenantId,
    impersonatedTenantName: imp.tenantName,
    impersonationGrantId: imp.grantId
  });

  if (entry) req._impersonationAuditLogged = true;
  return entry;
};

/**
 * Safety-net middleware that guarantees EVERY mutating request performed during
 * an impersonation session is audited — even if the route handler forgets to.
 * Controllers that already log via `logImpersonationAction` are not duplicated.
 */
export const impersonationAuditTrail = (req, res, next) => {
  if (!isImpersonationSession(req.user) || req.method === "GET") {
    return next();
  }

  res.on("finish", () => {
    if (req._impersonationAuditLogged) return;
    const result = res.statusCode >= 400 ? "failed" : "success";
    logImpersonationAction(req, {
      action: `${req.method} ${req.originalUrl || req.path}`,
      actionCategory: "impersonation",
      result
    }).catch((err) => {
      console.error("Impersonation audit trail failed:", err.message);
    });
  });

  next();
};
