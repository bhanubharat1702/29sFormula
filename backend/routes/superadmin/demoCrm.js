import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getDemoRequests,
  getCrmAnalytics,
  exportCrmCsv,
  updateLeadStage,
  assignLeadOwner,
  updateLeadPriority,
  addLeadNote,
  scheduleDemoMeeting,
  sendLeadEmail,
  markLeadLost,
  toggleLeadSpam,
  deleteLead
} from "../../controllers/superadmin/demoCrmController.js";

const router = express.Router();

router.get("/api/superadmin/demo-requests", verifySuperAdminToken, getDemoRequests);
router.get("/api/superadmin/demo-requests/analytics", verifySuperAdminToken, getCrmAnalytics);
router.get("/api/superadmin/demo-requests/export", verifySuperAdminToken, exportCrmCsv);

router.put("/api/superadmin/demo-requests/:id/stage", verifySuperAdminToken, updateLeadStage);
router.put("/api/superadmin/demo-requests/:id/assign", verifySuperAdminToken, assignLeadOwner);
router.put("/api/superadmin/demo-requests/:id/priority", verifySuperAdminToken, updateLeadPriority);

router.post("/api/superadmin/demo-requests/:id/notes", verifySuperAdminToken, addLeadNote);
router.post("/api/superadmin/demo-requests/:id/schedule-demo", verifySuperAdminToken, scheduleDemoMeeting);
router.post("/api/superadmin/demo-requests/:id/send-email", verifySuperAdminToken, sendLeadEmail);
router.post("/api/superadmin/demo-requests/:id/mark-lost", verifySuperAdminToken, markLeadLost);
router.post("/api/superadmin/demo-requests/:id/mark-spam", verifySuperAdminToken, toggleLeadSpam);

router.delete("/api/superadmin/demo-requests/:id", verifySuperAdminToken, deleteLead);

export default router;
