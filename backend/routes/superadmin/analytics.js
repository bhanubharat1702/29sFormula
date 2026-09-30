import express from "express";
import Store from "../../models/Store.js";
import { Product } from "../../models/Product.js";
import Order from "../../models/Order.js";
import DemoRequest from "../../models/DemoRequest.js";
import User from "../../models/User.js";
import { Plan, BillingInvoice, PaymentLog } from "../../models/Billing.js";
import { AnalyticsSnapshot, SavedReport } from "../../models/Analytics.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";

const router = express.Router();

// Helper to seed analytics snapshot / demo BI metrics
const seedAnalyticsDemoMetrics = async () => {
  const count = await AnalyticsSnapshot.countDocuments();
  if (count === 0) {
    const defaultSnapshots = [
      {
        group: 'revenue',
        period: '30d',
        metrics: {
          mrrMovement: { newMrr: 1250, expansionMrr: 450, contractionMrr: 120, churnMrr: 180, netNewMrr: 1400 },
          arpu: 74.50,
          ltv: 1780.00,
          revenueByPlan: [
            { plan: 'starter', count: 18, mrr: 522 },
            { plan: 'growth', count: 12, mrr: 588 },
            { plan: 'pro', count: 25, mrr: 1975 },
            { plan: 'enterprise', count: 6, mrr: 1794 }
          ],
          revenueByCountry: [
            { country: 'India', revenue: 2450, percentage: 50.2 },
            { country: 'United States', revenue: 1420, percentage: 29.1 },
            { country: 'United Kingdom', revenue: 610, percentage: 12.5 },
            { country: 'Other', revenue: 400, percentage: 8.2 }
          ]
        }
      },
      {
        group: 'growth',
        period: '30d',
        metrics: {
          signups: 48,
          trialToPaidConversionRate: 34.8,
          activationRate: { firstProductAddedPercent: 88.5, firstOrderReceivedPercent: 62.1 },
          signupTrend: [
            { date: '2026-09-01', signups: 3, conversions: 1 },
            { date: '2026-09-08', signups: 12, conversions: 4 },
            { date: '2026-09-15', signups: 15, conversions: 5 },
            { date: '2026-09-22', signups: 18, conversions: 7 }
          ]
        }
      },
      {
        group: 'retention',
        period: '30d',
        metrics: {
          logoChurnRate: 2.1,
          revenueChurnRate: 1.8,
          cancellationReasons: [
            { reason: 'Too expensive / budget constraints', percentage: 42 },
            { reason: 'Switched to alternative solution', percentage: 28 },
            { reason: 'Missing custom features', percentage: 18 },
            { reason: 'Store business closed down', percentage: 12 }
          ],
          cohortRetention: [
            { cohort: 'May 2026', size: 20, m1: 100, m2: 95, m3: 90, m4: 88 },
            { cohort: 'Jun 2026', size: 25, m1: 100, m2: 92, m3: 88, m4: 85 },
            { cohort: 'Jul 2026', size: 30, m1: 100, m2: 96, m3: 93, m4: 90 },
            { cohort: 'Aug 2026', size: 35, m1: 100, m2: 94, m3: 91, m4: 91 }
          ]
        }
      },
      {
        group: 'merchant_success',
        period: '30d',
        metrics: {
          totalGmv: 485000,
          totalPlatformOrders: 8940,
          avgStoreRevenue: 13850,
          topCategories: [
            { category: 'Fashion & Apparel', gmv: 198000, percentage: 40.8 },
            { category: 'Electronics & Tech', gmv: 142000, percentage: 29.3 },
            { category: 'Beauty & Wellness', gmv: 85000, percentage: 17.5 },
            { category: 'Home & Grocery', gmv: 60000, percentage: 12.4 }
          ]
        }
      },
      {
        group: 'funnel',
        period: '30d',
        metrics: {
          stages: [
            { stage: 'Landing Visits', count: 12400, conversion: 100 },
            { stage: 'Demo Requests', count: 320, conversion: 2.58 },
            { stage: 'Demos Scheduled', count: 210, conversion: 65.6 },
            { stage: 'Trials Started', count: 145, conversion: 69.0 },
            { stage: 'Paid Subscriptions', count: 52, conversion: 35.8 }
          ]
        }
      },
      {
        group: 'usage',
        period: '30d',
        metrics: {
          featureAdoption: [
            { feature: 'Custom Domain Setup', usagePercent: 82.4 },
            { feature: 'AI Product Copy Generator', usagePercent: 68.1 },
            { feature: 'Abandoned Cart Email Recovery', usagePercent: 74.9 },
            { feature: 'Multi-Currency Checkout', usagePercent: 31.2 }
          ],
          totalStorageUsedGB: 412.5,
          totalApiCallsMonth: 1850000,
          planLimitHitsUpsellSignals: 14
        }
      },
      {
        group: 'performance',
        period: '30d',
        metrics: {
          avgResponseTimeMs: 42.5,
          errorRatePercent: 0.04,
          slowestStores: [
            { storeName: 'Aura Luxury Apparel', avgMs: 112, errorCount: 2 },
            { storeName: 'Urban Tech Gadgets', avgMs: 88, errorCount: 0 },
            { storeName: 'Green Organic Foods', avgMs: 65, errorCount: 1 }
          ]
        }
      },
      {
        group: 'geography',
        period: '30d',
        metrics: {
          countries: [
            { country: 'India', merchants: 32, activeStores: 30, gmv: 245000 },
            { country: 'United States', merchants: 18, activeStores: 16, gmv: 185000 },
            { country: 'United Kingdom', merchants: 8, activeStores: 7, gmv: 42000 },
            { country: 'Australia', merchants: 3, activeStores: 3, gmv: 13000 }
          ]
        }
      }
    ];

    await AnalyticsSnapshot.insertMany(defaultSnapshots);
  }
};

