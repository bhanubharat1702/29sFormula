import mongoose from "mongoose";
import { Product, ProductVariant } from "../models/Product.js";
import Discount from "../models/Discount.js";
import { calculateOrderPricing } from "../utils/pricingHelper.js";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./setup.js";

describe("Checkout Pricing Calculation Test Suite", () => {
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

  it("should calculate correct subtotal and total using database prices, ignoring client tampered prices", async () => {
    const product = await Product.create({
      name: "Luxury Perfume 100ml",
      imageFront: "https://example.com/img1.jpg",
      price: 2500,
      makingPrice: 800,
      quantity: 50,
      category: ["Perfume"]
    });

    const cartItems = [
      {
        productId: product._id.toString(),
        size: "100ml",
        quantity: 2,
        price: 10 // Client trying to cheat and pass Rs.10!
      }
    ];

    const pricing = await calculateOrderPricing(cartItems, "");

    expect(pricing.subtotal).toBe(5000); // 2500 * 2
    expect(pricing.totalAmount).toBe(5000); // Ignored Rs.10 tampered price
    expect(pricing.resolvedCartItems[0].price).toBe(2500);
  });

  it("should calculate pricing using ProductVariant price when variant exists", async () => {
    const product = await Product.create({
      name: "Signature Eau De Parfum",
      imageFront: "https://example.com/img2.jpg",
      price: 1500,
      quantity: 20
    });

    const variant = await ProductVariant.create({
      productId: product._id,
      size: "100ml",
      price: 2200,
      makingPrice: 600,
      quantity: 15
    });

    const cartItems = [
      {
        productId: product._id.toString(),
        size: "100ml",
        quantity: 1,
        price: 100 // Tampered
      }
    ];

    const pricing = await calculateOrderPricing(cartItems, "");

    expect(pricing.subtotal).toBe(2200);
    expect(pricing.totalAmount).toBe(2200);
    expect(pricing.resolvedCartItems[0].variantId.toString()).toBe(variant._id.toString());
  });

  it("should apply percentage discount coupon correctly", async () => {
    const product = await Product.create({
      name: "Velvet Rose Perfume",
      imageFront: "https://example.com/img3.jpg",
      price: 2000,
      quantity: 10
    });

    await Discount.create({
      code: "FESTIVE15",
      type: "percentage",
      value: 15,
      minOrderAmount: 1000,
      active: true
    });

    const cartItems = [
      {
        productId: product._id.toString(),
        quantity: 1
      }
    ];

    const pricing = await calculateOrderPricing(cartItems, "FESTIVE15");

    expect(pricing.subtotal).toBe(2000);
    expect(pricing.discountCode).toBe("FESTIVE15");
    expect(pricing.discountAmount).toBe(300); // 15% of 2000 = 300
    expect(pricing.totalAmount).toBe(1700); // 2000 - 300 = 1700
  });

  it("should apply fixed discount coupon correctly and cap discount at subtotal", async () => {
    const product = await Product.create({
      name: "Pocket Spray 10ml",
      imageFront: "https://example.com/img4.jpg",
      price: 300,
      quantity: 10
    });

    await Discount.create({
      code: "FLAT500",
      type: "fixed",
      value: 500,
      minOrderAmount: 0,
      active: true
    });

    const cartItems = [
      {
        productId: product._id.toString(),
        quantity: 1
      }
    ];

    const pricing = await calculateOrderPricing(cartItems, "FLAT500");

    expect(pricing.subtotal).toBe(300);
    expect(pricing.discountAmount).toBe(300); // Capped at subtotal 300
    expect(pricing.totalAmount).toBe(0);
  });

  it("should NOT apply discount if subtotal is less than coupon minOrderAmount", async () => {
    const product = await Product.create({
      name: "Sample Perfume",
      imageFront: "https://example.com/img5.jpg",
      price: 400,
      quantity: 10
    });

    await Discount.create({
      code: "VIP1000",
      type: "fixed",
      value: 200,
      minOrderAmount: 1000,
      active: true
    });

    const cartItems = [
      {
        productId: product._id.toString(),
        quantity: 1
      }
    ];

    const pricing = await calculateOrderPricing(cartItems, "VIP1000");

    expect(pricing.subtotal).toBe(400);
    expect(pricing.discountCode).toBe("");
    expect(pricing.discountAmount).toBe(0);
    expect(pricing.totalAmount).toBe(400);
  });

  it("should throw error if requested quantity exceeds available DB stock", async () => {
    const product = await Product.create({
      name: "Limited Edition Perfume",
      imageFront: "https://example.com/img6.jpg",
      price: 4000,
      quantity: 2
    });

    const cartItems = [
      {
        productId: product._id.toString(),
        quantity: 5
      }
    ];

    await expect(calculateOrderPricing(cartItems, "")).rejects.toThrow(
      "Not enough stock for Limited Edition Perfume"
    );
  });

  it("should throw error if cart items array is empty", async () => {
    await expect(calculateOrderPricing([], "")).rejects.toThrow(
      "Cart items are required and cannot be empty."
    );
  });

  it("should handle custom gift set items correctly", async () => {
    const subProduct1 = await Product.create({
      name: "Perfume A",
      imageFront: "https://example.com/sub1.jpg",
      price: 1000,
      quantity: 10
    });

    const subProduct2 = await Product.create({
      name: "Perfume B",
      imageFront: "https://example.com/sub2.jpg",
      price: 1200,
      quantity: 10
    });

    const cartItems = [
      {
        name: "Custom Duo Gift Box",
        quantity: 1,
        giftSetDetails: [
          { _id: subProduct1._id.toString() },
          { _id: subProduct2._id.toString() }
        ]
      }
    ];

    const pricing = await calculateOrderPricing(cartItems, "");

    expect(pricing.subtotal).toBe(2200); // 1000 + 1200
    expect(pricing.resolvedCartItems[0].isGiftSet).toBe(true);
  });
});
