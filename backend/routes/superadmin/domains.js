import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getDomains,
  addDomain,
  recheckDomain,
  forceSslRenewal,
  setPrimaryDomain,
  blockDomain,
  removeDomain,
  getReservedSubdomains,
  addReservedSubdomain,
  deleteReservedSubdomain,
  bulkReverifyDomains,
  updateDomainSettings,
  seedDomainDefaults,
  getPlanDomainLimit
} from "../../controllers/superadmin/domainsController.js";

const router = express.Router();

export { seedDomainDefaults, getPlanDomainLimit };

router.get("/api/superadmin/domains", verifySuperAdminToken, getDomains);
router.post("/api/superadmin/domains", verifySuperAdminToken, addDomain);
router.post("/api/superadmin/domains/recheck", verifySuperAdminToken, recheckDomain);
router.post("/api/superadmin/domains/force-ssl-renewal", verifySuperAdminToken, forceSslRenewal);
router.put("/api/superadmin/domains/set-primary", verifySuperAdminToken, setPrimaryDomain);
router.post("/api/superadmin/domains/block", verifySuperAdminToken, blockDomain);
router.delete("/api/superadmin/domains", verifySuperAdminToken, removeDomain);

router.get("/api/superadmin/domains/reserved", verifySuperAdminToken, getReservedSubdomains);
router.post("/api/superadmin/domains/reserved", verifySuperAdminToken, addReservedSubdomain);
router.delete("/api/superadmin/domains/reserved/:id", verifySuperAdminToken, deleteReservedSubdomain);

router.post("/api/superadmin/domains/bulk-reverify", verifySuperAdminToken, bulkReverifyDomains);
router.put("/api/superadmin/domains/settings", verifySuperAdminToken, updateDomainSettings);

export default router;
