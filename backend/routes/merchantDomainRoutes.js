import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
    listMerchantDomains,
    checkSubdomainAvailability,
    assignPlatformSubdomain,
    addMerchantDomain,
    recheckMerchantDomain,
    pollMerchantDomainSsl,
    setPrimaryMerchantDomain,
    removeMerchantDomain
} from "../controllers/merchantDomainController.js";

const router = express.Router();

// All merchant domain endpoints require an authenticated merchant admin.
// The store is resolved from the token (req.user.storeId / req.storeId), so a
// merchant can only ever read/modify their OWN domains.
router.get("/api/merchant/domains", verifyToken, isAdmin, listMerchantDomains);
router.get("/api/merchant/domains/availability", verifyToken, isAdmin, checkSubdomainAvailability);

router.post("/api/merchant/domains/subdomain", verifyToken, isAdmin, assignPlatformSubdomain);
router.post("/api/merchant/domains/recheck", verifyToken, isAdmin, recheckMerchantDomain);
router.post("/api/merchant/domains/poll-ssl", verifyToken, isAdmin, pollMerchantDomainSsl);
router.post("/api/merchant/domains", verifyToken, isAdmin, addMerchantDomain);

router.put("/api/merchant/domains/set-primary", verifyToken, isAdmin, setPrimaryMerchantDomain);
router.delete("/api/merchant/domains", verifyToken, isAdmin, removeMerchantDomain);

export default router;
