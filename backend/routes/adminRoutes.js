import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import { Product, ProductVariant } from "../models/Product.js";
import Customer from "../models/Customer.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/api/admin/dashboard-stats", async (req, res) => {
  try {
    const { timeline } = req.query;
    let dateFilter = {};
    const now = new Date();
    
    let startOfToday, startOf7Days, startOf30Days, startOfYear;
    if (timeline === "today") {
      startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { createdAt: { $gte: startOfToday } };
    } else if (timeline === "7days") {
      startOf7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: startOf7Days } };
    } else if (timeline === "30days") {
      startOf30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: startOf30Days } };
    } else if (timeline === "year") {
      startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { createdAt: { $gte: startOfYear } };
    }

    const [totalProducts, latestArrivalsCount, bestSellersCount, allCustomers, allOrders, topProducts, recentOrders, allVariants, allBaseProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ category: "Latest Arrivals" }),
      Product.countDocuments({ category: "Best Seller" }),
      Customer.find({}, "createdAt").lean(),
      Order.find({}, "totalAmount status deletedByAdmin createdAt cartItems").lean(),
      Order.aggregate([
        { $match: { ...dateFilter, deletedByAdmin: false, status: { $nin: ["Cancelled"] } } },
        { $unwind: "$cartItems" },
        { $group: { _id: "$cartItems.productId", totalSold: { $sum: "$cartItems.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
      ]).then(async (topSales) => {
        const validProductIds = topSales
          .map(t => t._id)
          .filter(id => id && mongoose.Types.ObjectId.isValid(id));
        if (validProductIds.length === 0) return [];
        const products = await Product.find({ _id: { $in: validProductIds } }).lean();
        return topSales.map(t => products.find(p => String(p._id) === String(t._id))).filter(Boolean).slice(0, 5);
      }),
      Order.find({ deletedByAdmin: false }).sort({ createdAt: -1 }).limit(5).populate("customerId").lean(),
      ProductVariant.find({}, "productId size makingPrice").lean(),
      Product.find({}, "makingPrice").lean()
    ]);

    const orders = allOrders.filter(o => {
       if (!o.createdAt) return true;
       const d = new Date(o.createdAt);
       if (timeline === "today") return d >= startOfToday;
       if (timeline === "7days") return d >= startOf7Days;
       if (timeline === "30days") return d >= startOf30Days;
       if (timeline === "year") return d >= startOfYear;
       return true;
    });

    const totalCustomers = allCustomers.filter(c => {
       if (!c.createdAt) return true;
       const d = new Date(c.createdAt);
       if (timeline === "today") return d >= startOfToday;
       if (timeline === "7days") return d >= startOf7Days;
       if (timeline === "30days") return d >= startOf30Days;
       if (timeline === "year") return d >= startOfYear;
       return true;
    }).length;

    // ----- EXACT CARD METRICS CALCULATION -----
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const isValidRevenueOrder = (o) => !o.deletedByAdmin && o.status !== "Cancelled" && o.status !== "Return Approved";
    const allValidOrdersAllTime = allOrders.filter(isValidRevenueOrder);

    const calcTrueRevenue = (orderList) => {
       return orderList.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    };

    const getMakingPrice = (productId, size) => {
       if (!productId || !mongoose.Types.ObjectId.isValid(productId)) return 0;
       const variant = allVariants.find(v => String(v.productId) === String(productId) && v.size === size);
       if (variant && variant.makingPrice > 0) return variant.makingPrice;
       const product = allBaseProducts.find(p => String(p._id) === String(productId));
       if (product && product.makingPrice > 0) return product.makingPrice;
       return 0;
    };

    const calcTrueProfit = (orderList) => {
       return orderList.reduce((acc, o) => {
          let totalMakingCost = 0;
          if (o.cartItems && Array.isArray(o.cartItems)) {
             o.cartItems.forEach(item => {
                const storedMakingPrice = item.makingPrice || 0;
                const actualMakingPrice = storedMakingPrice > 0 ? storedMakingPrice : getMakingPrice(item.productId, item.size);
                totalMakingCost += actualMakingPrice * (item.quantity || 1);
             });
          }
          return acc + (o.totalAmount || 0) - totalMakingCost;
       }, 0);
    };

    const totalRevenueAllTime = calcTrueRevenue(allValidOrdersAllTime);
    
    const nonDeletedOrdersAllTime = allOrders.filter(o => !o.deletedByAdmin);
    const totalOrdersAllTime = nonDeletedOrdersAllTime.length;

    const netProfitAllTime = calcTrueProfit(allValidOrdersAllTime);
    const activeCustomersAllTime = allCustomers.length;

    const thisMonthOrders = allValidOrdersAllTime.filter(o => new Date(o.createdAt) >= currentMonthStart);
    const lastMonthOrders = allValidOrdersAllTime.filter(o => {
       const d = new Date(o.createdAt);
       return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const revThisMonth = calcTrueRevenue(thisMonthOrders);
    const revLastMonth = calcTrueRevenue(lastMonthOrders);
    const revChange = revLastMonth === 0 ? (revThisMonth > 0 ? 100 : 0) : ((revThisMonth - revLastMonth) / revLastMonth) * 100;

    const ordThisMonthOrders = nonDeletedOrdersAllTime.filter(o => new Date(o.createdAt) >= currentMonthStart);
    const ordLastMonthOrders = nonDeletedOrdersAllTime.filter(o => {
       const d = new Date(o.createdAt);
       return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const ordThisMonth = ordThisMonthOrders.length;
    const ordLastMonth = ordLastMonthOrders.length;
    const ordChange = ordLastMonth === 0 ? (ordThisMonth > 0 ? 100 : 0) : ((ordThisMonth - ordLastMonth) / ordLastMonth) * 100;

    const profThisMonth = calcTrueProfit(thisMonthOrders);
    const profLastMonth = calcTrueProfit(lastMonthOrders);
    const profChange = profLastMonth === 0 ? (profThisMonth > 0 ? 100 : 0) : ((profThisMonth - profLastMonth) / Math.abs(profLastMonth)) * 100;

    const custThisMonth = allCustomers.filter(c => new Date(c.createdAt) >= currentMonthStart).length;
    const custLastMonth = allCustomers.filter(c => {
       const d = new Date(c.createdAt);
       return d >= lastMonthStart && d <= lastMonthEnd;
    }).length;
    const custChange = custLastMonth === 0 ? (custThisMonth > 0 ? 100 : 0) : ((custThisMonth - custLastMonth) / custLastMonth) * 100;

    const cardStats = {
       totalRevenue: { value: totalRevenueAllTime, change: Number(revChange.toFixed(1)) },
       totalOrders: { value: totalOrdersAllTime, change: Number(ordChange.toFixed(1)) },
       netProfit: { value: netProfitAllTime, change: Number(profChange.toFixed(1)) },
       activeCustomers: { value: activeCustomersAllTime, change: Number(custChange.toFixed(1)) }
    };
    // ------------------------------------------

    const activeOrders = orders.filter(o => 
      !o.deletedByAdmin && 
      !["Cancelled", "Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(o.status)
    );
    const activeOrdersCount = activeOrders.length;
    
    const nonDeletedOrders = orders.filter(o => !o.deletedByAdmin);
    
    // Only count completed/valid orders for income
    const revenueOrders = nonDeletedOrders.filter(o => o.status !== "Cancelled" && o.status !== "Return Approved");
    const totalIncome = revenueOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalSalesCount = revenueOrders.length;

    const historicalDataMap = {};
    let dateKeyFn;
    
    if (timeline === "today") {
      const formatterHour = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      for (let i = 23; i >= 0; i--) {
        const d = new Date();
        d.setHours(d.getHours() - i);
        d.setMinutes(0);
        const key = formatterHour.format(d);
        historicalDataMap[key] = { date: key, sales: 0, orders: 0, profit: 0 };
      }
      dateKeyFn = (dateObj) => {
        const d = new Date(dateObj);
        d.setMinutes(0);
        return formatterHour.format(d);
      };
    } else if (timeline === "7days") {
      const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = formatter.format(d);
        historicalDataMap[key] = { date: key, sales: 0, orders: 0, profit: 0 };
      }
      dateKeyFn = (dateObj) => formatter.format(new Date(dateObj));
    } else if (timeline === "year" || timeline === "all") {
      const formatterMonth = new Intl.DateTimeFormat('en-GB', { month: 'short', year: '2-digit' });
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = formatterMonth.format(d);
        historicalDataMap[key] = { date: key, sales: 0, orders: 0, profit: 0 };
      }
      dateKeyFn = (dateObj) => formatterMonth.format(new Date(dateObj));
    } else {
      const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = formatter.format(d);
        historicalDataMap[key] = { date: key, sales: 0, orders: 0, profit: 0 };
      }
      dateKeyFn = (dateObj) => formatter.format(new Date(dateObj));
    }

    const allValidOrders = orders.filter(o => !o.deletedByAdmin && o.status !== "Cancelled");
    allValidOrders.forEach(o => {
      if (!o.createdAt) return;
      const dateString = dateKeyFn(o.createdAt);
      if (historicalDataMap[dateString]) {
        historicalDataMap[dateString].sales += (o.totalAmount || 0);
        historicalDataMap[dateString].orders += 1;
        
        let totalMakingCost = 0;
        if (o.cartItems && Array.isArray(o.cartItems)) {
          o.cartItems.forEach(item => {
            const storedMakingPrice = item.makingPrice || 0;
            const actualMakingPrice = storedMakingPrice > 0 ? storedMakingPrice : getMakingPrice(item.productId, item.size);
            totalMakingCost += actualMakingPrice * (item.quantity || 1);
          });
        }
        const orderProfit = (o.totalAmount || 0) - totalMakingCost;
        historicalDataMap[dateString].profit += orderProfit;
      }
    });

    const historicalData = Object.values(historicalDataMap);

    let totalProfitThisMonth = 0;
    const thisMonthRevenue = allValidOrders.reduce((acc, o) => {
      if (o.cartItems && Array.isArray(o.cartItems)) {
        o.cartItems.forEach(item => {
          const itemPrice = item.price || 0;
          const itemMakingPrice = item.makingPrice || 0;
          totalProfitThisMonth += (itemPrice - itemMakingPrice) * (item.quantity || 1);
        });
      }
      return acc + (o.totalAmount || 0);
    }, 0);

    res.json({
      cardStats,
      totalSales: totalSalesCount,
      totalIncome,
      activeOrders: activeOrdersCount,
      totalProducts,
      latestArrivalsCount,
      bestSellersCount,
      totalCustomers,
      topProducts,
      historicalData,
      totalProfitThisMonth,
      recentOrders: recentOrders.map(order => ({
        ...order,
        customerName: order.customerId ? order.customerId.name : (order.customerName || "Unknown Customer")
      }))
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    console.error("Dashboard Stats Error:", error); res.status(500).json({ error: "Failed to fetch dashboard stats", details: error.message, stack: error.stack });
  }
});

router.get("/api/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    res.status(500).json({ error: "Failed to fetch admin reviews" });
  }
});

router.delete("/api/admin/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Failed to delete review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

router.put("/api/admin/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, author, location } = req.body;

    const updatedData = {};
    if (rating !== undefined) updatedData.rating = rating;
    if (title !== undefined) updatedData.title = title;
    if (comment !== undefined) updatedData.comment = comment;
    if (author !== undefined) updatedData.author = author;
    if (location !== undefined) updatedData.location = location;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No fields to update provided." });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Invalidate product cache to ensure updated reviews show immediately on the storefront
    invalidateProductsCache(review.productId);

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Failed to update review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

export default router;
