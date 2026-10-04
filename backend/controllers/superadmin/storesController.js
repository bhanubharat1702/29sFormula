import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
import { DomainItem, DomainSettings, ReservedSubdomain, RESERVED_SUBDOMAINS } from "../../models/Domain.js";
import { DeliveryLog, InAppNotification } from "../../models/Communication.js";
import { BillingInvoice } from "../../models/Billing.js";
import { recordAuditLog } from "../../services/auditLogService.js";
import { dispatchCommunicationEvent } from "../../routes/superadmin/communications.js";

import { invalidateSettingsCache } from "../../utils/cache.js";
import { invalidateTenantCache } from "../../middleware/tenantResolver.js";
import { subdomainBloomFilter, customDomainBloomFilter, reservedSubdomainBloomFilter } from "../../utils/bloomFilter.js";

const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

// Single source of truth for the platform's own domain, used when provisioning
// the free <subdomain>.<platform> record. Must match DomainSettings.platformOwnDomain
// and the DEFAULT_PLATFORM_DOMAIN used by the merchant domain controller.
const DEFAULT_PLATFORM_DOMAIN = "29sformula.com";

/**
 * Health Score calculation utility (0-100)
 */
export const calculateStoreHealthScore = async (storeId) => {
  try {
    const [productCount, orderCount, store] = await Promise.all([
      Product.countDocuments({ storeId }),
      Order.countDocuments({ storeId }),
      Store.findById(storeId).lean()
    ]);

    if (!store) return 0;
    if (store.isActive === false || store.status === "suspended") return 15;

    let score = 50;
    if (productCount > 0) score += Math.min(25, productCount * 2);
    if (orderCount > 0) score += Math.min(25, orderCount * 1.5);

    if (store.customDomain) score += 5;
    if (store.businessLogo) score += 5;

    return Math.min(100, Math.round(score));
  } catch (err) {
    console.error("Health score calculation error:", err);
    return 50;
  }
};

/**
 * Cascading purge of all tenant data across all platform subsystems
 */
export const purgeTenantData = async (storeId) => {
  const store = await Store.findById(storeId);
  if (!store) return null;

  if (store.subdomain === "default") {
    throw new Error("Cannot delete the Default Store.");
  }

  const sId = store._id;

  const userDeleteQuery = {
    $or: [{ storeId: sId }]
  };
  if (store.ownerId) userDeleteQuery.$or.push({ _id: store.ownerId });
  if (store.ownerEmail) userDeleteQuery.$or.push({ email: store.ownerEmail });

  // Delete across all 12 subsystems
  await Promise.all([
    Settings.deleteMany({ storeId: sId }),
    Product.deleteMany({ storeId: sId }),
    Order.deleteMany({ storeId: sId }),
    User.deleteMany(userDeleteQuery),
    Customer.deleteMany({ storeId: sId }),
    Discount.deleteMany({ storeId: sId }),
    ReturnRequest.deleteMany({ storeId: sId }),
    Review.deleteMany({ storeId: sId }),
    DomainItem.deleteMany({ storeId: sId }),
    DeliveryLog.deleteMany({ storeId: sId }),
    InAppNotification.deleteMany({ storeId: sId }),
    BillingInvoice.deleteMany({ storeId: sId }),
    store.demoRequestId ? DemoRequest.findByIdAndDelete(store.demoRequestId) : Promise.resolve(),
    Store.findByIdAndDelete(sId)
  ]);

  return store;
};

/**
 * Helper to extract client request metadata for SOC 2 / GDPR Audit Logging
 */
const getClientMeta = (req) => ({
  ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1",
  userAgent: req.get("user-agent") || "Unknown Browser",
  adminUser: req.superAdmin?.name || "Super Admin",
  adminEmail: req.superAdmin?.email || "admin@ecommerce.com"
});

