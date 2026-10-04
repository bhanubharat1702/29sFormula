import express from "express";
import StoreMarket from "../models/StoreMarket.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { getTenantStoreId } from "../utils/tenantHelper.js";

const router = express.Router();

/**
 * GET /api/markets
 * Fetch all market configurations for the current merchant store.
 */
router.get("/api/markets", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const markets = await StoreMarket.find({ storeId }).sort({ countryCode: 1 });
    res.json({ success: true, markets });
  } catch (err) {
    console.error("Error fetching markets:", err);
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});

/**
 * GET /api/markets/:id
 * Fetch a single market configuration by ID for the current merchant store.
 */
router.get("/api/markets/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const market = await StoreMarket.findOne({ _id: req.params.id, storeId });

    if (!market) {
      return res.status(404).json({ error: "Market configuration not found" });
    }

    res.json({ success: true, market });
  } catch (err) {
    console.error("Error fetching market:", err);
    res.status(500).json({ error: "Failed to fetch market configuration" });
  }
});

/**
 * POST /api/markets
 * Create a new market configuration for the current merchant store.
 */
router.post("/api/markets", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    const { countryCode, currencyCode, exchangeRate, shippingRate, freeShippingThreshold, isActive } = req.body;

    if (!countryCode || !currencyCode || exchangeRate === undefined || exchangeRate === null) {
      return res.status(400).json({ error: "countryCode, currencyCode, and exchangeRate are required" });
    }

    const parsedRate = Number(exchangeRate);
    if (isNaN(parsedRate) || parsedRate <= 0) {
      return res.status(400).json({ error: "exchangeRate must be a positive number" });
    }

    const uppercaseCountry = countryCode.toUpperCase().trim();
    const uppercaseCurrency = currencyCode.toUpperCase().trim();

    // Check for existing market for this store & country
    const existing = await StoreMarket.findOne({ storeId, countryCode: uppercaseCountry });
    if (existing) {
      return res.status(409).json({ error: `Market configuration for country '${uppercaseCountry}' already exists.` });
    }

    const newMarket = new StoreMarket({
      storeId,
      countryCode: uppercaseCountry,
      currencyCode: uppercaseCurrency,
      exchangeRate: parsedRate,
      shippingRate: shippingRate !== undefined && shippingRate !== null ? Math.max(0, Number(shippingRate) || 0) : 0,
      freeShippingThreshold: freeShippingThreshold !== undefined && freeShippingThreshold !== null && freeShippingThreshold !== "" 
        ? Math.max(0, Number(freeShippingThreshold) || 0) 
        : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    await newMarket.save();
    res.status(201).json({ success: true, market: newMarket });
  } catch (err) {
    console.error("Error creating market:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Market configuration for this country already exists." });
    }
    res.status(500).json({ error: "Failed to create market configuration" });
  }
});

/**
 * PUT /api/markets/:id
 * Update an existing market configuration for the current merchant store.
 */
router.put("/api/markets/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const { countryCode, currencyCode, exchangeRate, shippingRate, freeShippingThreshold, isActive } = req.body;

    const market = await StoreMarket.findOne({ _id: req.params.id, storeId });
    if (!market) {
      return res.status(404).json({ error: "Market configuration not found" });
    }

    if (countryCode) {
      const uppercaseCountry = countryCode.toUpperCase().trim();
      if (uppercaseCountry !== market.countryCode) {
        const conflict = await StoreMarket.findOne({ storeId, countryCode: uppercaseCountry, _id: { $ne: market._id } });
        if (conflict) {
          return res.status(409).json({ error: `Market configuration for country '${uppercaseCountry}' already exists.` });
        }
        market.countryCode = uppercaseCountry;
      }
    }

    if (currencyCode) {
      market.currencyCode = currencyCode.toUpperCase().trim();
    }

    if (exchangeRate !== undefined && exchangeRate !== null) {
      const parsedRate = Number(exchangeRate);
      if (isNaN(parsedRate) || parsedRate <= 0) {
        return res.status(400).json({ error: "exchangeRate must be a positive number" });
      }
      market.exchangeRate = parsedRate;
    }

    if (shippingRate !== undefined && shippingRate !== null) {
      market.shippingRate = Math.max(0, Number(shippingRate) || 0);
    }

    if (freeShippingThreshold !== undefined) {
      market.freeShippingThreshold = freeShippingThreshold !== null && freeShippingThreshold !== "" 
        ? Math.max(0, Number(freeShippingThreshold) || 0) 
        : null;
    }

    if (isActive !== undefined) {
      market.isActive = Boolean(isActive);
    }

    await market.save();
    res.json({ success: true, market });
  } catch (err) {
    console.error("Error updating market:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Market configuration for this country already exists." });
    }
    res.status(500).json({ error: "Failed to update market configuration" });
  }
});

/**
 * DELETE /api/markets/:id
 * Delete a market configuration for the current merchant store.
 */
router.delete("/api/markets/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const deleted = await StoreMarket.findOneAndDelete({ _id: req.params.id, storeId });
    
    if (!deleted) {
      return res.status(404).json({ error: "Market configuration not found" });
    }

    res.json({ success: true, message: "Market configuration deleted successfully" });
  } catch (err) {
    console.error("Error deleting market:", err);
    res.status(500).json({ error: "Failed to delete market configuration" });
  }
});

export default router;
