import React, { useState } from "react";
import styles from "../../page.module.css";
import { DemoRequestItem, AdminUser } from "../types";

interface DemoRequestDetailModalProps {
  demo: DemoRequestItem | null;
  admins: AdminUser[];
  onClose: () => void;
  onUpdateStage: (id: string, stage: string, notes?: string) => void;
  onAssignOwner: (id: string, ownerName: string, ownerEmail: string, ownerId: string) => void;
  onUpdatePriority: (id: string, priority: "Low" | "Medium" | "High" | "Urgent") => void;
  onAddNote: (id: string, noteText: string, followUpReminder?: string) => void;
  onScheduleDemo: (id: string, date: string, meetingUrl: string, notes?: string) => void;
  onSendEmail: (id: string, templateType: string, customSubject?: string, customBody?: string) => void;
  onConvert: (demo: DemoRequestItem) => void;
  onMarkLost: (id: string, reason: string, notes?: string) => void;
  onToggleSpam: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DemoRequestDetailModal: React.FC<DemoRequestDetailModalProps> = ({
  demo,
  admins,
  onClose,
  onUpdateStage,
  onAssignOwner,
  onUpdatePriority,
  onAddNote,
  onScheduleDemo,
  onSendEmail,
  onConvert,
  onMarkLost,
  onToggleSpam,
  onDelete
}) => {
  if (!demo) return null;

  const [activeTab, setActiveTab] = useState<"info" | "schedule" | "email" | "timeline">("info");
  const [newNote, setNewNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  
  // Schedule state
  const [demoDate, setDemoDate] = useState(demo.scheduledDemo?.date ? new Date(demo.scheduledDemo.date).toISOString().slice(0, 16) : "");
  const [meetingUrl, setMeetingUrl] = useState(demo.scheduledDemo?.meetingUrl || "https://calendly.com/ecommerce-demo");
  const [demoNotes, setDemoNotes] = useState(demo.scheduledDemo?.notes || "");

  // Email state
  const [emailTemplate, setEmailTemplate] = useState("acknowledgement");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");

  // Mark lost state
  const [isMarkingLost, setIsMarkingLost] = useState(false);
  const [lossReason, setLossReason] = useState("Price / Budget");
  const [lossNotes, setLossNotes] = useState("");

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(demo._id, newNote.trim(), followUpDate);
    setNewNote("");
    setFollowUpDate("");
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoDate) return;
    onScheduleDemo(demo._id, demoDate, meetingUrl, demoNotes);
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendEmail(demo._id, emailTemplate, customSubject, customBody);
  };

  const handleConfirmLost = () => {
    onMarkLost(demo._id, lossReason, lossNotes);
    setIsMarkingLost(false);
  };

