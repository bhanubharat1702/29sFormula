import express from "express";
import DemoRequest from "../models/DemoRequest.js";
import { dispatchCommunicationEvent } from "./superadmin/communications.js";

const router = express.Router();

// POST /api/platform/demo-request - Merchant demo request from landing page
router.post("/api/platform/demo-request", async (req, res) => {
  try {
    const {
      storeName,
      ownerName,
      email,
      phone,
      subdomain,
      businessType,
      currentWebsite,
      monthlyOrders,
      message,
      preferredTime,
      utmSource
    } = req.body;

    if (!storeName || !ownerName || !email || !phone) {
      return res.status(400).json({ error: "Store Name, Owner Name, Email, and Phone are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanWebsite = (currentWebsite || "").trim();

    // Check duplicate lead detection by email or website domain within existing requests
    const existingLead = await DemoRequest.findOne({
      $or: [
        { email: cleanEmail },
        ...(cleanWebsite ? [{ currentWebsite: cleanWebsite }] : [])
      ]
    });
    const isDuplicate = !!existingLead;

    // Calculate lead score based on order volume, website, and info completeness
    let leadScore = 40;
    if (monthlyOrders === "2000+") leadScore += 50;
    else if (monthlyOrders === "500-2000") leadScore += 35;
    else if (monthlyOrders === "50-500") leadScore += 20;
    else if (monthlyOrders === "< 50") leadScore += 5;

    if (cleanWebsite) leadScore += 10;
    if (message && message.length > 20) leadScore += 5;
    if (leadScore > 100) leadScore = 100;

    // Set priority based on score
    let priority = "Medium";
    if (leadScore >= 80) priority = "Urgent";
    else if (leadScore >= 65) priority = "High";
    else if (leadScore < 45) priority = "Low";

    const newRequest = await DemoRequest.create({
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      subdomain: subdomain ? subdomain.toLowerCase().trim() : "",
      businessType: businessType || "Retail",
      currentWebsite: cleanWebsite,
      monthlyOrders: monthlyOrders || "< 50",
      message: message || "",
      preferredTime: preferredTime || "Morning (9 AM - 12 PM)",
      utmSource: utmSource || "Direct / Landing Page",
      status: "New",
      pipelineStage: "New",
      leadScore,
      priority,
      isDuplicate,
      timeline: [
        {
          action: "Lead Submitted",
          details: `Demo request submitted via ${utmSource || "Landing Page"}${isDuplicate ? " (Flagged as Duplicate)" : ""}`,
          performedBy: "Prospect Lead",
          timestamp: new Date()
        }
      ]
    });

    // Dispatch Communication Event (Demo Confirmation)
    dispatchCommunicationEvent({
      category: "demo confirmation",
      recipientEmail: cleanEmail,
      storeName: storeName.trim(),
      variables: {
        store_name: storeName.trim(),
        owner_name: ownerName.trim(),
        plan: "Trial / Demo"
      },
      channel: "email"
    }).catch(err => console.error("Communication dispatch error:", err));

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
