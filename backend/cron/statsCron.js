import cron from "node-cron";
import Store from "../models/Store.js";
import { Product } from "../models/Product.js";
import Order from "../models/Order.js";
import DemoRequest from "../models/DemoRequest.js";
import { DomainItem } from "../models/Domain.js";
import { PlatformStat } from "../models/PlatformStat.js";
import { runWithoutTenant } from "../utils/tenantContext.js";

const PLAN_PRICES = {
  starter: 29,
  pro: 79,
  enterprise: 299,
  free: 0,
};

export const runStatsAggregation = async () => {
  return runWithoutTenant(async () => {
    try {
      console.log("[Cron] Starting platform stats aggregation...");
      
      const totalStores = await Store.countDocuments();
      const activeStores = await Store.countDocuments({ isActive: true });
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalDemoRequests = await DemoRequest.countDocuments();
      const pendingDemoRequests = await DemoRequest.countDocuments({ status: "Pending" });
      
      const revenueAgg = await Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
      ]);
      const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

      const storesList = await Store.find({}, "plan isActive").lean();
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

      let pendingDomains = 0;
      try {
        pendingDomains = await DomainItem.countDocuments({
          type: 'custom',
          $or: [{ dnsStatus: 'pending' }, { sslStatus: 'pending' }]
        });
      } catch {
        pendingDomains = 0;
      }

      const updateData = {
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
        lastUpdated: new Date()
      };

      await PlatformStat.findOneAndUpdate(
        {},
        updateData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log("[Cron] Platform stats aggregation completed successfully.");
    } catch (error) {
      console.error("[Cron] Error aggregating platform stats:", error);
    }
  });
};

// Run the cron job every hour
export const startStatsCron = () => {
  cron.schedule("0 * * * *", runStatsAggregation);
  console.log("Stats aggregation cron job scheduled (runs every hour at minute 0).");
};
