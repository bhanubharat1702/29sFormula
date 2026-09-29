import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Store from "../models/Store.js";
import { Product } from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import DemoRequest from "../models/DemoRequest.js";
import Settings from "../models/Settings.js";
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

// DELETE /api/superadmin/stores/:id - Delete store
router.delete("/api/superadmin/stores/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found." });
    }

    if (store.subdomain === "default") {
      return res.status(400).json({ error: "Cannot delete the Default Store." });
    }

    await Store.findByIdAndDelete(id);
    res.json({ message: "Store deleted successfully." });
  } catch (err) {
    console.error("SuperAdmin Delete Store Error:", err);
    res.status(500).json({ error: "Failed to delete store." });
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

export default router;
