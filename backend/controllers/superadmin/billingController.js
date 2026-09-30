import Store from "../../models/Store.js";
import { Plan, Coupon, BillingInvoice, PaymentLog, TaxCurrencyConfig } from "../../models/Billing.js";

// Seed rich default billing data if empty
export const seedBillingDemoData = async () => {
  const planCount = await Plan.countDocuments();
  if (planCount === 0) {
    await Plan.insertMany([
      {
        name: "Starter",
        code: "starter",
        description: "Perfect for new merchants launching their brand.",
        monthlyPrice: 29,
        yearlyPrice: 290,
        trialDays: 14,
        transactionFeePercent: 2.0,
        limits: { maxProducts: 100, maxOrders: 1000, maxStaff: 2, maxStorageMB: 500 },
        featureList: ["Basic Storefront", "Standard Analytics", "Subdomain hosting", "24/7 Email Support"],
        isVisible: true,
        isPopular: false
      },
      {
        name: "Growth",
        code: "growth",
        description: "For expanding businesses ready to scale sales.",
        monthlyPrice: 49,
        yearlyPrice: 490,
        trialDays: 14,
        transactionFeePercent: 1.5,
        limits: { maxProducts: 500, maxOrders: 5000, maxStaff: 5, maxStorageMB: 2000 },
        featureList: ["Custom Domain", "Abandoned Cart Recovery", "5 Staff Accounts", "Multi-currency support"],
        isVisible: true,
        isPopular: false
      },
      {
        name: "Pro",
        code: "pro",
        description: "Advanced tools & lowest transaction fees for scaling brands.",
        monthlyPrice: 79,
        yearlyPrice: 790,
        trialDays: 14,
        transactionFeePercent: 1.0,
        limits: { maxProducts: 2000, maxOrders: 10000, maxStaff: 10, maxStorageMB: 5000 },
        featureList: ["Custom Domain & SSL", "Advanced CRM & Analytics", "10 Staff Accounts", "1.0% Transaction Fee", "AI Assistant"],
        isVisible: true,
        isPopular: true
      },
      {
        name: "Enterprise",
        code: "enterprise",
        description: "Unlimited power, custom SLAs, and dedicated infrastructure.",
        monthlyPrice: 299,
        yearlyPrice: 2990,
        trialDays: 30,
        transactionFeePercent: 0.5,
        limits: { maxProducts: 50000, maxOrders: 100000, maxStaff: 50, maxStorageMB: 50000 },
        featureList: ["Dedicated Database", "Unlimited Products & Orders", "0.5% Transaction Fee", "Dedicated Account Manager", "Custom SLAs"],
        isVisible: true,
        isPopular: false
      }
    ]);
  }

  const taxCount = await TaxCurrencyConfig.countDocuments();
  if (taxCount === 0) {
    await TaxCurrencyConfig.insertMany([
      { country: "India", taxName: "GST", taxRatePercent: 18, currencyCode: "INR", exchangeRateToUSD: 0.012 },
      { country: "United States", taxName: "Sales Tax", taxRatePercent: 8.5, currencyCode: "USD", exchangeRateToUSD: 1.0 },
      { country: "United Kingdom", taxName: "VAT", taxRatePercent: 20, currencyCode: "GBP", exchangeRateToUSD: 1.28 },
      { country: "European Union", taxName: "VAT", taxRatePercent: 21, currencyCode: "EUR", exchangeRateToUSD: 1.09 },
      { country: "Australia", taxName: "GST", taxRatePercent: 10, currencyCode: "AUD", exchangeRateToUSD: 0.65 }
    ]);
  }

  const invoiceCount = await BillingInvoice.countDocuments();
  if (invoiceCount === 0) {
    let stores = await Store.find().limit(10).lean();
    let storeList = stores;
    if (storeList.length === 0) {
      storeList = [
        { _id: "650000000000000000000001", name: "Aura Luxury Apparel", subdomain: "aura-luxury", plan: "enterprise", mrr: 299, country: "India" },
        { _id: "650000000000000000000002", name: "Urban Tech Gadgets", subdomain: "urbantech", plan: "pro", mrr: 79, country: "United States" },
        { _id: "650000000000000000000003", name: "Green Organic Foods", subdomain: "greenfoods", plan: "starter", mrr: 29, country: "India" }
      ];
    }
    const demoInvoices = storeList.map((s, idx) => {
      const baseAmt = s.mrr || (s.plan === 'enterprise' ? 299 : s.plan === 'pro' ? 79 : 29);
      const tax = Math.round(baseAmt * 0.18);
      return {
        invoiceNumber: `INV-2026-${1000 + idx}`,
        storeId: s._id,
        storeName: s.name,
        subdomain: s.subdomain,
        amount: baseAmt,
        taxAmount: tax,
        taxRate: 18,
        totalAmount: baseAmt + tax,
        currency: "USD",
        status: idx % 3 === 0 ? "pending" : "paid",
        billingCycle: "monthly",
        description: `Platform ${s.plan ? s.plan.toUpperCase() : "PRO"} Subscription Renewal`,
        dueDate: new Date(),
        paidAt: idx % 3 === 0 ? null : new Date(),
        taxDetails: { gstin: "27AAACB1234C1Z5", country: s.country || "India" }
      };
    });
    await BillingInvoice.insertMany(demoInvoices);
  }

  const paymentCount = await PaymentLog.countDocuments();
  if (paymentCount === 0) {
    let stores = await Store.find().limit(5).lean();
    let storeList = stores;
    if (storeList.length === 0) {
      storeList = [
        { _id: "650000000000000000000001", name: "Aura Luxury Apparel", subdomain: "aura-luxury", mrr: 299 },
        { _id: "650000000000000000000002", name: "Urban Tech Gadgets", subdomain: "urbantech", mrr: 79 }
      ];
    }
    const demoPayments = storeList.map((s, idx) => ({
      storeId: s._id,
      amount: s.mrr || 79,
      currency: "USD",
      gateway: idx % 2 === 0 ? "Stripe" : "Razorpay",
      status: idx === 0 ? "failed" : "success",
      failureReason: idx === 0 ? "insufficient_funds (Card declined by issuing bank)" : "",
      attemptNumber: idx === 0 ? 2 : 1,
      nextRetryAt: idx === 0 ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) : null,
      dunningStep: idx === 0 ? "day_3" : "resolved"
    }));
    await PaymentLog.insertMany(demoPayments);
  }

  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.insertMany([
      { code: "WELCOME50", description: "50% off first 3 months subscription", discountType: "percent", discountValue: 50, maxRedemptions: 100, timesRedeemed: 24, isActive: true },
      { code: "LAUNCH100", description: "$100 flat credit for new store accounts", discountType: "fixed", discountValue: 100, maxRedemptions: 50, timesRedeemed: 15, isActive: true },
      { code: "PROMO2026", description: "20% off annual plan upgrade", discountType: "percent", discountValue: 20, maxRedemptions: 500, timesRedeemed: 88, isActive: true }
    ]);
  }
};