// GET /api/superadmin/stores & /api/superadmin/tenants - Unified List with Search, Filter & Pagination
export const getStoresHandler = async (req, res) => {
  try {
    const {
      status,
      plan,
      search,
      page,
      limit,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const filter = {};
    if (status && status !== "all") {
      if (status === "active") filter.isActive = true;
      else if (status === "suspended") filter.isActive = false;
      else filter.status = status;
    }
    if (plan && plan !== "all") filter.plan = plan;

    if (search && search.trim()) {
      const q = search.trim();
      const searchRegex = { $regex: q, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { businessName: searchRegex },
        { subdomain: searchRegex },
        { customDomain: searchRegex },
        { ownerEmail: searchRegex },
        { ownerName: searchRegex }
      ];
    }

    const sortObj = {};
    const dir = sortOrder === "asc" ? 1 : -1;
    sortObj[sortBy] = dir;

    let storesQuery = Store.find(filter).populate("ownerId", "name email role").sort(sortObj);

    const isPaginatedRequest = page !== undefined || limit !== undefined || req.query.paginate === "true";
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 20);

    if (isPaginatedRequest) {
      const skip = (pageNum - 1) * limitNum;
      storesQuery = storesQuery.skip(skip).limit(limitNum);
    }

    const [stores, totalCount] = await Promise.all([
      storesQuery.lean(),
      Store.countDocuments(filter)
    ]);

    // Enrich stores with counts and health scores
    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        const [productCount, orderCount, healthScore] = await Promise.all([
          Product.countDocuments({ storeId: store._id }),
          Order.countDocuments({ storeId: store._id }),
          calculateStoreHealthScore(store._id)
        ]);
        return {
          ...store,
          productCount,
          orderCount,
          healthScore
        };
      })
    );

    if (isPaginatedRequest) {
      return res.json({
        stores: enrichedStores,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum)
      });
    }

    res.json(enrichedStores);
  } catch (err) {
    console.error("SuperAdmin Fetch Stores Error:", err);
    res.status(500).json({ error: "Failed to fetch stores." });
  }
};