  const stages = ["New", "Contacted", "Demo Scheduled", "Demo Done", "Trial Started", "Won", "Lost"];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalBox}
        style={{ maxWidth: "800px", maxHeight: "92vh", overflowY: "auto", padding: "32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0c0a09", margin: 0 }}>
                {demo.storeName}
              </h2>
              {/* Score Badge */}
              <span
                style={{
                  background: (demo.leadScore || 50) >= 80 ? "#fef3c7" : "#f3f4f6",
                  color: (demo.leadScore || 50) >= 80 ? "#b45309" : "#374151",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  border: "1px solid #fde68a"
                }}
              >
                🔥 Score: {demo.leadScore || 50}/100
              </span>
              {/* Priority Badge */}
              <span
                style={{
                  background: demo.priority === "Urgent" ? "#fee2e2" : demo.priority === "High" ? "#ffedd5" : "#f3f4f6",
                  color: demo.priority === "Urgent" ? "#991b1b" : demo.priority === "High" ? "#c2410c" : "#4b5563",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.78rem"
                }}
              >
                ⚡ {demo.priority || "Medium"}
              </span>
              {/* SLA Breach Warning */}
              {demo.slaBreached && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    animation: "pulse 2s infinite"
                  }}
                  title="Uncontacted lead for over 24 hours"
                >
                  ⚠️ SLA Breach (&gt;24h)
                </span>
              )}
              {demo.isDuplicate && (
                <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 10px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 700 }}>
                  👥 Duplicate Lead
                </span>
              )}
            </div>

            <div style={{ fontSize: "0.88rem", color: "#6b7280" }}>
              Contact: <strong>{demo.ownerName}</strong> ({demo.email} • {demo.phone})
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontSize: "1.1rem",
              color: "#4b5563",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Pipeline Stage Selector Bar */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4b5563", marginBottom: "8px", textTransform: "uppercase" }}>
            Pipeline Progress Stage
          </div>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px" }}>
            {stages.map((stg) => {
              const isActive = (demo.pipelineStage || demo.status) === stg;
              return (
                <button
                  key={stg}
                  onClick={() => onUpdateStage(demo._id, stg)}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: isActive ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    backgroundColor: isActive ? "#eff6ff" : "#ffffff",
                    color: isActive ? "#1d4ed8" : "#4b5563",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {stg === "Won" ? "🏆 " : stg === "Lost" ? "❌ " : ""}{stg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("info")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "info" ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              fontWeight: activeTab === "info" ? 700 : 500,
              color: activeTab === "info" ? "#2563eb" : "#6b7280",
              cursor: "pointer"
            }}
          >
            📋 Lead Info & Assignment
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "schedule" ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              fontWeight: activeTab === "schedule" ? 700 : 500,
              color: activeTab === "schedule" ? "#2563eb" : "#6b7280",
              cursor: "pointer"
            }}
          >
            📅 Schedule Demo
          </button>
          <button
            onClick={() => setActiveTab("email")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "email" ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              fontWeight: activeTab === "email" ? 700 : 500,
              color: activeTab === "email" ? "#2563eb" : "#6b7280",
              cursor: "pointer"
            }}
          >
            ✉️ Email Templates
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "timeline" ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              fontWeight: activeTab === "timeline" ? 700 : 500,
              color: activeTab === "timeline" ? "#2563eb" : "#6b7280",
              cursor: "pointer"
            }}
          >
            📜 Interactions Feed ({demo.timeline?.length || 0})
          </button>
        </div>

        {/* Tab Content: Lead Info */}
        {activeTab === "info" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#f9fafb" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, margin: "0 0 12px 0", color: "#111827" }}>
                  🏢 Business Information
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.84rem" }}>
                  <div><span style={{ color: "#6b7280" }}>Business Name:</span> <strong>{demo.storeName}</strong></div>
                  <div><span style={{ color: "#6b7280" }}>Category:</span> <strong>{demo.businessType || "Retail"}</strong></div>
                  <div><span style={{ color: "#6b7280" }}>Monthly Orders:</span> <strong style={{ color: "#2563eb" }}>{demo.monthlyOrders || "< 50"}</strong></div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Current Website:</span>{" "}
                    {demo.currentWebsite ? (
                      <a href={demo.currentWebsite.startsWith("http") ? demo.currentWebsite : `https://${demo.currentWebsite}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                        {demo.currentWebsite}
                      </a>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>None specified</span>
                    )}
                  </div>
                  <div><span style={{ color: "#6b7280" }}>Preferred Time:</span> <strong>{demo.preferredTime || "Morning"}</strong></div>
                  <div><span style={{ color: "#6b7280" }}>Lead Source:</span> <span className={styles.badge} style={{ background: "#e0e7ff", color: "#3730a3" }}>{demo.utmSource || "Direct / Landing Page"}</span></div>
                </div>
              </div>

              <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#f9fafb" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, margin: "0 0 12px 0", color: "#111827" }}>
                  👤 Owner Assignment & Priority
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                      Assigned Sales Rep:
                    </label>
                    <select
                      value={demo.assignedOwner?.id || ""}
                      onChange={(e) => {
                        const admin = admins.find((a) => a.id === e.target.value);
                        onAssignOwner(demo._id, admin ? admin.name : "Unassigned", admin ? admin.email : "", e.target.value);
                      }}
                      className={styles.input}
                      style={{ padding: "6px 10px", fontSize: "0.84rem" }}
                    >
                      <option value="">Unassigned</option>
                      {admins.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                      Lead Priority Level:
                    </label>
                    <select
                      value={demo.priority || "Medium"}
                      onChange={(e) => onUpdatePriority(demo._id, e.target.value as any)}
                      className={styles.input}
                      style={{ padding: "6px 10px", fontSize: "0.84rem" }}
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent 🔥</option>
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Lead Submitted: </span>
                    <strong style={{ fontSize: "0.82rem", color: "#111827" }}>
                      {demo.createdAt ? new Date(demo.createdAt).toLocaleString() : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Box */}
            {demo.message && (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", background: "#ffffff", marginBottom: "20px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>
                  💬 Prospect Message / Requirements:
                </div>
                <p style={{ fontSize: "0.85rem", color: "#1f2937", margin: 0, whiteSpace: "pre-wrap" }}>
                  {demo.message}
                </p>
              </div>
            )}

            {/* Quick Add Note */}
            <form onSubmit={handleNoteSubmit} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", background: "#ffffff", marginBottom: "20px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
                📝 Add Interaction Note & Follow-up
              </div>
              <textarea
                rows={2}
                placeholder="Log phone call outcome, meeting notes, customer feedback..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className={styles.input}
                style={{ width: "100%", marginBottom: "10px", fontSize: "0.85rem" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Follow-up Reminder:</span>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className={styles.input}
                    style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  />
                </div>
                <button type="submit" className={styles.btnAction} style={{ background: "#2563eb", color: "#ffffff", fontWeight: 600 }}>
                  Add Note
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content: Schedule Demo */}
        {activeTab === "schedule" && (
          <form onSubmit={handleScheduleSubmit} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", background: "#ffffff" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
              📅 Schedule Product Demo Session
            </h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Demo Date & Time:</label>
              <input
                type="datetime-local"
                required
                value={demoDate}
                onChange={(e) => setDemoDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Meeting Link (Calendly / Google Meet / Zoom):</label>
              <input
                type="url"
                required
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className={styles.input}
                placeholder="https://calendly.com/your-team/demo"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Internal Demo Notes / Focus Areas:</label>
              <textarea
                rows={3}
                value={demoNotes}
                onChange={(e) => setDemoNotes(e.target.value)}
                className={styles.input}
                placeholder="Key merchant pain points, features to showcase..."
              />
            </div>

            <button type="submit" className={styles.btnAction} style={{ background: "#2563eb", color: "#ffffff", padding: "10px 20px", fontWeight: 700 }}>
              ⚡ Confirm & Schedule Demo
            </button>
          </form>
        )}

        {/* Tab Content: Email Templates */}
        {activeTab === "email" && (
          <form onSubmit={handleSendEmailSubmit} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", background: "#ffffff" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
              ✉️ Send Email Communication to Lead
            </h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Select Email Template:</label>
              <select
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className={styles.input}
              >
                <option value="acknowledgement">Acknowledgement - "Thanks for requesting a demo!"</option>
                <option value="demo_confirmation">Demo Scheduled Confirmation & Link</option>
                <option value="follow_up">Follow-up Reminder - "Checking in on your e-commerce platform request"</option>
                <option value="rejection">Polite Recline / Rejection</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Custom Subject Line (Optional):</label>
              <input
                type="text"
                placeholder={`Re: ${demo.storeName} - Demo Request Update`}
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Custom Message Body Note (Optional):</label>
              <textarea
                rows={4}
                placeholder="Personalized message to add to template..."
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.btnAction} style={{ background: "#10b981", color: "#ffffff", padding: "10px 20px", fontWeight: 700 }}>
              📤 Log & Send Email Template
            </button>
          </form>
        )}

        {/* Tab Content: Interactions Feed */}
        {activeTab === "timeline" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(!demo.timeline || demo.timeline.length === 0) ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                No interaction logs recorded yet.
              </div>
            ) : (
              demo.timeline.map((item, idx) => (
                <div key={idx} style={{ border: "1px solid #f3f4f6", borderRadius: "8px", padding: "12px", background: "#f9fafb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#111827" }}>{item.action}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : ""}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#374151" }}>{item.details}</div>
                  <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "4px" }}>By: {item.performedBy || "System"}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal Footer / Primary Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
          {isMarkingLost ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Reason:</span>
              <select
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className={styles.input}
                style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              >
                <option value="Price / Budget">Price / Budget</option>
                <option value="Competitor">Competitor Chosen</option>
                <option value="No Response">No Response / Ghosted</option>
                <option value="Feature Gap">Feature Gap</option>
                <option value="Timing / Delayed">Timing / Delayed</option>
                <option value="Other">Other</option>
              </select>
              <button onClick={handleConfirmLost} className={styles.btnAction} style={{ background: "#dc2626", color: "#ffffff" }}>
                Confirm Lost
              </button>
              <button onClick={() => setIsMarkingLost(false)} className={styles.btnAction} style={{ background: "#f3f4f6" }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  onClose();
                  onConvert(demo);
                }}
                className={styles.btnAction}
                style={{ background: "#10b981", color: "#ffffff", fontWeight: 700, padding: "8px 16px" }}
              >
                🚀 Convert to Merchant
              </button>

              <button
                onClick={() => setIsMarkingLost(true)}
                className={styles.btnAction}
                style={{ background: "#fef2f2", color: "#991b1b", fontWeight: 600 }}
              >
                ❌ Mark Lost
              </button>

              <button
                onClick={() => onToggleSpam(demo._id)}
                className={styles.btnAction}
                style={{ background: demo.isSpam ? "#dcfce7" : "#fff7ed", color: demo.isSpam ? "#166534" : "#c2410c" }}
              >
                {demo.isSpam ? "Unflag Spam" : "🚫 Mark Spam"}
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onDelete(demo._id)}
              className={`${styles.btnAction} ${styles.btnActionDanger}`}
            >
              Delete
            </button>
            <button onClick={onClose} className={styles.btnAction} style={{ background: "#111827", color: "#ffffff" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