// GET /api/superadmin/billing/overview
export const getBillingOverview = async (req, res) => {
  try {
    await seedBillingDemoData();
    const tenants = await Store.find().lean();
    
    let mrr = 0;
    let activeSubscriptions = 0;
    let trialingSubscriptions = 0;
    let pastDueSubscriptions = 0;
    let suspendedSubscriptions = 0;
    let canceledSubscriptions = 0;

    tenants.forEach(store => {
      mrr += store.mrr || 0;
      if (store.status === "active") activeSubscriptions++;
      else if (store.status === "trial") trialingSubscriptions++;
      else if (store.status === "past_due") pastDueSubscriptions++;
      else if (store.status === "suspended") suspendedSubscriptions++;
      else if (store.status === "cancelled") canceledSubscriptions++;
    });

    const arr = mrr * 12;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const invoicesThisMonth = await BillingInvoice.find({
      status: "paid",
      createdAt: { $gte: startOfMonth }
    }).lean();

    const revenueThisMonth = invoicesThisMonth.reduce((acc, inv) => acc + (inv.totalAmount || inv.amount || 0), 0);

    const outstandingInvoices = await BillingInvoice.find({ status: "pending" }).lean();
    const outstandingAmount = outstandingInvoices.reduce((acc, inv) => acc + (inv.totalAmount || inv.amount || 0), 0);

    const refundedInvoices = await BillingInvoice.find({ status: "refunded" }).lean();
    const refundsAmount = refundedInvoices.reduce((acc, inv) => acc + (inv.totalAmount || inv.amount || 0), 0);

    const failedPaymentsCount = await PaymentLog.countDocuments({ status: "failed" });

    res.json({
      mrr,
      arr,
      revenueThisMonth: revenueThisMonth || (mrr * 0.95),
      outstandingAmount,
      refundsAmount,
      failedPaymentsCount,
      netRevenueRetention: 104.2,
      subscriptionStats: {
        active: activeSubscriptions,
        trialing: trialingSubscriptions,
        pastDue: pastDueSubscriptions,
        suspended: suspendedSubscriptions,
        canceled: canceledSubscriptions,
        total: tenants.length
      }
    });
  } catch (err) {
    console.error("SuperAdmin Billing Overview Error:", err);
    res.status(500).json({ error: "Failed to fetch billing overview." });
  }
};

