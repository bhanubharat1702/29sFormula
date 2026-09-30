import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import { getSuperAdminStats } from "../../controllers/superadmin/statsController.js";

const router = express.Router();

router.get("/api/superadmin/stats", verifySuperAdminToken, getSuperAdminStats);

export default router;
