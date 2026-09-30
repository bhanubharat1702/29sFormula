import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Store from "../../models/Store.js";
import { Product } from "../../models/Product.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import DemoRequest from "../../models/DemoRequest.js";
import Settings from "../../models/Settings.js";
import Customer from "../../models/Customer.js";
import Discount from "../../models/Discount.js";
import ReturnRequest from "../../models/ReturnRequest.js";
import Review from "../../models/Review.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import { purgeTenantData } from "./stores.js";

const router = express.Router();
const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

const RESERVED_SUBDOMAINS = [
  "admin", "api", "app", "www", "mail", "billing", "assets", "static", "superadmin", "status", "dashboard"
];

// Helper to compute default plan limits & MRR
const getPlanDefaults = (planName) => {
  switch (planName?.toLowerCase()) {
    case "enterprise":
      return { mrr: 299, maxProducts: 50000, maxOrders: 100000, maxStaff: 50, maxStorageMB: 50000 };
    case "pro":
      return { mrr: 79, maxProducts: 2000, maxOrders: 10000, maxStaff: 10, maxStorageMB: 5000 };
    case "starter":
    default:
      return { mrr: 29, maxProducts: 100, maxOrders: 1000, maxStaff: 2, maxStorageMB: 500 };
  }
};

// GET /api/superadmin/tenants — List all tenants with advanced search, filter, sort, pagination
router.get("/api/superadmin/tenants", verifySuperAdminToken, async (req, res) => {
  try {
    const {
      status,
      plan,
      country,
      hasCustomDomain,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (plan && plan !== "all") filter.plan = plan;
    if (country && country !== "all") filter.country = country;
    if (hasCustomDomain === "yes") {
      filter.customDomain = { $exists: true, $ne: "" };
    } else if (hasCustomDomain === "no") {
      filter.$or = [{ customDomain: { $exists: false } }, { customDomain: "" }];
    }

    if (search && search.trim()) {
      const q = search.trim();
      const searchRegex = { $regex: q, $options: "i" };
      const searchOr = [
        { name: searchRegex },
        { businessName: searchRegex },
        { subdomain: searchRegex },
        { customDomain: searchRegex },
        { ownerEmail: searchRegex },
        { ownerName: searchRegex }
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    const sortObj = {};
    const dir = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "mrr") sortObj.mrr = dir;
    else if (sortBy === "name") sortObj.name = dir;
    else if (sortBy === "status") sortObj.status = dir;
    else if (sortBy === "lastActiveAt") sortObj.lastActiveAt = dir;
    else sortObj.createdAt = dir;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [tenants, total] = await Promise.all([
      Store.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Store.countDocuments(filter)
    ]);

    // Enrich each store with counts, logo fallback, computed MRR
    const enriched = await Promise.all(
      tenants.map(async (store) => {
        const [productCount, orderCount, customerCount] = await Promise.all([
          Product.countDocuments({ storeId: store._id }),
          Order.countDocuments({ storeId: store._id }),
          Customer.countDocuments({ storeId: store._id })
        ]);

        const planDefaults = getPlanDefaults(store.plan);
        const computedMrr = store.mrr || planDefaults.mrr;

        return {
          ...store,
          productCount,
          orderCount,
          customerCount,
          mrr: computedMrr,
          businessLogo: store.businessLogo || "",
          logo: store.businessLogo || ""
        };
      })
    );

    res.json({
      tenants: enriched,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error("SuperAdmin List Tenants Error:", err);
    res.status(500).json({ error: "Failed to fetch tenants." });
  }
});

// GET /api/superadmin/tenants/:id — Single tenant detailed breakdown across 9 tabs
router.get("/api/superadmin/tenants/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).lean();
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const sId = store._id;
    const [productCount, orderCount, customerCount, revenueAgg, owner, staffUsers] = await Promise.all([
      Product.countDocuments({ storeId: sId }),
      Order.countDocuments({ storeId: sId }),
      Customer.countDocuments({ storeId: sId }),
      Order.aggregate([
        { $match: { storeId: sId, status: { $ne: "Cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
      ]),
      store.ownerId ? User.findById(store.ownerId).select("name email phone role isOwner mustChangePassword onboardingComplete lastLoginAt tokenVersion createdAt").lean() : null,
      User.find({ storeId: sId }).select("name email phone role isOwner lastLoginAt tokenVersion createdAt").lean()
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const planDefaults = getPlanDefaults(store.plan);

    // Assembly of tab data
    const tenantDetail = {
      ...store,
      mrr: store.mrr || planDefaults.mrr,
      healthScore: store.healthScore || 95,
      stats: {
        productCount,
        orderCount,
        customerCount,
        totalRevenue
      },
      usage: {
        products: { count: productCount, limit: store.limitOverrides?.maxProducts || planDefaults.maxProducts },
        orders: { count: orderCount, limit: store.limitOverrides?.maxOrders || planDefaults.maxOrders },
        staff: { count: staffUsers.length, limit: store.limitOverrides?.maxStaff || planDefaults.maxStaff },
        storageMB: { count: Math.round(productCount * 2.5), limit: store.limitOverrides?.maxStorageMB || planDefaults.maxStorageMB },
        apiCallsMonth: { count: Math.round(orderCount * 18 + productCount * 5), limit: 100000 }
      },
      billing: store.billing || {
        subscriptionId: `sub_${store._id.toString().substring(0, 10)}`,
        billingCycle: "monthly",
        paymentMethod: "Credit Card **** 4242",
        credits: 0,
        discountPercent: 0,
        invoices: [
          { invoiceId: `INV-${Date.now().toString().slice(-6)}`, amount: store.mrr || planDefaults.mrr, date: store.createdAt, status: "paid" }
        ]
      },
      domains: (store.domains && store.domains.length > 0) ? store.domains : [
        { domain: `${store.subdomain}.${process.env.PLATFORM_DOMAIN || "localhost:3000"}`, type: "subdomain", isPrimary: true, sslStatus: "active", createdAt: store.createdAt },
        ...(store.customDomain ? [{ domain: store.customDomain, type: "custom", isPrimary: false, sslStatus: "active", createdAt: store.createdAt }] : [])
      ],
      owner,
      users: staffUsers,
      featureFlags: store.featureFlags || {
        customDomain: store.plan !== "starter",
        advancedAnalytics: true,
        aiTools: true,
        loyaltyProgram: false,
        multiCurrency: false,
        betaCheckout: false
      },
      auditTrail: store.auditTrail || [],
      notes: store.notes || [],
      internalNotes: store.internalNotes || ""
    };

    res.json(tenantDetail);
  } catch (err) {
    console.error("SuperAdmin Get Tenant Detail Error:", err);
    res.status(500).json({ error: "Failed to fetch tenant details." });
  }
});

// POST /api/superadmin/tenants — Create a new merchant tenant with full auto-provisioning
router.post("/api/superadmin/tenants", verifySuperAdminToken, async (req, res) => {
  try {
    const {
      name,
      subdomain,
      customDomain = "",
      businessName = "",
      businessLogo = "",
      plan = "starter",
      trialDays = 14,
      businessType = "retail",
      country = "India",
      currency = "INR",
      timezone = "Asia/Kolkata",
      internalNotes = "",
      ownerName,
      ownerEmail,
      ownerPhone = "",
      password,
      autoProvisionSample = true,
      demoRequestId
    } = req.body;

    if (!name || !subdomain || !ownerName || !ownerEmail) {
      return res.status(400).json({
        error: "Required fields missing: name, subdomain, ownerName, ownerEmail."
      });
    }

    const finalPassword = password || `Pass_${Math.random().toString(36).substring(2, 10)}!`;
    if (finalPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const subdomainClean = subdomain.toLowerCase().trim();
    if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(subdomainClean)) {
      return res.status(400).json({
        error: "Subdomain must be 3-40 characters long, lowercase letters, numbers, and hyphens only."
      });
    }

    if (RESERVED_SUBDOMAINS.includes(subdomainClean)) {
      return res.status(400).json({ error: `Subdomain '${subdomainClean}' is reserved and cannot be used.` });
    }

    const existingSubdomain = await Store.findOne({ subdomain: subdomainClean });
    if (existingSubdomain) {
      return res.status(400).json({ error: `Subdomain '${subdomainClean}' is already registered.` });
    }

    const emailClean = ownerEmail.toLowerCase().trim();
    const existingOwner = await User.findOne({ email: emailClean });
    if (existingOwner && existingOwner.isOwner) {
      return res.status(400).json({ error: `An owner account with email '${emailClean}' already exists.` });
    }

    let owner = existingOwner;
    if (!owner) {
      const hashedPassword = await bcrypt.hash(finalPassword, 12);
      owner = await User.create({
        name: ownerName.trim(),
        email: emailClean,
        phone: ownerPhone.trim(),
        password: hashedPassword,
        role: "owner",
        isOwner: true,
        mustChangePassword: true,
        onboardingComplete: false
      });
    } else {
      await User.findByIdAndUpdate(owner._id, {
        role: "owner",
        isOwner: true,
        mustChangePassword: true
      });
    }

    const planDefaults = getPlanDefaults(plan);
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + parseInt(trialDays));

    const finalCustomDomain = plan === "starter" ? "" : (customDomain ? customDomain.toLowerCase().trim() : "");
    const storeDisplayName = (businessName || name).trim();

    const newStore = await Store.create({
      name: name.trim(),
      subdomain: subdomainClean,
      customDomain: finalCustomDomain,
      businessName: storeDisplayName,
      businessLogo: businessLogo || "",
      ownerId: owner._id,
      ownerName: ownerName.trim(),
      ownerEmail: emailClean,
      ownerPhone: ownerPhone.trim(),
      plan,
      status: "trial",
      trialDays: parseInt(trialDays),
      trialEndsAt,
      mrr: planDefaults.mrr,
      healthScore: 98,
      businessType,
      country,
      currency,
      timezone,
      internalNotes,
      isActive: true,
      provisionedBy: demoRequestId ? "demo_request" : "superadmin",
      demoRequestId: demoRequestId || null,
      domains: [
        { domain: `${subdomainClean}.${process.env.PLATFORM_DOMAIN || "localhost:3000"}`, type: "subdomain", isPrimary: true, sslStatus: "active" },
        ...(finalCustomDomain ? [{ domain: finalCustomDomain, type: "custom", isPrimary: false, sslStatus: "active" }] : [])
      ],
      auditTrail: [
        { action: "Tenant Created", performedBy: req.superAdmin?.email || "Super Admin", details: `Provisioned on ${plan.toUpperCase()} plan with ${trialDays} trial days.` }
      ]
    });

    await User.findByIdAndUpdate(owner._id, { storeId: newStore._id });

    await Settings.create({
      storeId: newStore._id,
      brandLogoValue: storeDisplayName,
      heroTitle: `WELCOME TO ${storeDisplayName.toUpperCase()}`,
      heroTitleFontColor: "#ffffff",
      heroManifestoFontColor: "#ffffff",
      mobileHeroTitleFontColor: "#ffffff",
      mobileHeroManifestoFontColor: "#ffffff",
      heroManifesto: "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION.",
      heroButtonColor: "#ffffff",
      heroButtonTextColor: "#000000",
      mobileHeroButtonColor: "#ffffff",
      mobileHeroButtonTextColor: "#000000",
      videoTitle: "NEW ARRIVALS",
      videoTitleFontColor: "#ffffff",
      videoSubtitleFontColor: "#ffffff",
      videoSubtitle: "Explore our latest collection crafted with care.",
      videoButtonColor: "#ffffff",
      videoButtonTextColor: "#000000",
      mobileVideoButtonColor: "#ffffff",
      mobileVideoButtonTextColor: "#000000",
      lifestyleText: "Uncompromising Quality, Curated for You.",
      lifestyleTextFontColor: "#ffffff",
      lifestyleButtonColor: "#ffffff",
      lifestyleButtonTextColor: "#000000",
      mobileLifestyleButtonColor: "#ffffff",
      mobileLifestyleButtonTextColor: "#000000",
      primaryColor: "#ffffff",
      contactUsText: `Need assistance? Contact our team at support@${subdomainClean}.com`
    });

    if (autoProvisionSample) {
      await Product.create([
        {
          storeId: newStore._id,
          name: "Sample Signature Leather Jacket",
          description: "Premium handcrafted genuine leather jacket with classic finish.",
          imageFront: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
          imageBack: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
          images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"],
          price: 14999,
          strikePrice: 19999,
          quantity: 45,
          category: ["Fashion", "Men"],
          sizes: ["M", "L", "XL"]
        },
        {
          storeId: newStore._id,
          name: "Sample Minimalist Smart Watch",
          description: "Sleek stainless steel fitness tracker with OLED display and heart monitor.",
          imageFront: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
          imageBack: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
          price: 4999,
          strikePrice: 7999,
          quantity: 50,
          category: ["Electronics", "Unisex"],
          sizes: ["One Size"]
        }
      ]);
    }

    if (demoRequestId) {
      await DemoRequest.findByIdAndUpdate(demoRequestId, {
        status: "Approved",
        pipelineStage: "Won",
        convertedStoreId: newStore._id,
        convertedAt: new Date(),
        $push: {
          timeline: {
            action: "Converted to Merchant",
            details: `Store "${newStore.name}" (${newStore.subdomain}) provisioned successfully`,
            performedBy: "Super Admin",
            timestamp: new Date()
          }
        }
      });
    }

    res.status(201).json({
      message: `Tenant merchant store '${newStore.name}' created and provisioned successfully!`,
      tenant: newStore,
      owner: {
        userId: owner._id,
        name: owner.name,
        email: owner.email,
        mustChangePassword: true
      }
    });
  } catch (err) {
    console.error("SuperAdmin Create Tenant Error:", err);
    res.status(500).json({ error: err.message || "Failed to create tenant store." });
  }
});

// PUT /api/superadmin/tenants/:id — Update tenant details & profile
router.put("/api/superadmin/tenants/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const {
      name,
      subdomain,
      businessName,
      businessLogo,
      customDomain,
      plan,
      status,
      isActive,
      internalNotes,
      country,
      currency,
      timezone,
      businessType,
      ownerName,
      ownerEmail,
      ownerPhone
    } = req.body;

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    if (subdomain !== undefined && subdomain.toLowerCase().trim() !== store.subdomain) {
      const cleanSub = subdomain.toLowerCase().trim();
      if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(cleanSub)) {
        return res.status(400).json({ error: "Subdomain must be 3-40 alphanumeric characters or hyphens." });
      }
      if (RESERVED_SUBDOMAINS.includes(cleanSub)) {
        return res.status(400).json({ error: `Subdomain '${cleanSub}' is reserved.` });
      }
      const existing = await Store.findOne({ subdomain: cleanSub, _id: { $ne: store._id } });
      if (existing) {
        return res.status(400).json({ error: `Subdomain '${cleanSub}' is already registered.` });
      }
      store.subdomain = cleanSub;
    }

    if (name !== undefined) store.name = name.trim();
    if (businessName !== undefined) store.businessName = businessName.trim();
    if (businessLogo !== undefined) store.businessLogo = businessLogo;
    if (plan !== undefined) {
      store.plan = plan;
      const defaults = getPlanDefaults(plan);
      store.mrr = defaults.mrr;
    }

    if (store.plan === "starter") {
      store.customDomain = "";
    } else if (customDomain !== undefined) {
      store.customDomain = customDomain.toLowerCase().trim();
    }

    if (status !== undefined) store.status = status;
    if (isActive !== undefined) store.isActive = Boolean(isActive);
    if (internalNotes !== undefined) store.internalNotes = internalNotes;
    if (country !== undefined) store.country = country;
    if (currency !== undefined) store.currency = currency;
    if (timezone !== undefined) store.timezone = timezone;
    if (businessType !== undefined) store.businessType = businessType;

    if (ownerName !== undefined) store.ownerName = ownerName.trim();
    if (ownerEmail !== undefined) store.ownerEmail = ownerEmail.trim();
    if (ownerPhone !== undefined) store.ownerPhone = ownerPhone.trim();

    store.auditTrail.push({
      action: "Tenant Profile Updated",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: "Updated general settings and tenant metadata."
    });

    await store.save();

    if (name !== undefined || businessName !== undefined) {
      const displayName = store.businessName || store.name;
      await Settings.findOneAndUpdate(
        { storeId: store._id },
        { brandLogoValue: displayName }
      );
    }

    if (store.ownerId) {
      const userUpdate = {};
      if (ownerName !== undefined) userUpdate.name = ownerName.trim();
      if (ownerEmail !== undefined) userUpdate.email = ownerEmail.trim();
      if (ownerPhone !== undefined) userUpdate.phone = ownerPhone.trim();

      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(store.ownerId, userUpdate);
      }
    }

    res.json({ message: "Tenant details updated successfully.", tenant: store });
  } catch (err) {
    console.error("SuperAdmin Update Tenant Error:", err);
    res.status(500).json({ error: err.message || "Failed to update tenant." });
  }
});

// POST /api/superadmin/tenants/:id/impersonate — Generate 30-min JWT impersonation token
router.post("/api/superadmin/tenants/:id/impersonate", verifySuperAdminToken, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "A valid reason is required for tenant impersonation." });
    }

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    let owner = null;
    if (store.ownerId) {
      owner = await User.findById(store.ownerId);
    }
    if (!owner && store.ownerEmail) {
      owner = await User.findOne({ email: store.ownerEmail, storeId: store._id });
    }

    if (!owner) {
      return res.status(400).json({ error: "Owner user account not found for this tenant store." });
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const token = jwt.sign(
      {
        id: owner._id.toString(),
        email: owner.email,
        name: owner.name,
        role: "owner",
        isOwner: true,
        storeId: store._id.toString(),
        isImpersonating: true,
        impersonatedBy: req.superAdmin?.email || "Super Admin",
        impersonationReason: reason.trim()
      },
      getJwtSecret(),
      { expiresIn: "30m" }
    );

    store.impersonationLogs.push({
      superAdminEmail: req.superAdmin?.email || "Super Admin",
      reason: reason.trim(),
      timestamp: new Date(),
      expiresAt
    });

    store.auditTrail.push({
      action: "Impersonation Session Started",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Reason: ${reason.trim()} (30-min token created)`
    });

    await store.save();

    res.json({
      message: `Impersonation token generated for store '${store.name}'. Expires in 30 minutes.`,
      token,
      expiresAt,
      store: {
        _id: store._id,
        name: store.name,
        subdomain: store.subdomain,
        ownerEmail: owner.email
      }
    });
  } catch (err) {
    console.error("SuperAdmin Impersonation Error:", err);
    res.status(500).json({ error: "Failed to generate impersonation token." });
  }
});

// PUT /api/superadmin/tenants/:id/suspend — Suspend tenant store
router.put("/api/superadmin/tenants/:id/suspend", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    store.status = "suspended";
    store.isActive = false;
    store.auditTrail.push({
      action: "Tenant Suspended",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: "Store access blocked and storefront set to temporarily unavailable."
    });

    await store.save();
    res.json({ message: `Tenant '${store.name}' has been suspended.`, tenant: store });
  } catch (err) {
    console.error("SuperAdmin Suspend Tenant Error:", err);
    res.status(500).json({ error: "Failed to suspend tenant." });
  }
});

// PUT /api/superadmin/tenants/:id/activate — Reactivate suspended tenant store
router.put("/api/superadmin/tenants/:id/activate", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    store.status = "active";
    store.isActive = true;
    store.auditTrail.push({
      action: "Tenant Activated",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: "Store access restored."
    });

    await store.save();
    res.json({ message: `Tenant '${store.name}' has been reactivated.`, tenant: store });
  } catch (err) {
    console.error("SuperAdmin Activate Tenant Error:", err);
    res.status(500).json({ error: "Failed to activate tenant." });
  }
});

// PUT /api/superadmin/tenants/:id/plan — Change subscription plan
router.put("/api/superadmin/tenants/:id/plan", verifySuperAdminToken, async (req, res) => {
  try {
    const { plan, trialDays } = req.body;
    if (!plan || !["starter", "pro", "enterprise"].includes(plan.toLowerCase())) {
      return res.status(400).json({ error: "Invalid plan specified. Choose starter, pro, or enterprise." });
    }

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const oldPlan = store.plan;
    store.plan = plan.toLowerCase();

    if (store.plan === "starter") {
      store.customDomain = "";
    }

    const defaults = getPlanDefaults(store.plan);
    store.mrr = defaults.mrr;

    if (trialDays !== undefined) {
      store.trialDays = parseInt(trialDays);
      const newTrialEnd = new Date();
      newTrialEnd.setDate(newTrialEnd.getDate() + parseInt(trialDays));
      store.trialEndsAt = newTrialEnd;
    }

    store.auditTrail.push({
      action: "Subscription Plan Changed",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Plan changed from ${oldPlan.toUpperCase()} to ${store.plan.toUpperCase()}. MRR set to $${store.mrr}.`
    });

    await store.save();
    res.json({ message: `Plan updated to ${store.plan.toUpperCase()}.`, tenant: store });
  } catch (err) {
    console.error("SuperAdmin Change Plan Error:", err);
    res.status(500).json({ error: "Failed to update plan." });
  }
});

