import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  getGlobalSettingsController,
  updateGlobalSettingsController,
  securityEnforcementController,
  previewTenantEffectiveSettings
} from "../../controllers/superadmin/globalSettingsController.js";

const router = express.Router();

router.get("/api/superadmin/global-settings", verifySuperAdminToken, getGlobalSettingsController);
router.put("/api/superadmin/global-settings", verifySuperAdminToken, updateGlobalSettingsController);
router.post("/api/superadmin/global-settings/security-enforcement", verifySuperAdminToken, securityEnforcementController);
router.get("/api/superadmin/global-settings/preview/:storeId", verifySuperAdminToken, previewTenantEffectiveSettings);

export default router;