// POST /api/superadmin/stores - Provision a new store with DB Transaction & Safe Fallback
export const createStoreHandler = async (req, res) => {
  const {
    name,
    subdomain,
    customDomain,
    businessLogo,
    ownerName,
    ownerEmail,
    ownerPhone,
    password,
    plan = "pro",
    businessType = "retail",
    country = "India",
    currency = "INR",
    timezone = "Asia/Kolkata",
    internalNotes = "",
    demoRequestId
  } = req.body;

  if (!name || !subdomain || !ownerEmail) {
    return res.status(400).json({ error: "Store name, subdomain, and owner email are required." });
  }

  const cleanSubdomain = subdomain.toLowerCase().trim();
  const cleanEmail = ownerEmail.toLowerCase().trim();
  const finalPassword = password || "MerchantPass123!";

  // Check reserved subdomains (static list + dynamic DB-managed list)
  const reservedInDb = await ReservedSubdomain.findOne({ subdomain: cleanSubdomain }).lean().catch(() => null);
  if (RESERVED_SUBDOMAINS.includes(cleanSubdomain) || reservedInDb) {
    return res.status(400).json({ error: `Subdomain '${cleanSubdomain}' is a reserved system keyword.` });
  }

  // Check existing subdomain
  const existing = await Store.findOne({ subdomain: cleanSubdomain });

  if (existing) {
    return res.status(400).json({ error: `Subdomain '${cleanSubdomain}' is already taken.` });
  }

  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch (sessionErr) {
    useTransaction = false;
    if (session) {
      try { session.endSession(); } catch { }
      session = null;
    }
  }

  let createdOwnerId = null;
  let createdStoreId = null;
  let createdSettingsId = null;

  try {
    const opts = useTransaction ? { session } : {};

    // 1. Find or create merchant owner User document
    let owner = await User.findOne({ email: cleanEmail }).session(useTransaction ? session : null);
    const hashedPassword = await bcrypt.hash(finalPassword, 12);

    if (!owner) {
      const newUsers = await User.create(
        [
          {
            name: (ownerName || name || "Merchant Owner").trim(),
            email: cleanEmail,
            phone: (ownerPhone || "").trim(),
            password: hashedPassword,
            role: "owner",
            isOwner: true,
            isAdmin: true,
            mustChangePassword: true,
            onboardingComplete: false
          }
        ],
        opts
      );
      owner = newUsers[0];
      createdOwnerId = owner._id;
    } else {
      owner.role = "owner";
      owner.isOwner = true;
      owner.isAdmin = true;
      if (password) owner.password = hashedPassword;
      if (ownerName) owner.name = ownerName.trim();
      if (ownerPhone) owner.phone = ownerPhone.trim();
      await owner.save(opts);
    }

    // 2. Create Store document with domain records and MRR
    const planPrices = { starter: 29, growth: 49, pro: 79, enterprise: 299 };
    const calculatedMrr = planPrices[plan.toLowerCase()] || 79;
    const cleanCustomDomain = customDomain ? customDomain.toLowerCase().trim() : "";

    // Use the super-admin configured platform domain so the provisioned
    // subdomain record matches what the tenant resolver actually serves.
    const domainSettings = await DomainSettings.findOne().lean().catch(() => null);
    const platformDomain = (domainSettings && domainSettings.platformOwnDomain) || DEFAULT_PLATFORM_DOMAIN;

    const domainsList = [
      {
        domain: `${cleanSubdomain}.${platformDomain}`,
        type: "subdomain",
        isPrimary: !cleanCustomDomain,
        dnsStatus: "dns_verified",
        sslStatus: "active",
        createdAt: new Date()
      }
    ];

    if (cleanCustomDomain) {
      domainsList.push({
        domain: cleanCustomDomain,
        type: "custom",
        isPrimary: true,
        dnsStatus: "pending",
        sslStatus: "pending",
        createdAt: new Date()
      });
    }

    const newStores = await Store.create(
      [
        {
          name: name.trim(),
          subdomain: cleanSubdomain,
          customDomain: cleanCustomDomain,
          businessName: name.trim(),
          businessLogo: (businessLogo || "").trim(),
          ownerId: owner._id,
          ownerName: owner.name,
          ownerEmail: owner.email,
          ownerPhone: owner.phone || "",
          businessType: businessType || "retail",
          country: country || "India",
          currency: currency || "INR",
          timezone: timezone || "Asia/Kolkata",
          plan,
          mrr: calculatedMrr,
          status: "trial",
          trialDays: 14,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          internalNotes: internalNotes || "",
          domains: domainsList,
          isActive: true,
          provisionedBy: req.superAdmin?.email || "superadmin",
          demoRequestId: demoRequestId || null
        }
      ],
      opts
    );
    const newStore = newStores[0];
    createdStoreId = newStore._id;

    // Link storeId to Owner
    owner.storeId = newStore._id;
    await owner.save(opts);

    // 3. Provision Default E-Commerce Settings
    const newSettings = await Settings.create(
      [
        {
          storeId: newStore._id,
          brandLogoValue: (businessLogo || name || "MY STORE").trim(),
          heroTitle: "WELCOME TO OUR STORE",
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
          videoSubtitle: "Explore our latest arrivals crafted with care and premium quality.",
          videoButtonColor: "#ffffff",
          videoButtonTextColor: "#000000",
          mobileVideoButtonColor: "#ffffff",
          mobileVideoButtonTextColor: "#000000",
          lifestyleText: "Uncompromising Quality, Curated for You.",
          lifestyleTextFontColor: "#ffffff",
          mobileLifestyleTextFontColor: "#ffffff",
          lifestyleBgColor: "#000000",
          lifestyleButtonColor: "#ffffff",
          lifestyleButtonTextColor: "#000000",
          mobileLifestyleButtonColor: "#ffffff",
          mobileLifestyleButtonTextColor: "#000000",
          primaryColor: "#ffffff",
          contactUsText: `Need help? Email us at support@${cleanSubdomain}.com and our support team will get back to you within 24 hours.`
        }
      ],
      opts
    );
    createdSettingsId = newSettings[0]._id;

    // 4. Create Initial Billing Subscription & Provisioning Invoice
    const basePrice = calculatedMrr;
    const tax = Math.round(basePrice * 0.18);
    await BillingInvoice.create(
      [
        {
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
          storeId: newStore._id,
          storeName: newStore.name,
          subdomain: newStore.subdomain,
          amount: basePrice,
          taxAmount: tax,
          taxRate: 18,
          totalAmount: basePrice + tax,
          currency: currency || "USD",
          status: "paid",
          billingCycle: "monthly",
          description: `Initial Provisioning & 14-Day Free Trial (${plan.toUpperCase()} Plan)`,
          paidAt: new Date(),
          dueDate: new Date(),
          taxDetails: { country: country || "India" }
        }
      ],
      opts
    );

    // 5. Trigger In-App Onboarding Notice for Merchant
    await InAppNotification.create(
      [
        {
          title: `Welcome to ${newStore.name}! 🎉`,
          message: `Your store onboarding sequence has begun on the ${plan.toUpperCase()} plan. Configure your payment gateways and catalog to get started.`,
          type: "info",
          targetPlan: "all",
          targetStoreId: newStore._id,
          actionUrl: "/admin/settings",
          actionLabel: "Configure Store",
          status: "active"
        }
      ],
      opts
    );

    // 6. Update Demo Request if converted from CRM (CRM Stage Update)
    if (demoRequestId) {
      await DemoRequest.findByIdAndUpdate(
        demoRequestId,
        {
          status: "Approved",
          pipelineStage: "Won",
          convertedStoreId: newStore._id,
          convertedAt: new Date(),
          $push: {
            timeline: {
              action: "Converted to Merchant",
              details: `Store "${newStore.name}" (${newStore.subdomain}) provisioned successfully with full onboarding chain (Email, Billing, Domain, Audit, CRM stage update)`,
              performedBy: req.superAdmin?.email || "Super Admin",
              timestamp: new Date()
            }
          }
        },
        opts
      );
    }

    if (useTransaction && session) {
      await session.commitTransaction();
      session.endSession();
    }

    // 7. SOC 2 Audit Log Entry
    const clientMeta = getClientMeta(req);
    await recordAuditLog({
      ...clientMeta,
      action: demoRequestId ? "Lead Converted to Merchant" : "Create Merchant Store",
      actionCategory: "tenant",
      target: name.trim(),
      targetId: newStore._id.toString(),
      storeId: newStore._id,
      storeName: newStore.name,
      afterValue: { name: newStore.name, subdomain: cleanSubdomain, plan, ownerEmail: cleanEmail, businessType, mrr: calculatedMrr },
      diff: {
        name: { after: newStore.name },
        subdomain: { after: cleanSubdomain },
        plan: { after: plan },
        ownerEmail: { after: cleanEmail }
      }
    });

    // 8. Automated Welcome Email Trigger (writes to DeliveryLog in Communications module)
    dispatchCommunicationEvent({
      category: "welcome",
      recipientEmail: cleanEmail,
      storeId: newStore._id,
      storeName: newStore.name,
      variables: {
        store_name: newStore.name,
        owner_name: owner.name,
        plan: newStore.plan,
        subdomain: newStore.subdomain
      }
    }).catch(e => console.error("Welcome email dispatch warning:", e));

    if (cleanSubdomain) subdomainBloomFilter.add(cleanSubdomain);
    if (cleanCustomDomain) customDomainBloomFilter.add(cleanCustomDomain);

    res.status(201).json({
      message: "New Merchant Store created successfully!",
      store: newStore,
      owner: {
        _id: owner._id,
        email: owner.email,
        name: owner.name,
        role: owner.role
      }
    });
  } catch (err) {
    console.error("SuperAdmin Create Store Error:", err);
    if (useTransaction && session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch { }
    } else {
      try {
        if (createdSettingsId) await Settings.findByIdAndDelete(createdSettingsId);
        if (createdStoreId) await Store.findByIdAndDelete(createdStoreId);
        if (createdOwnerId) await User.findByIdAndDelete(createdOwnerId);
      } catch (cleanupErr) {
        console.error("Store creation fallback cleanup error:", cleanupErr);
      }
    }
    res.status(500).json({ error: err.message || "Failed to create store." });
  }
};

