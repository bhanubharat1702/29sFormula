import Settings from "../models/Settings.js";
import { runWithoutTenant } from "./tenantContext.js";
import { getCachedSettingsForStore, setCachedSettingsForStore, invalidateSettingsCache } from "./cache.js";

/**
 * Default global email templates used across the platform.
 */
export const DEFAULT_EMAIL_TEMPLATES = {
  orderConfirmation: {
    subject: "Order Confirmation - {{orderId}}",
    body: "Thank you for your order! Your order {{orderId}} has been placed successfully."
  },
  orderShipped: {
    subject: "Your Order {{orderId}} Has Shipped!",
    body: "Great news! Your order {{orderId}} is on its way."
  },
  orderDelivered: {
    subject: "Your Order {{orderId}} Was Delivered",
    body: "Your order {{orderId}} has been delivered. Thank you for shopping with us."
  },
  orderRefund: {
    subject: "Refund Processed for Order {{orderId}}",
    body: "Your refund for order {{orderId}} has been processed successfully."
  }
};

/**
 * Gets or initializes the single platform-wide Global Settings document.
 * Bypasses tenant isolation using runWithoutTenant.
 */
export const getGlobalSettings = async () => {
  return await runWithoutTenant(async () => {
    let globalSettings = await Settings.findOne({ $or: [{ isGlobal: true }, { storeId: null }] }).lean();
    if (!globalSettings) {
      const created = new Settings({
        isGlobal: true,
        storeId: null,
        defaultPaymentGatewayFee: 2.0,
        taxRate: 0,
        taxInclusive: false,
        emailTemplates: DEFAULT_EMAIL_TEMPLATES
      });
      await created.save();
      globalSettings = created.toObject();
    }
    return globalSettings;
  });
};

/**
 * Performs deep, key-by-key inheritance merge.
 * Rules:
 * 1. Values at tenant level take precedence if explicitly listed in overriddenKeys or set by tenant.
 * 2. Explicit tenant overrides like 0 or false are PRESERVED as tenant values.
 * 3. Un-overridden keys at tenant level fall back to platform-wide global settings.
 * 4. Nested objects (e.g., emailTemplates) are merged key-by-key.
 */
export const mergeSettingsWithInheritance = (tenantSettings = null, globalSettings = {}) => {
  const merged = { ...globalSettings };
  delete merged.isGlobal;
  delete merged._id;
  delete merged.__v;

  if (!tenantSettings) {
    merged.overriddenKeys = [];
    return merged;
  }

  const tenantObj = typeof tenantSettings.toObject === "function" ? tenantSettings.toObject() : tenantSettings;
  const tenantOverrides = Array.isArray(tenantObj.overriddenKeys) ? new Set(tenantObj.overriddenKeys) : null;

  const activeOverrides = [];

  for (const [key, tenantValue] of Object.entries(tenantObj)) {
    if (key === "_id" || key === "__v" || key === "storeId" || key === "isGlobal" || key === "overriddenKeys") continue;

    const isExplicitOverride = tenantOverrides
      ? tenantOverrides.has(key)
      : (tenantValue !== null && tenantValue !== undefined);

    if (isExplicitOverride && tenantValue !== null && tenantValue !== undefined) {
      if (
        typeof tenantValue === "object" &&
        !Array.isArray(tenantValue) &&
        tenantValue !== null &&
        !(tenantValue instanceof Date) &&
        typeof merged[key] === "object" &&
        !Array.isArray(merged[key]) &&
        merged[key] !== null
      ) {
        // Deep merge nested object (e.g. emailTemplates)
        merged[key] = { ...merged[key] };
        for (const [subKey, subVal] of Object.entries(tenantValue)) {
          if (subVal !== null && subVal !== undefined) {
            if (
              typeof subVal === "object" &&
              !Array.isArray(subVal) &&
              subVal !== null &&
              typeof merged[key][subKey] === "object"
            ) {
              merged[key][subKey] = { ...merged[key][subKey], ...subVal };
            } else {
              merged[key][subKey] = subVal;
            }
          }
        }
        activeOverrides.push(key);
      } else {
        // Primitive or array value override
        merged[key] = tenantValue;
        activeOverrides.push(key);
      }
    }
  }

  merged.overriddenKeys = activeOverrides;
  return merged;
};

