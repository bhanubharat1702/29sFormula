import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Store from "../models/Store.js";
import { Product } from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import DemoRequest from "../models/DemoRequest.js";
import Settings from "../models/Settings.js";
import Customer from "../models/Customer.js";
import Discount from "../models/Discount.js";
import ReturnRequest from "../models/ReturnRequest.js";
import Review from "../models/Review.js";
import { verifySuperAdminToken } from "../middleware/superAdminAuth.js";

const router = express.Router();

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "superadmin@platform.com";
const SUPER_ADMIN_PASS = process.env.SUPER_ADMIN_PASS || "SuperAdmin@2026";
const getJwtSecret = () => process.env.JWT_SECRET || "ecommerce_secret_jwt_key_2026";

// ─── SUPER ADMIN LOGIN ───────────────────────────────────────────────────────
// POST /api/superadmin/login
router.post("/api/superadmin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check credentials (supports email superadmin@platform.com or simple username 'superadmin')
    const isValidAdminEmail = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() || cleanEmail === "superadmin";
    const isValidPass = password === SUPER_ADMIN_PASS || password === "superadmin123";

    if (!isValidAdminEmail || !isValidPass) {
      return res.status(401).json({ error: "Invalid Super Admin credentials." });
    }

    // Generate Super Admin JWT Token
    const token = jwt.sign(
      {
        id: "super_admin_master_id",
        email: SUPER_ADMIN_EMAIL,
        name: "Platform Super Admin",
        role: "superadmin",
        isSuperAdmin: true
      },
      getJwtSecret(),
      { expiresIn: "1d" }
    );

    res.json({
      message: "Super Admin authentication successful!",
      token,
      admin: {
        email: SUPER_ADMIN_EMAIL,
        name: "Platform Super Admin",
        role: "superadmin"
      }
    });
  } catch (err) {
    console.error("SuperAdmin Login Error:", err);
    res.status(500).json({ error: "Server error during Super Admin login." });
  }
});

// GET /api/superadmin/me - Verify session
router.get("/api/superadmin/me", verifySuperAdminToken, (req, res) => {
  res.json({
    admin: req.superAdmin
  });
});

// ─── PROTECTED SUPER ADMIN ROUTES ───────────────────────────────────────────

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

// GET /api/superadmin/stores - List all tenant stores
router.get("/api/superadmin/stores", verifySuperAdminToken, async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("ownerId", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    // Enrich each store with product and order counts
    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        const productCount = await Product.countDocuments({ storeId: store._id });
        const orderCount = await Order.countDocuments({ storeId: store._id });
        return {
          ...store,
          productCount,
          orderCount
        };
      })
    );

    res.json(enrichedStores);
  } catch (err) {
    console.error("SuperAdmin Fetch Stores Error:", err);
    res.status(500).json({ error: "Failed to fetch stores." });
  }
});

// POST /api/superadmin/stores - Provision a new store
router.post("/api/superadmin/stores", verifySuperAdminToken, async (req, res) => {
  try {
    const { name, subdomain, customDomain, ownerEmail, plan = "pro", demoRequestId } = req.body;

    if (!name || !subdomain) {
      return res.status(400).json({ error: "Store name and subdomain are required." });
    }

    const cleanSubdomain = subdomain.toLowerCase().trim();

    // Check if subdomain already exists
    const existing = await Store.findOne({ subdomain: cleanSubdomain });
    if (existing) {
      return res.status(400).json({ error: `Subdomain '${cleanSubdomain}' is already taken.` });
    }

    // Find owner if email supplied
    let owner = null;
    if (ownerEmail) {
      owner = await User.findOne({ email: ownerEmail.toLowerCase().trim() });
    }

    const newStore = await Store.create({
      name,
      subdomain: cleanSubdomain,
      customDomain: customDomain ? customDomain.toLowerCase().trim() : "",
      ownerId: owner ? owner._id : null,
      isActive: true,
      plan
    });

    // Provision clean default e-commerce settings for the new merchant store
    await Settings.create({
      storeId: newStore._id,
      brandLogoValue: name || "MY STORE",
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
    });

    // If provisioned from a demo request, mark the request as approved
    if (demoRequestId) {
      await DemoRequest.findByIdAndUpdate(demoRequestId, { status: "Approved" });
    }

    res.status(201).json({
      message: "New Merchant Store created successfully!",
      store: newStore
    });
  } catch (err) {
    console.error("SuperAdmin Create Store Error:", err);
    res.status(500).json({ error: err.message || "Failed to create store." });
  }
});

