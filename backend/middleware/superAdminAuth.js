import jwt from "jsonwebtoken";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "superadmin@platform.com";
const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

export const verifySuperAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Super Admin authorization token required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    
    // Check if token specifies superadmin role or matches superadmin email
    const isSuper = decoded.role === "superadmin" || 
                    decoded.isSuperAdmin === true || 
                    (decoded.email && decoded.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());

    if (!isSuper) {
      return res.status(403).json({ error: "Forbidden. Super Admin privileges required." });
    }

    req.superAdmin = decoded;
    next();
  } catch (error) {
    console.error("Super Admin Token Error:", error.message);
    return res.status(401).json({ error: "Invalid or expired Super Admin session." });
  }
};
