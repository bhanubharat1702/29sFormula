import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getStoresHandler,
  createStoreHandler,
  updateStoreHandler,
  restoreStoreHandler,
  impersonateStoreHandler,
  deleteStoreHandler,
  calculateStoreHealthScore,
  purgeTenantData
} from "../../controllers/superadmin/storesController.js";

const router = express.Router();

export { calculateStoreHealthScore, purgeTenantData };

// Store & Tenant Listing Routes
router.get("/api/superadmin/stores", verifySuperAdminToken, getStoresHandler);
router.get("/api/superadmin/tenants", verifySuperAdminToken, getStoresHandler);

// Store Provisioning Route
router.post("/api/superadmin/stores", verifySuperAdminToken, createStoreHandler);

// Store Modification Routes
router.put("/api/superadmin/stores/:id", verifySuperAdminToken, updateStoreHandler);
router.put("/api/superadmin/tenants/:id", verifySuperAdminToken, updateStoreHandler);

// Store Deletion Cancellation Route
router.post("/api/superadmin/stores/:id/restore", verifySuperAdminToken, restoreStoreHandler);

// Store Single-Use Impersonation Session Route
router.post("/api/superadmin/stores/:id/impersonate", verifySuperAdminToken, impersonateStoreHandler);

// Store Soft-Delete & Purge Routes
router.delete("/api/superadmin/stores/:id", verifySuperAdminToken, deleteStoreHandler);
router.delete("/api/superadmin/tenants/:id", verifySuperAdminToken, deleteStoreHandler);

export default router;
