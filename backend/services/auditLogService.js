import AuditLog from "../models/AuditLog.js";

/**
 * Builds a human-readable, compliance-grade attribution statement.
 * e.g. Action "Delete Product" was performed by Super Admin Y <y@x.com> on behalf of Merchant Z <store>
 */
export const buildAttributionStatement = ({
  action = "",
  impersonatorName = "",
  impersonatorEmail = "",
  impersonatedTenantName = "",
  adminUser = "",
  adminEmail = "",
  storeName = ""
}) => {
  const actionText = action || "Action";
  if (impersonatorEmail || impersonatorName) {
    const superAdminLabel = `${impersonatorName || "Super Admin"}${impersonatorEmail ? ` <${impersonatorEmail}>` : ""}`;
    const merchantLabel = `${impersonatedTenantName || storeName || "Merchant"}${storeName ? ` <${storeName}>` : ""}`;
    return `Action "${actionText}" was performed by Super Admin ${superAdminLabel} on behalf of Merchant ${merchantLabel}`;
  }
  const adminLabel = `${adminUser || "Super Admin"}${adminEmail ? ` <${adminEmail}>` : ""}`;
  return `Action "${actionText}" was performed by ${adminLabel}`;
};

/**
 * Helper utility to create append-only audit log entry
 */
export const recordAuditLog = async ({
  adminUser = "Super Admin",
  adminEmail = "root@ecommerce.com",
  role = "Super Admin",
  action,
  actionCategory = "auth",
  target = "",
  targetId = "",
  storeId = null,
  storeName = "",
  beforeValue = null,
  afterValue = null,
  diff = null,
  ipAddress = "127.0.0.1",
  country = "India",
  userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  reason = "",
  result = "success",
  isSuspicious = false,
  suspiciousReason = "",
  // ── Impersonation provenance (dual identity) ─────────────────
  isImpersonated = false,
  impersonatorId = "",
  impersonatorEmail = "",
  impersonatedTenantId = null,
  impersonatedTenantName = "",
  impersonationGrantId = null,
  attributionStatement = ""
}) => {
  try {
    const normalizedImpersonatorEmail = impersonatorEmail ? impersonatorEmail.toLowerCase().trim() : "";
    const normalizedAdminEmail = adminEmail ? adminEmail.toLowerCase().trim() : "";
    const normalizedRole = isImpersonated ? "Super Admin (Impersonating)" : role;

    const statement =
      attributionStatement ||
      buildAttributionStatement({
        action,
        impersonatorName: isImpersonated ? adminUser : "",
        impersonatorEmail: normalizedImpersonatorEmail,
        impersonatedTenantName: impersonatedTenantName || storeName,
        adminUser,
        adminEmail: normalizedAdminEmail,
        storeName
      });

    const entry = await AuditLog.create({
      timestamp: new Date(),
      adminUser,
      adminEmail: normalizedAdminEmail,
      role: normalizedRole,
      action,
      actionCategory,
      target,
      targetId,
      storeId,
      storeName,
      beforeValue,
      afterValue,
      diff,
      ipAddress,
      country,
      userAgent,
      reason,
      result,
      isSuspicious,
      suspiciousReason,
      isImpersonated,
      impersonatorId: impersonatorId ? String(impersonatorId) : "",
      impersonatorEmail: normalizedImpersonatorEmail,
      impersonatedTenantId: impersonatedTenantId || (isImpersonated ? storeId : null),
      impersonatedTenantName: impersonatedTenantName || (isImpersonated ? storeName : ""),
      impersonationGrantId: impersonationGrantId || null,
      attributionStatement: statement
    });
    return entry;
  } catch (err) {
    console.error("Failed to record audit log:", err);
    return null;
  }
};
