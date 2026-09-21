import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "29sformula_secret_jwt_key_2026";

/**
 * Middleware to verify JWT token from Authorization header (Bearer token)
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Authorization token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
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
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
    } catch (err) {
      // Ignore token errors for optional auth
    }
  }
  next();
};
