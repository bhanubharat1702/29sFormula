"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

interface StoreItem {
  _id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  ownerId?: { name?: string; email?: string };
  productCount?: number;
  orderCount?: number;
  plan?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface Stats {
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [newStoreName, setNewStoreName] = useState("");
  const [newSubdomain, setNewSubdomain] = useState("");
  const [newCustomDomain, setNewCustomDomain] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newPlan, setNewPlan] = useState("pro");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, storesRes] = await Promise.all([
        fetch(`${API_BASE}/api/superadmin/stats`),
        fetch(`${API_BASE}/api/superadmin/stores`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (storesRes.ok) setStores(await storesRes.json());
    } catch (err) {
      console.error("Error loading SuperAdmin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/superadmin/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStoreName,
          subdomain: newSubdomain,
          customDomain: newCustomDomain,
          ownerEmail: newOwnerEmail,
          plan: newPlan
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create store.");

      setIsModalOpen(false);
      setNewStoreName("");
      setNewSubdomain("");
      setNewCustomDomain("");
      setNewOwnerEmail("");
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (store: StoreItem) => {
    try {
      const res = await fetch(`${API_BASE}/api/superadmin/stores/${store._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !store.isActive })
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteStore = async (storeId: string, subdomain: string) => {
    if (subdomain === "default") {
      alert("Cannot delete the Default Store.");
      return;
    }
    if (!confirm("Are you sure you want to delete this store?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/superadmin/stores/${storeId}`, {
        method: "DELETE"
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to delete store:", err);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customDomain && s.customDomain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Super Admin Platform Portal</h1>
          <p className={styles.subtitle}>Manage multi-tenant merchant stores, domains, and global performance</p>
        </div>
        <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
          + Provision New Store
        </button>
      </div>

      {/* Platform Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Merchant Stores</div>
          <div className={styles.statValue}>{stats?.totalStores ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Stores</div>
          <div className={styles.statValue} style={{ color: "#34d399" }}>
            {stats?.activeStores ?? 0}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Platform Products</div>
          <div className={styles.statValue}>{stats?.totalProducts ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Platform Orders</div>
          <div className={styles.statValue}>{stats?.totalOrders ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Global Platform GMV</div>
          <div className={styles.statValue} style={{ color: "#60a5fa" }}>
            ₹{stats?.totalRevenue.toLocaleString() ?? 0}
          </div>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className={styles.actionBar}>
        <input
          type="text"
          placeholder="Search by store name, subdomain, or domain..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Merchants Table */}
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
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Loading tenant stores...
                </td>
              </tr>
            ) : filteredStores.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No stores found.
                </td>
              </tr>
            ) : (
              filteredStores.map((store) => (
                <tr key={store._id}>
                  <td>
                    <div className={styles.storeName}>{store.name}</div>
                    <div className={styles.subdomain}>{store.subdomain}.yourplatform.com</div>
                  </td>
                  <td>
                    {store.customDomain ? (
                      <span style={{ color: "#60a5fa", fontWeight: 600 }}>{store.customDomain}</span>
                    ) : (
                      <span style={{ color: "#64748b", fontSize: "0.8rem" }}>Unconfigured</span>
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
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleToggleStatus(store)}
                        style={{
                          background: "transparent",
                          border: "1px solid #334155",
                          color: "#cbd5e1",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        {store.isActive ? "Suspend" : "Activate"}
                      </button>
                      {store.subdomain !== "default" && (
                        <button
                          onClick={() => handleDeleteStore(store._id, store.subdomain)}
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
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

      {/* Provision Store Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Provision New Merchant Store</h2>
            {formError && (
              <div style={{ backgroundColor: "#ef444422", color: "#f87171", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "0.85rem" }}>
                {formError}
              </div>
            )}
            <form onSubmit={handleCreateStore}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Store Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxe Fragrances"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Platform Subdomain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. luxe"
                  value={newSubdomain}
                  onChange={(e) => setNewSubdomain(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Custom CNAME Domain (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. www.luxeparfum.com"
                  value={newCustomDomain}
                  onChange={(e) => setNewCustomDomain(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Store Owner Email (Optional)</label>
                <input
                  type="email"
                  placeholder="owner@luxeparfum.com"
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subscription Plan</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className={styles.input}
                >
                  <option value="starter">Starter Plan</option>
                  <option value="pro">Pro Plan</option>
                  <option value="enterprise">Enterprise Plan</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? "Provisioning..." : "Create Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
