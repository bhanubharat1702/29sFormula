"use client";

import React from "react";
import styles from "../../page.module.css";
import { EmailTemplateItem, BroadcastItem, InAppNotificationItem, SupportTicketItem } from "../communicationsTypes";

// ── Edit Email Template Modal ─────────────────────────────────
interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplateItem | null;
  onSave: (template: EmailTemplateItem) => void;
}

export const TemplateEditModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [formData, setFormData] = React.useState<EmailTemplateItem | null>(null);
  const [editTab, setEditTab] = React.useState<"editor" | "visual">("editor");

  React.useEffect(() => {
    setFormData(template);
  }, [template]);

  if (!isOpen || !formData) return null;

  const sampleVars: Record<string, string> = {
    store_name: "Fashion Hub India",
    owner_name: "Sarah Jenkins",
    plan: "Pro Plan",
    subdomain: "fashionhub",
    custom_domain: "fashionhub.in",
    amount: "79.00"
  };

  let renderedPreview = formData.htmlContent || "";
  Object.keys(sampleVars).forEach(key => {
    const reg = new RegExp(`{{${key}}}`, 'g');
    renderedPreview = renderedPreview.replace(reg, sampleVars[key]);
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} style={{ maxWidth: "760px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Edit Email Template</h3>
            <p className={styles.modalSubtitle}>Category: <strong>{formData.category}</strong></p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", background: "#f3f4f6", padding: "3px", borderRadius: "8px" }}>
              <button
                className={editTab === "editor" ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                onClick={() => setEditTab("editor")}
              >
                HTML Editor
              </button>
              <button
                className={editTab === "visual" ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                onClick={() => setEditTab("visual")}
              >
                Live Preview
              </button>
            </div>
            <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.modalBody} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className={styles.formLabel}>Template Name</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.formLabel}>Subject Line</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              Available variables: {formData.variables.map(v => `{{${v}}}`).join(", ")}
            </span>
          </div>

          {editTab === "editor" ? (
            <div>
              <label className={styles.formLabel}>HTML Body Content (Source Code)</label>
              <textarea
                className={styles.formInput}
                style={{ height: "180px", fontFamily: "monospace", fontSize: "0.85rem" }}
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <label className={styles.formLabel}>Visual Rendering Preview</label>
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#ffffff",
                  minHeight: "180px",
                  maxHeight: "260px",
                  overflowY: "auto",
                  color: "#1f2937"
                }}
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
            </div>
          )}

          <div>
            <label className={styles.formLabel}>Plain Text Fallback</label>
            <textarea
              className={styles.formInput}
              style={{ height: "70px", fontFamily: "monospace", fontSize: "0.85rem" }}
              value={formData.textContent || ""}
              onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="isTransactional"
              checked={formData.isTransactional}
              onChange={(e) => setFormData({ ...formData, isTransactional: e.target.checked })}
            />
            <label htmlFor="isTransactional" style={{ fontSize: "0.85rem", color: "#374151" }}>
              Transactional Email (Sent even if merchant has unsubscribed from marketing)
            </label>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={() => onSave(formData)}>Save Template</button>
        </div>
      </div>
    </div>
  );
};

// ── Live Preview Modal ─────────────────────────────────────────
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplateItem | null;
  onSendTest: (key: string, recipientEmail: string) => void;
}

export const TemplatePreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  template,
  onSendTest
}) => {
  const [testEmail, setTestEmail] = React.useState("owner@demostore.com");
  const [viewMode, setViewMode] = React.useState<"rendered" | "code">("rendered");

  if (!isOpen || !template) return null;

  // Substitute sample variables
  const sampleVars: Record<string, string> = {
    store_name: "Fashion Hub India",
    owner_name: "Sarah Jenkins",
    plan: "Pro Plan",
    subdomain: "fashionhub",
    custom_domain: "fashionhub.in",
    amount: "79.00"
  };

  let renderedSubject = template.subject;
  let renderedHtml = template.htmlContent;
  Object.keys(sampleVars).forEach(key => {
    const reg = new RegExp(`{{${key}}}`, 'g');
    renderedSubject = renderedSubject.replace(reg, sampleVars[key]);
    renderedHtml = renderedHtml.replace(reg, sampleVars[key]);
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} style={{ maxWidth: "780px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Live Email Preview</h3>
            <p className={styles.modalSubtitle}>Subject: <strong>{renderedSubject}</strong></p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", background: "#f3f4f6", padding: "3px", borderRadius: "8px" }}>
              <button
                className={viewMode === "rendered" ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                onClick={() => setViewMode("rendered")}
              >
                Visual Preview
              </button>
              <button
                className={viewMode === "code" ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                onClick={() => setViewMode("code")}
              >
                HTML Source Code
              </button>
            </div>
            <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.modalBody}>
          {viewMode === "rendered" ? (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
                background: "#ffffff",
                minHeight: "240px",
                marginBottom: "16px",
                color: "#1f2937"
              }}
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          ) : (
            <pre
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                background: "#09090b",
                color: "#38bdf8",
                fontSize: "0.82rem",
                minHeight: "240px",
                marginBottom: "16px",
                overflowX: "auto",
                whiteSpace: "pre-wrap"
              }}
            >
              {renderedHtml}
            </pre>
          )}

          <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
            <input
              type="email"
              className={styles.formInput}
              placeholder="Send test email to..."
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className={styles.btnPrimary}
              onClick={() => onSendTest(template.key, testEmail)}
            >
              Send Test Email
            </button>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Close Preview</button>
        </div>
      </div>
    </div>
  );
};

// ── Create Broadcast Modal ─────────────────────────────────────
interface CreateBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; targetPlan: string; targetStatus: string; scheduledAt?: string }) => void;
}

