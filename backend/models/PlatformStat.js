import mongoose from "mongoose";

const platformStatSchema = new mongoose.Schema(
  {
    totalStores: { type: Number, default: 0 },
    activeStores: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalDemoRequests: { type: Number, default: 0 },
    pendingDemoRequests: { type: Number, default: 0 },
    mrr: { type: Number, default: 0 },
    arr: { type: Number, default: 0 },
    planCounts: {
      starter: { type: Number, default: 0 },
      pro: { type: Number, default: 0 },
      enterprise: { type: Number, default: 0 },
      custom: { type: Number, default: 0 },
    },
    pendingDomains: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PlatformStat = mongoose.model("PlatformStat", platformStatSchema);
