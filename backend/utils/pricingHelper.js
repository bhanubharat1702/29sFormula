import mongoose from "mongoose";
import { Product, ProductVariant } from "../models/Product.js";
import Discount from "../models/Discount.js";
import Store from "../models/Store.js";
import { resolveTaxZone, calculateTaxAmount } from "./taxHelper.js";

/**
 * Server-side order pricing calculation with Multi-Currency & Region-Based Tax.
 * Computes subtotal, discount, shipping, line-item tax, and final total strictly from database data.
 * IGNORES any client-provided price, subtotal, discountAmount, or totalAmount to prevent price tampering.
 * 
 * Signature supports:
 *   calculateOrderPricing(cartItems, discountCode, options)
 *   OR calculateOrderPricing({ cartItems, discountCode, shippingAddress, targetCurrency, storeId, exchangeRate })
 */
export async function calculateOrderPricing(cartItemsInput, discountCodeInput = "", optionsInput = {}) {
  let cartItems = cartItemsInput;
  let discountCode = discountCodeInput;
  let options = optionsInput;

  // Handle single object parameter format if passed
  if (cartItemsInput && !Array.isArray(cartItemsInput) && typeof cartItemsInput === "object") {
    cartItems = cartItemsInput.cartItems;
    discountCode = cartItemsInput.discountCode || "";
    options = cartItemsInput.options || cartItemsInput;
  }

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart items are required and cannot be empty.");
  }

  const {
    shippingAddress = {},
    targetCurrency = "",
    storeId = null,
    customExchangeRate = null,
    shippingCharge = 0
  } = options;

  // Determine base currency of store
  let baseCurrency = "USD";
  if (storeId && mongoose.Types.ObjectId.isValid(storeId)) {
    try {
      const store = await Store.findById(storeId).select("currency").lean();
      if (store?.currency) baseCurrency = store.currency;
    } catch (e) {
      console.error("Error fetching store currency:", e);
    }
  }

  const presentmentCurrency = (targetCurrency || baseCurrency).toUpperCase();
  const exchangeRate = customExchangeRate && customExchangeRate > 0
    ? Number(customExchangeRate)
    : (presentmentCurrency === baseCurrency ? 1 : 1.0); // Default 1 if no specific rate provider

  // Resolve dynamic tax zone based on shipping address
  const taxZone = await resolveTaxZone({
    storeId,
    country: shippingAddress.country || shippingAddress.countryCode,
    state: shippingAddress.state || shippingAddress.province || shippingAddress.region,
    postalCode: shippingAddress.postalCode || shippingAddress.zip
  });

  let subtotal = 0;
  let totalTaxAmount = 0;
  const resolvedCartItems = [];

  // Extract all unique valid Product ObjectIds from cart items and gift set details
  const productIds = new Set();
  for (const item of cartItems) {
    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      productIds.add(item.productId.toString());
    }
    if (item.giftSetDetails && Array.isArray(item.giftSetDetails)) {
      for (const detail of item.giftSetDetails) {
        if (detail._id && mongoose.Types.ObjectId.isValid(detail._id)) {
          productIds.add(detail._id.toString());
        }
      }
    }
  }

  const productIdArray = Array.from(productIds);

  // Batch query all products and product variants in single database calls
  const [products, variants] = await Promise.all([
    productIdArray.length > 0 ? Product.find({ _id: { $in: productIdArray } }).lean() : [],
    productIdArray.length > 0 ? ProductVariant.find({ productId: { $in: productIdArray } }).lean() : []
  ]);

  // Store in Maps for O(1) instant memory access
  const productMap = new Map();
  products.forEach(p => productMap.set(p._id.toString(), p));

  const variantMap = new Map();
  variants.forEach(v => variantMap.set(`${v.productId.toString()}_${v.size}`, v));

  for (const item of cartItems) {
    const qty = Math.max(1, Number(item.quantity) || 1);

    if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
      const product = productMap.get(item.productId.toString());
      if (!product) {
        throw new Error(`Product not found for ID: ${item.productId}`);
      }

      let basePrice = product.price || 0;
      let actualMakingPrice = product.makingPrice || 0;
      let availableStock = product.quantity || 0;
      let priceBookEntry = null;

      // Check product variant from Map
      const variant = variantMap.get(`${item.productId.toString()}_${item.size}`);
      if (variant && variant.price !== undefined && variant.price !== null) {
        basePrice = variant.price;
        actualMakingPrice = variant.makingPrice || 0;
        availableStock = variant.quantity || 0;
        if (variant.priceBook && Array.isArray(variant.priceBook)) {
          priceBookEntry = variant.priceBook.find(pb => pb.currency === presentmentCurrency);
        }
      } else {
        // Fallback to embedded options
        const embeddedOpt = product.options?.find(o => o.size === item.size);
        if (embeddedOpt && embeddedOpt.price !== undefined && embeddedOpt.price !== null) {
          basePrice = embeddedOpt.price;
          actualMakingPrice = embeddedOpt.makingPrice || 0;
        }
      }

      // Check product-level priceBook if variant priceBook not found
      if (!priceBookEntry && product.priceBook && Array.isArray(product.priceBook)) {
        priceBookEntry = product.priceBook.find(pb => pb.currency === presentmentCurrency);
      }

      if (qty > availableStock) {
        throw new Error(`Not enough stock for ${product.name} (${item.size || 'Default'}). Only ${availableStock} available.`);
      }

      // Calculate unit price in target presentmentCurrency (using PriceBook if available, else converted)
      let unitPrice = priceBookEntry ? priceBookEntry.price : Math.round(basePrice * exchangeRate * 100) / 100;
      const itemSubtotal = unitPrice * qty;
      subtotal += itemSubtotal;

      // Line item tax calculation
      const taxCalc = calculateTaxAmount(itemSubtotal, taxZone.taxRate, taxZone.isInclusive);
      totalTaxAmount += taxCalc.taxAmount;

      resolvedCartItems.push({
        productId: item.productId,
        variantId: variant ? variant._id : null,
        name: product.name || item.name,
        price: unitPrice,
        makingPrice: actualMakingPrice,
        size: item.size,
        quantity: qty,
        image: product.imageFront || item.image,
        isGiftSet: false,
        taxRate: taxZone.taxRate,
        taxAmount: taxCalc.taxAmount
      });
    } else {
      // Custom Gift Set or custom non-DB product item
      let giftSetPrice = 0;

      if (item.giftSetDetails && Array.isArray(item.giftSetDetails) && item.giftSetDetails.length > 0) {
        for (const detail of item.giftSetDetails) {
          if (detail._id && mongoose.Types.ObjectId.isValid(detail._id)) {
            const subProduct = productMap.get(detail._id.toString());
            if (subProduct) {
              const subVariant = variantMap.get(`${detail._id.toString()}_${item.size}`);
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

      const unitPrice = Math.round(giftSetPrice * exchangeRate * 100) / 100;
      const itemSubtotal = unitPrice * qty;
      subtotal += itemSubtotal;

      const taxCalc = calculateTaxAmount(itemSubtotal, taxZone.taxRate, taxZone.isInclusive);
      totalTaxAmount += taxCalc.taxAmount;

      resolvedCartItems.push({
        productId: item.productId || `gift-set-${Date.now()}`,
        variantId: null,
        name: item.name || "Custom Gift Set",
        price: unitPrice,
        makingPrice: 0,
        size: item.size || "Default",
        quantity: qty,
        image: item.image || "",
        isGiftSet: true,
        giftSetDetails: item.giftSetDetails || item.giftSetItems || [],
        taxRate: taxZone.taxRate,
        taxAmount: taxCalc.taxAmount
      });
    }
  }

  // Calculate discount server-side from DB
  let discountAmount = 0;
  let appliedDiscountCode = "";
  if (discountCode && typeof discountCode === "string" && discountCode.trim() !== "") {
    const cleanCode = discountCode.toUpperCase().trim();
    const query = { code: cleanCode, active: true };
    if (storeId && mongoose.Types.ObjectId.isValid(storeId)) {
      query.$or = [{ storeId }, { storeId: null }, { storeId: { $exists: false } }];
    }
    const discount = await Discount.findOne(query);
    if (discount) {
      if (!discount.minOrderAmount || subtotal >= discount.minOrderAmount) {
        if (discount.type === "percentage") {
          discountAmount = (subtotal * discount.value) / 100;
        } else if (discount.type === "fixed") {
          const fixedPriceInCurrency = Math.round(discount.value * exchangeRate * 100) / 100;
          discountAmount = Math.min(subtotal, fixedPriceInCurrency);
        }
        discountAmount = Math.max(0, Math.round(discountAmount * 100) / 100);
        appliedDiscountCode = cleanCode;
      }
    }
  }

  const numShippingCharge = Math.max(0, Number(shippingCharge) || 0);
  const roundedTaxAmount = Math.round(totalTaxAmount * 100) / 100;

  // Compute final total based on whether tax is inclusive (VAT) or exclusive (Sales Tax)
  let totalAmount = 0;
  if (taxZone.isInclusive) {
    // VAT / Inclusive: subtotal already includes tax
    totalAmount = Math.max(0, Math.round((subtotal - discountAmount + numShippingCharge) * 100) / 100);
  } else {
    // Sales Tax / Exclusive: add tax on top of subtotal
    totalAmount = Math.max(0, Math.round((subtotal - discountAmount + numShippingCharge + roundedTaxAmount) * 100) / 100);
  }

  return {
    currency: baseCurrency,
    presentmentCurrency,
    exchangeRate,
    subtotal: Math.round(subtotal * 100) / 100,
    discountCode: appliedDiscountCode,
    discountAmount,
    shippingCharge: numShippingCharge,
    taxAmount: roundedTaxAmount,
    taxRate: taxZone.taxRate,
    taxName: taxZone.taxName,
    taxInclusive: taxZone.isInclusive,
    taxZoneName: taxZone.zoneName,
    totalAmount,
    resolvedCartItems
  };
}
