import express from "express";
import Discount from "../models/Discount.js";
import { getPaginationParams, buildPaginatedResponse, setPaginationHeaders } from "../utils/paginationHelper.js";
import { validate } from "../middleware/validate.js";
import { createDiscountSchema, validateDiscountQuerySchema } from "../utils/schemas.js";

const router = express.Router();

router.get("/api/discounts", async (req, res) => {
  try {
    const { page, limit, skip, cursor, isExplicitPagination } = getPaginationParams(req, 20, 100);

    const filter = {};
    if (cursor) {
      filter._id = { $lt: cursor };
    }

    const total = await Discount.countDocuments(filter);
    const discounts = await Discount.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(cursor ? 0 : skip)
      .limit(limit)
      .lean();

    setPaginationHeaders(res, total, page, limit);
    const nextCursor = discounts.length > 0 ? String(discounts[discounts.length - 1]._id) : null;

    if (isExplicitPagination) {
      return res.json(buildPaginatedResponse(discounts, total, page, limit, nextCursor));
    }

    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch discounts" });
  }
});

router.post("/api/discounts", validate(createDiscountSchema), async (req, res) => {
  try {
    const { code, type, value, minOrderAmount } = req.body;
    const newDiscount = new Discount({
      code: String(code).toUpperCase().trim(),
      type: type || "percentage",
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || 0,
      active: true
    });
    await newDiscount.save();
    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(500).json({ error: "Failed to create discount (code may already exist)." });
  }
});

router.delete("/api/discounts/:id", async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete discount" });
  }
});

router.get("/api/discounts/validate", validate(validateDiscountQuerySchema, "query"), async (req, res) => {
  try {
    const { code, subtotal } = req.query;
    const discount = await Discount.findOne({ code: String(code).toUpperCase().trim(), active: true });
    if (!discount) return res.status(404).json({ error: "Invalid discount code" });
    
    if (discount.minOrderAmount > 0 && subtotal !== undefined) {
      if (Number(subtotal) < discount.minOrderAmount) {
        return res.status(400).json({ error: `This coupon requires a minimum order of ₹${discount.minOrderAmount}` });
      }
    }
    
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: "Failed to validate code" });
  }
});

export default router;
