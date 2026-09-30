import React from "react";
import styles from "../../page.module.css";
import { StoreItem } from "../types";

interface MerchantDetailsModalProps {
  store: StoreItem | null;
  onClose: () => void;
  onOpenEdit: (store: StoreItem) => void;
  onToggleStatus: (store: StoreItem) => void;
}

export const MerchantDetailsModal: React.FC<MerchantDetailsModalProps> = ({
  store,
  onClose,
  onOpenEdit,
  onToggleStatus
}) => {
  if (!store) return null;

  const ownerName = store.ownerName || (typeof store.ownerId === "object" ? store.ownerId?.name : "") || "Not specified";
  const ownerEmail = store.ownerEmail || (typeof store.ownerId === "object" ? store.ownerId?.email : "") || "Not specified";
  const ownerPhone = store.ownerPhone || "Not specified";
  const storefrontUrl = `http://${store.subdomain}.localhost:3000`;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalBox}
        style={{ maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", padding: "32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {store.businessLogo ? (
              <img
                src={store.businessLogo}
                alt={store.name}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
              />
            ) : (
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  backgroundColor: "#0c0a09",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                {(store.name || "M").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0c0a09", margin: 0 }}>
                  {store.name}
                </h2>
                <span
                  className={`${styles.badge} ${
                    store.plan === "enterprise"
                      ? styles.badgeEnterprise
                      : store.plan === "pro"
                      ? styles.badgePro
                      : styles.badgeStarter
                  }`}
                >
                  {(store.plan || "starter").toUpperCase()}
                </span>
                <span className={store.isActive ? styles.statusActive : styles.statusSuspended}>
                  {store.isActive ? "● Active" : "● Suspended"}
                </span>
              </div>
              <div style={{ fontSize: "0.88rem", color: "#6b7280", marginTop: "4px" }}>
                Subdomain:{" "}
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 500 }}
                >
                  {store.subdomain}.localhost:3000
                </a>
              </div>
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

        {/* Highlight Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            backgroundColor: "#f9fafb",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #f3f4f6",
            marginBottom: "24px"
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Products</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827" }}>{store.productCount ?? 0}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Orders</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827" }}>{store.orderCount ?? 0}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Health Score</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981" }}>{store.healthScore ?? 95}%</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>MRR</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#2563eb" }}>₹{store.mrr ?? 0}</div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          {/* Owner Details Card */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              👤 Owner Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
              <div>
                <span style={{ color: "#6b7280" }}>Full Name: </span>
                <strong style={{ color: "#111827" }}>{ownerName}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Email: </span>
                <strong style={{ color: "#111827" }}>{ownerEmail}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Phone: </span>
                <strong style={{ color: "#111827" }}>{ownerPhone}</strong>
              </div>
            </div>
          </div>

          {/* Business & Region Card */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              🏢 Business & Settings
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
              <div>
                <span style={{ color: "#6b7280" }}>Business Category: </span>
                <strong style={{ color: "#111827", textTransform: "capitalize" }}>{store.businessType || "Retail"}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Custom Domain: </span>
                <strong style={{ color: store.customDomain ? "#2563eb" : "#9ca3af" }}>
                  {store.customDomain || "Unconfigured"}
                </strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Country / Currency: </span>
                <strong style={{ color: "#111827" }}>
                  {store.country || "India"} ({store.currency || "INR"})
                </strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Timezone: </span>
                <strong style={{ color: "#111827" }}>{store.timezone || "Asia/Kolkata"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure & Audit Section */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#ffffff", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            ⚙️ Infrastructure & Registration
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>Store ID:</span>
              <code style={{ fontSize: "0.78rem", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                {store._id}
              </code>
            </div>
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>Provisioned By:</span>
              <strong style={{ color: "#111827", textTransform: "capitalize" }}>{store.provisionedBy || "Super Admin"}</strong>
            </div>
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>Created On:</span>
              <strong style={{ color: "#111827" }}>
                {store.createdAt ? new Date(store.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
              </strong>
            </div>
          </div>
        </div>

        {/* Internal Notes Section */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#f9fafb", marginBottom: "28px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            📝 Internal Notes
          </h3>
          <p style={{ fontSize: "0.85rem", color: store.internalNotes ? "#374151" : "#9ca3af", margin: 0, fontStyle: store.internalNotes ? "normal" : "italic" }}>
            {store.internalNotes || "No internal notes provided for this merchant store."}
          </p>
        </div>

        {/* Actions Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnAction}
            style={{
              padding: "10px 18px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.88rem"
            }}
          >
            🚀 Open Storefront
          </a>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                onClose();
                onOpenEdit(store);
              }}
              className={styles.btnAction}
              style={{ padding: "10px 18px", background: "#f3f4f6", color: "#374151", borderRadius: "8px", fontWeight: 600 }}
            >
              ✏️ Edit Store
            </button>
            <button
              onClick={() => {
                onToggleStatus(store);
              }}
              className={styles.btnAction}
              style={{
                padding: "10px 18px",
                background: store.isActive ? "#fee2e2" : "#dcfce7",
                color: store.isActive ? "#991b1b" : "#166534",
                borderRadius: "8px",
                fontWeight: 600
              }}
            >
              {store.isActive ? "⏸️ Suspend Store" : "▶️ Activate Store"}
            </button>
            <button
              onClick={onClose}
              className={styles.btnAction}
              style={{ padding: "10px 18px", background: "#111827", color: "#ffffff", borderRadius: "8px", fontWeight: 600 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
