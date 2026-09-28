import express from "express";
import DemoRequest from "../models/DemoRequest.js";

const router = express.Router();

// POST /api/platform/demo-request - Merchant demo request from landing page
router.post("/api/platform/demo-request", async (req, res) => {
  try {
    const { storeName, ownerName, email, phone, subdomain, businessType, message } = req.body;

    if (!storeName || !ownerName || !email || !phone) {
      return res.status(400).json({ error: "Store Name, Owner Name, Email, and Phone are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const newRequest = await DemoRequest.create({
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      subdomain: subdomain ? subdomain.toLowerCase().trim() : "",
      businessType: businessType || "Retail",
      message: message || ""
    });

    res.status(201).json({
      message: "Thank you for requesting a demo! Our team will contact you within 24 hours.",
      request: newRequest
    });
  } catch (err) {
    console.error("Demo Request Error:", err);
    res.status(500).json({ error: "Failed to submit demo request." });
  }
});

export default router;
