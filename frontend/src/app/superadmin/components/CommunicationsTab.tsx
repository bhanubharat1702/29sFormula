"use client";

import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import {
  EmailTemplateItem,
  BroadcastItem,
  InAppNotificationItem,
  AutomationRuleItem,
  DeliveryLogItem,
  ChannelConfigData,
  SupportTicketItem,
  UnsubscribedEmailItem,
  SupportConfigData,
  OverviewStatsData
} from "./communicationsTypes";

import CommunicationsOverview from "./communications/CommunicationsOverview";
import EmailTemplatesTab from "./communications/EmailTemplatesTab";
import BroadcastsTab from "./communications/BroadcastsTab";
import InAppNoticesTab from "./communications/InAppNoticesTab";
import AutomationsTab from "./communications/AutomationsTab";
import DeliveryLogsTab from "./communications/DeliveryLogsTab";
import ChannelsConfigTab from "./communications/ChannelsConfigTab";
import SupportInboxTab from "./communications/SupportInboxTab";
import UnsubscribesTab from "./communications/UnsubscribesTab";
import {
  TemplateEditModal,
  TemplatePreviewModal,
  CreateBroadcastModal,
  CreateNoticeModal,
  ReplyTicketModal
} from "./communications/CommunicationsModals";

interface CommunicationsTabProps {
  token: string;
  onShowToast: (msg: string) => void;
  onUnauthorized?: () => void;
}