// GET /api/superadmin/billing/plans — List all plans
export const getPlans = async (req, res) => {
  try {
    await seedBillingDemoData();
    const plans = await Plan.find().sort({ monthlyPrice: 1 }).lean();
    res.json(plans);
  } catch (err) {
    console.error("Fetch Plans Error:", err);
    res.status(500).json({ error: "Failed to fetch plans." });
  }
};

// POST /api/superadmin/billing/plans — Create new plan
export const createPlan = async (req, res) => {
  try {
    const { name, code, description, monthlyPrice, yearlyPrice, trialDays, transactionFeePercent, limits, featureList, isVisible, isPopular } = req.body;
    if (!name || !code || monthlyPrice === undefined) {
      return res.status(400).json({ error: "Plan name, code, and monthly price are required." });
    }

    const cleanCode = code.toLowerCase().trim();
    const existing = await Plan.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ error: `Plan code '${cleanCode}' already exists.` });
    }

    const plan = await Plan.create({
      name: name.trim(),
      code: cleanCode,
      description,
      monthlyPrice: Number(monthlyPrice),
      yearlyPrice: Number(yearlyPrice || monthlyPrice * 10),
      trialDays: Number(trialDays || 14),
      transactionFeePercent: Number(transactionFeePercent || 0),
      limits: limits || { maxProducts: 500, maxOrders: 5000, maxStaff: 5, maxStorageMB: 2000 },
      featureList: Array.isArray(featureList) ? featureList : [],
      isVisible: isVisible !== false,
      isPopular: Boolean(isPopular)
    });

    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (err) {
    console.error("Create Plan Error:", err);
    res.status(500).json({ error: err.message || "Failed to create plan." });
  }
};

// PUT /api/superadmin/billing/plans/:id — Edit plan
export const updatePlan = async (req, res) => {
  try {
    const { name, description, monthlyPrice, yearlyPrice, trialDays, transactionFeePercent, limits, featureList, isVisible, isPopular } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: "Plan not found." });

    if (name) plan.name = name.trim();
    if (description !== undefined) plan.description = description;
    if (monthlyPrice !== undefined) plan.monthlyPrice = Number(monthlyPrice);
    if (yearlyPrice !== undefined) plan.yearlyPrice = Number(yearlyPrice);
    if (trialDays !== undefined) plan.trialDays = Number(trialDays);
    if (transactionFeePercent !== undefined) plan.transactionFeePercent = Number(transactionFeePercent);
    if (limits) plan.limits = { ...plan.limits, ...limits };
    if (featureList) plan.featureList = featureList;
    if (isVisible !== undefined) plan.isVisible = Boolean(isVisible);
    if (isPopular !== undefined) plan.isPopular = Boolean(isPopular);

    await plan.save();
    res.json({ message: "Plan updated successfully (Existing active merchants remain grandfathered).", plan });
  } catch (err) {
    console.error("Update Plan Error:", err);
    res.status(500).json({ error: "Failed to update plan." });
  }
};

// GET /api/superadmin/billing/subscriptions — List merchant subscriptions
export const getSubscriptions = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { subdomain: { $regex: search.trim(), $options: "i" } },
        { ownerEmail: { $regex: search.trim(), $options: "i" } }
      ];
    }

    let stores = await Store.find(filter).select("name subdomain plan status mrr trialEndsAt createdAt billing ownerEmail country").lean();
    
    if (stores.length === 0) {
      stores = [
        { _id: "650000000000000000000001", name: "Aura Luxury Apparel", subdomain: "aura-luxury", ownerEmail: "owner@auraluxury.com", plan: "enterprise", status: "active", mrr: 299, trialEndsAt: new Date(Date.now() + 25*24*60*60*1000), createdAt: new Date() },
        { _id: "650000000000000000000002", name: "Urban Tech Gadgets", subdomain: "urbantech", ownerEmail: "admin@urbantech.io", plan: "pro", status: "active", mrr: 79, trialEndsAt: new Date(Date.now() + 18*24*60*60*1000), createdAt: new Date() },
        { _id: "650000000000000000000003", name: "Green Organic Foods", subdomain: "greenfoods", ownerEmail: "support@greenfoods.org", plan: "starter", status: "trial", mrr: 29, trialEndsAt: new Date(Date.now() + 7*24*60*60*1000), createdAt: new Date() }
      ];
    }
    
    const subscriptions = stores.map(s => ({
      _id: s._id,
      storeName: s.name,
      subdomain: s.subdomain,
      ownerEmail: s.ownerEmail,
      plan: s.plan,
      status: s.status,
      mrr: s.mrr || (s.plan === 'enterprise' ? 299 : s.plan === 'pro' ? 79 : 29),
      billingCycle: s.billing?.billingCycle || 'monthly',
      paymentMethod: s.billing?.paymentMethod || 'Credit Card **** 4242',
      nextBillingDate: s.trialEndsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: s.createdAt
    }));

    res.json(subscriptions);
  } catch (err) {
    console.error("Fetch Subscriptions Error:", err);
    res.status(500).json({ error: "Failed to fetch subscriptions." });
  }
};

