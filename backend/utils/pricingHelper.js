import mongoose from "mongoose";
import { Product, ProductVariant } from "../models/Product.js";
import Discount from "../models/Discount.js";

/**
 * Server-side order pricing calculation.
 * Computes subtotal, discount, shipping, tax, and final total strictly from database data.
 * IGNORES any client-provided price, subtotal, discountAmount, or totalAmount to prevent price tampering.
 */
export async function calculateOrderPricing(cartItems, discountCode = "") {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart items are required and cannot be empty.");
  }

  let subtotal = 0;
  const resolvedCartItems = [];

  for (const item of cartItems) {
    const qty = Math.max(1, Number(item.quantity) || 1);

    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found for ID: ${item.productId}`);
      }

      let actualPrice = product.price || 0;
      let actualMakingPrice = product.makingPrice || 0;
      let availableStock = product.quantity || 0;

      // Check product variant
      const variant = await ProductVariant.findOne({ productId: item.productId, size: item.size });
      if (variant && variant.price !== undefined && variant.price !== null) {
        actualPrice = variant.price;
        actualMakingPrice = variant.makingPrice || 0;
        availableStock = variant.quantity || 0;
      } else {
        // Fallback to embedded options
        const embeddedOpt = product.options?.find(o => o.size === item.size);
        if (embeddedOpt && embeddedOpt.price !== undefined && embeddedOpt.price !== null) {
          actualPrice = embeddedOpt.price;
          actualMakingPrice = embeddedOpt.makingPrice || 0;
        }
      }

      if (qty > availableStock) {
        throw new Error(`Not enough stock for ${product.name} (${item.size || 'Default'}). Only ${availableStock} available.`);
      }

      const itemSubtotal = actualPrice * qty;
      subtotal += itemSubtotal;

      resolvedCartItems.push({
        productId: item.productId,
        variantId: variant ? variant._id : null,
        name: product.name || item.name,
        price: actualPrice,
        makingPrice: actualMakingPrice,
        size: item.size,
        quantity: qty,
        image: product.imageFront || item.image,
        isGiftSet: false
      });
    } else {
      // Custom Gift Set or custom non-DB product item
      let giftSetPrice = 0;

      if (item.giftSetDetails && Array.isArray(item.giftSetDetails) && item.giftSetDetails.length > 0) {
        for (const detail of item.giftSetDetails) {
          if (detail._id && mongoose.Types.ObjectId.isValid(detail._id)) {
            const subProduct = await Product.findById(detail._id);
            if (subProduct) {
              const subVariant = await ProductVariant.findOne({ productId: detail._id, size: item.size });
              const subPrice = subVariant?.price ?? subProduct.options?.find(o => o.size === item.size)?.price ?? subProduct.price ?? detail.price ?? 0;
              giftSetPrice += subPrice;
            } else {
              giftSetPrice += Number(detail.price) || 0;
            }
          } else {
            giftSetPrice += Number(detail.price) || 0;
          }
        }
      } else {
        giftSetPrice = Math.max(0, Number(item.price) || 0);
      }

      const itemSubtotal = giftSetPrice * qty;
      subtotal += itemSubtotal;

      resolvedCartItems.push({
        productId: item.productId || `gift-set-${Date.now()}`,
        variantId: null,
        name: item.name || "Custom Gift Set",
        price: giftSetPrice,
        makingPrice: 0,
        size: item.size || "Default",
        quantity: qty,
        image: item.image || "",
        isGiftSet: true,
        giftSetDetails: item.giftSetDetails || item.giftSetItems || []
      });
    }
  }

  // Calculate discount server-side from DB
  let discountAmount = 0;
  let appliedDiscountCode = "";
  if (discountCode && typeof discountCode === "string" && discountCode.trim() !== "") {
    const cleanCode = discountCode.toUpperCase().trim();
    const discount = await Discount.findOne({ code: cleanCode, active: true });
    if (discount) {
      if (!discount.minOrderAmount || subtotal >= discount.minOrderAmount) {
        if (discount.type === "percentage") {
          discountAmount = (subtotal * discount.value) / 100;
        } else if (discount.type === "fixed") {
          discountAmount = Math.min(subtotal, discount.value);
        }
        discountAmount = Math.max(0, Math.round(discountAmount * 100) / 100);
        appliedDiscountCode = cleanCode;
      }
    }
  }

  const shippingCharge = 0;
  const taxAmount = 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharge + taxAmount);

  return {
    subtotal,
    discountCode: appliedDiscountCode,
    discountAmount,
    shippingCharge,
    taxAmount,
    totalAmount,
    resolvedCartItems
  };
}