export default function CommunicationsTab({ token, onShowToast, onUnauthorized }: CommunicationsTabProps) {
  const [subTab, setSubTab] = useState<
    "templates" | "broadcasts" | "in-app" | "automations" | "delivery-logs" | "channels" | "support-inbox" | "unsubscribes"
  >("templates");

  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState<OverviewStatsData | null>(null);

  // Sub-tab Data States
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [notices, setNotices] = useState<InAppNotificationItem[]>([]);
  const [automations, setAutomations] = useState<AutomationRuleItem[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLogItem[]>([]);
  const [channelConfig, setChannelConfig] = useState<ChannelConfigData | null>(null);
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [supportConfig, setSupportConfig] = useState<SupportConfigData | null>(null);
  const [unsubscribes, setUnsubscribes] = useState<UnsubscribedEmailItem[]>([]);

  // Delivery log filters
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [logSearchQuery, setLogSearchQuery] = useState("");

  // Modals States
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplateItem | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplateItem | null>(null);
  const [isCreateBroadcastOpen, setIsCreateBroadcastOpen] = useState(false);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);

  const getAuthHeaders = () => {
    const effectiveToken = token || (typeof window !== "undefined" ? localStorage.getItem("superAdminToken") : "") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${effectiveToken}`
    };
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/overview", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setOverviewStats(data.stats);
        if (data.channelConfig) setChannelConfig(data.channelConfig);
      }
    } catch (err) {
      console.error("Fetch Communications Overview Error:", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/templates", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error("Fetch Templates Error:", err);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/broadcasts", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setBroadcasts(data);
      }
    } catch (err) {
      console.error("Fetch Broadcasts Error:", err);
    }
  };

  const fetchInAppNotices = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/in-app", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) {
      console.error("Fetch In-App Notices Error:", err);
    }
  };

  const fetchAutomations = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/automations", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setAutomations(data);
      }
    } catch (err) {
      console.error("Fetch Automations Error:", err);
    }
  };

  const fetchDeliveryLogs = async () => {
    try {
      const url = new URL("http://localhost:5001/api/superadmin/communications/delivery-logs");
      if (logStatusFilter !== "all") url.searchParams.append("status", logStatusFilter);
      if (logSearchQuery) url.searchParams.append("search", logSearchQuery);

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setDeliveryLogs(data);
      }
    } catch (err) {
      console.error("Fetch Delivery Logs Error:", err);
    }
  };

  const fetchChannelsConfig = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/channel-config", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setChannelConfig(data);
      }
    } catch (err) {
      console.error("Fetch Channels Config Error:", err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/tickets", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }

      const cfgRes = await fetch("http://localhost:5001/api/superadmin/communications/support-config", {
        headers: getAuthHeaders()
      });
      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        setSupportConfig(cfgData);
      }
    } catch (err) {
      console.error("Fetch Tickets Error:", err);
    }
  };

  const fetchUnsubscribes = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/unsubscribes", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setUnsubscribes(data);
      }
    } catch (err) {
      console.error("Fetch Unsubscribes Error:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOverview(),
      fetchTemplates(),
      fetchBroadcasts(),
      fetchInAppNotices(),
      fetchAutomations(),
      fetchDeliveryLogs(),
      fetchChannelsConfig(),
      fetchTickets(),
      fetchUnsubscribes()
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (subTab === "delivery-logs") {
      fetchDeliveryLogs();
    }
  }, [logStatusFilter, logSearchQuery, subTab]);

  // Handlers
  const handleSaveTemplate = async (tmpl: EmailTemplateItem) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/templates/${tmpl.key}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(tmpl)
      });
      if (res.ok) {
        onShowToast(`Template '${tmpl.name}' updated!`);
        setEditingTemplate(null);
        fetchTemplates();
      }
    } catch {
      onShowToast("Failed to save email template.");
    }
  };

  const handleSendTestEmail = async (key: string, recipientEmail: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/templates/send-test", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ key, recipientEmail })
      });
      if (res.ok) {
        onShowToast(`Test email sent to ${recipientEmail}`);
        setPreviewTemplate(null);
        fetchDeliveryLogs();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to send test email.");
    }
  };

  const handleCreateBroadcast = async (data: any) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/broadcasts", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        onShowToast("Broadcast created successfully.");
        setIsCreateBroadcastOpen(false);
        fetchBroadcasts();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to create broadcast.");
    }
  };

  const handleSendBroadcastNow = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/broadcasts/${id}/send-now`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        onShowToast(data.message || "Broadcast sent!");
        fetchBroadcasts();
        fetchDeliveryLogs();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to dispatch broadcast.");
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/broadcasts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        onShowToast("Broadcast deleted.");
        fetchBroadcasts();
      }
    } catch {
      onShowToast("Failed to delete broadcast.");
    }
  };

  const handleCreateNotice = async (data: any) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/in-app", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        onShowToast("In-app notice published.");
        setIsCreateNoticeOpen(false);
        fetchInAppNotices();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to create notice.");
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/in-app/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        onShowToast("In-app notice removed.");
        fetchInAppNotices();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to delete notice.");
    }
  };

  const handleToggleAutomation = async (key: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/automations/${key}/toggle`, {
        method: "PUT",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        onShowToast(data.message || "Automation state updated.");
        fetchAutomations();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to toggle automation.");
    }
  };

  const handleTriggerTestAutomation = async (key: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/automations/${key}/trigger-test`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        onShowToast(`Automation '${key}' test trigger executed!`);
        fetchAutomations();
        fetchDeliveryLogs();
      }
    } catch {
      onShowToast("Failed to trigger test automation.");
    }
  };

  const handleResendLog = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/delivery-logs/${id}/resend`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        onShowToast(data.message || "Message resent!");
        fetchDeliveryLogs();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to resend message.");
    }
  };

  const handleSaveChannelConfig = async (updated: Partial<ChannelConfigData>) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/channel-config", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        onShowToast("Channels config saved successfully.");
        fetchChannelsConfig();
      }
    } catch {
      onShowToast("Failed to save channel config.");
    }
  };

  const handleVerifyDns = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/channel-config/verify-dns", {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        onShowToast("Domain SPF, DKIM, and DMARC verified!");
        fetchChannelsConfig();
      }
    } catch {
      onShowToast("DNS verification failed.");
    }
  };

  const handleTicketReply = async (ticketId: string, message: string, isInternal: boolean) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/tickets/${ticketId}/reply`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message, isInternal })
      });
      if (res.ok) {
        onShowToast(isInternal ? "Internal note added." : "Reply sent to merchant!");
        setSelectedTicket(null);
        fetchTickets();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to reply to ticket.");
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onShowToast(`Ticket status updated to ${status}`);
        setSelectedTicket(null);
        fetchTickets();
        fetchOverview();
      }
    } catch {
      onShowToast("Failed to update ticket status.");
    }
  };

  const handleSaveSupportConfig = async (cfg: SupportConfigData) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/support-config", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(cfg)
      });
      if (res.ok) {
        onShowToast("Support desk integration settings saved.");
        fetchTickets();
      }
    } catch {
      onShowToast("Failed to save support settings.");
    }
  };

  const handleAddUnsubscribe = async (email: string, reason: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/communications/unsubscribes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, reason })
      });
      if (res.ok) {
        onShowToast(`${email} added to opt-out list.`);
        fetchUnsubscribes();
      }
    } catch {
      onShowToast("Failed to add unsubscribe.");
    }
  };

  const handleRemoveUnsubscribe = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/communications/unsubscribes/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        onShowToast(`${email} removed from opt-out list.`);
        fetchUnsubscribes();
      }
    } catch {
      onShowToast("Failed to remove unsubscribe.");
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          Merchant Communications Hub
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Manage email templates, announcements, in-app bell alerts, automated workflows, delivery logs, channels, and support tickets.
        </p>
      </div>

      {/* Overview Stats */}
      <CommunicationsOverview stats={overviewStats} />

      {/* Sub-Navigation Tabs */}
      <div className={styles.subNav} style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <button
          className={`${styles.subNavItem} ${subTab === "templates" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("templates")}
        >
          Email Templates ({templates.length})
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "broadcasts" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("broadcasts")}
        >
          Broadcasts ({broadcasts.length})
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "in-app" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("in-app")}
        >
          In-App Notices ({notices.length})
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "automations" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("automations")}
        >
          Automations ({automations.length})
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "delivery-logs" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("delivery-logs")}
        >
          Delivery Logs
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "channels" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("channels")}
        >
          Channels Config
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "support-inbox" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("support-inbox")}
        >
          Support Inbox ({tickets.length})
        </button>
        <button
          className={`${styles.subNavItem} ${subTab === "unsubscribes" ? styles.subNavItemActive : ""}`}
          onClick={() => setSubTab("unsubscribes")}
        >
          Opt-Outs ({unsubscribes.length})
        </button>
      </div>

      {/* Active Sub-Tab View */}
      {loading ? (
        <div className={styles.tableCard} style={{ padding: "48px", textAlign: "center", color: "#6b7280" }}>
          Loading merchant communications data...
        </div>
      ) : (
        <>
          {subTab === "templates" && (
            <EmailTemplatesTab
              templates={templates}
              onOpenEdit={(tmpl) => setEditingTemplate(tmpl)}
              onOpenPreview={(tmpl) => setPreviewTemplate(tmpl)}
            />
          )}

          {subTab === "broadcasts" && (
            <BroadcastsTab
              broadcasts={broadcasts}
              onOpenCreate={() => setIsCreateBroadcastOpen(true)}
              onSendNow={handleSendBroadcastNow}
              onDelete={handleDeleteBroadcast}
            />
          )}

          {subTab === "in-app" && (
            <InAppNoticesTab
              notices={notices}
              onOpenCreate={() => setIsCreateNoticeOpen(true)}
              onDelete={handleDeleteNotice}
            />
          )}

          {subTab === "automations" && (
            <AutomationsTab
              automations={automations}
              onToggleEnabled={handleToggleAutomation}
              onTriggerTest={handleTriggerTestAutomation}
            />
          )}

          {subTab === "delivery-logs" && (
            <DeliveryLogsTab
              logs={deliveryLogs}
              statusFilter={logStatusFilter}
              setStatusFilter={setLogStatusFilter}
              searchQuery={logSearchQuery}
              setSearchQuery={setLogSearchQuery}
              onResend={handleResendLog}
            />
          )}

          {subTab === "channels" && (
            <ChannelsConfigTab
              config={channelConfig}
              onSaveConfig={handleSaveChannelConfig}
              onVerifyDns={handleVerifyDns}
            />
          )}

          {subTab === "support-inbox" && (
            <SupportInboxTab
              tickets={tickets}
              config={supportConfig}
              onOpenReply={(t) => setSelectedTicket(t)}
              onSaveConfig={handleSaveSupportConfig}
            />
          )}

          {subTab === "unsubscribes" && (
            <UnsubscribesTab
              unsubscribes={unsubscribes}
              onAddEmail={handleAddUnsubscribe}
              onRemoveEmail={handleRemoveUnsubscribe}
            />
          )}
        </>
      )}

      {/* Modals */}
      <TemplateEditModal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />

      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onSendTest={handleSendTestEmail}
      />

      <CreateBroadcastModal
        isOpen={isCreateBroadcastOpen}
        onClose={() => setIsCreateBroadcastOpen(false)}
        onSubmit={handleCreateBroadcast}
      />

      <CreateNoticeModal
        isOpen={isCreateNoticeOpen}
        onClose={() => setIsCreateNoticeOpen(false)}
        onSubmit={handleCreateNotice}
      />

      <ReplyTicketModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onReply={handleTicketReply}
        onUpdateStatus={handleUpdateTicketStatus}
      />
    </div>
  );
}
