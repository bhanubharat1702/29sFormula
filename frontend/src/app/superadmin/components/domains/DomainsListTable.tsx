"use client";

import React, { useState } from "react";
import styles from "../../page.module.css";
import { DomainRecord } from "../domainsTypes";

interface DomainsListTableProps {
  loading: boolean;
  domains: DomainRecord[];
  onViewDns: (domain: DomainRecord) => void;
  onRecheckDns: (domain: DomainRecord) => void;
  onForceSsl: (domain: DomainRecord) => void;
  onSetPrimary: (domain: DomainRecord) => void;
  onBlockDomain: (domain: DomainRecord) => void;
  onRemoveDomain: (domain: DomainRecord) => void;
}

export const DomainsListTable: React.FC<DomainsListTableProps> = ({
  loading,
  domains,
  onViewDns,
  onRecheckDns,
  onForceSsl,
  onSetPrimary,
  onBlockDomain,
  onRemoveDomain
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainRecord | null>(null);

  return (
    <>
      <div className={styles.settingsSectionCard} style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Domain</th>
              <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Merchant Store</th>
              <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Type</th>
              <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Status</th>
              <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                  Loading domain list...
                </td>
              </tr>
            ) : domains.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                  No matching domains found.
                </td>
              </tr>
            ) : (
              domains.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => setSelectedDomain(item)}
                  style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
                  className={styles.tableRowHover}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{item.domain}</span>
                      {item.isPrimary && (
                        <span style={{ padding: "2px 6px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                          ★ Primary
                        </span>
                      )}
                      {item.isBlocked && (
                        <span style={{ fontSize: "11px", background: "#fee2e2", color: "#991b1b", padding: "2px 6px", borderRadius: "4px" }}>
                          BLOCKED
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "500", color: "#374151" }}>{item.storeName}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: item.type === "custom" ? "#eff6ff" : "#f3f4f6",
                      color: item.type === "custom" ? "#1d4ed8" : "#374151",
                      border: `1px solid ${item.type === "custom" ? "#bfdbfe" : "#e5e7eb"}`
                    }}>
                      {item.type === "custom" ? "Custom Domain" : "Subdomain"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor:
                          item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "#f0fdf4" :
                          item.dnsStatus === "pending" ? "#fefce8" : "#fef2f2",
                        color:
                          item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "#15803d" :
                          item.dnsStatus === "pending" ? "#a16207" : "#dc2626",
                        border: `1px solid ${
                          item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "#bbf7d0" :
                          item.dnsStatus === "pending" ? "#fef08a" : "#fecaca"
                        }`
                      }}>
                        {item.dnsStatus === "dns_verified" || item.dnsStatus === "active" ? "✓ Verified" :
                         item.dnsStatus === "pending" ? "⏳ Pending" : "❌ Failed"}
                      </span>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor:
                          item.sslStatus === "active" ? "#f0fdf4" :
                          item.sslStatus === "pending" || item.sslStatus === "issuing" ? "#fefce8" : "#fef2f2",
                        color:
                          item.sslStatus === "active" ? "#15803d" :
                          item.sslStatus === "pending" || item.sslStatus === "issuing" ? "#a16207" : "#dc2626",
                        border: `1px solid ${
                          item.sslStatus === "active" ? "#bbf7d0" :
                          item.sslStatus === "pending" || item.sslStatus === "issuing" ? "#fef08a" : "#fecaca"
                        }`
                      }}>
                        🔒 {item.sslStatus.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        onClick={() => onViewDns(item)}
                        title="View DNS Info"
                      >
                        DNS Info
                      </button>
                      <button
                        className={styles.btnSecondary}
                        style={{ padding: "4px 8px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        onClick={() => onRecheckDns(item)}
                        title="Re-check DNS propagation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "13px", height: "13px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Re-check
                      </button>
                      {!item.isBlocked ? (
                        <button
                          className={styles.btnSecondary}
                          style={{ padding: "4px 8px", fontSize: "12px", color: "#dc2626", borderColor: "#fecaca" }}
                          onClick={() => onBlockDomain(item)}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className={styles.btnSecondary}
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                          onClick={() => onRemoveDomain(item)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Domain Full Details Pop-up Modal */}
      {selectedDomain && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setSelectedDomain(null)}
        >
          <div
            className={styles.settingsSectionCard}
            style={{ width: "90%", maxWidth: "540px", padding: "24px", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <h3 className={styles.settingsTitle} style={{ fontSize: "1.1rem", margin: 0 }}>
                  Domain Details: {selectedDomain.domain}
                </h3>
                <p className={styles.settingsSub} style={{ margin: "2px 0 0 0" }}>
                  Merchant: {selectedDomain.storeName}
                </p>
              </div>
              <button
                onClick={() => setSelectedDomain(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#374151" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>Subdomain Target:</span>
                <span style={{ fontWeight: 600 }}>{selectedDomain.subdomain}.yourplatform.com</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>Owner Email:</span>
                <span style={{ fontWeight: 600 }}>{selectedDomain.ownerEmail || "N/A"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>Domain Type:</span>
                <span style={{ fontWeight: 600 }}>{selectedDomain.type === "custom" ? "Custom Domain" : "Subdomain"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>Primary Status:</span>
                <span style={{ fontWeight: 600 }}>{selectedDomain.isPrimary ? "★ Primary Domain" : "Secondary Domain"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>DNS Propagation:</span>
                <span style={{ fontWeight: 600 }}>{selectedDomain.dnsStatus}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>SSL Certificate:</span>
                <span style={{ fontWeight: 600 }}>{selectedDomain.sslStatus}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>Added On:</span>
                <span>{new Date(selectedDomain.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>Last DNS Verification:</span>
                <span>{selectedDomain.lastDnsCheckAt ? new Date(selectedDomain.lastDnsCheckAt).toLocaleString() : "Never"}</span>
              </div>
              {selectedDomain.dnsFailureReason && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "10px", borderRadius: "6px", color: "#dc2626" }}>
                  <strong>DNS Failure Reason:</strong> {selectedDomain.dnsFailureReason}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              {!selectedDomain.isPrimary && (
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    onSetPrimary(selectedDomain);
                    setSelectedDomain(null);
                  }}
                >
                  Set as Primary
                </button>
              )}
              <button
                className={styles.btnPrimary}
                onClick={() => setSelectedDomain(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