// PUT /api/superadmin/tenants/:id/trial — Extend trial or apply credits/discounts
router.put("/api/superadmin/tenants/:id/trial", verifySuperAdminToken, async (req, res) => {
  try {
    const { extendDays = 0, credits = 0, discountPercent = 0 } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    if (extendDays > 0) {
      const currentEnd = store.trialEndsAt && store.trialEndsAt > new Date() ? new Date(store.trialEndsAt) : new Date();
      currentEnd.setDate(currentEnd.getDate() + parseInt(extendDays));
      store.trialEndsAt = currentEnd;
      store.status = "trial";
      store.isActive = true;
    }

    if (!store.billing) store.billing = {};
    if (credits) store.billing.credits = (store.billing.credits || 0) + Number(credits);
    if (discountPercent !== undefined) store.billing.discountPercent = Number(discountPercent);

    store.auditTrail.push({
      action: "Trial / Credits Adjusted",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Trial extended by ${extendDays} days. Added $${credits} credits. Discount: ${discountPercent}%.`
    });

    await store.save();
    res.json({ message: "Trial and billing credits updated.", tenant: store });
  } catch (err) {
    console.error("SuperAdmin Update Trial Error:", err);
    res.status(500).json({ error: "Failed to adjust trial or credits." });
  }
});

// PUT /api/superadmin/tenants/:id/limits — Override tenant quotas
router.put("/api/superadmin/tenants/:id/limits", verifySuperAdminToken, async (req, res) => {
  try {
    const { maxProducts, maxOrders, maxStaff, maxStorageMB } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    if (!store.limitOverrides) store.limitOverrides = {};
    if (maxProducts !== undefined) store.limitOverrides.maxProducts = maxProducts ? Number(maxProducts) : null;
    if (maxOrders !== undefined) store.limitOverrides.maxOrders = maxOrders ? Number(maxOrders) : null;
    if (maxStaff !== undefined) store.limitOverrides.maxStaff = maxStaff ? Number(maxStaff) : null;
    if (maxStorageMB !== undefined) store.limitOverrides.maxStorageMB = maxStorageMB ? Number(maxStorageMB) : null;

    store.auditTrail.push({
      action: "Limit Overrides Updated",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Custom quotas configured for products, orders, staff, or storage.`
    });

    await store.save();
    res.json({ message: "Tenant limit overrides updated.", tenant: store });
  } catch (err) {
    console.error("SuperAdmin Update Limits Error:", err);
    res.status(500).json({ error: "Failed to update limits." });
  }
});

