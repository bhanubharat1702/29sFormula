import express from "express";
import Store from "../../models/Store.js";
import { Product } from "../../models/Product.js";
import Order from "../../models/Order.js";
import DemoRequest from "../../models/DemoRequest.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";

const router = express.Router();

// GET /api/superadmin/stats - Platform-wide analytics
router.get("/api/superadmin/stats", verifySuperAdminToken, async (req, res) => {
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

    res.json({
      totalStores,
      activeStores,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalDemoRequests,
      pendingDemoRequests
    });
  } catch (err) {
    console.error("SuperAdmin Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch platform metrics." });
  }
});

export default router;