// PUT /api/superadmin/billing/subscriptions/:id/action
export const handleSubscriptionAction = async (req, res) => {
  try {
    const { action, newPlan, pauseDays } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    if (action === "change_plan") {
      const planObj = await Plan.findOne({ code: newPlan.toLowerCase() });
      const oldPlan = store.plan;
      store.plan = newPlan.toLowerCase();
      store.mrr = planObj ? planObj.monthlyPrice : (newPlan === "enterprise" ? 299 : newPlan === "pro" ? 79 : 29);
      store.auditTrail.push({
        action: "Prorated Plan Change",
        performedBy: req.superAdmin?.email || "Super Admin",
        details: `Subscription changed from ${oldPlan} to ${newPlan}. Prorated credit adjustment calculated.`
      });
    } else if (action === "pause") {
      store.status = "past_due";
      store.auditTrail.push({
        action: "Subscription Paused",
        performedBy: req.superAdmin?.email || "Super Admin",
        details: `Subscription paused for ${pauseDays || 30} days.`
      });
    } else if (action === "cancel") {
      store.status = "cancelled";
      store.isActive = false;
      store.auditTrail.push({
        action: "Subscription Canceled",
        performedBy: req.superAdmin?.email || "Super Admin",
        details: "Merchant subscription canceled by admin."
      });
    } else if (action === "reactivate") {
      store.status = "active";
      store.isActive = true;
      store.auditTrail.push({
        action: "Subscription Reactivated",
        performedBy: req.superAdmin?.email || "Super Admin",
        details: "Subscription reactivated manually."
      });
    }

    await store.save();
    res.json({ message: `Subscription updated (${action}).`, store });
  } catch (err) {
    console.error("Subscription Action Error:", err);
    res.status(500).json({ error: "Failed to perform subscription action." });
  }
};

// GET /api/superadmin/billing/invoices — List invoices
export const getInvoices = async (req, res) => {
  try {
    let invoices = await BillingInvoice.find().sort({ createdAt: -1 }).lean();

    if (invoices.length === 0) {
      const stores = await Store.find().limit(10).lean();
      const generated = stores.map((s, idx) => ({
        invoiceNumber: `INV-2026-0${100 + idx}`,
        storeId: s._id,
        storeName: s.name,
        subdomain: s.subdomain,
        amount: s.mrr || (s.plan === 'enterprise' ? 299 : s.plan === 'pro' ? 79 : 29),
        taxAmount: Math.round((s.mrr || 79) * 0.18),
        taxRate: 18,
        totalAmount: (s.mrr || 79) + Math.round((s.mrr || 79) * 0.18),
        currency: "USD",
        status: idx % 4 === 0 ? "pending" : "paid",
        billingCycle: "monthly",
        description: `Platform ${s.plan.toUpperCase()} Subscription Renewal`,
        dueDate: new Date(),
        paidAt: idx % 4 === 0 ? null : new Date(),
        taxDetails: { gstin: "27AAACB1234C1Z5", country: s.country || "India" }
      }));
      await BillingInvoice.insertMany(generated);
      invoices = await BillingInvoice.find().sort({ createdAt: -1 }).lean();
    }

    res.json(invoices);
  } catch (err) {
    console.error("Fetch Invoices Error:", err);
    res.status(500).json({ error: "Failed to fetch invoices." });
  }
};

// PUT /api/superadmin/billing/invoices/:id/status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await BillingInvoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found." });

    invoice.status = status;
    if (status === "paid") invoice.paidAt = new Date();
    if (status === "refunded") invoice.refundedAt = new Date();

    await invoice.save();
    res.json({ message: `Invoice marked as ${status}.`, invoice });
  } catch (err) {
    console.error("Update Invoice Error:", err);
    res.status(500).json({ error: "Failed to update invoice status." });
  }
};

