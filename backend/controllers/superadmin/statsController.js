import Store from "../../models/Store.js";
import AuditLog from "../../models/AuditLog.js";
import { PlatformStat } from "../../models/PlatformStat.js";

// GET /api/superadmin/stats - Executive Platform-wide Analytics & Overview
export const getSuperAdminStats = async (req, res) => {
  try {
    // 1. Fetch the aggregated materialized view instead of running expensive counts
    let stats = await PlatformStat.findOne({}).lean();
    
    // If stats haven't been aggregated yet (e.g. first run), provide default 0s
    if (!stats) {
      stats = {
        totalStores: 0,
        activeStores: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalDemoRequests: 0,
        pendingDemoRequests: 0,
        mrr: 0,
        arr: 0,
        planCounts: { starter: 0, pro: 0, enterprise: 0, custom: 0 },
        pendingDomains: 0,
      };
    }

    // 2. Fetch lightweight recent activities directly
    let recentLogs = [];
    try {
      recentLogs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(5).lean();
    } catch {
      recentLogs = [];
    }

    let recentStores = [];
    try {
      recentStores = await Store.find({}, "plan isActive createdAt name subdomain")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    } catch {
      recentStores = [];
    }

    res.json({
      totalStores: stats.totalStores,
      activeStores: stats.activeStores,
      totalProducts: stats.totalProducts,
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      totalDemoRequests: stats.totalDemoRequests,
      pendingDemoRequests: stats.pendingDemoRequests,
      mrr: stats.mrr,
      arr: stats.arr,
      planCounts: stats.planCounts,
      pendingDomains: stats.pendingDomains,
      recentLogs,
      recentStores,
      systemHealth: {
        database: "Healthy",
        api: "Operational",
        storage: "Healthy",
        uptimeSeconds: Math.floor(process.uptime()),
        lastAggregatedAt: stats.lastUpdated || null
      }
    });
  } catch (err) {
    console.error("SuperAdmin Stats Error:", err);
    res.status(500).json({ error: "Failed to load platform overview statistics." });
  }
};