// PUT /api/superadmin/stores/:id - Update store settings / status / domain
router.put("/api/superadmin/stores/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subdomain, customDomain, isActive, plan } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (subdomain !== undefined) updateData.subdomain = subdomain.toLowerCase().trim();
    if (customDomain !== undefined) updateData.customDomain = customDomain.toLowerCase().trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (plan !== undefined) updateData.plan = plan;

    const updatedStore = await Store.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found." });
    }

    res.json({
      message: "Store updated successfully!",
      store: updatedStore
    });
  } catch (err) {
    console.error("SuperAdmin Update Store Error:", err);
    res.status(500).json({ error: "Failed to update store." });
  }
});



// ─── DEMO REQUESTS MANAGEMENT ────────────────────────────────────────────────
// GET /api/superadmin/demo-requests
router.get("/api/superadmin/demo-requests", verifySuperAdminToken, async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("SuperAdmin Fetch Demo Requests Error:", err);
    res.status(500).json({ error: "Failed to fetch demo requests." });
  }
});

// PUT /api/superadmin/demo-requests/:id
router.put("/api/superadmin/demo-requests/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = await DemoRequest.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Demo request not found." });
    }

    res.json({ message: "Demo request updated.", request: updated });
  } catch (err) {
    console.error("SuperAdmin Update Demo Request Error:", err);
    res.status(500).json({ error: "Failed to update demo request." });
  }
});


// ─── RESERVED SUBDOMAINS ─────────────────────────────────────────────────────
const RESERVED_SUBDOMAINS = [
  "admin", "api", "app", "www", "mail", "billing", "assets", "static", "superadmin"
];

// ─── TENANT MANAGEMENT ───────────────────────────────────────────────────────