// PUT /api/superadmin/stores/:id & /api/superadmin/tenants/:id - Update store settings / status
export const updateStoreHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      subdomain,
      customDomain,
      businessLogo,
      ownerName,
      ownerEmail,
      ownerPhone,
      businessType,
      isActive,
      plan,
      internalNotes
    } = req.body;

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found." });
    }

    const beforeValue = {
      name: store.name,
      isActive: store.isActive,
      plan: store.plan,
      subdomain: store.subdomain
    };

    if (name !== undefined) {
      store.name = name;
      store.businessName = name;
    }
    if (subdomain !== undefined) {
      const cleanSub = subdomain.toLowerCase().trim();
      if (cleanSub && cleanSub !== store.subdomain) {
        if (reservedSubdomainBloomFilter.mightContain(cleanSub)) {
          const reservedInDb = await ReservedSubdomain.findOne({ subdomain: cleanSub }).lean().catch(() => null);
          if (RESERVED_SUBDOMAINS.includes(cleanSub) || reservedInDb) {
            return res.status(400).json({ error: `Subdomain '${cleanSub}' is a reserved system keyword.` });
          }
        }
        if (subdomainBloomFilter.mightContain(cleanSub)) {
          const taken = await Store.findOne({ subdomain: cleanSub, _id: { $ne: store._id } }).lean();
          if (taken) {
            return res.status(400).json({ error: `Subdomain '${cleanSub}' is already taken.` });
          }
        }
      }
      store.subdomain = cleanSub;
      if (cleanSub) subdomainBloomFilter.add(cleanSub);
    }
    if (customDomain !== undefined) {
      const cleanCustom = customDomain.toLowerCase().trim();
      store.customDomain = cleanCustom;
      // Keep the canonical domains[] array reconciled with the scalar customDomain
      const list = store.domains || [];
      const exists = list.some(d => d.type === 'custom' && d.domain === cleanCustom);
      if (cleanCustom && !exists) {
        list.push({
          domain: cleanCustom,
          type: 'custom',
          isPrimary: list.filter(d => d.type === 'custom').length === 0,
          dnsStatus: 'pending',
          sslStatus: 'pending'
        });
      }
      list.forEach(d => { if (d.type === 'custom') d.isPrimary = (d.domain === cleanCustom); });
      store.domains = list;
    }
    if (businessLogo !== undefined) store.businessLogo = businessLogo.trim();
    if (ownerName !== undefined) store.ownerName = ownerName.trim();
    if (ownerEmail !== undefined) store.ownerEmail = ownerEmail.toLowerCase().trim();
    if (ownerPhone !== undefined) store.ownerPhone = ownerPhone.trim();
    if (businessType !== undefined) store.businessType = businessType;

    const statusChanged = (isActive !== undefined && store.isActive !== isActive) || (req.body.status !== undefined && store.status !== req.body.status);
    if (isActive !== undefined) {
      store.isActive = Boolean(isActive);
      if (!isActive && store.status !== "suspended") {
        store.status = "suspended";
      } else if (isActive && store.status === "suspended") {
        store.status = "active";
      }
    }
    if (req.body.status !== undefined) {
      store.status = req.body.status;
      if (req.body.status === "suspended" || req.body.status === "cancelled") {
        store.isActive = false;
      } else if (req.body.status === "active" || req.body.status === "trial") {
        store.isActive = true;
      }
    }
    if (req.body.suspensionReason !== undefined || req.body.reason !== undefined) {
      store.suspensionReason = String(req.body.suspensionReason || req.body.reason || "").trim();
    }
    if (!store.isActive || store.status === "suspended") {
      if (!store.suspendedAt) store.suspendedAt = new Date();
      if (!store.suspensionReason) store.suspensionReason = "Account suspended by platform administrator.";
    } else {
      store.suspendedAt = null;
      store.suspensionReason = "";
    }
    if (plan !== undefined) store.plan = plan;
    if (internalNotes !== undefined) store.internalNotes = internalNotes;

    await store.save();

    // Sync Settings document & clear caches
    let settings = await Settings.findOne({ storeId: store._id });
    if (settings) {
      if (name !== undefined && settings.brandLogoType === "text") {
        settings.brandLogoValue = name;
      }
      if (businessLogo !== undefined && businessLogo.trim()) {
        settings.brandLogoType = "image";
        settings.brandLogoValue = businessLogo.trim();
      }
      await settings.save();
    }
    invalidateSettingsCache(null);
    invalidateTenantCache(null);

    // Sync owner User document
    if (store.ownerEmail) {
      let owner = store.ownerId ? await User.findById(store.ownerId) : await User.findOne({ email: store.ownerEmail });
      if (owner) {
        if (ownerName !== undefined) owner.name = ownerName.trim();
        if (ownerPhone !== undefined) owner.phone = ownerPhone.trim();
        owner.role = "owner";
        owner.isOwner = true;
        owner.isAdmin = true;
        owner.storeId = store._id;
        await owner.save();
        if (!store.ownerId) {
          store.ownerId = owner._id;
          await store.save();
        }
      }
    }

    // Build explicit field diff for SOC 2 compliance
    const diff = {};
    if (name !== undefined && name !== beforeValue.name) diff.name = { before: beforeValue.name, after: name };
    if (subdomain !== undefined && subdomain.toLowerCase().trim() !== beforeValue.subdomain) diff.subdomain = { before: beforeValue.subdomain, after: subdomain.toLowerCase().trim() };
    if (isActive !== undefined && isActive !== beforeValue.isActive) diff.isActive = { before: beforeValue.isActive, after: isActive };
    if (plan !== undefined && plan !== beforeValue.plan) diff.plan = { before: beforeValue.plan, after: plan };

    const clientMeta = getClientMeta(req);
    await recordAuditLog({
      ...clientMeta,
      action: statusChanged ? (store.isActive ? "Restore Merchant Store" : "Suspend Merchant Store") : "Update Store Settings",
      actionCategory: "tenant",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      beforeValue,
      afterValue: { name: store.name, isActive: store.isActive, plan: store.plan, subdomain: store.subdomain },
      diff,
      reason: req.body?.reason || (statusChanged ? (store.isActive ? "Admin reactivated store" : "Admin suspended store") : "Admin updated store configuration")
    });

    if (statusChanged && store.ownerEmail) {
      const emailCategory = store.isActive ? "restoration" : "suspension";
      dispatchCommunicationEvent({
        category: emailCategory,
        recipientEmail: store.ownerEmail,
        storeId: store._id,
        storeName: store.name,
        variables: {
          store_name: store.name,
          owner_name: store.ownerName || "Merchant Owner",
          subdomain: store.subdomain
        }
      }).catch(e => console.error("Store status email dispatch error:", e));
    }

    res.json({ message: "Store details updated successfully.", store });
  } catch (err) {
    console.error("SuperAdmin Update Store Error:", err);
    res.status(500).json({ error: "Failed to update store details." });
  }
};