export const CreateBroadcastModal: React.FC<CreateBroadcastModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [targetPlan, setTargetPlan] = React.useState("all");
  const [targetStatus, setTargetStatus] = React.useState("all");
  const [scheduledAt, setScheduledAt] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} style={{ maxWidth: "600px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>New Platform Broadcast</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className={styles.formLabel}>Broadcast Title / Announcement Subject</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Scheduled Infrastructure Maintenance Tonight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={styles.formLabel}>Target Plan Segment</label>
              <select className={styles.formInput} value={targetPlan} onChange={(e) => setTargetPlan(e.target.value)}>
                <option value="all">All Merchants (All Plans)</option>
                <option value="starter">Starter Plan Only</option>
                <option value="pro">Pro Plan Only</option>
                <option value="enterprise">Enterprise Plan Only</option>
              </select>
            </div>
            <div>
              <label className={styles.formLabel}>Target Store Status</label>
              <select className={styles.formInput} value={targetStatus} onChange={(e) => setTargetStatus(e.target.value)}>
                <option value="all">All Stores (Active & Suspended)</option>
                <option value="active">Active Stores Only</option>
                <option value="suspended">Suspended Stores Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className={styles.formLabel}>Announcement Message Body</label>
            <textarea
              className={styles.formInput}
              style={{ height: "120px" }}
              placeholder="Write announcement details for merchant admins..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className={styles.formLabel}>Schedule Date & Time (Optional - Leave blank to send immediately)</label>
            <input
              type="datetime-local"
              className={styles.formInput}
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              if (!title || !content) return;
              onSubmit({ title, content, targetPlan, targetStatus, scheduledAt });
              setTitle("");
              setContent("");
              setScheduledAt("");
            }}
          >
            Create Broadcast
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Create In-App Notice Modal ─────────────────────────────────
interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; message: string; type: "info" | "warning" | "critical"; targetPlan: string; actionUrl?: string; actionLabel?: string }) => void;
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState<"info" | "warning" | "critical">("info");
  const [targetPlan, setTargetPlan] = React.useState("all");
  const [actionUrl, setActionUrl] = React.useState("");
  const [actionLabel, setActionLabel] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} style={{ maxWidth: "580px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>New In-App Notice / Banner</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className={styles.formLabel}>Notice Title</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Critical Billing Update Required"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={styles.formLabel}>Severity Level</label>
              <select className={styles.formInput} value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Amber)</option>
                <option value="critical">Critical (Red Alert)</option>
              </select>
            </div>
            <div>
              <label className={styles.formLabel}>Target Audience</label>
              <select className={styles.formInput} value={targetPlan} onChange={(e) => setTargetPlan(e.target.value)}>
                <option value="all">All Merchants</option>
                <option value="starter">Starter Plan</option>
                <option value="pro">Pro Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>
          </div>

          <div>
            <label className={styles.formLabel}>Banner Message</label>
            <textarea
              className={styles.formInput}
              style={{ height: "90px" }}
              placeholder="Message shown inside merchant admin dashboard..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={styles.formLabel}>Call to Action Label (Optional)</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Update Billing"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Action Target URL (Optional)</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. /admin/billing"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              if (!title || !message) return;
              onSubmit({ title, message, type, targetPlan, actionUrl, actionLabel });
              setTitle("");
              setMessage("");
              setActionLabel("");
              setActionUrl("");
            }}
          >
            Publish Notice
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Ticket Reply Drawer / Modal ────────────────────────────────
interface ReplyTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicketItem | null;
  onReply: (ticketId: string, message: string, isInternal: boolean) => void;
  onUpdateStatus: (ticketId: string, status: string) => void;
}

export const ReplyTicketModal: React.FC<ReplyTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onReply,
  onUpdateStatus
}) => {
  const [replyText, setReplyText] = React.useState("");
  const [isInternal, setIsInternal] = React.useState(false);

  if (!isOpen || !ticket) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} style={{ maxWidth: "680px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Ticket {ticket.ticketNumber}: {ticket.subject}</h3>
            <p className={styles.modalSubtitle}>Store: <strong>{ticket.storeName}</strong> ({ticket.ownerEmail})</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody} style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
            <span className={styles.tableBadge} style={{ background: ticket.status === "open" ? "#fef3c7" : "#dcfce7", color: ticket.status === "open" ? "#92400e" : "#166534" }}>
              Status: {ticket.status.toUpperCase()}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.btnSecondary}
                onClick={() => onUpdateStatus(ticket._id, "resolved")}
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
              >
                Mark Resolved
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => onUpdateStatus(ticket._id, "open")}
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
              >
                Re-open
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {ticket.replies && ticket.replies.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: r.isInternal ? "#fef3c7" : r.sender === "Super Admin" ? "#eff6ff" : "#f9fafb",
                  border: r.isInternal ? "1px solid #fde68a" : "1px solid #e5e7eb"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6b7280", marginBottom: "4px" }}>
                  <strong>{r.sender} {r.isInternal ? "(Internal Note)" : ""}</strong>
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#1f2937", whiteSpace: "pre-wrap" }}>{r.message}</div>
              </div>
            ))}
          </div>

          <div>
            <label className={styles.formLabel}>Write Reply / Note</label>
            <textarea
              className={styles.formInput}
              style={{ height: "90px" }}
              placeholder="Type your response to merchant..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
              <input
                type="checkbox"
                id="internalNoteCheck"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
              />
              <label htmlFor="internalNoteCheck" style={{ fontSize: "0.8rem", color: "#4b5563" }}>
                Save as internal admin note (Hidden from merchant)
              </label>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Close</button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              if (!replyText) return;
              onReply(ticket._id, replyText, isInternal);
              setReplyText("");
            }}
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};
