import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getAnalytics,
  getSavedReports,
  createSavedReport,
  seedAnalyticsDemoMetrics
} from "../../controllers/superadmin/analyticsController.js";

const router = express.Router();

export { seedAnalyticsDemoMetrics };

router.get("/api/superadmin/analytics", verifySuperAdminToken, getAnalytics);
router.get("/api/superadmin/analytics/reports", verifySuperAdminToken, getSavedReports);
router.post("/api/superadmin/analytics/reports", verifySuperAdminToken, createSavedReport);

export default router;