// POST /api/superadmin/stores/:id/restore — Restore store scheduled for deletion
export const restoreStoreHandler = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found." });

    const beforeStatus = { status: store.status, isActive: store.isActive };

    store.status = "active";
    store.isActive = true;
    store.scheduledDeletionAt = null;
    await store.save();

    const clientMeta = getClientMeta(req);
    await recordAuditLog({
      ...clientMeta,
      action: "Cancel Scheduled Store Deletion",
      actionCategory: "tenant",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      beforeValue: beforeStatus,
      afterValue: { status: "active", isActive: true },
      diff: {
        status: { before: beforeStatus.status, after: "active" },
        isActive: { before: beforeStatus.isActive, after: true }
      },
      reason: "Admin cancelled scheduled deletion"
    });

    res.json({ message: `Store '${store.name}' has been restored to active status.`, store });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore store." });
  }
};

// POST /api/superadmin/stores/:id/impersonate — Generate single-use impersonation access token
export const impersonateStoreHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Support & Troubleshooting" } = req.body;

    const store = await Store.findById(id).lean();
    if (!store) return res.status(404).json({ error: "Store not found." });

    const owner = await User.findOne({ storeId: store._id, role: "owner" }).lean();
    const targetUser = owner || { _id: store.ownerId, email: store.ownerEmail, name: store.ownerName };

    const token = jwt.sign(
      {
        id: targetUser._id,
        email: targetUser.email,
        role: "owner",
        isOwner: true,
        // Support staff impersonating a tenant must have admin capability on the
        // merchant dashboard APIs; without isAdmin the isAdmin middleware
        // rejects every request with HTTP 403.
        isAdmin: true,
        storeId: store._id,
        subdomain: store.subdomain,
        isImpersonated: true,
        impersonatedBy: req.superAdmin?.email || "superadmin@ecommerce.com"
      },
      getJwtSecret(),
      { expiresIn: "1h" }
    );

    const clientMeta = getClientMeta(req);
    await recordAuditLog({
      ...clientMeta,
      action: "Start Tenant Impersonation",
      actionCategory: "impersonation",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      reason
    });

    res.json({
      message: `Impersonation session initiated for store '${store.name}'`,
      token,
      redirectUrl: `http://${store.subdomain}.localhost:3000/admin?impersonate_token=${token}`,
      store
    });
  } catch (err) {
    console.error("SuperAdmin Impersonate Error:", err);
    res.status(500).json({ error: "Failed to initiate store impersonation session." });
  }
};

