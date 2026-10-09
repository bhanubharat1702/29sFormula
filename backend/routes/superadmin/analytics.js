import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getAnalytics,
  getSavedReports,
  createSavedReport,
  exportAnalyticsCsv,
  runScheduledReportManual,
  seedAnalyticsDemoMetrics
} from "../../controllers/superadmin/analyticsController.js";

const router = express.Router();

export { seedAnalyticsDemoMetrics };

router.get("/api/superadmin/analytics", verifySuperAdminToken, getAnalytics);
router.get("/api/superadmin/analytics/export", verifySuperAdminToken, exportAnalyticsCsv);
router.get("/api/superadmin/analytics/reports", verifySuperAdminToken, getSavedReports);
router.post("/api/superadmin/analytics/reports", verifySuperAdminToken, createSavedReport);
router.post("/api/superadmin/analytics/reports/:id/run", verifySuperAdminToken, runScheduledReportManual);

export default router;
