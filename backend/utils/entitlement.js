import { Plan } from "../models/Billing.js";

/**
 * Reusable server-side Entitlement Check
 * Checks if a tenant/store has access to a specific subscription plan feature.
 * 
 * @param {Object} store - The store Mongoose document or lean object.
 * @param {string} featureName - Feature flag key (e.g., 'customDomain', 'advancedAnalytics').
 * @returns {Promise<boolean>}
 */
export const hasFeature = async (store, featureName = "customDomain") => {
  if (!store) return false;

  // Suspended or cancelled stores lose premium plan features
  if (store.status === "suspended" || store.status === "cancelled" || store.isActive === false) {
    return false;
  }

  // 1. Direct Store-level Feature Flag Overrides (if set explicitly by Super Admin)
  if (store.featureFlags && store.featureFlags[featureName] !== undefined && store.featureFlags[featureName] !== null) {
    return Boolean(store.featureFlags[featureName]);
  }

  // 2. Subscription Plan-level Feature Entitlement
  const planCode = (store.plan || "starter").toLowerCase().trim();
  try {
    const plan = await Plan.findOne({ code: planCode }).lean();
    if (plan && plan.featureFlags && plan.featureFlags[featureName] !== undefined) {
      return Boolean(plan.featureFlags[featureName]);
    }
  } catch (err) {
    console.error(`Error resolving plan entitlement for '${planCode}':`, err);
  }

  // Default fallbacks for built-in plan codes if plan database document is missing
  if (featureName === "customDomain") {
    return ["growth", "pro", "enterprise"].includes(planCode);
  }

  return false;
};

/**
 * Detailed Entitlement Summary Helper for Merchant & Admin APIs
 */
export const getTenantFeatureEntitlement = async (store, featureName = "customDomain") => {
  const entitled = await hasFeature(store, featureName);
  const planCode = (store.plan || "starter").toLowerCase().trim();

  let limit = 0;
  if (entitled) {
    if (planCode === "enterprise") limit = 20;
    else if (planCode === "pro") limit = 5;
    else if (planCode === "growth") limit = 2;
    else limit = 1;
  }

  return {
    featureName,
    plan: planCode,
    entitled,
    limit,
    status: store?.status || "trial"
  };
};