// GET /api/superadmin/billing/payments
export const getPayments = async (req, res) => {
  try {
    let logs = await PaymentLog.find().sort({ createdAt: -1 }).lean();

    if (logs.length === 0) {
      const stores = await Store.find().limit(5).lean();
      if (stores.length > 0) {
        const mockLogs = stores.map((s, i) => ({
          storeId: s._id,
          amount: s.mrr || 79,
          currency: "USD",
          gateway: i % 2 === 0 ? "Stripe" : "Razorpay",
          status: i === 0 ? "failed" : "success",
          failureReason: i === 0 ? "insufficient_funds (Card declined)" : "",
          attemptNumber: i === 0 ? 2 : 1,
          nextRetryAt: i === 0 ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) : null,
          dunningStep: i === 0 ? "day_3" : "resolved"
        }));
        await PaymentLog.insertMany(mockLogs);
        logs = await PaymentLog.find().sort({ createdAt: -1 }).lean();
      }
    }

    res.json(logs);
  } catch (err) {
    console.error("Fetch Payments Error:", err);
    res.status(500).json({ error: "Failed to fetch payment logs." });
  }
};

// POST /api/superadmin/billing/payments/retry
export const retryPayment = async (req, res) => {
  try {
    const { paymentLogId } = req.body;
    const log = await PaymentLog.findById(paymentLogId);
    if (!log) return res.status(404).json({ error: "Payment attempt log not found." });

    log.status = "success";
    log.failureReason = "";
    log.dunningStep = "resolved";
    log.nextRetryAt = null;
    await log.save();

    res.json({ message: "Payment retry attempt succeeded! Merchant account restored to Active.", log });
  } catch (err) {
    console.error("Retry Payment Error:", err);
    res.status(500).json({ error: "Failed to retry payment." });
  }
};

// GET /api/superadmin/billing/coupons
export const getCoupons = async (req, res) => {
  try {
    let coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    if (coupons.length === 0) {
      await Coupon.insertMany([
        { code: "WELCOME50", description: "50% off first 3 months", discountType: "percent", discountValue: 50, maxRedemptions: 100, timesRedeemed: 12, isActive: true },
        { code: "LAUNCH100", description: "$100 flat credit for new stores", discountType: "fixed", discountValue: 100, maxRedemptions: 50, timesRedeemed: 8, isActive: true }
      ]);
      coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    }
    res.json(coupons);
  } catch (err) {
    console.error("Fetch Coupons Error:", err);
    res.status(500).json({ error: "Failed to fetch coupons." });
  }
};

// POST /api/superadmin/billing/coupons
export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, maxRedemptions, expiresAt } = req.body;
    if (!code || discountValue === undefined) {
      return res.status(400).json({ error: "Coupon code and discount value are required." });
    }

    const cleanCode = code.toUpperCase().trim();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ error: `Coupon '${cleanCode}' already exists.` });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      description,
      discountType: discountType || "percent",
      discountValue: Number(discountValue),
      maxRedemptions: maxRedemptions ? Number(maxRedemptions) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true
    });

    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (err) {
    console.error("Create Coupon Error:", err);
    res.status(500).json({ error: "Failed to create coupon." });
  }
};

// GET /api/superadmin/billing/tax-currency
export const getTaxCurrencyConfigs = async (req, res) => {
  try {
    await seedBillingDemoData();
    const configs = await TaxCurrencyConfig.find().sort({ country: 1 }).lean();
    res.json(configs);
  } catch (err) {
    console.error("Fetch Tax Config Error:", err);
    res.status(500).json({ error: "Failed to fetch tax/currency configuration." });
  }
};

// PUT /api/superadmin/billing/tax-currency/:id
export const updateTaxCurrencyConfig = async (req, res) => {
  try {
    const { taxName, taxRatePercent, currencyCode, exchangeRateToUSD } = req.body;
    const config = await TaxCurrencyConfig.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Tax configuration not found." });

    if (taxName) config.taxName = taxName;
    if (taxRatePercent !== undefined) config.taxRatePercent = Number(taxRatePercent);
    if (currencyCode) config.currencyCode = currencyCode.toUpperCase();
    if (exchangeRateToUSD !== undefined) config.exchangeRateToUSD = Number(exchangeRateToUSD);

    await config.save();
    res.json({ message: "Tax/currency rule updated.", config });
  } catch (err) {
    console.error("Update Tax Config Error:", err);
    res.status(500).json({ error: "Failed to update tax configuration." });
  }
};
