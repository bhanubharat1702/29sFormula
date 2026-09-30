import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import { loginSuperAdmin, getSuperAdminMe } from "../../controllers/superadmin/authController.js";

const router = express.Router();

router.post("/api/superadmin/login", loginSuperAdmin);
router.get("/api/superadmin/me", verifySuperAdminToken, getSuperAdminMe);

export default router;