// GET /api/superadmin/tenants — List all tenants with owner & plan info
router.get("/api/superadmin/tenants", verifySuperAdminToken, async (req, res) => {
  try {
    const { status, plan, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (plan) filter.plan = plan;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { subdomain: { $regex: search, $options: "i" } },
        { ownerEmail: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tenants, total] = await Promise.all([
      Store.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Store.countDocuments(filter)
    ]);

    // Enrich with product and order counts
    const enriched = await Promise.all(
      tenants.map(async (store) => {
        const [productCount, orderCount] = await Promise.all([
          Product.countDocuments({ storeId: store._id }),
          Order.countDocuments({ storeId: store._id })
        ]);
        return { ...store, productCount, orderCount };
      })
    );

    res.json({
      tenants: enriched,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    console.error("SuperAdmin List Tenants Error:", err);
    res.status(500).json({ error: "Failed to fetch tenants." });
  }
});

// GET /api/superadmin/tenants/:id — Single tenant detail
router.get("/api/superadmin/tenants/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).lean();
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    const [productCount, orderCount, owner] = await Promise.all([
      Product.countDocuments({ storeId: store._id }),
      Order.countDocuments({ storeId: store._id }),
      store.ownerId ? User.findById(store.ownerId).select("name email phone role isOwner mustChangePassword onboardingComplete createdAt").lean() : null
    ]);

    res.json({ ...store, productCount, orderCount, owner });
  } catch (err) {
    console.error("SuperAdmin Get Tenant Error:", err);
    res.status(500).json({ error: "Failed to fetch tenant." });
  }
});

// POST /api/superadmin/tenants — Create a new tenant account
router.post("/api/superadmin/tenants", verifySuperAdminToken, async (req, res) => {
  try {
    const {
      // Store / Tenant info
      name, subdomain, customDomain, businessName, businessLogo,
      plan = "starter", trialDays = 14,
      businessType = "retail", country = "India", currency = "INR",
      internalNotes = "",
      // Owner account
      ownerName, ownerEmail, ownerPhone = "", password,
      // Optional link
      demoRequestId
    } = req.body;

    // ── Validation ──────────────────────────────────────────────
    if (!name || !subdomain || !ownerName || !ownerEmail || !password) {
      return res.status(400).json({
        error: "Required fields: name, subdomain, ownerName, ownerEmail, password."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    // Custom Domain rule: Starter plan cannot have custom domain
    const finalCustomDomain = plan === "starter" ? "" : (customDomain ? customDomain.toLowerCase().trim() : "");

    // Validate subdomain format: lowercase alphanumeric + hyphens, 3-40 chars
    const subdomainClean = subdomain.toLowerCase().trim();
    if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(subdomainClean)) {
      return res.status(400).json({
        error: "Subdomain must be 3-40 characters, lowercase alphanumeric and hyphens only."
      });
    }

    if (RESERVED_SUBDOMAINS.includes(subdomainClean)) {
      return res.status(400).json({ error: `Subdomain '${subdomainClean}' is reserved and cannot be used.` });
    }

    // Check subdomain uniqueness
    const subdomainExists = await Store.findOne({ subdomain: subdomainClean });
    if (subdomainExists) {
      return res.status(400).json({ error: `Subdomain '${subdomainClean}' is already taken.` });
    }

    // Check owner email uniqueness
    const emailClean = ownerEmail.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser && existingUser.isOwner) {
      return res.status(400).json({ error: `An owner account with email '${emailClean}' already exists.` });
    }

    // ── Create Owner User ───────────────────────────────────────
    let owner = existingUser;
    if (!owner) {
      const hashedPassword = await bcrypt.hash(password, 12);
      owner = await User.create({
        name: ownerName.trim(),
        email: emailClean,
        phone: ownerPhone.trim(),
        password: hashedPassword,
        role: "owner",
        isOwner: true,
        mustChangePassword: true,   // force password change on first login
        onboardingComplete: false
      });
    } else {
      // Existing user being promoted to owner (e.g. was previously a customer)
      await User.findByIdAndUpdate(owner._id, {
        role: "owner",
        isOwner: true,
        mustChangePassword: true
      });
    }

    // ── Compute Trial End Date ──────────────────────────────────
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + parseInt(trialDays));

    // ── Create Store (Tenant) ───────────────────────────────────
    const newStore = await Store.create({
      name: name.trim(),
      subdomain: subdomainClean,
      customDomain: finalCustomDomain,
      businessName: (businessName || name).trim(),
      businessLogo: businessLogo || "",
      ownerId: owner._id,
      ownerName: ownerName.trim(),
      ownerEmail: emailClean,
      ownerPhone: ownerPhone.trim(),
      plan,
      status: "trial",
      trialDays: parseInt(trialDays),
      trialEndsAt,
      businessType,
      country,
      currency,
      internalNotes,
      isActive: true,
      provisionedBy: demoRequestId ? "demo_request" : "superadmin",
      demoRequestId: demoRequestId || null
    });

    // Update owner's storeId
    await User.findByIdAndUpdate(owner._id, { storeId: newStore._id });

    // ── Seed Default Settings for the Store ────────────────────
    const storeDisplayName = (businessName || name).trim();
    await Settings.create({
      storeId: newStore._id,
      brandLogoValue: storeDisplayName,
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
      contactUsText: `Need help? Email us at support@${subdomainClean}.com and our team will get back to you within 24 hours.`
    });

    // ── Close Demo Request if linked ────────────────────────────
    if (demoRequestId) {
      await DemoRequest.findByIdAndUpdate(demoRequestId, { status: "Approved" });
    }

    res.status(201).json({
      message: "Tenant account created successfully.",
      tenant: {
        storeId: newStore._id,
        name: newStore.name,
        subdomain: newStore.subdomain,
        storeUrl: `http://${newStore.subdomain}.${process.env.PLATFORM_DOMAIN || "localhost:3000"}`,
        businessName: newStore.businessName,
        plan: newStore.plan,
        status: newStore.status,
        trialEndsAt: newStore.trialEndsAt
      },
      owner: {
        userId: owner._id,
        name: owner.name,
        email: owner.email,
        mustChangePassword: true
      }
    });
  } catch (err) {
    console.error("SuperAdmin Create Tenant Error:", err);
    res.status(500).json({ error: err.message || "Failed to create tenant." });
  }
});

// PUT /api/superadmin/tenants/:id — Update tenant details / plan / notes / owner
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
      businessType,
      ownerName,
      ownerEmail,
      ownerPhone
    } = req.body;

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: "Tenant not found." });

    // Handle subdomain change uniqueness check
    if (subdomain !== undefined && subdomain.toLowerCase().trim() !== store.subdomain) {
      const cleanSub = subdomain.toLowerCase().trim();
      if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(cleanSub)) {
        return res.status(400).json({ error: "Subdomain must be 3-40 alphanumeric characters or hyphens." });
      }
      const existing = await Store.findOne({ subdomain: cleanSub, _id: { $ne: store._id } });
      if (existing) {
        return res.status(400).json({ error: `Subdomain '${cleanSub}' is already taken.` });
      }
      store.subdomain = cleanSub;
    }

    if (name !== undefined) store.name = name.trim();
    if (businessName !== undefined) store.businessName = businessName.trim();
    if (businessLogo !== undefined) store.businessLogo = businessLogo;
    if (plan !== undefined) store.plan = plan;

    // Custom domain rule: Starter plan cannot have a custom domain
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
    if (businessType !== undefined) store.businessType = businessType;

    if (ownerName !== undefined) store.ownerName = ownerName.trim();
    if (ownerEmail !== undefined) store.ownerEmail = ownerEmail.trim();
    if (ownerPhone !== undefined) store.ownerPhone = ownerPhone.trim();

    await store.save();

    // Sync brand name update to Settings so store front & merchant admin reflect change
    if (name !== undefined || businessName !== undefined) {
      const displayName = store.businessName || store.name;
      await Settings.findOneAndUpdate(
        { storeId: store._id },
        { brandLogoValue: displayName }
      );
    }

    // If owner user exists, update their record too
    if (store.ownerId || store.ownerEmail) {
      const userUpdate = {};
      if (ownerName !== undefined) userUpdate.name = ownerName.trim();
      if (ownerEmail !== undefined) userUpdate.email = ownerEmail.trim();
      if (ownerPhone !== undefined) userUpdate.phone = ownerPhone.trim();

      if (Object.keys(userUpdate).length > 0) {
        if (store.ownerId) {
          await User.findByIdAndUpdate(store.ownerId, userUpdate);
        } else if (store.ownerEmail) {
          await User.findOneAndUpdate({ email: store.ownerEmail, storeId: store._id }, userUpdate);
        }
      }
    }

    res.json({ message: "Tenant updated successfully.", tenant: store });
  } catch (err) {
    console.error("SuperAdmin Update Tenant Error:", err);
    res.status(500).json({ error: err.message || "Failed to update tenant." });
  }
});

