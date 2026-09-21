import express from "express";
import Customer from "../models/Customer.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Otp from "../models/Otp.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/emailService.js";
import { getBrandInfo } from "../utils/brandHelper.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { otpLimiter } from "../middleware/rateLimiter.js";

dotenv.config();

const router = express.Router();

// Generate 6 digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/api/customers/request-autofill-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if customer exists
    const customer = await Customer.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (!customer) {
      return res.status(404).json({ error: "Not registered with us" });
    }

    // Generate and store OTP
    const otpCode = generateOtp();
    await Otp.findOneAndUpdate(
      { email: customer.email }, // Use consistent email formatting
      { otp: otpCode, createdAt: Date.now() },
      { upsert: true, returnDocument: 'after' }
    );

    const { brandName } = await getBrandInfo();
    await sendEmail({
      to: customer.email,
      subject: `Your ${brandName} Verification Code`,
      text: `Hello ${customer.name || 'Customer'},\n\nPlease use the verification code below to autofill your checkout details for ${brandName}. This code will expire in 5 minutes.\n\nCode: ${otpCode}\n\nIf you didn't request this code, you can safely ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Your ${brandName} Verification Code</h2>
          <p style="color: #555; font-size: 16px;">Hello ${customer.name || 'Customer'},</p>
          <p style="color: #555; font-size: 16px;">Please use the verification code below to autofill your checkout details. This code will expire in 5 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 28px; font-weight: bold; background-color: #f4f4f4; border-radius: 8px; letter-spacing: 4px; color: #111;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #777; font-size: 14px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Failed to request autofill OTP:", error);
    res.status(500).json({ error: error.message || "Failed to send OTP email. Please try again." });
  }
});

router.post("/api/customers/verify-autofill-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email: new RegExp(`^${email}$`, 'i'), otp });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // OTP verified, fetch customer data
    const customer = await Customer.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json(customer);
  } catch (error) {
    console.error("Failed to verify autofill OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

router.get("/api/customers/search", verifyToken, isAdmin, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    
    const cleanQuery = String(query).trim();
    const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1. Search Customer model
    let customer = await Customer.findOne({
      $or: [
        { email: new RegExp(`^${escapedQuery}$`, 'i') },
        { phone: cleanQuery }
      ]
    }).lean();

    // 2. Search User model
    const userAcc = await User.findOne({
      $or: [
        { email: new RegExp(`^${escapedQuery}$`, 'i') },
        { phone: cleanQuery }
      ]
    }).lean();

    // 3. Search latest Order
    const lastOrder = await Order.findOne({
      $or: [
        { customerEmail: new RegExp(`^${escapedQuery}$`, 'i') },
        { customerPhone: cleanQuery }
      ]
    }).sort({ _id: -1 }).lean();

    if (!customer && !userAcc && !lastOrder) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const mergedName = customer?.name || userAcc?.name || lastOrder?.customerName || "";
    const mergedEmail = customer?.email || userAcc?.email || lastOrder?.customerEmail || cleanQuery;
    const mergedPhone = customer?.phone || userAcc?.phone || lastOrder?.customerPhone || "";
    const mergedAddress = customer?.address || lastOrder?.shippingAddress || "";

    res.json({
      _id: customer?._id || userAcc?._id || lastOrder?._id,
      name: mergedName,
      email: mergedEmail,
      phone: mergedPhone,
      address: mergedAddress
    });
  } catch (error) {
    console.error("Failed to search customer:", error);
    res.status(500).json({ error: "Failed to search customer" });
  }
});

router.get("/api/customers", verifyToken, isAdmin, async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ totalSpend: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Failed to retrieve customers:", error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
});

router.get("/api/cart", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    const customer = await Customer.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') });
    if (!customer) {
      return res.json({ cart: [] });
    }
    res.json({ cart: customer.cart || [] });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

router.post("/api/cart", async (req, res) => {
  try {
    const { email, cart } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const cartItems = Array.isArray(cart) ? cart : [];

    let customer = await Customer.findOne({ email: new RegExp(`^${cleanEmail}$`, 'i') });
    if (customer) {
      customer.cart = cartItems;
      await customer.save();
    } else {
      customer = await Customer.create({
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        cart: cartItems
      });
    }
    res.json({ success: true, cart: customer.cart });
  } catch (error) {
    console.error("Failed to save cart:", error);
    res.status(500).json({ error: "Failed to save cart" });
  }
});

export default router;
