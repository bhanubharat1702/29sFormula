import express from "express";
import Store from "../models/Store.js";
import { Product } from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/superadmin/stats - Platform-wide analytics
router.get("/api/superadmin/stats", async (req, res) => {
  try {
    const totalStores = await Store.countDocuments();
    const activeStores = await Store.countDocuments({ isActive: true });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
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
      totalRevenue
    });
  } catch (err) {
    console.error("SuperAdmin Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch platform metrics." });
  }
});

// GET /api/superadmin/stores - List all tenant stores
router.get("/api/superadmin/stores", async (req, res) => {
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
router.post("/api/superadmin/stores", async (req, res) => {
  try {
    const { name, subdomain, customDomain, ownerEmail, plan = "pro" } = req.body;

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
router.put("/api/superadmin/stores/:id", async (req, res) => {
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
router.delete("/api/superadmin/stores/:id", async (req, res) => {
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

export default router;
