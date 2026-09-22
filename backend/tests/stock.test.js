import { Product, ProductVariant } from "../models/Product.js";
import { deductStockAtomically, rollbackStock } from "../utils/stockHelper.js";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./setup.js";

describe("Atomic Stock Deduction & Stock Rollback Test Suite", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await connectTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  describe("deductStockAtomically Function", () => {
    it("should atomically deduct stock for base products when stock is available", async () => {
      const product = await Product.create({
        name: "Oud Royale 50ml",
        imageFront: "https://example.com/oud.jpg",
        price: 3500,
        quantity: 10
      });

      const cartItems = [{ productId: product._id, quantity: 3 }];
      const result = await deductStockAtomically(cartItems);

      expect(result.success).toBe(true);
      expect(result.deducted.length).toBe(1);

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.quantity).toBe(7); // 10 - 3 = 7
    });

    it("should atomically deduct stock for ProductVariant and base Product when size variant is requested", async () => {
      const product = await Product.create({
        name: "Ocean Breeze",
        imageFront: "https://example.com/ocean.jpg",
        price: 2000,
        quantity: 15
      });

      const variant = await ProductVariant.create({
        productId: product._id,
        size: "50ml",
        price: 2000,
        quantity: 8
      });

      const cartItems = [{ productId: product._id, size: "50ml", quantity: 2 }];
      const result = await deductStockAtomically(cartItems);

      expect(result.success).toBe(true);
      expect(result.deducted[0].variantDeducted).toBe(true);

      const updatedVariant = await ProductVariant.findById(variant._id);
      const updatedProduct = await Product.findById(product._id);

      expect(updatedVariant.quantity).toBe(6); // 8 - 2 = 6
      expect(updatedProduct.quantity).toBe(13); // 15 - 2 = 13
    });

    it("should fail stock deduction if requested quantity exceeds available stock", async () => {
      const product = await Product.create({
        name: "Rare Collection",
        imageFront: "https://example.com/rare.jpg",
        price: 5000,
        quantity: 2
      });

      const cartItems = [{ productId: product._id, quantity: 5 }];
      const result = await deductStockAtomically(cartItems);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Not enough stock available for \"Rare Collection\"");

      // Verify stock remained intact
      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.quantity).toBe(2);
    });

    it("should perform automatic rollback of previous items if a subsequent item in a multi-item cart fails stock check", async () => {
      const productInStock = await Product.create({
        name: "Item In Stock",
        imageFront: "https://example.com/instock.jpg",
        price: 1000,
        quantity: 10
      });

      const productOutStock = await Product.create({
        name: "Item Out Of Stock",
        imageFront: "https://example.com/outstock.jpg",
        price: 1500,
        quantity: 1
      });

      const cartItems = [
        { productId: productInStock._id, quantity: 3 },
        { productId: productOutStock._id, quantity: 5 } // Will fail!
      ];

      const result = await deductStockAtomically(cartItems);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Item Out Of Stock");

      // Verify that Item In Stock was automatically ROLLED BACK to 10
      const checkItem1 = await Product.findById(productInStock._id);
      expect(checkItem1.quantity).toBe(10);

      // Verify Item Out Of Stock remained 1
      const checkItem2 = await Product.findById(productOutStock._id);
      expect(checkItem2.quantity).toBe(1);
    });

    it("should prevent double-deduction under concurrent stock deduction attempts", async () => {
      const product = await Product.create({
        name: "Flash Sale Perfume",
        imageFront: "https://example.com/flash.jpg",
        price: 1200,
        quantity: 1 // Only 1 in stock!
      });

      const cartItem = [{ productId: product._id, quantity: 1 }];

      // Simulate 2 concurrent checkout requests for the last 1 item
      const [attempt1, attempt2] = await Promise.all([
        deductStockAtomically(cartItem),
        deductStockAtomically(cartItem)
      ]);

      // Exactly 1 must succeed and 1 must fail
      const successCount = (attempt1.success ? 1 : 0) + (attempt2.success ? 1 : 0);
      const failureCount = (!attempt1.success ? 1 : 0) + (!attempt2.success ? 1 : 0);

      expect(successCount).toBe(1);
      expect(failureCount).toBe(1);

      // Verify final stock is 0 (never negative!)
      const finalProduct = await Product.findById(product._id);
      expect(finalProduct.quantity).toBe(0);
    });
  });

  describe("rollbackStock Function", () => {
    it("should restore stock for deducted base product and variant", async () => {
      const product = await Product.create({
        name: "Citrus Punch",
        imageFront: "https://example.com/citrus.jpg",
        price: 1800,
        quantity: 5
      });

      const variant = await ProductVariant.create({
        productId: product._id,
        size: "30ml",
        price: 1800,
        quantity: 2
      });

      const deductedItems = [
        {
          productId: product._id,
          size: "30ml",
          quantity: 2,
          variantDeducted: true
        }
      ];

      await rollbackStock(deductedItems);

      const restoredVariant = await ProductVariant.findById(variant._id);
      const restoredProduct = await Product.findById(product._id);

      expect(restoredVariant.quantity).toBe(4); // 2 + 2 = 4
      expect(restoredProduct.quantity).toBe(7); // 5 + 2 = 7
    });
  });
});
