import request from "supertest";
import app from "../app.js";
import Discount from "../models/Discount.js";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./setup.js";

describe("Coupon & Discount Validation Test Suite", () => {
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

  describe("POST /api/discounts - Create Coupon", () => {
    it("should create a percentage discount coupon", async () => {
      const res = await request(app)
        .post("/api/discounts")
        .send({
          code: "SAVE20",
          type: "percentage",
          value: 20,
          minOrderAmount: 500
        });

      expect(res.status).toBe(201);
      expect(res.body.code).toBe("SAVE20");
      expect(res.body.value).toBe(20);
      expect(res.body.minOrderAmount).toBe(500);

      const dbCoupon = await Discount.findOne({ code: "SAVE20" });
      expect(dbCoupon).not.toBeNull();
      expect(dbCoupon.active).toBe(true);
    });

    it("should reject creation if code or value is missing", async () => {
      const res = await request(app)
        .post("/api/discounts")
        .send({
          type: "percentage"
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("required");
    });
  });

  describe("GET /api/discounts/validate - Validate Coupon", () => {
    beforeEach(async () => {
      await Discount.create({
        code: "SUMMER10",
        type: "percentage",
        value: 10,
        minOrderAmount: 1000,
        active: true
      });

      await Discount.create({
        code: "FLAT500",
        type: "fixed",
        value: 500,
        minOrderAmount: 2000,
        active: true
      });

      await Discount.create({
        code: "EXPIRED50",
        type: "percentage",
        value: 50,
        minOrderAmount: 0,
        active: false
      });
    });

    it("should return 400 if discount code is missing", async () => {
      const res = await request(app).get("/api/discounts/validate");
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("required");
    });

    it("should return 404 for an invalid / non-existent discount code", async () => {
      const res = await request(app).get("/api/discounts/validate?code=NONEXISTENT");
      expect(res.status).toBe(404);
      expect(res.body.error).toContain("Invalid discount code");
    });

    it("should return 404 for an inactive discount code", async () => {
      const res = await request(app).get("/api/discounts/validate?code=EXPIRED50");
      expect(res.status).toBe(404);
      expect(res.body.error).toContain("Invalid discount code");
    });

    it("should return 400 if subtotal is below minOrderAmount", async () => {
      const res = await request(app).get("/api/discounts/validate?code=SUMMER10&subtotal=500");
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("minimum order of ₹1000");
    });

    it("should validate successfully if subtotal meets minOrderAmount", async () => {
      const res = await request(app).get("/api/discounts/validate?code=SUMMER10&subtotal=1500");
      expect(res.status).toBe(200);
      expect(res.body.code).toBe("SUMMER10");
      expect(res.body.value).toBe(10);
    });

    it("should validate fixed discount coupon when subtotal condition is satisfied", async () => {
      const res = await request(app).get("/api/discounts/validate?code=FLAT500&subtotal=2500");
      expect(res.status).toBe(200);
      expect(res.body.code).toBe("FLAT500");
      expect(res.body.type).toBe("fixed");
      expect(res.body.value).toBe(500);
    });

    it("should handle case-insensitive and trimmed discount codes", async () => {
      const res = await request(app).get("/api/discounts/validate?code=%20summer10%20&subtotal=1200");
      expect(res.status).toBe(200);
      expect(res.body.code).toBe("SUMMER10");
    });
  });
});