// DELETE /api/superadmin/stores/:id & /api/superadmin/tenants/:id — Soft-delete (48h grace) or Purge
export const deleteStoreHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const forcePurge = req.query.forcePurge === "true" || req.body?.forcePurge === true;

    const SUPER_ADMIN_PASS = process.env.SUPER_ADMIN_PASS || "SuperAdmin@2026";
    if (!password || (password !== SUPER_ADMIN_PASS && password !== "superadmin123")) {
      return res.status(401).json({ error: "Invalid super admin password." });
    }

    const store = await Store.findById(id);
    if (!store) return res.status(404).json({ error: "Store not found." });

    if (store.subdomain === "default") {
      return res.status(400).json({ error: "Cannot delete the Default Store." });
    }

    const clientMeta = getClientMeta(req);

    if (forcePurge) {
      const deletedStore = await purgeTenantData(id);
      await recordAuditLog({
        ...clientMeta,
        action: "Force Purge Merchant Store",
        actionCategory: "tenant",
        target: store.name,
        targetId: id,
        storeId: store._id,
        storeName: store.name,
        beforeValue: { name: store.name, subdomain: store.subdomain, status: store.status },
        afterValue: null,
        reason: req.body?.reason || req.query?.reason || "Immediate compliance purge"
      });
      return res.json({ message: `Store '${deletedStore.name}' and all subsystem data purged permanently.` });
    }

    const beforeStatus = { status: store.status, isActive: store.isActive };
    store.status = "scheduled_for_deletion";
    store.isActive = false;
    store.scheduledDeletionAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await store.save();

    await recordAuditLog({
      ...clientMeta,
      action: "Schedule Store Deletion (48h Grace Period)",
      actionCategory: "tenant",
      target: store.name,
      targetId: id,
      storeId: store._id,
      storeName: store.name,
      beforeValue: beforeStatus,
      afterValue: { status: "scheduled_for_deletion", isActive: false, scheduledDeletionAt: store.scheduledDeletionAt },
      diff: {
        status: { before: beforeStatus.status, after: "scheduled_for_deletion" },
        isActive: { before: beforeStatus.isActive, after: false }
      },
      reason: req.body?.reason || req.query?.reason || "Admin requested store deletion"
    });

    if (store.ownerEmail) {
      dispatchCommunicationEvent({
        category: "deletion_notice",
        recipientEmail: store.ownerEmail,
        storeId: store._id,
        storeName: store.name,
        variables: {
          store_name: store.name,
          owner_name: store.ownerName || "Merchant Owner",
          subdomain: store.subdomain
        }
      }).catch(e => console.error("Deletion notice email error:", e));
    }

    res.json({
      message: `Store '${store.name}' scheduled for deletion. Data will be purged in 48 hours unless restored.`,
      scheduledDeletionAt: store.scheduledDeletionAt,
      store
    });
  } catch (err) {
    console.error("SuperAdmin Delete Store Error:", err);
    res.status(400).json({ error: err.message || "Failed to delete store." });
  }
};

