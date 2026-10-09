import { getGlobalSettings, updateGlobalSettings, getEffectiveSettings } from "../../utils/settingsHelper.js";
import Store from "../../models/Store.js";
import Settings from "../../models/Settings.js";
import { runWithoutTenant } from "../../utils/tenantContext.js";

/**
 * Fetch platform-wide Global Settings for Super Admin.
 */
export const getGlobalSettingsController = async (req, res) => {
  try {
    const globalSettings = await getGlobalSettings();

    // Calculate count of stores with custom settings vs total stores
    const { totalStores, storesWithCustomSettings } = await runWithoutTenant(async () => {
      const total = await Store.countDocuments({});
      const customCount = await Settings.countDocuments({ isGlobal: false, storeId: { $ne: null } });
      return { totalStores: total, storesWithCustomSettings: customCount };
    });

    res.json({
      success: true,
      globalSettings,
      stats: {
        totalStores,
        storesWithCustomSettings,
        storesInheritingGlobal: Math.max(0, totalStores - storesWithCustomSettings)
      }
    });
  } catch (error) {
    console.error("Get Global Settings Error:", error);
    res.status(500).json({ error: "Failed to fetch global settings" });
  }
};

/**
 * Push platform-wide Global Update for Super Admin.
 * Updates the global settings document without touching or overwriting custom tenant DB rows.
 */
export const updateGlobalSettingsController = async (req, res) => {
  try {
    const updatePayload = req.body;

    const updatedGlobal = await updateGlobalSettings(updatePayload, {
      isSecurityEnforcement: false
    });

    res.json({
      success: true,
      message: "Platform-wide global settings updated successfully! Merchants without custom overrides will automatically inherit these settings.",
      globalSettings: updatedGlobal
    });
  } catch (error) {
    console.error("Update Global Settings Error:", error);
    res.status(500).json({ error: "Failed to update global settings" });
  }
};

/**
 * Optional Super Admin route for mandatory security enforcement overrides.
 */
export const securityEnforcementController = async (req, res) => {
  try {
    const { overwriteKeys, updatePayload } = req.body;

    if (!Array.isArray(overwriteKeys) || overwriteKeys.length === 0) {
      return res.status(400).json({ error: "overwriteKeys array is required for security enforcement" });
    }

    const updatedGlobal = await updateGlobalSettings(updatePayload || {}, {
      isSecurityEnforcement: true,
      overwriteKeys
    });

    res.json({
      success: true,
      message: `Mandatory security enforcement applied successfully for keys: ${overwriteKeys.join(", ")}`,
      globalSettings: updatedGlobal
    });
  } catch (error) {
    console.error("Security Enforcement Error:", error);
    res.status(500).json({ error: "Failed to apply security enforcement" });
  }
};

/**
 * Preview effective settings for a specific tenant (for Super Admin inspection).
 */
export const previewTenantEffectiveSettings = async (req, res) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const effectiveSettings = await getEffectiveSettings(storeId);
    res.json({
      success: true,
      storeId,
      effectiveSettings
    });
  } catch (error) {
    console.error("Preview Tenant Effective Settings Error:", error);
    res.status(500).json({ error: "Failed to preview effective settings" });
  }
};
