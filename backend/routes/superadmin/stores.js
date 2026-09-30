import express from "express";
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
import { DomainItem, RESERVED_SUBDOMAINS } from "../../models/Domain.js";

import { DeliveryLog, InAppNotification } from "../../models/Communication.js";
import { BillingInvoice } from "../../models/Billing.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import { recordAuditLog } from "../../services/auditLogService.js";
import { dispatchCommunicationEvent } from "./communications.js";

const router = express.Router();
const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

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

// GET /api/superadmin/stores & /api/superadmin/tenants - Unified List with Search, Filter & Pagination
const getStoresHandler = async (req, res) => {
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

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 20);
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

    if (page && limit) {
      return res.json({
        stores: enrichedStores,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      });
    }

    res.json(enrichedStores);
  } catch (err) {
    console.error("SuperAdmin Fetch Stores Error:", err);
    res.status(500).json({ error: "Failed to fetch stores." });
  }
};

router.get("/api/superadmin/stores", verifySuperAdminToken, getStoresHandler);
router.get("/api/superadmin/tenants", verifySuperAdminToken, getStoresHandler);

// POST /api/superadmin/stores - Provision a new store with DB Transaction & Safe Fallback
router.post("/api/superadmin/stores", verifySuperAdminToken, async (req, res) => {
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

  // Check reserved subdomains
  if (RESERVED_SUBDOMAINS.includes(cleanSubdomain)) {
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
    // Standalone MongoDB without replica set
    useTransaction = false;
    if (session) {
      try { session.endSession(); } catch {}
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

    // 2. Create Store document
    const newStores = await Store.create(
      [
        {
          name: name.trim(),
          subdomain: cleanSubdomain,
          customDomain: customDomain ? customDomain.toLowerCase().trim() : "",
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
          status: "trial",
          trialDays: 14,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          internalNotes: internalNotes || "",
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

    // 4. Update Demo Request if converted
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
              details: `Store "${newStore.name}" (${newStore.subdomain}) provisioned successfully`,
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

    // 5. Audit Log Entry (Issue 6)
    await recordAuditLog({
      adminUser: req.superAdmin?.name || "Super Admin",
      adminEmail: req.superAdmin?.email || "admin@ecommerce.com",
      action: "Create Merchant Store",
      actionCategory: "tenant",
      target: name.trim(),
      targetId: newStore._id.toString(),
      storeId: newStore._id,
      storeName: newStore.name,
      afterValue: { subdomain: cleanSubdomain, plan, ownerEmail: cleanEmail },
      ipAddress: req.ip || "127.0.0.1"
    });

    // 6. Automated Welcome Email Trigger (Issue 6)
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
      } catch {}
    } else {
      // Non-transactional fallback cleanup
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
});

// PUT /api/superadmin/stores/:id & /api/superadmin/tenants/:id - Update store settings / status
const updateStoreHandler = async (req, res) => {
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
    if (subdomain !== undefined) store.subdomain = subdomain.toLowerCase().trim();
    if (customDomain !== undefined) store.customDomain = customDomain.toLowerCase().trim();
    if (businessLogo !== undefined) store.businessLogo = businessLogo.trim();
    if (ownerName !== undefined) store.ownerName = ownerName.trim();
    if (ownerEmail !== undefined) store.ownerEmail = ownerEmail.toLowerCase().trim();
    if (ownerPhone !== undefined) store.ownerPhone = ownerPhone.trim();
    if (businessType !== undefined) store.businessType = businessType;

    const statusChanged = isActive !== undefined && store.isActive !== isActive;
    if (isActive !== undefined) store.isActive = isActive;
    if (plan !== undefined) store.plan = plan;
    if (internalNotes !== undefined) store.internalNotes = internalNotes;

    await store.save();

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

    // Record Audit Log (Issue 6)
    await recordAuditLog({
      adminUser: req.superAdmin?.name || "Super Admin",
      adminEmail: req.superAdmin?.email || "admin@ecommerce.com",
      action: statusChanged ? (store.isActive ? "Restore Merchant Store" : "Suspend Merchant Store") : "Update Store Settings",
      actionCategory: "tenant",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      beforeValue,
      afterValue: { name: store.name, isActive: store.isActive, plan: store.plan, subdomain: store.subdomain },
      ipAddress: req.ip || "127.0.0.1"
    });

    // Lifecycle Email Notification Trigger (Issue 6)
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

router.put("/api/superadmin/stores/:id", verifySuperAdminToken, updateStoreHandler);
router.put("/api/superadmin/tenants/:id", verifySuperAdminToken, updateStoreHandler);

// POST /api/superadmin/stores/:id/restore — Restore store scheduled for deletion
router.post("/api/superadmin/stores/:id/restore", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found." });

    store.status = "active";
    store.isActive = true;
    store.scheduledDeletionAt = null;
    await store.save();

    await recordAuditLog({
      adminUser: req.superAdmin?.name || "Super Admin",
      adminEmail: req.superAdmin?.email || "admin@ecommerce.com",
      action: "Cancel Scheduled Store Deletion",
      actionCategory: "tenant",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      ipAddress: req.ip || "127.0.0.1"
    });

    res.json({ message: `Store '${store.name}' has been restored to active status.`, store });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore store." });
  }
});

// POST /api/superadmin/stores/:id/impersonate — Generate single-use impersonation access token (Issue 3)
router.post("/api/superadmin/stores/:id/impersonate", verifySuperAdminToken, async (req, res) => {
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
        storeId: store._id,
        subdomain: store.subdomain,
        isImpersonated: true,
        impersonatedBy: req.superAdmin?.email || "superadmin@ecommerce.com"
      },
      getJwtSecret(),
      { expiresIn: "1h" }
    );

    // Audit Log entry (Issue 6)
    await recordAuditLog({
      adminUser: req.superAdmin?.name || "Super Admin",
      adminEmail: req.superAdmin?.email || "admin@ecommerce.com",
      action: "Start Tenant Impersonation",
      actionCategory: "impersonation",
      target: store.name,
      targetId: store._id.toString(),
      storeId: store._id,
      storeName: store.name,
      reason,
      ipAddress: req.ip || "127.0.0.1"
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
});

// DELETE /api/superadmin/stores/:id & /api/superadmin/tenants/:id — Soft-delete (48h grace) or Purge
const deleteStoreHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const forcePurge = req.query.forcePurge === "true" || req.body?.forcePurge === true;

    const store = await Store.findById(id);
    if (!store) return res.status(404).json({ error: "Store not found." });

    if (store.subdomain === "default") {
      return res.status(400).json({ error: "Cannot delete the Default Store." });
    }

    if (forcePurge) {
      const deletedStore = await purgeTenantData(id);
      await recordAuditLog({
        adminUser: req.superAdmin?.name || "Super Admin",
        adminEmail: req.superAdmin?.email || "admin@ecommerce.com",
        action: "Force Purge Merchant Store",
        actionCategory: "tenant",
        target: store.name,
        targetId: id,
        storeId: store._id,
        storeName: store.name,
        reason: req.body?.reason || "Immediate compliance purge",
        ipAddress: req.ip || "127.0.0.1"
      });
      return res.json({ message: `Store '${deletedStore.name}' and all subsystem data purged permanently.` });
    }

    // 48-Hour Soft-Delete Grace Period (Issue 5)
    store.status = "scheduled_for_deletion";
    store.isActive = false;
    store.scheduledDeletionAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await store.save();

    await recordAuditLog({
      adminUser: req.superAdmin?.name || "Super Admin",
      adminEmail: req.superAdmin?.email || "admin@ecommerce.com",
      action: "Schedule Store Deletion (48h Grace Period)",
      actionCategory: "tenant",
      target: store.name,
      targetId: id,
      storeId: store._id,
      storeName: store.name,
      reason: req.body?.reason || "Admin requested store deletion",
      ipAddress: req.ip || "127.0.0.1"
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

router.delete("/api/superadmin/stores/:id", verifySuperAdminToken, deleteStoreHandler);
router.delete("/api/superadmin/tenants/:id", verifySuperAdminToken, deleteStoreHandler);

export default router;
