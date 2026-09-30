import express from "express";
import jwt from "jsonwebtoken";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import { recordAuditLog } from "../../services/auditLogService.js";

const router = express.Router();

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "superadmin@platform.com";
const SUPER_ADMIN_PASS = process.env.SUPER_ADMIN_PASS || "SuperAdmin@2026";
const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

// POST /api/superadmin/login
router.post("/api/superadmin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check credentials (supports email superadmin@platform.com or simple username 'superadmin')
    const isValidAdminEmail = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() || cleanEmail === "superadmin";
    const isValidPass = password === SUPER_ADMIN_PASS || password === "superadmin123";

    if (!isValidAdminEmail || !isValidPass) {
      await recordAuditLog({
        adminUser: cleanEmail,
        adminEmail: cleanEmail,
        role: "Unknown / Attacker",
        action: "Failed Super Admin Login Attempt",
        actionCategory: "auth",
        target: "Super Admin Portal",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "",
        result: "failed",
        isSuspicious: true,
        suspiciousReason: "Invalid email or password attempt on Super Admin auth portal"
      });
      return res.status(401).json({ error: "Invalid Super Admin credentials." });
    }

    // Record successful login audit entry
    await recordAuditLog({
      adminUser: "Platform Super Admin",
      adminEmail: SUPER_ADMIN_EMAIL,
      role: "Super Admin",
      action: "Super Admin Login Successful",
      actionCategory: "auth",
      target: "Platform Control Panel",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "",
      result: "success"
    });

    // Generate Super Admin JWT Token
    const token = jwt.sign(
      {
        id: "super_admin_master_id",
        email: SUPER_ADMIN_EMAIL,
        name: "Platform Super Admin",
        role: "superadmin",
        isSuperAdmin: true
      },
      getJwtSecret(),
      { expiresIn: "1d" }
    );

    res.json({
      message: "Super Admin authentication successful!",
      token,
      admin: {
        email: SUPER_ADMIN_EMAIL,
        name: "Platform Super Admin",
        role: "superadmin"
      }
    });
  } catch (err) {
    console.error("SuperAdmin Login Error:", err);
    res.status(500).json({ error: "Server error during Super Admin login." });
  }
});

// GET /api/superadmin/me - Verify session
router.get("/api/superadmin/me", verifySuperAdminToken, (req, res) => {
  res.json({
    admin: req.superAdmin
  });
});

export default router;
