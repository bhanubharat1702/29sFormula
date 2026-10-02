import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Store from "../models/Store.js";
import { setTenantStoreId } from "../utils/tenantContext.js";

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
 * Middleware to verify JWT token from Authorization header (Bearer token)
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Authorization token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
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

  const userIsAdmin = req.user.isAdmin || req.user.role === "admin" || (process.env.ADMIN_EMAIL && req.user.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());

  if (!userIsAdmin) {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }

  next();
};

/**
 * Optional authentication middleware - populates req.user if token present, but does not block
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
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