/**
 * Retrieves the effective settings for a given storeId by resolving
 * tenant settings with fallback to platform-wide global settings.
 */
export const getEffectiveSettings = async (storeId = null) => {
  const storeIdStr = storeId ? String(storeId) : null;
  if (storeIdStr) {
    const cached = getCachedSettingsForStore(storeIdStr);
    if (cached) return cached;
  }

  const globalSettings = await getGlobalSettings();

  if (!storeIdStr) {
    return globalSettings;
  }

  const tenantSettings = await runWithoutTenant(async () => {
    return await Settings.findOne({ storeId: storeIdStr, isGlobal: false }).lean();
  });

  const effective = mergeSettingsWithInheritance(tenantSettings, globalSettings);
  effective.storeId = storeIdStr;

  setCachedSettingsForStore(storeIdStr, effective);
  return effective;
};

/**
 * Updates platform-wide Global Settings.
 * NEVER forcefully overwrites existing custom tenant settings rows in DB
 * unless isSecurityEnforcement is explicitly set to true with specific target keys.
 */
export const updateGlobalSettings = async (updatePayload = {}, options = {}) => {
  const { isSecurityEnforcement = false, overwriteKeys = [] } = options;

  const updatedGlobal = await runWithoutTenant(async () => {
    let globalDoc = await Settings.findOne({ $or: [{ isGlobal: true }, { storeId: null }] });
    if (!globalDoc) {
      globalDoc = new Settings({ isGlobal: true, storeId: null });
    }

    Object.keys(updatePayload).forEach((key) => {
      if (key !== "_id" && key !== "storeId" && key !== "isGlobal" && key !== "overriddenKeys") {
        globalDoc[key] = updatePayload[key];
      }
    });

    globalDoc.isGlobal = true;
    globalDoc.storeId = null;
    await globalDoc.save();
    return globalDoc.toObject();
  });

  // Security Enforcement handling: ONLY overwrite tenant rows if security enforcement is true
  // and specific target keys are supplied. Ordinary updates NEVER touch tenant DB rows.
  if (isSecurityEnforcement && Array.isArray(overwriteKeys) && overwriteKeys.length > 0) {
    await runWithoutTenant(async () => {
      const securityUpdates = {};
      overwriteKeys.forEach((key) => {
        if (updatePayload[key] !== undefined) {
          securityUpdates[key] = updatePayload[key];
        }
      });

      if (Object.keys(securityUpdates).length > 0) {
        await Settings.updateMany(
          { isGlobal: false, storeId: { $ne: null } },
          { $set: securityUpdates }
        );
      }
    });
  }

  // Clear all cached settings so all tenants inherit updated global defaults
  invalidateSettingsCache(null);

  return updatedGlobal;
};

/**
 * Updates (or creates) custom tenant settings for a storeId.
 * Tracks explicit overriddenKeys on tenant document.
 * Passing null/undefined for a key unsets it from overriddenKeys on tenant document, falling back to global settings.
 */
export const updateTenantSettings = async (storeId, updatePayload = {}) => {
  if (!storeId) {
    throw new Error("Store ID is required to update tenant settings");
  }

  const updatedTenant = await runWithoutTenant(async () => {
    let tenantDoc = await Settings.findOne({ storeId, isGlobal: false });
    if (!tenantDoc) {
      tenantDoc = new Settings({ storeId, isGlobal: false, overriddenKeys: [] });
    }

    const currentOverrides = new Set(tenantDoc.overriddenKeys || []);
    const unsets = {};

    Object.keys(updatePayload).forEach((key) => {
      if (key === "_id" || key === "storeId" || key === "isGlobal" || key === "overriddenKeys") return;

      if (updatePayload[key] === null || updatePayload[key] === undefined) {
        tenantDoc[key] = undefined;
        currentOverrides.delete(key);
        unsets[key] = 1;
      } else {
        tenantDoc[key] = updatePayload[key];
        currentOverrides.add(key);
      }
    });

    tenantDoc.overriddenKeys = Array.from(currentOverrides);
    tenantDoc.markModified("overriddenKeys");
    await tenantDoc.save();

    if (Object.keys(unsets).length > 0) {
      await Settings.updateOne({ _id: tenantDoc._id }, { $unset: unsets });
    }

    return tenantDoc;
  });

  invalidateSettingsCache(storeId);
  return await getEffectiveSettings(storeId);
};
