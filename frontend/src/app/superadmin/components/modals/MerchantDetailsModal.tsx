import React, { useState, useEffect } from "react";
import styles from "./MerchantDetailsModal.module.css";
import pageStyles from "../../page.module.css";
import { StoreItem } from "../types";

interface MerchantDetailsModalProps {
  store: StoreItem | null;
  onClose: () => void;
  onOpenEdit: (store: StoreItem) => void;
  onToggleStatus: (store: StoreItem) => void;
  onDeleteStore?: (store: StoreItem) => void;
}

const LOCAL_HOST_RE = /localhost|127\.0\.0\.1|0\.0\.0\.0/;

const countryToAlpha2 = (country?: string): string => {
  if (!country) return "";
  const codes: Record<string, string> = {
    india: "in",
    "united states": "us",
    usa: "us",
    "united kingdom": "gb",
    uk: "gb",
    canada: "ca",
    australia: "au",
    germany: "de",
    france: "fr",
    sweden: "se",
    singapore: "sg",
    "united arab emirates": "ae",
    uae: "ae",
    netherlands: "nl",
    spain: "es",
    italy: "it",
    brazil: "br",
    japan: "jp",
    china: "cn",
    mexico: "mx",
    "south africa": "za",
  };
  const key = country.toLowerCase().trim();
  return codes[key] || key.replace(/[^a-z]/g, "").slice(0, 2);
};

