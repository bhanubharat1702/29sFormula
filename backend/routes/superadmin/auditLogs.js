import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getAuditLogs,
  exportAuditLogsCsv,
  seedAuditLogsIfEmpty
} from "../../controllers/superadmin/auditLogsController.js";

const router = express.Router();

export { seedAuditLogsIfEmpty };

router.get("/api/superadmin/audit-logs", verifySuperAdminToken, getAuditLogs);
router.get("/api/superadmin/audit-logs/export", verifySuperAdminToken, exportAuditLogsCsv);

export default router;
