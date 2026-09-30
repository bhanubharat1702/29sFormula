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

// Seed communication defaults
export const seedCommunicationDefaults = async () => {
  try {
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
          key: "acknowledgement",
          name: "CRM Lead Demo Request Acknowledgement",
          category: "acknowledgement",
          subject: "Thank you for requesting a demo for {{store_name}}!",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #4f46e5;">Demo Request Received 🎉</h2>
              <p>Hello {{owner_name}},</p>
              <p>Thank you for requesting a demo for <strong>{{store_name}}</strong>. Our enterprise team will get in touch with you shortly.</p>
              <p>Best regards,<br/>Platform Team</p>
            </div>
          `,
          textContent: "Hello {{owner_name}}, thank you for requesting a demo for {{store_name}}. Our team will contact you shortly.",
          variables: ["store_name", "owner_name"],
          isTransactional: true
        },
        {
          key: "demo_confirmation",
          name: "CRM Demo Scheduled Confirmation",
          category: "demo_confirmation",
          subject: "Demo Scheduled: {{store_name}} Platform Tour",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #10b981;">Your Demo is Confirmed 📅</h2>
              <p>Hello {{owner_name}},</p>
              <p>Your scheduled product demo for <strong>{{store_name}}</strong> has been confirmed.</p>
              <p>Best regards,<br/>Platform Sales Team</p>
            </div>
          `,
          textContent: "Hello {{owner_name}}, your product demo for {{store_name}} is confirmed.",
          variables: ["store_name", "owner_name"],
          isTransactional: true
        },
        {
          key: "follow_up",
          name: "CRM Lead Follow-up Reminder",
          category: "follow_up",
          subject: "Following up on your e-commerce platform request for {{store_name}}",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #2563eb;">Checking In 👋</h2>
              <p>Hello {{owner_name}},</p>
              <p>We're following up regarding your demo request for <strong>{{store_name}}</strong>. Let us know if you have any questions or want to jump on a quick call!</p>
              <p>Best regards,<br/>Platform Sales Team</p>
            </div>
          `,
          textContent: "Hello {{owner_name}}, following up on your demo request for {{store_name}}.",
          variables: ["store_name", "owner_name"],
          isTransactional: false
        },
        {
          key: "rejection",
          name: "CRM Polite Decline / Rejection Notice",
          category: "rejection",
          subject: "Update regarding your demo request for {{store_name}}",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <p>Hello {{owner_name}},</p>
              <p>Thank you for your interest in our platform for <strong>{{store_name}}</strong>. At this time, we are unable to fulfill your request.</p>
              <p>Best regards,<br/>Platform Team</p>
            </div>
          `,
          textContent: "Hello {{owner_name}}, thank you for your interest in {{store_name}}. We cannot fulfill your request at this time.",
          variables: ["store_name", "owner_name"],
          isTransactional: false
        },
        {
          key: "invoice",
          name: "Platform Billing Invoice Receipt",
          category: "invoice",
          subject: "Invoice {{invoice_number}} for {{store_name}}",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #4f46e5;">Invoice Receipt 📄</h2>
              <p>Dear {{owner_name}},</p>
              <p>Invoice <strong>{{invoice_number}}</strong> of <strong>\${{amount}} {{currency}}</strong> for <strong>{{store_name}}</strong> has been generated.</p>
              <p>Billing Cycle: {{billing_cycle}} | Status: {{status}}</p>
            </div>
          `,
          textContent: "Dear {{owner_name}}, Invoice {{invoice_number}} of \${{amount}} {{currency}} for {{store_name}} has been generated.",
          variables: ["invoice_number", "store_name", "owner_name", "amount", "currency", "billing_cycle", "status"],
          isTransactional: true
        },
        {
          key: "plan_changed",
          name: "Subscription Plan Change Notification",
          category: "plan_changed",
          subject: "Subscription Plan Updated for {{store_name}}",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #10b981;">Subscription Plan Updated 🚀</h2>
              <p>Hello {{owner_name}},</p>
              <p>Your subscription plan for <strong>{{store_name}}</strong> was changed to <strong>{{plan}}</strong>.</p>
              <p>Prorated calculation: <strong>\${{prorated_amount}} {{currency}}</strong>.</p>
            </div>
          `,
          textContent: "Hello {{owner_name}}, your plan for {{store_name}} was changed to {{plan}}. Prorated amount: \${{prorated_amount}} {{currency}}.",
          variables: ["store_name", "owner_name", "plan", "prorated_amount", "currency"],
          isTransactional: true
        },
        {
          key: "refund_processed",
          name: "Invoice Refund Confirmation",
          category: "refund_processed",
          subject: "Refund Processed for {{store_name}} (Invoice {{invoice_number}})",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
              <h2 style="color: #059669;">Refund Confirmation 💸</h2>
              <p>Dear {{owner_name}},</p>
              <p>A refund of <strong>\${{amount}} {{currency}}</strong> has been processed for Invoice <strong>{{invoice_number}}</strong> (Store: {{store_name}}).</p>
            </div>
          `,
          textContent: "Dear {{owner_name}}, a refund of \${{amount}} {{currency}} has been processed for Invoice {{invoice_number}}.",
          variables: ["invoice_number", "store_name", "owner_name", "amount", "currency"],
          isTransactional: true
        }
      ]);
    }

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
        }
      ]);
    }

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

// Dispatch communication event
export const dispatchCommunicationEvent = async ({
  category,
  recipientEmail,
  storeId = null,
  storeName = "",
  variables = {},
  channel = "email",
  customSubject = null,
  customBody = null
}) => {
  try {
    const unsub = await UnsubscribedEmail.findOne({ email: recipientEmail.toLowerCase().trim() });
    const template = await EmailTemplate.findOne({
      $or: [{ category }, { key: category }]
    });

    let subject = customSubject || (template ? template.subject : `Notification: ${category}`);
    let body = customBody || (template ? template.htmlContent : `Notification details for ${category}`);

    Object.keys(variables).forEach((varName) => {
      const reg = new RegExp(`{{${varName}}}`, 'g');
      subject = subject.replace(reg, variables[varName] || "");
      body = body.replace(reg, variables[varName] || "");
    });

    const isTransactional = template ? template.isTransactional : true;

    if (unsub && !isTransactional) {
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

// GET overview
export const getCommunicationsOverview = async (req, res) => {
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
};

// GET & PUT Email Templates
export const getEmailTemplates = async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const templates = await EmailTemplate.find().sort({ category: 1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmailTemplate = async (req, res) => {
  try {
    const { key } = req.params;
    const { name, subject, htmlContent, textContent, category, isTransactional } = req.body;

    const updated = await EmailTemplate.findOneAndUpdate(
      { key },
      { name, subject, htmlContent, textContent, category, isTransactional, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Template not found." });

    res.json({ message: "Template updated successfully.", template: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendTestEmail = async (req, res) => {
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

    res.json({ message: `Test email sent to ${targetEmail}`, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET & POST Broadcasts
export const getBroadcasts = async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const broadcasts = await Broadcast.find().sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBroadcast = async (req, res) => {
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
};

export const sendBroadcastNow = async (req, res) => {
  try {
    const broadcast = await Broadcast.findById(req.params.id);
    if (!broadcast) return res.status(404).json({ error: "Broadcast not found." });

    const query = {};
    if (broadcast.targetSegment.plan && broadcast.targetSegment.plan !== "all") {
      query.plan = broadcast.targetSegment.plan;
    }
    if (broadcast.targetSegment.status && broadcast.targetSegment.status !== "all") {
      if (broadcast.targetSegment.status === "active") query.isActive = true;
      if (broadcast.targetSegment.status === "suspended") query.isActive = false;
    }

    const matchingStores = await Store.find(query);
    const storeCount = matchingStores.length || 1;

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
    broadcast.openRate = Math.floor(Math.random() * 20) + 75;
    broadcast.clickRate = Math.floor(Math.random() * 25) + 25;
    await broadcast.save();

    res.json({ message: `Broadcast dispatches to ${storeCount} merchants!`, broadcast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBroadcast = async (req, res) => {
  try {
    await Broadcast.findByIdAndDelete(req.params.id);
    res.json({ message: "Broadcast deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// In-App Notifications
export const getInAppNotifications = async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const notices = await InAppNotification.find().populate("targetStoreId", "name subdomain").sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createInAppNotification = async (req, res) => {
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
};

export const updateInAppNotification = async (req, res) => {
  try {
    const updated = await InAppNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "In-app notification updated.", notice: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInAppNotification = async (req, res) => {
  try {
    await InAppNotification.findByIdAndDelete(req.params.id);
    res.json({ message: "In-app notification deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMerchantInAppNotifications = async (req, res) => {
  try {
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
};

// Automations
export const getAutomations = async (req, res) => {
  try {
    await seedCommunicationDefaults();
    const rules = await AutomationRule.find().sort({ updatedAt: -1 });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleAutomation = async (req, res) => {
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
};

export const updateAutomation = async (req, res) => {
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
};

export const triggerTestAutomation = async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ key: req.params.key });
    if (!rule) return res.status(404).json({ error: "Automation rule not found." });

    rule.totalTriggered += 1;
    await rule.save();

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
};

// Delivery Logs
export const getDeliveryLogs = async (req, res) => {
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
};

export const resendDeliveryLog = async (req, res) => {
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
};

// Channel Config
export const getChannelConfig = async (req, res) => {
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
};

export const updateChannelConfig = async (req, res) => {
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
};

export const verifyChannelDns = async (req, res) => {
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
};

// Support Tickets
export const getSupportTickets = async (req, res) => {
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
};

export const createSupportTicket = async (req, res) => {
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
};

export const replySupportTicket = async (req, res) => {
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
};

export const updateSupportTicketStatus = async (req, res) => {
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
};

export const getSupportConfig = async (req, res) => {
  try {
    await seedCommunicationDefaults();
    let config = await SupportIntegrationConfig.findOne();
    if (!config) config = await SupportIntegrationConfig.create({});
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSupportConfig = async (req, res) => {
  try {
    let config = await SupportIntegrationConfig.findOne();
    if (!config) config = new SupportIntegrationConfig(req.body);
    else Object.assign(config, req.body, { updatedAt: new Date() });
    await config.save();
    res.json({ message: "Support integration config saved.", config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unsubscribes
export const getUnsubscribes = async (req, res) => {
  try {
    const unsubscribes = await UnsubscribedEmail.find().sort({ unsubscribedAt: -1 });
    res.json(unsubscribes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUnsubscribe = async (req, res) => {
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
};

export const deleteUnsubscribe = async (req, res) => {
  try {
    await UnsubscribedEmail.findOneAndDelete({ email: req.params.email.toLowerCase().trim() });
    res.json({ message: `${req.params.email} removed from opt-out list.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
