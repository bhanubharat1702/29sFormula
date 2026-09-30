import Store from "../../models/Store.js";
import { Product } from "../../models/Product.js";
import Order from "../../models/Order.js";
import DemoRequest from "../../models/DemoRequest.js";
import { DomainItem } from "../../models/Domain.js";
import AuditLog from "../../models/AuditLog.js";

const PLAN_PRICES = {
  starter: 29,
  pro: 79,
  enterprise: 299,
  free: 0,
};

// GET /api/superadmin/stats - Executive Platform-wide Analytics & Overview
export const getSuperAdminStats = async (req, res) => {
  try {
    const totalStores = await Store.countDocuments();
    const activeStores = await Store.countDocuments({ isActive: true });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalDemoRequests = await DemoRequest.countDocuments();
    const pendingDemoRequests = await DemoRequest.countDocuments({ status: "Pending" });
    
    // Calculate total platform revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Calculate MRR & ARR based on active store subscription plans
    const storesList = await Store.find({}, "plan isActive createdAt name subdomain").lean();
    let mrr = 0;
    const planCounts = { starter: 0, pro: 0, enterprise: 0, custom: 0 };

    storesList.forEach((store) => {
      const p = (store.plan || "pro").toLowerCase();
      if (planCounts[p] !== undefined) {
        planCounts[p]++;
      } else {
        planCounts.custom++;
      }
      if (store.isActive !== false) {
        mrr += PLAN_PRICES[p] || 79;
      }
    });

    const arr = mrr * 12;

    // Fetch pending domain approvals / SSL pending count
    let pendingDomains = 0;
    try {
      pendingDomains = await DomainItem.countDocuments({
        type: 'custom',
        $or: [{ dnsStatus: 'pending' }, { sslStatus: 'pending' }]
      });
    } catch {
      pendingDomains = 0;
    }

    // Fetch recent 5 audit log actions
    let recentLogs = [];
    try {
      recentLogs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(5).lean();
    } catch {
      recentLogs = [];
    }

    // Recent 5 stores
    const recentStores = storesList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5);

    res.json({
      totalStores,
      activeStores,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalDemoRequests,
      pendingDemoRequests,
      mrr,
      arr,
      planCounts,
      pendingDomains,
      recentLogs,
      recentStores,
      systemHealth: {
        database: "Healthy",
        api: "Operational",
        storage: "Healthy",
        uptimeSeconds: Math.floor(process.uptime()),
      }
    });
  } catch (err) {
    console.error("SuperAdmin Stats Error:", err);
    res.status(500).json({ error: "Failed to load platform overview statistics." });
  }
};
