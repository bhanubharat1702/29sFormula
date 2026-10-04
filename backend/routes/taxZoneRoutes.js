import express from "express";
import TaxZone from "../models/TaxZone.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { getTenantStoreId } from "../utils/tenantHelper.js";

const router = express.Router();

// GET all Tax Zones for the current store
router.get("/api/tax-zones", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const zones = await TaxZone.find({ storeId }).sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, taxZones: zones });
  } catch (err) {
    console.error("Error fetching tax zones:", err);
    res.status(500).json({ error: "Failed to fetch tax zones" });
  }
});

// GET single Tax Zone by ID
router.get("/api/tax-zones/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const zone = await TaxZone.findOne({ _id: req.params.id, storeId });
    if (!zone) {
      return res.status(404).json({ error: "Tax zone not found" });
    }
    res.json({ success: true, taxZone: zone });
  } catch (err) {
    console.error("Error fetching tax zone:", err);
    res.status(500).json({ error: "Failed to fetch tax zone" });
  }
});

// POST create new Tax Zone
router.post("/api/tax-zones", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const { name, country, regions, postalCodes, taxRate, taxName, isInclusive, priority, active } = req.body;

    if (!name || !country || taxRate === undefined || taxRate === null) {
      return res.status(400).json({ error: "Name, country, and taxRate are required" });
    }

    const newZone = new TaxZone({
      storeId,
      name,
      country: country.toUpperCase().trim(),
      regions: Array.isArray(regions) ? regions.map(r => r.toUpperCase().trim()) : ["*"],
      postalCodes: Array.isArray(postalCodes) ? postalCodes.map(p => p.trim()) : [],
      taxRate: Number(taxRate) || 0,
      taxName: taxName || "Tax",
      isInclusive: Boolean(isInclusive),
      priority: Number(priority) || 0,
      active: active !== undefined ? Boolean(active) : true
    });

    await newZone.save();
    res.status(201).json({ success: true, taxZone: newZone });
  } catch (err) {
    console.error("Error creating tax zone:", err);
    res.status(500).json({ error: "Failed to create tax zone" });
  }
});

// PUT update existing Tax Zone
router.put("/api/tax-zones/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const { name, country, regions, postalCodes, taxRate, taxName, isInclusive, priority, active } = req.body;

    const zone = await TaxZone.findOne({ _id: req.params.id, storeId });
    if (!zone) {
      return res.status(404).json({ error: "Tax zone not found" });
    }

    if (name) zone.name = name;
    if (country) zone.country = country.toUpperCase().trim();
    if (regions) zone.regions = Array.isArray(regions) ? regions.map(r => r.toUpperCase().trim()) : zone.regions;
    if (postalCodes) zone.postalCodes = Array.isArray(postalCodes) ? postalCodes.map(p => p.trim()) : zone.postalCodes;
    if (taxRate !== undefined) zone.taxRate = Number(taxRate) || 0;
    if (taxName) zone.taxName = taxName;
    if (isInclusive !== undefined) zone.isInclusive = Boolean(isInclusive);
    if (priority !== undefined) zone.priority = Number(priority) || 0;
    if (active !== undefined) zone.active = Boolean(active);

    await zone.save();
    res.json({ success: true, taxZone: zone });
  } catch (err) {
    console.error("Error updating tax zone:", err);
    res.status(500).json({ error: "Failed to update tax zone" });
  }
});

// DELETE Tax Zone
router.delete("/api/tax-zones/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const deleted = await TaxZone.findOneAndDelete({ _id: req.params.id, storeId });
    if (!deleted) {
      return res.status(404).json({ error: "Tax zone not found" });
    }
    res.json({ success: true, message: "Tax zone deleted successfully" });
  } catch (err) {
    console.error("Error deleting tax zone:", err);
    res.status(500).json({ error: "Failed to delete tax zone" });
  }
});

export default router;
