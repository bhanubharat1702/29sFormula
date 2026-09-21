import mongoose from "mongoose";
import { Product, ProductVariant } from "../models/Product.js";

/**
 * Atomically deducts stock for a list of resolved cart items.
 * Uses atomic conditional updates in MongoDB: { quantity: { $gte: requiredQuantity } }
 * If stock is insufficient for any item at the exact millisecond of deduction,
 * rolls back all previously deducted items in the batch and returns error details.
 */
export const deductStockAtomically = async (cartItems, session = null) => {
  const deducted = [];
  const opts = session ? { session } : {};

  for (const item of cartItems) {
    if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
      continue;
    }

    const qtyToDeduct = Number(item.quantity) || 1;
    let deductionSuccessful = false;
    let variantDeducted = false;

    // Check if product has size variants
    if (item.size) {
      const variantExists = await ProductVariant.exists({ productId: item.productId, size: item.size }, opts);
      if (variantExists) {
        // Product has a specific variant for this size -> deduct atomically from variant
        const variantResult = await ProductVariant.updateOne(
          { productId: item.productId, size: item.size, quantity: { $gte: qtyToDeduct } },
          { $inc: { quantity: -qtyToDeduct } },
          opts
        );

        if (variantResult.matchedCount > 0) {
          deductionSuccessful = true;
          variantDeducted = true;
          // Also decrement overall total quantity on base Product document if tracked
          await Product.updateOne(
            { _id: item.productId, quantity: { $gte: qtyToDeduct } },
            { $inc: { quantity: -qtyToDeduct } },
            opts
          );
        }
      }
    }

    // If product has no size variant document, deduct from base Product
    if (!deductionSuccessful && !variantDeducted) {
      const hasAnyVariant = await ProductVariant.exists({ productId: item.productId }, opts);

      if (!hasAnyVariant) {
        const productResult = await Product.updateOne(
          { _id: item.productId, quantity: { $gte: qtyToDeduct } },
          { $inc: { quantity: -qtyToDeduct } },
          opts
        );

        if (productResult.matchedCount > 0) {
          deductionSuccessful = true;
        }
      }
    }

    if (!deductionSuccessful) {
      // Atomic deduction failed — insufficient stock!
      // If not running inside an active transaction session, manually roll back items deducted so far
      if (!session) {
        await rollbackStock(deducted);
      }
      const product = await Product.findById(item.productId, null, opts);
      const productName = product ? product.name : (item.name || "Item");
      return {
        success: false,
        error: `Not enough stock available for "${productName}"${item.size ? ` (${item.size})` : ""}. Someone else may have just purchased the last item!`
      };
    }

    deducted.push({
      productId: item.productId,
      size: item.size,
      quantity: qtyToDeduct,
      variantDeducted
    });
  }

  return { success: true, deducted };
};

/**
 * Restores stock for a list of deducted items (used for order rollback or cancellation).
 */
export const rollbackStock = async (deductedItems, session = null) => {
  const opts = session ? { session } : {};
  for (const item of deductedItems) {
    if (item.variantDeducted && item.size) {
      await ProductVariant.updateOne(
        { productId: item.productId, size: item.size },
        { $inc: { quantity: item.quantity } },
        opts
      );
    }
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { quantity: item.quantity } },
      opts
    );
  }
};