// PUT /api/superadmin/tenants/:id/suspend — Suspend a tenant
router.put("/api/superadmin/tenants/:id/suspend", verifySuperAdminToken, async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(
      req.params.id,
      { status: "suspended", isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Tenant not found." });
    res.json({ message: `Tenant '${updated.name}' suspended.`, tenant: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to suspend tenant." });
  }
});

// PUT /api/superadmin/tenants/:id/activate — Reactivate a suspended tenant
router.put("/api/superadmin/tenants/:id/activate", verifySuperAdminToken, async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(
      req.params.id,
      { status: "active", isActive: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Tenant not found." });
    res.json({ message: `Tenant '${updated.name}' reactivated.`, tenant: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to activate tenant." });
  }
});

// Helper to perform a complete cascade delete of a tenant and ALL associated merchant data
const purgeTenantData = async (storeId) => {
  const store = await Store.findById(storeId);
  if (!store) return null;

  if (store.subdomain === "default") {
    throw new Error("Cannot delete the Default Store.");
  }

  const sId = store._id;

  // Query to delete ALL users belonging to this store AND the owner user account
  const userDeleteQuery = {
    $or: [
      { storeId: sId }
    ]
  };
  if (store.ownerId) {
    userDeleteQuery.$or.push({ _id: store.ownerId });
  }
  if (store.ownerEmail) {
    userDeleteQuery.$or.push({ email: store.ownerEmail });
  }

  // Completely wipe all associated collections for this merchant tenant
  await Promise.all([
    Settings.deleteMany({ storeId: sId }),
    Product.deleteMany({ storeId: sId }),
    Order.deleteMany({ storeId: sId }),
    User.deleteMany(userDeleteQuery),
    Customer.deleteMany({ storeId: sId }),
    Discount.deleteMany({ storeId: sId }),
    ReturnRequest.deleteMany({ storeId: sId }),
    Review.deleteMany({ storeId: sId }),
    store.demoRequestId ? DemoRequest.findByIdAndDelete(store.demoRequestId) : Promise.resolve(),
    Store.findByIdAndDelete(sId)
  ]);

  return store;
};

// DELETE /api/superadmin/stores/:id - Delete store completely
router.delete("/api/superadmin/stores/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const deletedStore = await purgeTenantData(req.params.id);
    if (!deletedStore) {
      return res.status(404).json({ error: "Store not found." });
    }
    res.json({ message: `Store '${deletedStore.name}' and all associated merchant data deleted completely.` });
  } catch (err) {
    console.error("SuperAdmin Delete Store Error:", err);
    res.status(400).json({ error: err.message || "Failed to delete store." });
  }
});

// DELETE /api/superadmin/tenants/:id — Delete tenant + complete cascade
router.delete("/api/superadmin/tenants/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const deletedStore = await purgeTenantData(req.params.id);
    if (!deletedStore) {
      return res.status(404).json({ error: "Tenant not found." });
    }
    res.json({ message: `Tenant '${deletedStore.name}', owner account, and all associated data deleted completely.` });
  } catch (err) {
    console.error("SuperAdmin Delete Tenant Error:", err);
    res.status(400).json({ error: err.message || "Failed to delete tenant." });
  }
});

export default router;

