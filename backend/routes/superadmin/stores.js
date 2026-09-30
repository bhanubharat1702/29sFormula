import express from "express";
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

const router = express.Router();

// Helper for complete cascade purge of tenant data
export const purgeTenantData = async (storeId) => {
  const store = await Store.findById(storeId);
  if (!store) return null;

  if (store.subdomain === "default") {
    throw new Error("Cannot delete the Default Store.");
  }

  const sId = store._id;

  const userDeleteQuery = {
    $or: [
      { storeId: sId }
    ]
  };
  if (store.ownerId) userDeleteQuery.$or.push({ _id: store.ownerId });
  if (store.ownerEmail) userDeleteQuery.$or.push({ email: store.ownerEmail });

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

    // Check if subdomain already exists
    const existing = await Store.findOne({ subdomain: cleanSubdomain });
    if (existing) {
      return res.status(400).json({ error: `Subdomain '${cleanSubdomain}' is already taken.` });
    }

    // 1. Find or create merchant owner User document
    let owner = await User.findOne({ email: cleanEmail });
    const hashedPassword = await bcrypt.hash(finalPassword, 12);

    if (!owner) {
      owner = await User.create({
        name: (ownerName || name || "Merchant Owner").trim(),
        email: cleanEmail,
        phone: (ownerPhone || "").trim(),
        password: hashedPassword,
        role: "owner",
        isOwner: true,
        isAdmin: true,
        mustChangePassword: true,
        onboardingComplete: false
      });
    } else {
      owner.role = "owner";
      owner.isOwner = true;
      owner.isAdmin = true;
      if (password) {
        owner.password = hashedPassword;
      }
      if (ownerName) owner.name = ownerName.trim();
      if (ownerPhone) owner.phone = ownerPhone.trim();
      await owner.save();
    }

    // 2. Create Store document with complete merchant info & logo
    const newStore = await Store.create({
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
      provisionedBy: "superadmin",
      demoRequestId: demoRequestId || null
    });

    // 3. Link storeId on User document
    owner.storeId = newStore._id;
    await owner.save();

    // 4. Provision clean default e-commerce settings for the store
    await Settings.create({
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
    });

    // 5. If provisioned from a demo request, mark request as Approved & Won
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
    res.status(500).json({ error: err.message || "Failed to create store." });
  }
});

// PUT /api/superadmin/stores/:id - Update store settings / status / domain / owner info / logo
router.put("/api/superadmin/stores/:id", verifySuperAdminToken, async (req, res) => {
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

    res.json({ message: "Store details updated successfully.", store });
  } catch (err) {
    console.error("SuperAdmin Update Store Error:", err);
    res.status(500).json({ error: "Failed to update store details." });
  }
});

// DELETE /api/superadmin/stores/:id - Delete store completely (legacy path)
router.delete("/api/superadmin/stores/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const deletedStore = await purgeTenantData(req.params.id);
    if (!deletedStore) return res.status(404).json({ error: "Store not found." });
    res.json({ message: `Store '${deletedStore.name}' and all associated merchant data deleted completely.` });
  } catch (err) {
    console.error("SuperAdmin Delete Store Error:", err);
    res.status(400).json({ error: err.message || "Failed to delete store." });
  }
});

export default router;
