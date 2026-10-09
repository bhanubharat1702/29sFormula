import AuditLog from "../../models/AuditLog.js";
import { recordAuditLog } from "../../services/auditLogService.js";

// Seed initial audit log demo entries if empty
export const seedAuditLogsIfEmpty = async () => {
  try {
    const count = await AuditLog.countDocuments();
    if (count === 0) {
      const demoLogs = [
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          adminUser: "Root Admin",
          adminEmail: "root@ecommerce.com",
          role: "Super Admin",
          action: "Super Admin Login",
          actionCategory: "auth",
          target: "Platform Control Panel",
          ipAddress: "192.168.1.45",
          country: "India",
          userAgent: "Chrome 128.0 (macOS)",
          result: "success",
          isSuspicious: false
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          adminUser: "Sarah Jenkins",
          adminEmail: "sarah@ecommerce.com",
          role: "Platform Support",
          action: "Start Tenant Impersonation",
          actionCategory: "impersonation",
          target: "Aura Luxury Apparel",
          storeName: "Aura Luxury Apparel",
          reason: "Investigating customer checkout gateway error on support ticket #TCK-1001",
          ipAddress: "203.0.113.195",
          country: "United States",
          userAgent: "Safari 17.4 (macOS)",
          result: "success",
          isSuspicious: false
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          adminUser: "System Monitor",
          adminEmail: "security-bot@ecommerce.com",
          role: "Automated Bot",
          action: "Failed Super Admin Login Attempt",
          actionCategory: "auth",
          target: "Super Admin Auth Portal",
          ipAddress: "185.220.101.4",
          country: "Russia",
          userAgent: "Python-urllib/3.9",
          result: "failed",
          isSuspicious: true,
          suspiciousReason: "Multiple failed logins from new un-allowlisted country (Russia)"
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 300),
          adminUser: "Root Admin",
          adminEmail: "root@ecommerce.com",
          role: "Super Admin",
          action: "Provision Merchant Store",
          actionCategory: "tenant",
          target: "Urban Tech Gadgets (urbantech)",
          storeName: "Urban Tech Gadgets",
          beforeValue: { plan: "none", status: "unprovisioned" },
          afterValue: { plan: "pro", status: "trial", trialDays: 14 },
          diff: { plan: { from: null, to: "pro" }, mrr: { from: 0, to: 79 } },
          ipAddress: "192.168.1.45",
          country: "India",
          result: "success"
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 600),
          adminUser: "Root Admin",
          adminEmail: "root@ecommerce.com",
          role: "Super Admin",
          action: "Custom Domain DNS Verified",
          actionCategory: "domain",
          target: "store.urbantech.io",
          storeName: "Urban Tech Gadgets",
          beforeValue: { dnsStatus: "pending", sslStatus: "pending" },
          afterValue: { dnsStatus: "dns_verified", sslStatus: "active" },
          diff: { sslStatus: { from: "pending", to: "active" } },
          ipAddress: "192.168.1.45",
          country: "India",
          result: "success"
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 1400),
          adminUser: "Alex Rivera",
          adminEmail: "alex@ecommerce.com",
          role: "Security Lead",
          action: "Update Platform Security Settings",
          actionCategory: "settings",
          target: "Global Security Config",
          beforeValue: { enforce2FA: false, minPasswordLength: 8 },
          afterValue: { enforce2FA: true, minPasswordLength: 10 },
          diff: { enforce2FA: { from: false, to: true }, minPasswordLength: { from: 8, to: 10 } },
          ipAddress: "198.51.100.22",
          country: "United States",
          result: "success"
        }
      ];

      await AuditLog.insertMany(demoLogs);
    }
  } catch (err) {
    console.error("Failed to seed demo audit logs:", err);
  }
};

// GET /api/superadmin/audit-logs — Read immutable append-only audit trail
export const getAuditLogs = async (req, res) => {
  try {
    await seedAuditLogsIfEmpty();

    const {
      search,
      actionCategory,
      result,
      adminEmail,
      isSuspicious,
      isImpersonated,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (actionCategory && actionCategory !== "all") query.actionCategory = actionCategory;
    if (result && result !== "all") query.result = result;
    if (adminEmail && adminEmail !== "all") query.adminEmail = adminEmail.toLowerCase().trim();
    if (isSuspicious === "true") query.isSuspicious = true;
    if (isImpersonated === "true") query.isImpersonated = true;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.timestamp.$lte = end;
      }
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { action: { $regex: q, $options: "i" } },
        { adminUser: { $regex: q, $options: "i" } },
        { adminEmail: { $regex: q, $options: "i" } },
        { target: { $regex: q, $options: "i" } },
        { storeName: { $regex: q, $options: "i" } },
        { reason: { $regex: q, $options: "i" } },
        { ipAddress: { $regex: q, $options: "i" } },
        { attributionStatement: { $regex: q, $options: "i" } },
        { impersonatorEmail: { $regex: q, $options: "i" } },
        { impersonatedTenantName: { $regex: q, $options: "i" } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total, suspiciousCount] = await Promise.all([
      AuditLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limitNum).lean(),
      AuditLog.countDocuments(query),
      AuditLog.countDocuments({ isSuspicious: true })
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      suspiciousCount
    });
  } catch (err) {
    console.error("Fetch Audit Logs Error:", err);
    res.status(500).json({ error: "Failed to fetch audit logs." });
  }
};

// GET /api/superadmin/audit-logs/export — Export CSV endpoint
export const exportAuditLogsCsv = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(1000).lean();

    await recordAuditLog({
      adminUser: req.superAdmin?.name || "Super Admin",
      adminEmail: req.superAdmin?.email || "root@ecommerce.com",
      role: "Super Admin",
      action: "Export Audit Logs CSV",
      actionCategory: "export",
      target: "System Audit Logs",
      reason: "Compliance export download",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1"
    });

    const headers = [
      "ID",
      "Timestamp",
      "Admin User",
      "Admin Email",
      "Role",
      "Category",
      "Action",
      "Target",
      "Store Name",
      "IP Address",
      "Country",
      "User Agent",
      "Result",
      "Suspicious Flag",
      "Reason"
    ];

    const csvRows = [headers.join(",")];

    logs.forEach((l) => {
      const row = [
        `"${l._id}"`,
        `"${l.timestamp ? new Date(l.timestamp).toISOString() : ""}"`,
        `"${(l.adminUser || "").replace(/"/g, '""')}"`,
        `"${(l.adminEmail || "").replace(/"/g, '""')}"`,
        `"${(l.role || "").replace(/"/g, '""')}"`,
        `"${(l.actionCategory || "").replace(/"/g, '""')}"`,
        `"${(l.action || "").replace(/"/g, '""')}"`,
        `"${(l.target || "").replace(/"/g, '""')}"`,
        `"${(l.storeName || "").replace(/"/g, '""')}"`,
        `"${(l.ipAddress || "").replace(/"/g, '""')}"`,
        `"${(l.country || "").replace(/"/g, '""')}"`,
        `"${(l.userAgent || "").replace(/"/g, '""')}"`,
        `"${(l.result || "").replace(/"/g, '""')}"`,
        `"${l.isSuspicious ? "YES" : "NO"}"`,
        `"${(l.reason || l.suspiciousReason || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="audit_logs_${Date.now()}.csv"`);
    res.status(200).send(csvRows.join("\n"));
  } catch (err) {
    console.error("Export Audit Logs CSV Error:", err);
    res.status(500).json({ error: "Failed to export audit logs CSV." });
  }
};