const CountryFlag: React.FC<{ country?: string }> = ({ country }) => {
  const [failed, setFailed] = useState(false);
  const code = countryToAlpha2(country);
  if (!code || failed) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={country || "Country flag"}
      onError={() => setFailed(true)}
      style={{
        width: "20px",
        height: "14px",
        objectFit: "cover",
        borderRadius: "2px",
        border: "1px solid rgba(15, 23, 42, 0.15)",
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
};

export const MerchantDetailsModal: React.FC<MerchantDetailsModalProps> = ({
  store,
  onClose,
  onOpenEdit,
  onToggleStatus,
  onDeleteStore,
}) => {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isModalOpen = !!store;

  // Handle Lenis smooth scrolling pause & document overflow locking (identical to CartDrawer)
  useEffect(() => {
    if (isModalOpen) {
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }

      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.start();
        }
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  if (!store && !isClosing) return null;
  if (!store) return null;

  const ownerName = store.ownerName || (typeof store.ownerId === "object" ? store.ownerId?.name : "") || "Not specified";
  const ownerEmail = store.ownerEmail || (typeof store.ownerId === "object" ? store.ownerId?.email : "") || "Not specified";
  const ownerPhone = store.ownerPhone || (typeof store.ownerId === "object" ? store.ownerId?.phone : "") || "Not specified";

  const runtimeHost = typeof window !== "undefined" ? window.location.host : "localhost:3000";
  const isLocal = LOCAL_HOST_RE.test(runtimeHost);
  const storefrontUrl = isLocal
    ? `http://${store.subdomain || "store"}.${runtimeHost}`
    : store.customDomain
    ? `https://${store.customDomain}`
    : `https://${store.subdomain}.29sformula.com`;

  const merchantAdminUrl = isLocal
    ? `http://${store.subdomain || "store"}.${runtimeHost}/admin`
    : store.customDomain
    ? `https://${store.customDomain}/admin`
    : `https://${store.subdomain}.29sformula.com/admin`;

  const planName = (store.plan || "starter").toUpperCase();
  const isActive = store.isActive !== false;

  const handleImpersonate = async () => {
    try {
      setIsImpersonating(true);
      const superAdminToken = localStorage.getItem("superAdminToken") || "";
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const res = await fetch(`${apiBase}/api/superadmin/stores/${store._id}/impersonate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${superAdminToken}`
        },
        body: JSON.stringify({ reason: "Super Admin Troubleshooting Session" })
      });

      if (res.ok) {
        const data = await res.json();
        const impersonationToken = data.token;
        const targetUrl = `${merchantAdminUrl}?impersonationToken=${encodeURIComponent(impersonationToken)}`;
        window.open(targetUrl, "_blank");
      } else {
        const targetUrl = `${merchantAdminUrl}?impersonationToken=${encodeURIComponent(superAdminToken)}`;
        window.open(targetUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to launch impersonation session:", err);
      window.open(merchantAdminUrl, "_blank");
    } finally {
      setIsImpersonating(false);
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={handleClose}
      data-lenis-prevent="true"
    >
      <div
        className={`${styles.drawer} ${isClosing ? styles.drawerClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Drawer Header & Action Toolbar */}
        <div className={styles.drawerHeader}>
          {/* Top Title Bar */}
          <div className={styles.headerTop}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
              {store.businessLogo ? (
                <img
                  src={store.businessLogo}
                  alt={store.name}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    objectFit: "cover",
                    border: "2px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    flexShrink: 0
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    backgroundColor: "#4338ca",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    letterSpacing: "0.02em"
                  }}
                >
                  {(store.name || "M").charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {store.name}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: store.plan === "enterprise" ? "#fef3c7" : store.plan === "pro" ? "#e0e7ff" : "#f1f5f9",
                      color: store.plan === "enterprise" ? "#92400e" : store.plan === "pro" ? "#3730a3" : "#475569",
                      border: `1px solid ${store.plan === "enterprise" ? "#fde68a" : store.plan === "pro" ? "#c7d2fe" : "#cbd5e1"}`,
                      textTransform: "uppercase"
                    }}
                  >
                    {planName}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: isActive ? "#ecfdf5" : "#fef2f2",
                      color: isActive ? "#047857" : "#991b1b",
                      border: `1px solid ${isActive ? "#a7f3d0" : "#fecaca"}`
                    }}
                  >
                    {isActive ? "● Active" : "● Suspended"}
                  </span>
                </div>

                <div style={{ fontSize: "0.82rem", color: "#64748b", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span>Subdomain:</span>
                  <a
                    href={storefrontUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}
                  >
                    {store.subdomain || "default"}.29sformula.com
                  </a>
                  {store.customDomain && (
                    <>
                      <span style={{ color: "#cbd5e1" }}>•</span>
                      <a
                        href={`https://${store.customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}
                      >
                        🌐 {store.customDomain}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s ease"
              }}
              title="Close Drawer (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Action Toolbar */}
          <div className={styles.actionToolbar}>
            <a
              href={storefrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={pageStyles.btnAction}
              style={{
                padding: "7px 14px",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              🚀 Open Storefront
            </a>

            <button
              onClick={handleImpersonate}
              disabled={isImpersonating}
              className={pageStyles.btnAction}
              style={{
                padding: "7px 14px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.82rem",
                border: "none",
                cursor: isImpersonating ? "wait" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                opacity: isImpersonating ? 0.7 : 1
              }}
            >
              {isImpersonating ? "⏳ Launching..." : "🔑 Impersonate Admin"}
            </button>

            <button
              onClick={() => {
                handleClose();
                onOpenEdit(store);
              }}
              className={pageStyles.btnAction}
              style={{
                padding: "7px 14px",
                backgroundColor: "#f1f5f9",
                color: "#334155",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.82rem",
                border: "1px solid #cbd5e1",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              ✏️ Edit Store
            </button>

            <button
              onClick={() => onToggleStatus(store)}
              className={pageStyles.btnAction}
              style={{
                padding: "7px 14px",
                backgroundColor: isActive ? "#fef2f2" : "#ecfdf5",
                color: isActive ? "#991b1b" : "#047857",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.82rem",
                border: `1px solid ${isActive ? "#fecaca" : "#a7f3d0"}`,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
            >
              {isActive ? "⏸️ Suspend" : "▶️ Activate"}
            </button>

            {onDeleteStore && store.subdomain !== "default" && (
              <button
                onClick={() => {
                  handleClose();
                  onDeleteStore(store);
                }}
                className={pageStyles.btnAction}
                style={{
                  padding: "7px 14px",
                  backgroundColor: "#fff1f2",
                  color: "#be123c",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  border: "1px solid #fecdd3",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap"
                }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body & Content List (Replicating CartDrawer architecture) */}
        <div className={styles.drawerBody}>
          <div className={styles.contentList} data-lenis-prevent="true">
            {/* GROUP 1: 📊 KEY PERFORMANCE & HEALTH METRICS */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>📊</span> Merchant Health & Performance Metrics
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Total Products</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    {store.productCount ?? 0}
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Total Orders</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    {store.orderCount ?? 0}
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Health Score</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: (store.healthScore ?? 95) > 80 ? "#059669" : (store.healthScore ?? 95) > 50 ? "#d97706" : "#dc2626", marginTop: "4px" }}>
                    {store.healthScore ?? 95}%
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Monthly Revenue</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#4f46e5", marginTop: "4px" }}>
                    ₹{(store.mrr ?? 0).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.82rem", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                <div>
                  <span style={{ color: "#64748b" }}>Last Active Activity: </span>
                  <strong style={{ color: "#0f172a" }}>{formatDate(store.lastActiveAt || store.updatedAt)}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Trial Period Status: </span>
                  <strong style={{ color: store.trialDays ? "#0284c7" : "#64748b" }}>
                    {store.trialDays ? `${store.trialDays} Days (${store.trialEndsAt ? `Ends ${formatDate(store.trialEndsAt)}` : "Active"})` : "N/A (Standard Plan)"}
                  </strong>
                </div>
              </div>
            </div>

            {/* GROUP 2: 🏛️ CORE STORE IDENTITY & PROVISIONING */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>🏛️</span> Store Identity & Provisioning Details
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.85rem" }}>
                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Store Display Name:</span>
                  <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>{store.name}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Legal / Business Name:</span>
                  <strong style={{ color: "#0f172a" }}>{store.businessName || store.name}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Tenant Database ID (_id):</span>
                  <code style={{ backgroundColor: "#f1f5f9", padding: "3px 6px", borderRadius: "4px", color: "#334155", fontSize: "0.78rem" }}>
                    {store._id}
                  </code>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Subdomain Handle:</span>
                  <code style={{ backgroundColor: "#f1f5f9", padding: "3px 6px", borderRadius: "4px", color: "#4f46e5", fontWeight: 600 }}>
                    {store.subdomain || "default"}
                  </code>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Primary Custom Domain:</span>
                  <strong style={{ color: store.customDomain ? "#059669" : "#94a3b8" }}>
                    {store.customDomain || "Not Configured"}
                  </strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Infrastructure Isolation Tier:</span>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    backgroundColor: store.isolationTier === "dedicated_db" ? "#fef3c7" : store.isolationTier === "enterprise_cluster" ? "#f3e8ff" : "#f1f5f9",
                    color: store.isolationTier === "dedicated_db" ? "#92400e" : store.isolationTier === "enterprise_cluster" ? "#6b21a8" : "#475569",
                    textTransform: "uppercase"
                  }}>
                    {store.isolationTier || "shared"}
                  </span>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Provisioned By:</span>
                  <strong style={{ color: "#0f172a", textTransform: "capitalize" }}>{store.provisionedBy || "Super Admin"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Store Lifecycle Status:</span>
                  <strong style={{ color: isActive ? "#059669" : "#dc2626", textTransform: "uppercase" }}>
                    {store.status || (isActive ? "active" : "suspended")}
                  </strong>
                  {store.suspensionReason && (
                    <div style={{ fontSize: "0.78rem", color: "#dc2626", marginTop: "2px" }}>
                      Reason: {store.suspensionReason}
                    </div>
                  )}
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Account Created Date:</span>
                  <strong style={{ color: "#0f172a" }}>{formatDate(store.createdAt)}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Last Config Update:</span>
                  <strong style={{ color: "#0f172a" }}>{formatDate(store.updatedAt)}</strong>
                </div>
              </div>
            </div>

            {/* GROUP 3: 👤 OWNER & SUPPORT CONTACT DATA */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>👤</span> Merchant Owner & Customer Support Info
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.85rem" }}>
                <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Owner Account Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <span style={{ color: "#64748b" }}>Full Name: </span>
                      <strong style={{ color: "#0f172a" }}>{ownerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>Email: </span>
                      <a href={`mailto:${ownerEmail}`} style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
                        {ownerEmail}
                      </a>
                      {store.ownerEmailVerified ? (
                        <span style={{ fontSize: "0.7rem", color: "#059669", backgroundColor: "#ecfdf5", padding: "1px 6px", borderRadius: "4px", marginLeft: "6px" }}>Verified ✓</span>
                      ) : (
                        <span style={{ fontSize: "0.7rem", color: "#d97706", backgroundColor: "#fffbebe", padding: "1px 6px", borderRadius: "4px", marginLeft: "6px" }}>Unverified</span>
                      )}
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>Phone: </span>
                      <strong style={{ color: "#0f172a" }}>{ownerPhone}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Public Customer Support Contact</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <span style={{ color: "#64748b" }}>Support Email: </span>
                      <a href={`mailto:${store.supportEmail || ownerEmail}`} style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
                        {store.supportEmail || ownerEmail}
                      </a>
                      {store.supportEmailVerified && (
                        <span style={{ fontSize: "0.7rem", color: "#059669", backgroundColor: "#ecfdf5", padding: "1px 6px", borderRadius: "4px", marginLeft: "6px" }}>Verified ✓</span>
                      )}
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>Support Phone: </span>
                      <strong style={{ color: "#0f172a" }}>{store.supportPhone || ownerPhone}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 4: 📍 LOCATION & REGIONAL CONFIGURATION */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>📍</span> Regional & Location Settings
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.85rem" }}>
                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Industry Category:</span>
                  <strong style={{ color: "#0f172a", textTransform: "capitalize" }}>{store.businessType || "Retail"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Base Currency:</span>
                  <strong style={{ color: "#0f172a" }}>{store.currency || "INR"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Store Timezone:</span>
                  <strong style={{ color: "#0f172a" }}>{store.timezone || "Asia/Kolkata"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Country / Region:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CountryFlag country={store.country || "India"} />
                    <strong style={{ color: "#0f172a" }}>{store.country || "India"}</strong>
                  </div>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Physical Business Address:</span>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "6px", color: "#334155", border: "1px solid #e2e8f0" }}>
                    {store.address1 || store.address2 || store.city || store.state || store.postalCode ? (
                      <>
                        {store.address1 && <div>{store.address1}</div>}
                        {store.address2 && <div>{store.address2}</div>}
                        <div>
                          {[store.city, store.state, store.postalCode, store.country].filter(Boolean).join(", ")}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No physical address on file</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 5: 💳 BILLING, SUBSCRIPTION & INVOICES */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>💳</span> Plan, Billing & Financial Records
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.85rem", marginBottom: "16px" }}>
                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Subscribed Tier Plan:</span>
                  <strong style={{ color: "#4f46e5", fontSize: "0.95rem", textTransform: "uppercase" }}>{store.plan || "Starter"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Billing Frequency:</span>
                  <strong style={{ color: "#0f172a", textTransform: "capitalize" }}>{store.billing?.billingCycle || "Monthly"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Subscription Gateway ID:</span>
                  <code style={{ fontSize: "0.78rem", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                    {store.billing?.subscriptionId || "sub_live_default_01"}
                  </code>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Primary Payment Method:</span>
                  <strong style={{ color: "#0f172a" }}>{store.billing?.paymentMethod || "Credit Card **** 4242"}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Account Credits Balance:</span>
                  <strong style={{ color: "#059669" }}>₹{store.billing?.credits || 0}</strong>
                </div>

                <div>
                  <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Active Discount:</span>
                  <strong style={{ color: store.billing?.discountPercent ? "#d97706" : "#64748b" }}>
                    {store.billing?.discountPercent ? `${store.billing.discountPercent}% Off` : "None"}
                  </strong>
                </div>
              </div>

              {/* Invoices List */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Recent Invoices</div>
                {store.billing?.invoices && store.billing.invoices.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
                        <th style={{ padding: "6px 10px" }}>Invoice ID</th>
                        <th style={{ padding: "6px 10px" }}>Date</th>
                        <th style={{ padding: "6px 10px" }}>Amount</th>
                        <th style={{ padding: "6px 10px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.billing.invoices.map((inv, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "6px 10px" }}><code>{inv.invoiceId}</code></td>
                          <td style={{ padding: "6px 10px" }}>{formatDate(inv.date)}</td>
                          <td style={{ padding: "6px 10px", fontWeight: 600 }}>₹{inv.amount}</td>
                          <td style={{ padding: "6px 10px" }}>
                            <span style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              backgroundColor: inv.status === "paid" ? "#ecfdf5" : "#fef2f2",
                              color: inv.status === "paid" ? "#047857" : "#991b1b"
                            }}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                    No past payment invoices recorded.
                  </div>
                )}
              </div>
            </div>

            {/* GROUP 6: 🌐 DOMAINS & SSL PROVISIONING STATUS */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>🌐</span> Custom Domains & SSL Certificates
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px dashed #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Platform Subdomain:</span>
                  <code style={{ color: "#4f46e5" }}>{store.subdomain || "default"}.29sformula.com</code>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px dashed #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Custom Domain:</span>
                  <code>{store.customDomain || "Not attached"}</code>
                </div>

                {store.domains && store.domains.length > 0 ? (
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", margin: "10px 0 6px 0" }}>Registered Routing Domains</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {store.domains.map((d, i) => (
                        <div key={i} style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <strong style={{ color: "#0f172a", fontSize: "0.88rem" }}>{d.domain}</strong>
                            {d.isPrimary && <span style={{ fontSize: "0.68rem", backgroundColor: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px" }}>Primary</span>}
                            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>Type: {d.type}</div>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#ecfdf5", color: "#047857", fontWeight: 600 }}>
                              DNS: {d.dnsStatus || "verified"}
                            </span>
                            <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#ecfdf5", color: "#047857", fontWeight: 600 }}>
                              SSL: {d.sslStatus || "active"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>SSL Security Certificate:</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>Active (Wildcard Let's Encrypt SSL)</span>
                  </div>
                )}
              </div>
            </div>

            {/* GROUP 7: ⚡ CUSTOM QUOTAS & RESOURCE LIMIT OVERRIDES */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>⚡</span> Resource Quotas & Overrides
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Max Products</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    {store.limitOverrides?.maxProducts ?? "Unlimited"}
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Max Monthly Orders</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    {store.limitOverrides?.maxOrders ?? "Unlimited"}
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Staff Accounts</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    {store.limitOverrides?.maxStaff ?? "5 Seats"}
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Max Storage</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    {store.limitOverrides?.maxStorageMB ? `${store.limitOverrides.maxStorageMB} MB` : "10 GB"}
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 8: 🚩 FEATURE FLAGS & MODULE ENTITLEMENTS */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>🚩</span> Feature Flags & Module Entitlements
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { label: "Custom Domain", enabled: store.featureFlags?.customDomain ?? true },
                  { label: "Advanced Analytics", enabled: store.featureFlags?.advancedAnalytics ?? true },
                  { label: "AI Copywriter Tools", enabled: store.featureFlags?.aiTools ?? true },
                  { label: "Loyalty Program", enabled: store.featureFlags?.loyaltyProgram ?? false },
                  { label: "Multi-Currency Checkout", enabled: store.featureFlags?.multiCurrency ?? false },
                  { label: "Beta Checkout Engine", enabled: store.featureFlags?.betaCheckout ?? false },
                ].map((flag, i) => (
                  <div key={i} style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: flag.enabled ? "#f0fdf4" : "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>{flag.label}</span>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: flag.enabled ? "#dcfce7" : "#e2e8f0",
                      color: flag.enabled ? "#15803d" : "#64748b"
                    }}>
                      {flag.enabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GROUP 9: 📝 SUPER ADMIN NOTES & AUDIT TRAIL LOGS */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                <span>📝</span> Super Admin Notes & System Audit History
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Internal Notes */}
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Internal Operational Notes</div>
                  <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", color: store.internalNotes ? "#334155" : "#94a3b8", fontStyle: store.internalNotes ? "normal" : "italic" }}>
                    {store.internalNotes || "No specific internal administrator notes recorded for this merchant account."}
                  </div>
                </div>

                {/* Impersonation History if any */}
                {store.impersonationLogs && store.impersonationLogs.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Super Admin Impersonation Log</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {store.impersonationLogs.map((log, idx) => (
                        <div key={idx} style={{ padding: "8px 12px", backgroundColor: "#fffbebe", borderRadius: "6px", border: "1px solid #fef3c7", fontSize: "0.78rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{log.superAdminEmail}</strong>: {log.reason}
                          </div>
                          <div style={{ color: "#92400e" }}>{formatDate(log.timestamp)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Trail if any */}
                {store.auditTrail && store.auditTrail.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Recent Tenant Audit Log</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {store.auditTrail.slice(0, 5).map((log, idx) => (
                        <div key={idx} style={{ padding: "8px 12px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.78rem", display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <strong style={{ color: "#0f172a" }}>{log.action}</strong> - <span style={{ color: "#64748b" }}>{log.details}</span>
                          </div>
                          <div style={{ color: "#64748b" }}>{formatDate(log.timestamp)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className={styles.drawerFooter}>
          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Merchant Context ID: <code style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{store._id}</code>
          </span>

          <button
            onClick={handleClose}
            className={pageStyles.btnAction}
            style={{
              padding: "8px 20px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
