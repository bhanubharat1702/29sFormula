import express from "express";
import Customer from "../models/Customer.js";
import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Generate 6 digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/api/customers/request-autofill-otp", async (req, res) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
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
      { upsert: true, new: true }
    );

    // Send email
    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"29sFORMULA" <${emailUser}>`,
        replyTo: emailUser,
        to: customer.email,
        subject: "Your 29sFORMULA Verification Code",
        text: `Hello ${customer.name || 'Customer'},\n\nPlease use the verification code below to autofill your checkout details. This code will expire in 5 minutes.\n\nCode: ${otpCode}\n\nIf you didn't request this code, you can safely ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
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
      };

      transporter.sendMail(mailOptions).catch(err => console.error("Failed to send OTP email:", err));
    } else {
      console.warn("Email credentials not set. Logging OTP instead:", otpCode);
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Failed to request autofill OTP:", error);
    res.status(500).json({ error: "Failed to request OTP" });
  }
});

router.post("/api/customers/verify-autofill-otp", async (req, res) => {
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

router.get("/api/customers/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    
    // Search by email or phone
    const customer = await Customer.findOne({
      $or: [
        { email: new RegExp(`^${query}$`, 'i') },
        { phone: query }
      ]
    });
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    res.json(customer);
  } catch (error) {
    console.error("Failed to search customer:", error);
    res.status(500).json({ error: "Failed to search customer" });
  }
});

router.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ totalSpend: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Failed to retrieve customers:", error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
});

router.delete("/api/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;
