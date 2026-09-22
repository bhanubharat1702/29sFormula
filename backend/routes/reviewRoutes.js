import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { Product } from "../models/Product.js";
import { getPaginationParams, buildPaginatedResponse, setPaginationHeaders } from "../utils/paginationHelper.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema } from "../utils/schemas.js";

const router = express.Router();

router.get("/api/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    let objId;
    try {
      objId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const { page, limit, skip, cursor, isExplicitPagination } = getPaginationParams(req, 10, 50);

    const filter = { productId: objId };
    if (cursor) {
      filter._id = { $lt: cursor };
    }

    // Get total review count and rating aggregation
    const total = await Review.countDocuments({ productId: objId });
    
    if (total === 0) {
      setPaginationHeaders(res, 0, page, limit);
      const emptyRes = {
        reviews: [],
        average: 0,
        total: 0,
        breakdown: [
          { stars: 5, percentage: 0, count: 0 },
          { stars: 4, percentage: 0, count: 0 },
          { stars: 3, percentage: 0, count: 0 },
          { stars: 2, percentage: 0, count: 0 },
          { stars: 1, percentage: 0, count: 0 },
        ]
      };
      if (isExplicitPagination) {
        return res.json({ ...emptyRes, ...buildPaginatedResponse([], 0, page, limit) });
      }
      return res.json(emptyRes);
    }

    // Compute rating breakdown efficiently without loading all text reviews
    const stats = await Review.aggregate([
      { $match: { productId: objId } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
          sumRating: { $sum: "$rating" }
        }
      }
    ]);

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    stats.forEach(s => {
      const star = Math.min(5, Math.max(1, Math.round(s._id)));
      counts[star] = (counts[star] || 0) + s.count;
      sum += s.sumRating;
    });

    const average = parseFloat((sum / total).toFixed(1));
    const breakdown = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars] || 0,
      percentage: Math.round(((counts[stars] || 0) / total) * 100)
    }));

    // Fetch paginated reviews for this page
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(cursor ? 0 : skip)
      .limit(limit)
      .lean();

    setPaginationHeaders(res, total, page, limit);
    const nextCursor = reviews.length > 0 ? String(reviews[reviews.length - 1]._id) : null;

    const responsePayload = {
      reviews,
      average,
      total,
      breakdown,
      ...(isExplicitPagination ? buildPaginatedResponse(reviews, total, page, limit, nextCursor).pagination : {})
    };

    res.json(responsePayload);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/api/reviews", validate(createReviewSchema), async (req, res) => {
  try {
    const { productId, author, rating, comment, title, location, images } = req.body;

    let objId;
    try {
      objId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const avatarBgs = ["#fef08a", "#ffe4e6", "#ffedd5", "#f1f5f9", "#e0f2fe", "#f3e8ff"];
    const avatarColors = ["#854d0e", "#9f1239", "#9a3412", "#334155", "#0369a1", "#6b21a8"];
    const randomIndex = Math.floor(Math.random() * avatarBgs.length);

    const authorName = String(author).trim();
    const avatarInitial = authorName.charAt(0).toUpperCase();

    const newReview = new Review({
      productId: objId,
      author: authorName,
      avatar: avatarInitial,
      avatarBg: avatarBgs[randomIndex],
      avatarColor: avatarColors[randomIndex],
      location: location || "IN",
      rating: numRating,
      comment: String(comment).trim(),
      title: title ? String(title).trim() : "",
      images: Array.isArray(images) ? images : [],
      verified: true,
      helpful: 0
    });

    await newReview.save();
    console.log(`Saved new review for product ${productId} by ${authorName}`);

    const reviews = await Review.find({ productId: objId }).sort({ createdAt: -1 });
    const total = reviews.length;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
      sum += r.rating;
    });

    const average = parseFloat((sum / total).toFixed(1));
    const breakdown = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars],
      percentage: Math.round((counts[stars] / total) * 100)
    }));

    res.status(201).json({
      message: "Review added successfully",
      newReview,
      reviews,
      average,
      total,
      breakdown
    });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
});

router.post("/api/reviews/:reviewId/helpful", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { increment } = req.body;
    const change = increment === false ? -1 : 1;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: change } },
      { returnDocument: "after" }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Helpful count updated", helpful: Math.max(0, review.helpful) });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    res.status(500).json({ error: "Failed to update helpful count" });
  }
});

export default router;