// ── GET /api/superadmin/analytics — Read BI metrics by report group & filters ──
router.get("/api/superadmin/analytics", verifySuperAdminToken, async (req, res) => {
  try {
    await seedAnalyticsDemoMetrics();

    const { group = "revenue", dateRange = "30d", plan = "all", country = "all" } = req.query;

    let snapshot = await AnalyticsSnapshot.findOne({ group, period: dateRange }).lean();
    if (!snapshot) {
      snapshot = await AnalyticsSnapshot.findOne({ group }).lean();
    }

    // Compute live real-time aggregate fallbacks directly from DB if needed
    const [totalStores, totalOrders, totalProducts, demoRequestsCount] = await Promise.all([
      Store.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      DemoRequest.countDocuments()
    ]);

    const liveRevenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const liveGmv = liveRevenueAgg[0]?.total || 0;

    res.json({
      group,
      dateRange,
      plan,
      country,
      liveSummary: {
        totalStores,
        totalOrders,
        totalProducts,
        demoRequestsCount,
        liveGmv
      },
      data: snapshot ? snapshot.metrics : null
    });
  } catch (err) {
    console.error("SuperAdmin BI Analytics Error:", err);
    res.status(500).json({ error: "Failed to fetch analytics." });
  }
});

// ── GET /api/superadmin/analytics/reports — List saved reports ──
router.get("/api/superadmin/analytics/reports", verifySuperAdminToken, async (req, res) => {
  try {
    let reports = await SavedReport.find().sort({ createdAt: -1 }).lean();
    if (reports.length === 0) {
      await SavedReport.insertMany([
        {
          name: "Weekly Executive Revenue & Churn Summary",
          description: "Automated Monday morning report detailing MRR movement and cohort retention.",
          reportGroup: "revenue",
          filters: { dateRange: "30d", plan: "all", country: "all", source: "all" },
          isScheduled: true,
          scheduleFrequency: "weekly",
          emailRecipients: ["execs@platform.com", "finance@platform.com"]
        },
        {
          name: "Monthly Merchant GMV & Category Leaders",
          description: "Top performing merchant stores and product categories.",
          reportGroup: "merchant_success",
          filters: { dateRange: "12m", plan: "all", country: "all", source: "all" },
          isScheduled: true,
          scheduleFrequency: "monthly",
          emailRecipients: ["sales@platform.com"]
        }
      ]);
      reports = await SavedReport.find().sort({ createdAt: -1 }).lean();
    }
    res.json(reports);
  } catch (err) {
    console.error("Fetch Saved Reports Error:", err);
    res.status(500).json({ error: "Failed to fetch saved reports." });
  }
});

// ── POST /api/superadmin/analytics/reports — Save report / Schedule email ──
router.post("/api/superadmin/analytics/reports", verifySuperAdminToken, async (req, res) => {
  try {
    const { name, description, reportGroup, filters, isScheduled, scheduleFrequency, emailRecipients } = req.body;
    if (!name || !reportGroup) {
      return res.status(400).json({ error: "Report name and report group are required." });
    }

    const report = await SavedReport.create({
      name: name.trim(),
      description: description || '',
      reportGroup,
      filters: filters || { dateRange: '30d', plan: 'all', country: 'all' },
      createdBy: req.superAdmin?.email || "Super Admin",
      isScheduled: Boolean(isScheduled),
      scheduleFrequency: scheduleFrequency || 'weekly',
      emailRecipients: Array.isArray(emailRecipients) ? emailRecipients : []
    });

    res.status(201).json({ message: "Report saved and schedule created!", report });
  } catch (err) {
    console.error("Create Saved Report Error:", err);
    res.status(500).json({ error: "Failed to save report." });
  }
});

export default router;
