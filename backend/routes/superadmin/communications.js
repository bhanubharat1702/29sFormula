import express from "express";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";
import {
  seedCommunicationDefaults,
  dispatchCommunicationEvent,
  getCommunicationsOverview,
  getEmailTemplates,
  updateEmailTemplate,
  sendTestEmail,
  getBroadcasts,
  createBroadcast,
  sendBroadcastNow,
  deleteBroadcast,
  getInAppNotifications,
  createInAppNotification,
  updateInAppNotification,
  deleteInAppNotification,
  getMerchantInAppNotifications,
  getAutomations,
  toggleAutomation,
  updateAutomation,
  triggerTestAutomation,
  runAutomationWorkerManualHandler,
  getDeliveryLogs,
  resendDeliveryLog,
  getChannelConfig,
  updateChannelConfig,
  verifyChannelDns,
  getSupportTickets,
  createSupportTicket,
  replySupportTicket,
  updateSupportTicketStatus,
  getSupportConfig,
  updateSupportConfig,
  getUnsubscribes,
  addUnsubscribe,
  deleteUnsubscribe
} from "../../controllers/superadmin/communicationsController.js";

const router = express.Router();

export { seedCommunicationDefaults, dispatchCommunicationEvent };

// Overview
router.get("/api/superadmin/communications/overview", verifySuperAdminToken, getCommunicationsOverview);

// Email Templates
router.get("/api/superadmin/communications/templates", verifySuperAdminToken, getEmailTemplates);
router.put("/api/superadmin/communications/templates/:key", verifySuperAdminToken, updateEmailTemplate);
router.post("/api/superadmin/communications/templates/send-test", verifySuperAdminToken, sendTestEmail);

// Broadcasts
router.get("/api/superadmin/communications/broadcasts", verifySuperAdminToken, getBroadcasts);
router.post("/api/superadmin/communications/broadcasts", verifySuperAdminToken, createBroadcast);
router.post("/api/superadmin/communications/broadcasts/:id/send-now", verifySuperAdminToken, sendBroadcastNow);
router.delete("/api/superadmin/communications/broadcasts/:id", verifySuperAdminToken, deleteBroadcast);

// In-App Notifications
router.get("/api/superadmin/communications/in-app", verifySuperAdminToken, getInAppNotifications);
router.post("/api/superadmin/communications/in-app", verifySuperAdminToken, createInAppNotification);
router.put("/api/superadmin/communications/in-app/:id", verifySuperAdminToken, updateInAppNotification);
router.delete("/api/superadmin/communications/in-app/:id", verifySuperAdminToken, deleteInAppNotification);
router.get("/api/merchant/in-app-notifications", getMerchantInAppNotifications);

// Automations
router.get("/api/superadmin/communications/automations", verifySuperAdminToken, getAutomations);
router.put("/api/superadmin/communications/automations/:key/toggle", verifySuperAdminToken, toggleAutomation);
router.put("/api/superadmin/communications/automations/:key", verifySuperAdminToken, updateAutomation);
router.post("/api/superadmin/communications/automations/:key/trigger-test", verifySuperAdminToken, triggerTestAutomation);
router.post("/api/superadmin/communications/automations/run-worker", verifySuperAdminToken, runAutomationWorkerManualHandler);

// Delivery Logs
router.get("/api/superadmin/communications/delivery-logs", verifySuperAdminToken, getDeliveryLogs);
router.post("/api/superadmin/communications/delivery-logs/:id/resend", verifySuperAdminToken, resendDeliveryLog);

// Channels Config
router.get("/api/superadmin/communications/channel-config", verifySuperAdminToken, getChannelConfig);
router.put("/api/superadmin/communications/channel-config", verifySuperAdminToken, updateChannelConfig);
router.post("/api/superadmin/communications/channel-config/verify-dns", verifySuperAdminToken, verifyChannelDns);

// Support Inbox
router.get("/api/superadmin/communications/tickets", verifySuperAdminToken, getSupportTickets);
router.post("/api/superadmin/communications/tickets", verifySuperAdminToken, createSupportTicket);
router.put("/api/superadmin/communications/tickets/:id/reply", verifySuperAdminToken, replySupportTicket);
router.put("/api/superadmin/communications/tickets/:id/status", verifySuperAdminToken, updateSupportTicketStatus);
router.get("/api/superadmin/communications/support-config", verifySuperAdminToken, getSupportConfig);
router.put("/api/superadmin/communications/support-config", verifySuperAdminToken, updateSupportConfig);

// Unsubscribes
router.get("/api/superadmin/communications/unsubscribes", verifySuperAdminToken, getUnsubscribes);
router.post("/api/superadmin/communications/unsubscribes", verifySuperAdminToken, addUnsubscribe);
router.delete("/api/superadmin/communications/unsubscribes/:email", verifySuperAdminToken, deleteUnsubscribe);

export default router;