// PUT /api/superadmin/tenants/:id/features — Override per-tenant feature flags
router.put("/api/superadmin/tenants/:id/features", verifySuperAdminToken, async (req, res) => {
  try {
    const { featureFlags } = req.body;
    if (!featureFlags || typeof featureFlags !== "object") {
      return res.status(400).json({ error: "featureFlags object is required." });
    }

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const updatedFlags = {
      ...(store.featureFlags || {}),
      ...featureFlags
    };

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      {
        $set: { featureFlags: updatedFlags },
        $push: {
          auditTrail: {
            action: "Feature Flags Updated",
            performedBy: req.superAdmin?.email || "Super Admin",
            details: `Updated feature toggles: ${Object.keys(featureFlags).join(", ")}.`
          }
        }
      },
      { new: true }
    );

    res.json({ message: "Feature flags updated successfully.", featureFlags: updatedStore.featureFlags, store: updatedStore });
  } catch (err) {
    console.error("SuperAdmin Update Features Error:", err);
    res.status(500).json({ error: "Failed to update feature flags." });
  }
});

// POST /api/superadmin/tenants/:id/reset-owner-password — Reset owner password or resend invite
router.post("/api/superadmin/tenants/:id/reset-owner-password", verifySuperAdminToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    let owner = null;
    if (store.ownerId) owner = await User.findById(store.ownerId);
    if (!owner && store.ownerEmail) owner = await User.findOne({ email: store.ownerEmail, storeId: store._id });

    if (!owner) return res.status(404).json({ error: "Owner user account not found." });

    const tempPassword = newPassword || `StoreOwner@${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    owner.password = hashedPassword;
    owner.mustChangePassword = true;
    owner.tokenVersion = (owner.tokenVersion || 0) + 1;
    await owner.save();

    store.auditTrail.push({
      action: "Owner Password Reset",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: "Owner password reset and forced password change flag enabled."
    });
    await store.save();

    res.json({
      message: `Password reset successfully for ${owner.email}.`,
      tempPassword,
      ownerEmail: owner.email
    });
  } catch (err) {
    console.error("SuperAdmin Reset Password Error:", err);
    res.status(500).json({ error: "Failed to reset owner password." });
  }
});

// POST /api/superadmin/tenants/:id/force-logout — Revoke all active sessions for store owner & staff
router.post("/api/superadmin/tenants/:id/force-logout", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    await User.updateMany(
      { storeId: store._id },
      { $inc: { tokenVersion: 1 }, $set: { lastLogoutAt: new Date() } }
    );

    store.auditTrail.push({
      action: "Force Logout Executed",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: "Revoked active tokens for all store users."
    });
    await store.save();

    res.json({ message: `All active sessions revoked for tenant '${store.name}'.` });
  } catch (err) {
    console.error("SuperAdmin Force Logout Error:", err);
    res.status(500).json({ error: "Failed to force logout tenant users." });
  }
});

// POST /api/superadmin/tenants/:id/notes — Add internal sales/support note
router.post("/api/superadmin/tenants/:id/notes", verifySuperAdminToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Note text cannot be empty." });
    }

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const newNote = {
      text: text.trim(),
      author: req.superAdmin?.email || "Super Admin",
      createdAt: new Date()
    };

    store.notes.push(newNote);
    await store.save();

    res.json({ message: "Internal note added.", notes: store.notes });
  } catch (err) {
    console.error("SuperAdmin Add Note Error:", err);
    res.status(500).json({ error: "Failed to add internal note." });
  }
});

// GET /api/superadmin/tenants/:id/export — GDPR full JSON data export
router.get("/api/superadmin/tenants/:id/export", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).lean();
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const sId = store._id;
    const [settings, products, orders, customers, reviews, discounts] = await Promise.all([
      Settings.findOne({ storeId: sId }).lean(),
      Product.find({ storeId: sId }).lean(),
      Order.find({ storeId: sId }).lean(),
      Customer.find({ storeId: sId }).lean(),
      Review.find({ storeId: sId }).lean(),
      Discount.find({ storeId: sId }).lean()
    ]);

    const exportPackage = {
      exportedAt: new Date().toISOString(),
      exportType: "GDPR_TENANT_FULL_DUMP",
      store,
      settings,
      products,
      orders,
      customers,
      reviews,
      discounts
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="tenant_${store.subdomain}_export.json"`);
    res.json(exportPackage);
  } catch (err) {
    console.error("SuperAdmin Export Data Error:", err);
    res.status(500).json({ error: "Failed to export tenant data." });
  }
});

