import React from "react";
import styles from "../../page.module.css";
import { StoreItem } from "../types";

interface StoresTableProps {
  activeTab: string;
  loading: boolean;
  filteredStores: StoreItem[];
  onOpenEditModal: (store: StoreItem) => void;
  onToggleStatus: (store: StoreItem) => void;
  onDeleteStore: (storeId: string, subdomain: string) => void;
  onSelectStore?: (store: StoreItem) => void;
  currentPage?: number;
  totalPages?: number;
  totalStores?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  activeTab,
  loading,
  filteredStores,
  onOpenEditModal,
  onToggleStatus,
  onDeleteStore,
  onSelectStore,
  currentPage = 1,
  totalPages = 1,
  totalStores = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  if (activeTab !== "stores" && activeTab !== "dashboard") return null;

  const startItem = totalStores === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalStores || filteredStores.length);

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

      {/* Server-Side / Dynamic Pagination Control Bar */}
      {activeTab === "stores" && onPageChange && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalStores || filteredStores.length}</strong> merchant stores
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {onPageSizeChange && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#374151" }}>
                <span>Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f9fafb",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={styles.btnAction}
                style={{
                  opacity: currentPage <= 1 ? 0.5 : 1,
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer"
                }}
              >
                ◀ Previous
              </button>

              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", padding: "0 8px" }}>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={styles.btnAction}
                style={{
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                  cursor: currentPage >= totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
