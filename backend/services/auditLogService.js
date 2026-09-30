import AuditLog from "../models/AuditLog.js";

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
  suspiciousReason = ""
}) => {
  try {
    const entry = await AuditLog.create({
      timestamp: new Date(),
      adminUser,
      adminEmail: adminEmail.toLowerCase().trim(),
      role,
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
      suspiciousReason
    });
    return entry;
  } catch (err) {
    console.error("Failed to record audit log:", err);
    return null;
  }
};