// PUT /api/superadmin/tenants/:id/transfer-ownership — Transfer tenant store ownership
router.put("/api/superadmin/tenants/:id/transfer-ownership", verifySuperAdminToken, async (req, res) => {
  try {
    const { newOwnerEmail, newOwnerName, newOwnerPhone } = req.body;
    if (!newOwnerEmail) {
      return res.status(400).json({ error: "New owner email is required." });
    }

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const emailClean = newOwnerEmail.toLowerCase().trim();
    let newOwner = await User.findOne({ email: emailClean });

    if (!newOwner) {
      const tempPass = await bcrypt.hash("OwnerPass@2026", 12);
      newOwner = await User.create({
        name: (newOwnerName || "Store Owner").trim(),
        email: emailClean,
        phone: (newOwnerPhone || "").trim(),
        password: tempPass,
        role: "owner",
        isOwner: true,
        storeId: store._id,
        mustChangePassword: true
      });
    } else {
      await User.findByIdAndUpdate(newOwner._id, {
        role: "owner",
        isOwner: true,
        storeId: store._id
      });
    }

    store.ownerId = newOwner._id;
    store.ownerName = newOwner.name;
    store.ownerEmail = newOwner.email;
    store.ownerPhone = newOwner.phone || "";

    store.auditTrail.push({
      action: "Ownership Transferred",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Ownership transferred to ${newOwner.email}.`
    });

    await store.save();
    res.json({ message: `Ownership of store '${store.name}' transferred to ${newOwner.email}.`, tenant: store });
  } catch (err) {
    console.error("SuperAdmin Transfer Ownership Error:", err);
    res.status(500).json({ error: "Failed to transfer store ownership." });
  }
});

// PUT /api/superadmin/tenants/:id/move — Upgrade tenant isolation tier (shared -> dedicated_db)
router.put("/api/superadmin/tenants/:id/move", verifySuperAdminToken, async (req, res) => {
  try {
    const { isolationTier } = req.body;
    if (!isolationTier || !["shared", "dedicated_db", "enterprise_cluster"].includes(isolationTier)) {
      return res.status(400).json({ error: "Invalid isolation tier. Choose shared, dedicated_db, or enterprise_cluster." });
    }

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const oldTier = store.isolationTier || "shared";
    store.isolationTier = isolationTier;

    store.auditTrail.push({
      action: "Infrastructure Tier Changed",
      performedBy: req.superAdmin?.email || "Super Admin",
      details: `Isolation tier updated from ${oldTier} to ${isolationTier}.`
    });

    await store.save();
    res.json({ message: `Tenant moved to '${isolationTier}' infrastructure tier.`, tenant: store });
  } catch (err) {
    console.error("SuperAdmin Move Tenant Error:", err);
    res.status(500).json({ error: "Failed to update tenant isolation tier." });
  }
});

// POST /api/superadmin/tenants/bulk-action — Perform bulk operations on selected tenants
router.post("/api/superadmin/tenants/bulk-action", verifySuperAdminToken, async (req, res) => {
  try {
    const { action, tenantIds, payload = {} } = req.body;
    if (!action || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return res.status(400).json({ error: "Action and array of tenantIds are required." });
    }

    let modifiedCount = 0;

    if (action === "suspend") {
      const resVal = await Store.updateMany(
        { _id: { $in: tenantIds }, subdomain: { $ne: "default" } },
        { status: "suspended", isActive: false }
      );
      modifiedCount = resVal.modifiedCount;
    } else if (action === "activate") {
      const resVal = await Store.updateMany(
        { _id: { $in: tenantIds } },
        { status: "active", isActive: true }
      );
      modifiedCount = resVal.modifiedCount;
    } else if (action === "change_plan") {
      if (!payload.plan) return res.status(400).json({ error: "Plan is required for bulk plan change." });
      const defaults = getPlanDefaults(payload.plan);
      const resVal = await Store.updateMany(
        { _id: { $in: tenantIds } },
        { plan: payload.plan.toLowerCase(), mrr: defaults.mrr }
      );
      modifiedCount = resVal.modifiedCount;
    } else {
      return res.status(400).json({ error: `Unsupported bulk action: ${action}` });
    }

    res.json({ message: `Bulk action '${action}' completed on ${modifiedCount} tenants.` });
  } catch (err) {
    console.error("SuperAdmin Bulk Action Error:", err);
    res.status(500).json({ error: "Failed to execute bulk action." });
  }
});

// DELETE /api/superadmin/tenants/:id — Delete tenant (soft delete or hard delete with confirmation)
router.delete("/api/superadmin/tenants/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const { soft = "false", confirmName = "" } = req.query;
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    if (store.subdomain === "default") {
      return res.status(400).json({ error: "Cannot delete the Default System Store." });
    }

    if (soft === "true") {
      store.status = "cancelled";
      store.isActive = false;
      store.deletedAt = new Date();
      store.deletedReason = "Soft deleted by Super Admin with 30-day grace period.";
      await store.save();
      return res.json({ message: `Tenant '${store.name}' soft deleted. Moved to 30-day grace period.` });
    }

    if (confirmName.trim().toLowerCase() !== store.name.trim().toLowerCase()) {
      return res.status(400).json({
        error: `Confirmation failed. Type exact store name '${store.name}' to confirm deletion.`
      });
    }

    const deletedStore = await purgeTenantData(req.params.id);
    res.json({ message: `Tenant '${deletedStore.name}', owner account, and all associated merchant data deleted completely.` });
  } catch (err) {
    console.error("SuperAdmin Delete Tenant Error:", err);
    res.status(400).json({ error: err.message || "Failed to delete tenant." });
  }
});

export default router;
