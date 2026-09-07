import express from "express";
import { Product, ProductVariant } from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Settings from "../models/Settings.js";
import { cachedProducts, cachedSettings } from "../utils/cache.js";

const router = express.Router();

router.get("/api/storefront/shop", async (req, res) => {
  try {
    const [settings, products] = await Promise.all([
      Settings.findOne().lean(),
      Product.find({}).sort({ createdAt: -1 }).lean()
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

    res.json({
      settings: settings || {},
      products
    });
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
    res.status(500).json({ error: "Failed to fetch shop data" });
  }
});

router.get("/api/storefront/home", async (req, res) => {
  try {
    const [settings, arrivals, reviews] = await Promise.all([
      Settings.findOne().lean(),
      Product.find({ category: "Latest Arrivals" }).sort({ createdAt: -1 }).lean(),
      Review.find({}).sort({ createdAt: -1 }).lean()
    ]);

    // Aggregate to find true best sellers based on order quantity
    const salesAggregation = await Order.aggregate([
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
    let bestSellers = await Product.find({ _id: { $in: topSellingIds } }).lean();

    // Sort to match aggregation order
    bestSellers.sort((a, b) => {
      const indexA = topSellingIds.findIndex(id => id.toString() === a._id.toString());
      const indexB = topSellingIds.findIndex(id => id.toString() === b._id.toString());
      return indexA - indexB;
    });

    // Fill remaining if less than 4 products have been sold
    if (bestSellers.length < 4) {
      const additional = await Product.find({ 
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

export default router;
