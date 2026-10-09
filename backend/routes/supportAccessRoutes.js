import express from "express";
import { verifyToken, isAdmin, impersonationAuditTrail } from "../middleware/authMiddleware.js";
import {
    grantSupportAccess,
    getSupportAccessStatus,
    revokeSupportAccess
} from "../controllers/supportAccessController.js";

const router = express.Router();

// All support-access consent endpoints require an authenticated merchant owner.
router.use("/api/admin/support-access", verifyToken, isAdmin, impersonationAuditTrail);

// Merchant grants temporary support access (explicit consent)
router.post("/api/admin/support-access", grantSupportAccess);

// Merchant views current consent status + history
router.get("/api/admin/support-access", getSupportAccessStatus);

// Merchant revokes active consent immediately (all grants, or a specific grant)
router.delete("/api/admin/support-access", revokeSupportAccess);
router.delete("/api/admin/support-access/:grantId", revokeSupportAccess);

export default router;
