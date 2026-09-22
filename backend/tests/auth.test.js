import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import app from "../app.js";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./setup.js";

const JWT_SECRET = process.env.JWT_SECRET || "29sformula_secret_jwt_key_2026";

describe("JWT Auth & Authorization Test Suite", () => {
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

  describe("verifyToken Middleware Unit Tests", () => {
    it("should return 401 if Authorization header is missing", () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("missing") }));
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if Authorization header does not start with Bearer", () => {
      const req = { headers: { authorization: "Basic 12345" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 for an invalid or corrupt token", () => {
      const req = { headers: { authorization: "Bearer invalid.token.value" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Invalid or expired") }));
      expect(next).not.toHaveBeenCalled();
    });

    it("should populate req.user and call next() for a valid token", () => {
      const payload = { id: "user123", email: "test@29sformula.com", isAdmin: false };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.email).toBe("test@29sformula.com");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("isAdmin Middleware Unit Tests", () => {
    it("should return 401 if req.user is undefined", () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if user is not an admin", () => {
      const req = { user: { email: "regular@user.com", isAdmin: false, role: "user" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user has isAdmin: true", () => {
      const req = { user: { email: "admin@user.com", isAdmin: true } };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should call next() if user role is admin", () => {
      const req = { user: { email: "admin@user.com", role: "admin" } };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("Auth Routes Supertest Integration", () => {
    it("POST /api/auth/register - should register a new customer and return JWT", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "SecurePassword123"
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email", "johndoe@example.com");

      // Verify user saved in DB
      const dbUser = await User.findOne({ email: "johndoe@example.com" });
      expect(dbUser).not.toBeNull();
    });

    it("POST /api/auth/login - should authenticate valid user credentials", async () => {
      // Register user first
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Jane Smith",
          email: "jane@example.com",
          password: "MyPassword456"
        });

      // Login
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "jane@example.com",
          password: "MyPassword456"
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email", "jane@example.com");
    });

    it("POST /api/auth/login - should fail with 400 for incorrect password", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Jane Smith",
          email: "jane@example.com",
          password: "MyPassword456"
        });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "jane@example.com",
          password: "WrongPassword"
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });
});