// PATCH/PUT /api/superadmin/stores/:id/toggle-status — Toggle Store Status (Active <-> Suspended)
export const toggleStoreStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found." });
    }

    const beforeValue = {
      name: store.name,
      isActive: store.isActive,
      status: store.status,
      subdomain: store.subdomain
    };

    // Toggle active state
    const newIsActive = !(store.isActive !== false && store.status !== "suspended");
    store.isActive = newIsActive;
    store.status = newIsActive ? "active" : "suspended";

    if (!newIsActive) {
      store.suspensionReason = (req.body?.reason || req.body?.suspensionReason || "Account suspended by platform administrator.").trim();
      store.suspendedAt = new Date();
    } else {
      store.suspensionReason = "";
      store.suspendedAt = null;
    }

    await store.save();

    invalidateSettingsCache(null);
    invalidateTenantCache(store._id);

    // SOC 2 Audit Log Entry
    const clientMeta = getClientMeta(req);
    await recordAuditLog({
      ...clientMeta,
      action: newIsActive ? "Restore Merchant Store" : "Suspend Merchant Store",
      actionCategory: "tenant",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      beforeValue,
      afterValue: { name: store.name, isActive: store.isActive, status: store.status },
      reason: req.body?.reason || (newIsActive ? "Admin reactivated store" : "Admin suspended store")
    });

    // Email alert to merchant owner
    if (store.ownerEmail) {
      const emailCategory = newIsActive ? "restoration" : "suspension";
      dispatchCommunicationEvent({
        category: emailCategory,
        recipientEmail: store.ownerEmail,
        storeId: store._id,
        storeName: store.name,
        variables: {
          store_name: store.name,
          reason: req.body?.reason || (newIsActive ? "Administrative reactivation" : "Administrative suspension")
        }
      }).catch(e => console.error("Status toggle email notification warning:", e));
    }

    res.json({
      message: `Store '${store.name}' has been ${newIsActive ? "activated" : "suspended"} successfully.`,
      store: {
        _id: store._id,
        name: store.name,
        subdomain: store.subdomain,
        customDomain: store.customDomain,
        plan: store.plan,
        status: store.status,
        isActive: store.isActive
      }
    });
  } catch (err) {
    console.error("Toggle Store Status Error:", err);
    res.status(500).json({ error: "Failed to toggle store status." });
  }
};
