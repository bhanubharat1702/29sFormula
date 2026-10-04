import express from "express";
import { Product, ProductVariant } from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import StoreMarket from "../models/StoreMarket.js";
import Store from "../models/Store.js";
import Settings from "../models/Settings.js";
import { detectShopperCountry } from "../utils/geoIpHelper.js";
import { getPaginationParams, buildPaginatedResponse, setPaginationHeaders } from "../utils/paginationHelper.js";
import { getTenantStoreId } from "../utils/tenantHelper.js";
import { storefrontSuspensionGate } from "../middleware/suspensionGate.js";

const router = express.Router();
router.use(storefrontSuspensionGate);

router.get("/api/storefront/shop", async (req, res) => {
  try {
    const { page, limit, skip, cursor } = getPaginationParams(req, 20, 100);
    const storeId = getTenantStoreId(req);

    const filter = {};
    if (storeId) {
      filter.storeId = storeId;
    }
    if (cursor) {
      filter._id = { $lt: cursor };
    }

    const totalProducts = await Product.countDocuments(filter);
    const [settings, products] = await Promise.all([
      Settings.findOne(storeId ? { storeId } : {}).lean(),
      Product.find(filter)
        .sort({ _id: -1 })
        .skip(cursor ? 0 : skip)
        .limit(limit)
        .lean()
    ]);

    const productIds = products.map(p => p._id);
    const variants = await ProductVariant.find({ productId: { $in: productIds } }).lean();
    
    const variantsMap = {};
    variants.forEach(v => {
      const pid = String(v.productId);
      if (!variantsMap[pid]) variantsMap[pid] = [];
      variantsMap[pid].push(v);
    });

    products.forEach(p => {
      let prodVariants = variantsMap[String(p._id)] || [];
      prodVariants.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      p.variants = prodVariants;
      
      if (prodVariants.length > 0) {
        p.price = prodVariants[0].price;
        p.strikePrice = prodVariants[0].strikePrice;
        p.sizes = prodVariants.map(v => v.size).filter(Boolean);
      }
    });

    setPaginationHeaders(res, totalProducts, page, limit);
    const nextCursor = products.length > 0 ? String(products[products.length - 1]._id) : null;

    res.json({
      settings: settings || {},
      products,
      pagination: buildPaginatedResponse(products, totalProducts, page, limit, nextCursor).pagination
    });
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
    res.status(500).json({ error: "Failed to fetch shop data" });
  }
});

router.get("/api/storefront/home", async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const storeFilter = storeId ? { storeId } : {};

    let settings = await Settings.findOne(storeFilter).lean();
    if (!settings) {
      settings = await Settings.findOne({}).lean() || {};
    }

    const [arrivals, reviews] = await Promise.all([
      Product.find({ ...storeFilter, category: "Latest Arrivals" }).sort({ createdAt: -1 }).limit(10).lean(),
      Review.find(storeFilter).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    // Aggregate to find true best sellers based on order quantity for this specific store
    const salesAggregation = await Order.aggregate([
      ...(storeId ? [{ $match: { storeId } }] : []),
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.productId",
          salesCount: { $sum: "$cartItems.quantity" }
        }
      },
      { $sort: { salesCount: -1 } },
      { $limit: 4 }
    ]);

    const topSellingIds = salesAggregation.map(item => item._id);
    let bestSellers = await Product.find({ ...storeFilter, _id: { $in: topSellingIds } }).lean();

    // Sort to match aggregation order
    bestSellers.sort((a, b) => {
      const indexA = topSellingIds.findIndex(id => id.toString() === a._id.toString());
      const indexB = topSellingIds.findIndex(id => id.toString() === b._id.toString());
      return indexA - indexB;
    });

    // Fill remaining if less than 4 products have been sold
    if (bestSellers.length < 4) {
      const additional = await Product.find({ 
        ...storeFilter,
        category: "Best Seller", 
        _id: { $nin: topSellingIds } 
      }).sort({ createdAt: -1 }).limit(4 - bestSellers.length).lean();
      bestSellers = [...bestSellers, ...additional];
    }

    const allProducts = [...arrivals, ...bestSellers];
    const productIds = [...new Set(allProducts.map(p => p._id))];
    const variants = await ProductVariant.find({ productId: { $in: productIds } }).lean();
    
    const variantsMap = {};
    variants.forEach(v => {
      const pid = String(v.productId);
      if (!variantsMap[pid]) variantsMap[pid] = [];
      variantsMap[pid].push(v);
    });

    const populateVariants = (p) => {
      let prodVariants = variantsMap[String(p._id)] || [];
      prodVariants.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      p.variants = prodVariants;
      
      if (prodVariants.length > 0) {
        p.price = prodVariants[0].price;
        p.strikePrice = prodVariants[0].strikePrice;
        p.sizes = prodVariants.map(v => v.size).filter(Boolean);
      }
    };
    
    arrivals.forEach(populateVariants);
    bestSellers.forEach(populateVariants);

    res.json({
      settings: settings || {},
      arrivals,
      bestSellers,
      reviews
    });
  } catch (error) {
    console.error("Failed to fetch storefront data:", error);
    res.status(500).json({ error: "Failed to fetch storefront data" });
  }
});

router.get("/api/storefront/markets", async (req, res) => {
  try {
    const storeId = getTenantStoreId(req);
    const store = storeId ? await Store.findById(storeId).lean() : null;

    const baseCurrency = store?.currency || "INR";
    const baseCountry = store?.country || "India";

    // Convert store base country string (e.g., "India" or "IN") to 2-letter uppercase ISO if possible
    const baseCountryCode = (baseCountry.toLowerCase() === "india" || baseCountry.toUpperCase() === "IN") 
      ? "IN" 
      : (baseCountry.toLowerCase() === "united states" || baseCountry.toUpperCase() === "US") 
      ? "US" 
      : baseCountry.substring(0, 2).toUpperCase();

    const activeMarkets = storeId 
      ? await StoreMarket.find({ storeId, isActive: true }).lean() 
      : [];

    const detectedCountry = await detectShopperCountry(req);

    let isAllowed = true;
    let currentMarket = null;

    if (activeMarkets.length > 0) {
      // Find matching market for detected country
      const matched = activeMarkets.find(m => m.countryCode === detectedCountry);
      if (matched) {
        isAllowed = true;
        currentMarket = matched;
      } else if (detectedCountry === baseCountryCode) {
        // Base country is always allowed
        isAllowed = true;
        currentMarket = {
          countryCode: baseCountryCode,
          currencyCode: baseCurrency,
          exchangeRate: 1,
          shippingRate: 0,
          freeShippingThreshold: null,
          isActive: true
        };
      } else {
        // Country is not in merchant's active markets
        isAllowed = false;
        currentMarket = null;
      }
    } else {
      // Default: No restricted markets defined by merchant; allow all traffic in base currency
      isAllowed = true;
      currentMarket = {
        countryCode: detectedCountry,
        currencyCode: baseCurrency,
        exchangeRate: 1,
        shippingRate: 0,
        freeShippingThreshold: null,
        isActive: true
      };
    }

    res.json({
      success: true,
      storeName: store?.businessName || store?.name || "Our Store",
      baseCurrency,
      baseCountry: baseCountryCode,
      detectedCountry,
      isAllowed,
      currentMarket,
      activeMarkets
    });
  } catch (error) {
    console.error("Failed to fetch storefront market configuration:", error);
    res.status(500).json({ error: "Failed to resolve market configuration" });
  }
});

export default router;
