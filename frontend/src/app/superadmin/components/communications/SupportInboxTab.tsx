"use client";

import React from "react";
import styles from "../../page.module.css";
import { SupportTicketItem, SupportConfigData } from "../communicationsTypes";

interface SupportInboxTabProps {
  tickets: SupportTicketItem[];
  config: SupportConfigData | null;
  onOpenReply: (ticket: SupportTicketItem) => void;
  onSaveConfig: (cfg: SupportConfigData) => void;
}

export default function SupportInboxTab({
  tickets,
  config,
  onOpenReply,
  onSaveConfig
}: SupportInboxTabProps) {
  const [activeView, setActiveView] = React.useState<"tickets" | "integrations">("tickets");
  const [integrationForm, setIntegrationForm] = React.useState<SupportConfigData | null>(config);

  React.useEffect(() => {
    setIntegrationForm(config);
  }, [config]);

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeaderRow} style={{ padding: "16px 20px" }}>
        <div>
          <h3 className={styles.tableTitle}>Merchant Support Inbox & Desk</h3>
          <p className={styles.tableSubtitle}>
            Intercom / Zendesk style ticketing center for merchant help requests & platform support.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={activeView === "tickets" ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setActiveView("tickets")}
          >
            Support Tickets
          </button>
          <button
            className={activeView === "integrations" ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setActiveView("integrations")}
          >
            Zendesk / Freshdesk Integration
          </button>
        </div>
      </div>

      {activeView === "tickets" ? (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket ID & Subject</th>
                <th>Merchant Store</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    No support tickets found in inbox.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#111827" }}>
                        {t.ticketNumber}: {t.subject}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{t.ownerEmail}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "#374151" }}>{t.storeName}</span>
                    </td>
                    <td>
                      <span className={styles.tableBadge} style={{ background: "#e0e7ff", color: "#3730a3" }}>
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.tableBadge}
                        style={{
                          background:
                            t.priority === "urgent" || t.priority === "high"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            t.priority === "urgent" || t.priority === "high"
                              ? "#991b1b"
                              : "#92400e"
                        }}
                      >
                        {t.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.tableBadge}
                        style={{
                          background: t.status === "open" ? "#fef3c7" : "#dcfce7",
                          color: t.status === "open" ? "#92400e" : "#166534"
                        }}
                      >
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {new Date(t.updatedAt).toLocaleString()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className={styles.btnPrimary}
                        style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                        onClick={() => onOpenReply(t)}
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: "24px", maxWidth: "680px" }}>
          <h4 style={{ fontWeight: 600, color: "#111827", marginBottom: "8px" }}>Third-Party Support Desk Integration</h4>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "20px" }}>
            Connect Zendesk or Freshdesk to synchronize merchant support tickets with your external helpdesk.
          </p>

          {integrationForm && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className={styles.formLabel}>Active Support Provider</label>
                <select
                  className={styles.formInput}
                  value={integrationForm.provider}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, provider: e.target.value as any })}
                >
                  <option value="native">Native Platform Support Inbox</option>
                  <option value="zendesk">Zendesk Support Suite</option>
                  <option value="freshdesk">Freshdesk Helpdesk</option>
                </select>
              </div>

              {integrationForm.provider === "zendesk" && (
                <>
                  <div>
                    <label className={styles.formLabel}>Zendesk Subdomain</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. ecommerce.zendesk.com"
                      value={integrationForm.zendeskDomain || ""}
                      onChange={(e) => setIntegrationForm({ ...integrationForm, zendeskDomain: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Zendesk API Key</label>
                    <input
                      type="password"
                      className={styles.formInput}
                      value={integrationForm.zendeskApiKey || ""}
                      onChange={(e) => setIntegrationForm({ ...integrationForm, zendeskApiKey: e.target.value })}
                    />
                  </div>
                </>
              )}

              {integrationForm.provider === "freshdesk" && (
                <>
                  <div>
                    <label className={styles.formLabel}>Freshdesk Domain</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. ecommerce.freshdesk.com"
                      value={integrationForm.freshdeskDomain || ""}
                      onChange={(e) => setIntegrationForm({ ...integrationForm, freshdeskDomain: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Freshdesk API Key</label>
                    <input
                      type="password"
                      className={styles.formInput}
                      value={integrationForm.freshdeskApiKey || ""}
                      onChange={(e) => setIntegrationForm({ ...integrationForm, freshdeskApiKey: e.target.value })}
                    />
                  </div>
                </>
              )}

              <button
                className={styles.btnPrimary}
                style={{ alignSelf: "flex-start", marginTop: "10px" }}
                onClick={() => onSaveConfig(integrationForm)}
              >
                Save Integration Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
