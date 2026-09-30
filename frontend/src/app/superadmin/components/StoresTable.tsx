import React from "react";
import styles from "../page.module.css";
import { StoreItem } from "./types";

interface StoresTableProps {
  activeTab: string;
  loading: boolean;
  filteredStores: StoreItem[];
  onOpenEditModal: (store: StoreItem) => void;
  onToggleStatus: (store: StoreItem) => void;
  onDeleteStore: (storeId: string, subdomain: string) => void;
  onSelectStore?: (store: StoreItem) => void;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  activeTab,
  loading,
  filteredStores,
  onOpenEditModal,
  onToggleStatus,
  onDeleteStore,
  onSelectStore
}) => {
  if (activeTab !== "stores" && activeTab !== "dashboard") return null;

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Store / Subdomain</th>
            <th>Custom Domain</th>
            <th>Products</th>
            <th>Orders</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                Loading merchant stores...
              </td>
            </tr>
          ) : filteredStores.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                No stores found.
              </td>
            </tr>
          ) : (
            filteredStores.map((store) => (
              <tr
                key={store._id}
                onClick={() => onSelectStore && onSelectStore(store)}
                style={{ cursor: "pointer" }}
                title="Click anywhere on this row to view full merchant information"
              >
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {store.businessLogo ? (
                      <img
                        src={store.businessLogo}
                        alt={store.name}
                        style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e5e7eb" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #e5e7eb"
                        }}
                      >
                        {(store.name || "M").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className={styles.storeName}>{store.name}</div>
                      <div className={styles.subdomain}>
                        <a
                          href={`http://${store.subdomain}.localhost:3000`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {store.subdomain}.localhost:3000
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {store.customDomain ? (
                    <span style={{ color: "#2563eb", fontWeight: 600 }}>{store.customDomain}</span>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Unconfigured</span>
                  )}
                </td>
                <td>{store.productCount ?? 0}</td>
                <td>{store.orderCount ?? 0}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      store.plan === "enterprise"
                        ? styles.badgeEnterprise
                        : store.plan === "pro"
                        ? styles.badgePro
                        : styles.badgeStarter
                    }`}
                  >
                    {(store.plan || "pro").toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={store.isActive ? styles.statusActive : styles.statusSuspended}>
                    {store.isActive ? "● Active" : "● Suspended"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(store);
                      }}
                      className={styles.btnAction}
                      style={{ background: "#f3f4f6", color: "#374151" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(store);
                      }}
                      className={styles.btnAction}
                    >
                      {store.isActive ? "Suspend" : "Activate"}
                    </button>
                    {store.subdomain !== "default" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStore(store._id, store.subdomain);
                        }}
                        className={`${styles.btnAction} ${styles.btnActionDanger}`}
                      >
                        Delete
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
  );
};
