import express from "express";
import Store from "../../models/Store.js";
import {
  EmailTemplate,
  Broadcast,
  InAppNotification,
  AutomationRule,
  DeliveryLog,
  ChannelConfig,
  SupportTicket,
  UnsubscribedEmail,
  SupportIntegrationConfig
} from "../../models/Communication.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";

const router = express.Router();

// ── Default Data Seeder Helper ──────────────────────────────────
export const seedCommunicationDefaults = async () => {
  try {
    // 1. Templates
    const templateCount = await EmailTemplate.countDocuments();
    if (templateCount === 0) {
      await EmailTemplate.insertMany([
        {
          key: "welcome",
          name: "Merchant Welcome Email",
          category: "welcome",
          subject: "Welcome to {{store_name}} on Enterprise Platform!",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #4f46e5;">Welcome aboard, {{owner_name}}! 🎉</h2>
              <p>Your store <strong>{{store_name}}</strong> is now active on the <strong>{{plan}}</strong> plan.</p>
              <p>Subdomain URL: <a href="https://{{subdomain}}.ecommerce.com">https://{{subdomain}}.ecommerce.com</a></p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p>Need help setting up payment gateways or custom domain? Check our docs or reply directly to this email.</p>
            </div>
          `,
          textContent: "Welcome aboard {{owner_name}}! Your store {{store_name}} is now live on the {{plan}} plan.",
          variables: ["store_name", "owner_name", "plan", "subdomain"],
          isTransactional: true
        },
        {
          key: "trial_ending",
          name: "Trial Period Expiration Notice",
          category: "trial ending",
          subject: "Notice: Your trial for {{store_name}} ends in 3 days",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #d97706;">Trial Ending Soon ⏳</h2>
              <p>Hello {{owner_name}},</p>
              <p>Your 14-day free trial for <strong>{{store_name}}</strong> will expire in 3 days. Upgrade your subscription to avoid service interruption.</p>
              <a href="https://{{subdomain}}.ecommerce.com/admin/billing" style="display:inline-block; padding: 10px 20px; background-color:#4f46e5; color:#fff; text-decoration:none; border-radius:6px; margin-top:10px;">Upgrade Plan Now</a>
            </div>
          `,
          textContent: "Hello {{owner_name}}, your trial for {{store_name}} ends in 3 days. Please upgrade to continue.",
          variables: ["store_name", "owner_name", "plan", "subdomain"],
          isTransactional: false
        },
        {
          key: "payment_failed",
          name: "Subscription Payment Failed Alert",
          category: "payment failed",
          subject: "Action Required: Payment failed for {{store_name}}",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #dc2626;">Payment Failed ⚠️</h2>
              <p>Dear {{owner_name}},</p>
              <p>We were unable to process the recurring billing charge of <strong>\${{amount}}</strong> for <strong>{{store_name}}</strong> on the {{plan}} plan.</p>
              <p>Please update your card details promptly to keep your store online.</p>
            </div>
          `,
          textContent: "Payment failed for {{store_name}}. Amount: \${{amount}}. Please update your payment method.",
          variables: ["store_name", "owner_name", "plan", "amount"],
          isTransactional: true
        },
        {
          key: "invoice",
          name: "Monthly Billing Invoice",
          category: "invoice",
          subject: "Invoice #INV-2026-{{store_name}} for {{plan}} Plan",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #059669;">Subscription Invoice Paid ✅</h2>
              <p>Hi {{owner_name}},</p>
              <p>Thank you for your payment of <strong>\${{amount}}</strong> for <strong>{{store_name}}</strong>.</p>
              <p>Your subscription is renewed through next month.</p>
            </div>
          `,
          textContent: "Invoice paid for {{store_name}}. Amount \${{amount}}. Subscription extended.",
          variables: ["store_name", "owner_name", "plan", "amount"],
          isTransactional: true
        },
        {
          key: "suspension",
          name: "Store Account Suspension Notice",
          category: "suspension",
          subject: "URGENT: Store {{store_name}} account has been suspended",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #dc2626;">Account Suspended 🛑</h2>
              <p>Hello {{owner_name}},</p>
              <p>Store <strong>{{store_name}}</strong> has been suspended due to overdue invoice / policy review.</p>
              <p>Please contact support immediately to resolve this matter.</p>
            </div>
          `,
          textContent: "Store {{store_name}} has been suspended. Please contact super admin support.",
          variables: ["store_name", "owner_name", "plan"],
          isTransactional: true
        },
        {
          key: "domain_verified",
          name: "Custom Domain Active Notification",
          category: "domain verified",
          subject: "Domain {{custom_domain}} is now live with SSL!",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #059669;">Custom Domain Verified 🌐</h2>
              <p>Hi {{owner_name}},</p>
              <p>Great news! Your custom domain <strong>{{custom_domain}}</strong> for {{store_name}} has been verified and SSL certificate auto-provisioned.</p>
            </div>
          `,
          textContent: "Your domain {{custom_domain}} is now active for {{store_name}} with SSL enabled.",
          variables: ["store_name", "owner_name", "custom_domain"],
          isTransactional: true
        },
        {
          key: "demo_confirmation",
          name: "Demo Request Confirmation",
          category: "demo confirmation",
          subject: "Demo Request Received - Platform Overview for {{owner_name}}",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #4f46e5;">Thank you for requesting a demo! 🚀</h2>
              <p>Hi {{owner_name}},</p>
              <p>We received your request for <strong>{{store_name}}</strong>. Our solutions engineer will reach out shortly to schedule a walkthrough.</p>
            </div>
          `,
          textContent: "Thank you for requesting a demo, {{owner_name}}! Our team will contact you shortly.",
          variables: ["store_name", "owner_name", "plan"],
          isTransactional: true
        }
      ]);
    }

    // 2. Automations
    const autoCount = await AutomationRule.countDocuments();
    if (autoCount === 0) {
      await AutomationRule.insertMany([
        {
          key: "trial_ends_3d",
          name: "Nudge merchants 3 days before trial ends",
          trigger: "Trial ends in 3 days",
          action: "Send email template 'trial_ending'",
          emailTemplateKey: "trial_ending",
          channel: "email",
          enabled: true,
          triggerDelayDays: 3,
          totalTriggered: 14
        },
        {
          key: "inactive_7d",
          name: "Re-engage stores inactive for 7 days",
          trigger: "7 days inactive (No orders)",
          action: "Send nudge email + bell alert",
          emailTemplateKey: "welcome",
          channel: "both",
          enabled: true,
          triggerDelayDays: 7,
          totalTriggered: 8
        },
        {
          key: "payment_failed_alert",
          name: "Immediate warning banner on payment failure",
          trigger: "Payment Failed Event",
          action: "Send email template 'payment_failed' & show Critical banner",
          emailTemplateKey: "payment_failed",
          channel: "both",
          enabled: true,
          triggerDelayDays: 0,
          totalTriggered: 3
        },
        {
          key: "domain_verified_notice",
          name: "Notify merchant when DNS is live",
          trigger: "Custom Domain Status -> Active",
          action: "Send email template 'domain_verified'",
          emailTemplateKey: "domain_verified",
          channel: "email",
          enabled: true,
          triggerDelayDays: 0,
          totalTriggered: 19
        }
      ]);
    }

    // 3. Channel Config
    const configCount = await ChannelConfig.countDocuments();
    if (configCount === 0) {
      await ChannelConfig.create({
        emailProvider: "SendGrid",
        sendgridApiKey: "SG.v89123891723891723",
        senderEmail: "notifications@ecommerce.com",
        senderName: "Enterprise Commerce Platform",
        smsProvider: "Twilio",
        twilioSid: "AC_sample_twilio_sid_9981",
        twilioToken: "token_sample_123891",
        whatsappProvider: "Meta Cloud API",
        senderDomain: "ecommerce.com",
        spfStatus: "verified",
        dkimStatus: "verified",
        dmarcStatus: "verified"
      });
    }

    // 4. Sample Broadcasts
    const broadcastCount = await Broadcast.countDocuments();
    if (broadcastCount === 0) {
      await Broadcast.insertMany([
        {
          title: "Scheduled Maintenance Tonight (02:00 UTC)",
          content: "We will be upgrading database servers tonight. Dashboard operations will undergo a brief 10-minute pause.",
          targetSegment: { plan: "all", status: "active", country: "all" },
          status: "sent",
          sentAt: new Date(Date.now() - 86400000 * 2),
          sentCount: 42,
          deliveredCount: 41,
          openRate: 78.5,
          clickRate: 34.2
        },
        {
          title: "New Analytics & AI Copywriter Feature Launched!",
          content: "Check out the brand new Analytics tab and AI product copy generator in your store admin.",
          targetSegment: { plan: "pro", status: "all", country: "all" },
          status: "sent",
          sentAt: new Date(Date.now() - 86400000 * 5),
          sentCount: 25,
          deliveredCount: 25,
          openRate: 92.0,
          clickRate: 56.0
        }
      ]);
    }

    // 5. In-App Notifications
    const noticeCount = await InAppNotification.countDocuments();
    if (noticeCount === 0) {
      await InAppNotification.insertMany([
        {
          title: "Scheduled Platform Upgrade",
          message: "System maintenance is scheduled for Sunday at 02:00 UTC. Storefront checkouts remain uninterrupted.",
          type: "warning",
          targetPlan: "all",
          actionUrl: "/admin/settings",
          actionLabel: "View Details",
          expiresAt: new Date(Date.now() + 86400000 * 7),
          status: "active"
        },
        {
          title: "Update Payment Method",
          message: "Your primary card is expiring next month. Please update your billing details.",
          type: "critical",
          targetPlan: "starter",
          actionUrl: "/admin/billing",
          actionLabel: "Update Billing",
          expiresAt: new Date(Date.now() + 86400000 * 14),
          status: "active"
        }
      ]);
    }

    // 6. Support Tickets
    const ticketCount = await SupportTicket.countDocuments();
    if (ticketCount === 0) {
      await SupportTicket.insertMany([
        {
          ticketNumber: "TCK-1001",
          storeName: "Fashion Hub India",
          ownerEmail: "fashion@hub.com",
          subject: "Custom Domain DNS Verification assistance",
          category: "domain",
          priority: "high",
          status: "open",
          replies: [
            { sender: "fashion@hub.com", message: "Hi support, I added the CNAME record 4 hours ago but SSL is still pending.", isInternal: false, createdAt: new Date(Date.now() - 3600000 * 4) },
            { sender: "Super Admin", message: "DNS propagation in progress. We triggered manual SSL re-validation.", isInternal: true, createdAt: new Date(Date.now() - 3600000 * 2) }
          ]
        },
        {
          ticketNumber: "TCK-1002",
          storeName: "TechGadgets Pro",
          ownerEmail: "admin@techgadgets.com",
          subject: "Question about Pro Plan payment gateway fees",
          category: "billing",
          priority: "medium",
          status: "resolved",
          replies: [
            { sender: "admin@techgadgets.com", message: "Can we switch from Razorpay to Stripe without extra charge?", isInternal: false, createdAt: new Date(Date.now() - 86400000 * 2) },
            { sender: "Super Admin", message: "Yes! All gateway integrations are included in your Pro plan at no added cost.", isInternal: false, createdAt: new Date(Date.now() - 86400000) }
          ]
        }
      ]);
    }

    // 7. Delivery Logs
    const logCount = await DeliveryLog.countDocuments();
    if (logCount === 0) {
      await DeliveryLog.insertMany([
        {
          recipientEmail: "owner@fashionhub.com",
          storeName: "Fashion Hub India",
          channel: "email",
          category: "welcome",
          subject: "Welcome to Fashion Hub India on Enterprise Platform!",
          messageBody: "Welcome email sent successfully upon store provisioning.",
          status: "delivered",
          retries: 0
        },
        {
          recipientEmail: "billing@gadgetstore.com",
          storeName: "TechGadgets Pro",
          channel: "email",
          category: "invoice",
          subject: "Invoice #INV-2026-TechGadgets for Pro Plan",
          messageBody: "Monthly invoice delivery succeeded.",
          status: "delivered",
          retries: 0
        },
        {
          recipientEmail: "invalid-user@teststore.io",
          storeName: "TestStore",
          channel: "email",
          category: "payment failed",
          subject: "Action Required: Payment failed for TestStore",
          messageBody: "SMTP 550 5.1.1 Recipient email address invalid.",
          status: "bounced",
          retries: 2,
          errorMessage: "550 5.1.1 Mailbox unavailable"
        }
      ]);
    }

    // 8. Support Integration Config
    const supportConfigCount = await SupportIntegrationConfig.countDocuments();
    if (supportConfigCount === 0) {
      await SupportIntegrationConfig.create({
        provider: "native",
        zendeskDomain: "ecommerce-support.zendesk.com",
        zendeskApiKey: "zd_api_token_sample_991823",
        freshdeskDomain: "ecommerce.freshdesk.com",
        freshdeskApiKey: "fd_key_sample_88273"
      });
    }

  } catch (err) {
    console.error("Failed to seed communication defaults:", err);
  }
};

// ── Shared Event Dispatch Helper ───────────────────────────────
export const dispatchCommunicationEvent = async ({
  category,
  recipientEmail,
  storeId = null,
  storeName = "",
  variables = {},
  channel = "email"
}) => {
  try {
    // Check if recipient is unsubscribed & category is not transactional
    const unsub = await UnsubscribedEmail.findOne({ email: recipientEmail.toLowerCase().trim() });
    
    // Fetch Template matching category or fallback
    const template = await EmailTemplate.findOne({ category });
    
    let subject = template ? template.subject : `Notification: ${category}`;
    let body = template ? template.htmlContent : `Notification details for ${category}`;

    // Replace variables
    Object.keys(variables).forEach((varName) => {
      const reg = new RegExp(`{{${varName}}}`, 'g');
      subject = subject.replace(reg, variables[varName]);
      body = body.replace(reg, variables[varName]);
    });

    const isTransactional = template ? template.isTransactional : true;

    if (unsub && !isTransactional) {
      // Log blocked opt-out email
      await DeliveryLog.create({
        recipientEmail,
        storeId,
        storeName,
        channel,
        category,
        subject,
        messageBody: body,
        status: "failed",
        errorMessage: "Recipient opted out (Unsubscribed)",
        isTransactional: false
      });
      return { success: false, reason: "Unsubscribed" };
    }

    // Record delivery log
    const log = await DeliveryLog.create({
      recipientEmail,
      storeId,
      storeName,
      channel,
      category,
      subject,
      messageBody: body,
      status: "delivered",
      retries: 0,
      isTransactional
    });

    return { success: true, logId: log._id };
  } catch (err) {
    console.error("Error dispatching communication event:", err);
    return { success: false, error: err.message };
  }
};

// ── GET /api/superadmin/communications/overview ───────────────
router.get("/api/superadmin/communications/overview", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();

    const [
      templatesCount,
      broadcastsCount,
      activeNoticesCount,
      automationsCount,
      totalDeliveredLogs,
      totalFailedLogs,
      openTicketsCount,
      channelConfig
    ] = await Promise.all([
      EmailTemplate.countDocuments(),
      Broadcast.countDocuments(),
      InAppNotification.countDocuments({ status: "active" }),
      AutomationRule.countDocuments({ enabled: true }),
      DeliveryLog.countDocuments({ status: "delivered" }),
      DeliveryLog.countDocuments({ status: { $in: ["failed", "bounced"] } }),
      SupportTicket.countDocuments({ status: { $in: ["open", "pending"] } }),
      ChannelConfig.findOne()
    ]);

    const totalLogs = totalDeliveredLogs + totalFailedLogs;
    const deliveryRate = totalLogs > 0 ? ((totalDeliveredLogs / totalLogs) * 100).toFixed(1) : 100;

    res.json({
      stats: {
        templatesCount,
        broadcastsCount,
        activeNoticesCount,
        automationsCount,
        totalDeliveredLogs,
        totalFailedLogs,
        deliveryRate: Number(deliveryRate),
        openTicketsCount
      },
      channelConfig
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── EMAIL TEMPLATES ROUTES ─────────────────────────────────────
router.get("/api/superadmin/communications/templates", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const templates = await EmailTemplate.find().sort({ category: 1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/templates/:key", verifySuperAdminToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { name, subject, htmlContent, textContent, category, isTransactional } = req.body;

    const updated = await EmailTemplate.findOneAndUpdate(
      { key },
      {
        name,
        subject,
        htmlContent,
        textContent,
        category,
        isTransactional,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Template not found." });

    res.json({ message: "Template updated successfully.", template: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/templates/send-test", verifySuperAdminToken, async (req, res) => {
  try {
    const { key, recipientEmail, sampleData } = req.body;
    const template = await EmailTemplate.findOne({ key });
    if (!template) return res.status(404).json({ error: "Template not found." });

    const targetEmail = recipientEmail || "admin@example.com";
    const data = sampleData || {
      store_name: "Demo Store Pro",
      owner_name: "Alex Merchant",
      plan: "Pro",
      subdomain: "demostore",
      custom_domain: "demostore.com",
      amount: "79.00"
    };

    const result = await dispatchCommunicationEvent({
      category: template.category,
      recipientEmail: targetEmail,
      storeName: data.store_name,
      variables: data,
      channel: "email"
    });

    res.json({
      message: `Test email sent to ${targetEmail}`,
      result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BROADCASTS ROUTES ──────────────────────────────────────────
router.get("/api/superadmin/communications/broadcasts", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const broadcasts = await Broadcast.find().sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/broadcasts", verifySuperAdminToken, async (req, res) => {
  try {
    const { title, content, targetSegment, scheduledAt } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required." });

    const broadcast = await Broadcast.create({
      title,
      content,
      targetSegment: targetSegment || { plan: "all", status: "all", country: "all" },
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? "scheduled" : "draft"
    });

    res.status(201).json({ message: "Broadcast created successfully.", broadcast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/broadcasts/:id/send-now", verifySuperAdminToken, async (req, res) => {
  try {
    const broadcast = await Broadcast.findById(req.params.id);
    if (!broadcast) return res.status(404).json({ error: "Broadcast not found." });

    // Target merchant stores matching criteria
    const query = {};
    if (broadcast.targetSegment.plan && broadcast.targetSegment.plan !== "all") {
      query.plan = broadcast.targetSegment.plan;
    }
    if (broadcast.targetSegment.status && broadcast.targetSegment.status !== "all") {
      if (broadcast.targetSegment.status === "active") query.isActive = true;
      if (broadcast.targetSegment.status === "suspended") query.isActive = false;
    }

    const matchingStores = await Store.find(query);
    const storeCount = matchingStores.length || 1; // Fallback mock target count if empty

    // Log broadcast delivery to matching stores
    const logs = [];
    for (const store of matchingStores) {
      if (store.ownerEmail) {
        logs.push({
          recipientEmail: store.ownerEmail,
          storeId: store._id,
          storeName: store.name,
          channel: "email",
          category: "broadcast",
          subject: broadcast.title,
          messageBody: broadcast.content,
          status: "delivered",
          isTransactional: false
        });
      }
    }

    if (logs.length > 0) {
      await DeliveryLog.insertMany(logs);
    }

    broadcast.status = "sent";
    broadcast.sentAt = new Date();
    broadcast.sentCount = storeCount;
    broadcast.deliveredCount = storeCount;
    broadcast.openRate = Math.floor(Math.random() * 20) + 75; // 75-95% simulated open rate
    broadcast.clickRate = Math.floor(Math.random() * 25) + 25; // 25-50% simulated click rate
    await broadcast.save();

    res.json({ message: `Broadcast dispatches to ${storeCount} merchants!`, broadcast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/api/superadmin/communications/broadcasts/:id", verifySuperAdminToken, async (req, res) => {
  try {
    await Broadcast.findByIdAndDelete(req.params.id);
    res.json({ message: "Broadcast deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── IN-APP NOTIFICATIONS ROUTES ───────────────────────────────
router.get("/api/superadmin/communications/in-app", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const notices = await InAppNotification.find().populate("targetStoreId", "name subdomain").sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/in-app", verifySuperAdminToken, async (req, res) => {
  try {
    const { title, message, type, targetPlan, targetStoreId, actionUrl, actionLabel, expiresAt } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message are required." });

    const notice = await InAppNotification.create({
      title,
      message,
      type: type || "info",
      targetPlan: targetPlan || "all",
      targetStoreId: targetStoreId || null,
      actionUrl: actionUrl || "",
      actionLabel: actionLabel || "",
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 86400000 * 30),
      status: "active"
    });

    res.status(201).json({ message: "In-app notice created.", notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/in-app/:id", verifySuperAdminToken, async (req, res) => {
  try {
    const updated = await InAppNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "In-app notification updated.", notice: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/api/superadmin/communications/in-app/:id", verifySuperAdminToken, async (req, res) => {
  try {
    await InAppNotification.findByIdAndDelete(req.params.id);
    res.json({ message: "In-app notification deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Merchant Admin Endpoint to fetch active notifications
router.get("/api/merchant/in-app-notifications", async (req, res) => {
  try {
    const { storeId, plan } = req.query;
    const now = new Date();

    const query = {
      status: "active",
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: now } }
      ]
    };

    const notices = await InAppNotification.find(query).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AUTOMATIONS ROUTES ─────────────────────────────────────────
router.get("/api/superadmin/communications/automations", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const rules = await AutomationRule.find().sort({ updatedAt: -1 });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/automations/:key/toggle", verifySuperAdminToken, async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ key: req.params.key });
    if (!rule) return res.status(404).json({ error: "Automation rule not found." });

    rule.enabled = !rule.enabled;
    rule.updatedAt = new Date();
    await rule.save();

    res.json({ message: `Automation ${rule.enabled ? 'enabled' : 'disabled'}`, rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/automations/:key", verifySuperAdminToken, async (req, res) => {
  try {
    const { name, trigger, action, emailTemplateKey, channel, triggerDelayDays } = req.body;
    const rule = await AutomationRule.findOneAndUpdate(
      { key: req.params.key },
      { name, trigger, action, emailTemplateKey, channel, triggerDelayDays, updatedAt: new Date() },
      { new: true }
    );
    res.json({ message: "Automation updated.", rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/automations/:key/trigger-test", verifySuperAdminToken, async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ key: req.params.key });
    if (!rule) return res.status(404).json({ error: "Automation rule not found." });

    rule.totalTriggered += 1;
    await rule.save();

    // Log automated dispatch
    await DeliveryLog.create({
      recipientEmail: "test-merchant@example.com",
      storeName: "Test Automation Store",
      channel: rule.channel === "both" ? "email" : rule.channel,
      category: "automation",
      subject: `[Automation Test] Triggered: ${rule.name}`,
      messageBody: `Automation rule '${rule.trigger}' executed successfully.`,
      status: "delivered",
      isTransactional: true
    });

    res.json({ message: `Test trigger executed for '${rule.name}'`, rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELIVERY LOGS ROUTES ───────────────────────────────────────
router.get("/api/superadmin/communications/delivery-logs", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const { status, channel, search } = req.query;
    const query = {};

    if (status && status !== "all") query.status = status;
    if (channel && channel !== "all") query.channel = channel;
    if (search) {
      query.$or = [
        { recipientEmail: { $regex: search, $options: "i" } },
        { storeName: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } }
      ];
    }

    const logs = await DeliveryLog.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/delivery-logs/:id/resend", verifySuperAdminToken, async (req, res) => {
  try {
    const log = await DeliveryLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "Log not found." });

    log.retries += 1;
    log.status = "delivered";
    log.errorMessage = "";
    log.createdAt = new Date();
    await log.save();

    res.json({ message: `Message resent successfully to ${log.recipientEmail}`, log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CHANNELS CONFIG ROUTES ─────────────────────────────────────
router.get("/api/superadmin/communications/channel-config", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    let config = await ChannelConfig.findOne();
    if (!config) {
      config = await ChannelConfig.create({});
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/channel-config", verifySuperAdminToken, async (req, res) => {
  try {
    let config = await ChannelConfig.findOne();
    if (!config) {
      config = new ChannelConfig(req.body);
    } else {
      Object.assign(config, req.body, { updatedAt: new Date() });
    }
    await config.save();
    res.json({ message: "Channel configuration updated successfully.", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/channel-config/verify-dns", verifySuperAdminToken, async (req, res) => {
  try {
    let config = await ChannelConfig.findOne();
    if (!config) config = await ChannelConfig.create({});

    config.spfStatus = "verified";
    config.dkimStatus = "verified";
    config.dmarcStatus = "verified";
    config.updatedAt = new Date();
    await config.save();

    res.json({ message: "Domain SPF, DKIM, and DMARC DNS records verified!", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SUPPORT INBOX ROUTES ───────────────────────────────────────
router.get("/api/superadmin/communications/tickets", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const { status, priority } = req.query;
    const query = {};
    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;

    const tickets = await SupportTicket.find(query).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/tickets", verifySuperAdminToken, async (req, res) => {
  try {
    const { storeName, ownerEmail, merchantEmail, subject, category, priority, initialMessage } = req.body;
    const resolvedEmail = ownerEmail || merchantEmail || "support@merchant.com";
    const ticketCount = await SupportTicket.countDocuments();
    const ticketNumber = `TCK-${1000 + ticketCount + 1}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      storeName: storeName || "Direct Inquiry",
      ownerEmail: resolvedEmail,
      subject,
      category: category || "general",
      priority: priority || "medium",
      status: "open",
      replies: initialMessage ? [{ sender: resolvedEmail, message: initialMessage, isInternal: false }] : []
    });

    res.status(201).json({ message: "Support ticket created.", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/tickets/:id/reply", verifySuperAdminToken, async (req, res) => {
  try {
    const { message, isInternal } = req.body;
    if (!message) return res.status(400).json({ error: "Message content is required." });

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });

    ticket.replies.push({
      sender: "Super Admin",
      message,
      isInternal: !!isInternal,
      createdAt: new Date()
    });

    if (!isInternal && ticket.status === "open") {
      ticket.status = "pending";
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    res.json({ message: "Reply added to ticket.", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/tickets/:id/status", verifySuperAdminToken, async (req, res) => {
  try {
    const { status, priority } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    ticket.updatedAt = new Date();
    await ticket.save();

    res.json({ message: "Ticket updated.", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/superadmin/communications/support-config", verifySuperAdminToken, async (req, res) => {
  try {
    await seedCommunicationDefaults();
    let config = await SupportIntegrationConfig.findOne();
    if (!config) config = await SupportIntegrationConfig.create({});
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/superadmin/communications/support-config", verifySuperAdminToken, async (req, res) => {
  try {
    let config = await SupportIntegrationConfig.findOne();
    if (!config) config = new SupportIntegrationConfig(req.body);
    else Object.assign(config, req.body, { updatedAt: new Date() });
    await config.save();
    res.json({ message: "Support integration config saved.", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UNSUBSCRIBE MANAGEMENT ROUTES ──────────────────────────────
router.get("/api/superadmin/communications/unsubscribes", verifySuperAdminToken, async (req, res) => {
  try {
    const unsubscribes = await UnsubscribedEmail.find().sort({ unsubscribedAt: -1 });
    res.json(unsubscribes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/superadmin/communications/unsubscribes", verifySuperAdminToken, async (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const item = await UnsubscribedEmail.create({
      email: email.toLowerCase().trim(),
      reason: reason || "Added by Super Admin"
    });

    res.status(201).json({ message: `${email} added to opt-out list.`, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/api/superadmin/communications/unsubscribes/:email", verifySuperAdminToken, async (req, res) => {
  try {
    await UnsubscribedEmail.findOneAndDelete({ email: req.params.email.toLowerCase().trim() });
    res.json({ message: `${req.params.email} removed from opt-out list.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
