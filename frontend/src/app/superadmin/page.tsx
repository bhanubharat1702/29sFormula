"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

interface DemoRequestItem {
  _id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  subdomain?: string;
  businessType?: string;
  message?: string;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  createdAt: string;
}

interface Stats {
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalDemoRequests?: number;
  pendingDemoRequests?: number;
}

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Stats & Data
  const [stats, setStats] = useState<Stats | null>(null);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"stores" | "demo-requests">("stores");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Store Creation Form State
  const [newStoreName, setNewStoreName] = useState("");
  const [newSubdomain, setNewSubdomain] = useState("");
  const [newCustomDomain, setNewCustomDomain] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newPlan, setNewPlan] = useState("pro");
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";

  // Check auth & fetch data
  const verifyAuthAndFetch = async () => {
    const token = localStorage.getItem("superAdminToken");
    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);
      return;
    }

    try {
      const authRes = await fetch(`${API_BASE}/api/superadmin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!authRes.ok) {
        localStorage.removeItem("superAdminToken");
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      setIsAuthenticated(true);
      setCheckingAuth(false);
      fetchData(token);
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setCheckingAuth(false);
    }
  };

  const fetchData = async (authToken?: string) => {
    const token = authToken || localStorage.getItem("superAdminToken");
    if (!token) return;

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, storesRes, demoRes] = await Promise.all([
        fetch(`${API_BASE}/api/superadmin/stats`, { headers }),
        fetch(`${API_BASE}/api/superadmin/stores`, { headers }),
        fetch(`${API_BASE}/api/superadmin/demo-requests`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (storesRes.ok) setStores(await storesRes.json());
      if (demoRes.ok) setDemoRequests(await demoRes.json());
    } catch (err) {
      console.error("Error loading SuperAdmin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAuthAndFetch();
  }, []);

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/superadmin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      localStorage.setItem("superAdminToken", data.token);
      setIsAuthenticated(true);
      fetchData(data.token);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    setIsAuthenticated(false);
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const token = localStorage.getItem("superAdminToken");

    try {
      const res = await fetch(`${API_BASE}/api/superadmin/stores`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newStoreName,
          subdomain: newSubdomain,
          customDomain: newCustomDomain,
          ownerEmail: newOwnerEmail,
          plan: newPlan,
          demoRequestId: selectedDemoId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create store.");

      setIsModalOpen(false);
      setNewStoreName("");
      setNewSubdomain("");
      setNewCustomDomain("");
      setNewOwnerEmail("");
      setSelectedDemoId(null);
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (store: StoreItem) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`${API_BASE}/api/superadmin/stores/${store._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !store.isActive })
      });

      if (res.ok) fetchData();
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

    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`${API_BASE}/api/superadmin/stores/${storeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to delete store:", err);
    }
  };

  const handleProvisionFromDemo = (demo: DemoRequestItem) => {
    setNewStoreName(demo.storeName);
    setNewSubdomain(demo.subdomain || demo.storeName.toLowerCase().replace(/[^a-z0-9]/g, ""));
    setNewOwnerEmail(demo.email);
    setSelectedDemoId(demo._id);
    setIsModalOpen(true);
  };

  if (checkingAuth) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ color: "#a1a1aa", fontSize: "0.95rem" }}>Authenticating Super Admin Session...</div>
      </div>
    );
  }

  // Unauthenticated Login View (Matching Dark Luxury UI)
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>29s ENGINE</div>
          <p className={styles.loginSubtitle}>Super Admin Telemetry & Merchant Control</p>

          <div className={styles.credBox}>
            <div>🧪 <strong>Testing Credentials:</strong></div>
            <div style={{ marginTop: "4px" }}>Email: <code>superadmin@platform.com</code></div>
            <div>Password: <code>SuperAdmin@2026</code></div>
          </div>

          {loginError && <div className={styles.errorBanner}>{loginError}</div>}

          <form onSubmit={handleSuperAdminLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label} style={{ color: "#d4d4d8" }}>Super Admin Email</label>
              <input 
                type="text" 
                required 
                placeholder="superadmin@platform.com"
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className={styles.input}
                style={{ background: "#09090b", border: "1px solid #27272a", color: "#fff" }}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: "24px" }}>
              <label className={styles.label} style={{ color: "#d4d4d8" }}>Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••••••"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className={styles.input}
                style={{ background: "#09090b", border: "1px solid #27272a", color: "#fff" }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loginSubmitting}
              className={styles.btnPrimary}
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
            >
              {loginSubmitting ? "Authenticating..." : "Login to Control Panel"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem" }}>
            <Link href="/platform" style={{ color: "#a1a1aa", textDecoration: "none" }}>← Return to SaaS Platform Landing</Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customDomain && s.customDomain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.adminPageWrapper}>
      {/* Sidebar matching project Admin Sidebar styling */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brandRow}>
            <span className={styles.brandName}>29s SUPERADMIN</span>
          </div>

          <nav className={styles.navMenu}>
            <button 
              className={`${styles.menuItem} ${activeTab === "stores" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("stores")}
            >
              <span>🏪 Merchant Stores</span>
              <span className={styles.menuBadge}>{stores.length}</span>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "demo-requests" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("demo-requests")}
            >
              <span>📩 Demo Requests</span>
              <span className={styles.menuBadge}>{demoRequests.length}</span>
            </button>
          </nav>
        </div>

        <div>
          <Link href="/platform" className={styles.btnSecondary} style={{ display: "block", textAlign: "center", marginBottom: "10px" }}>
            🌐 SaaS Landing Page
          </Link>
          <button onClick={handleLogout} className={styles.btnSecondary} style={{ width: "100%", color: "#dc2626" }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.titleGroup}>
            <h1>Platform Control Center</h1>
            <p>Manage multi-tenant merchant stores, custom domains, and platform telemetry</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnPrimary} onClick={() => { setSelectedDemoId(null); setIsModalOpen(true); }}>
              + Provision New Store
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Merchant Stores</span>
              <span className={styles.statIcon}>🏪</span>
            </div>
            <div className={styles.statValue}>{stats?.totalStores ?? 0}</div>
            <div className={styles.statSubtext}>Across all tenants</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Active Provisioned Stores</span>
              <span className={styles.statIcon}>✅</span>
            </div>
            <div className={styles.statValue} style={{ color: "#059669" }}>
              {stats?.activeStores ?? 0}
            </div>
            <div className={styles.statSubtext}>Live on platform</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Merchant Demo Requests</span>
              <span className={styles.statIcon}>📩</span>
            </div>
            <div className={styles.statValue} style={{ color: "#7c3aed" }}>
              {stats?.totalDemoRequests ?? 0}
            </div>
            {stats?.pendingDemoRequests ? (
              <div className={styles.statSubtext} style={{ color: "#d97706" }}>
                ● {stats.pendingDemoRequests} Pending Action
              </div>
            ) : null}
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Platform Products</span>
              <span className={styles.statIcon}>🛍️</span>
            </div>
            <div className={styles.statValue}>{stats?.totalProducts ?? 0}</div>
            <div className={styles.statSubtext}>Catalog items</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Global Platform GMV</span>
              <span className={styles.statIcon}>💰</span>
            </div>
            <div className={styles.statValue} style={{ color: "#2563eb" }}>
              ₹{stats?.totalRevenue.toLocaleString() ?? 0}
            </div>
            <div className={styles.statSubtext}>Total order revenue</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0c0a09" }}>
            {activeTab === "stores" ? "Provisioned Merchant Stores" : "Incoming Merchant Demo Requests"}
          </div>

          {activeTab === "stores" && (
            <input
              type="text"
              placeholder="Search stores by name, subdomain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          )}
        </div>

        {/* Stores Table */}
        {activeTab === "stores" && (
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
                    <tr key={store._id}>
                      <td>
                        <div className={styles.storeName}>{store.name}</div>
                        <div className={styles.subdomain}>{store.subdomain}.29sformula.com</div>
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
                            onClick={() => handleToggleStatus(store)}
                            className={styles.btnAction}
                          >
                            {store.isActive ? "Suspend" : "Activate"}
                          </button>
                          {store.subdomain !== "default" && (
                            <button
                              onClick={() => handleDeleteStore(store._id, store.subdomain)}
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
        )}

        {/* Demo Requests Table */}
        {activeTab === "demo-requests" && (
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Brand & Owner</th>
                  <th>Contact Info</th>
                  <th>Requested Subdomain</th>
                  <th>Business Category</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                      Loading merchant demo requests...
                    </td>
                  </tr>
                ) : demoRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                      No demo requests submitted yet.
                    </td>
                  </tr>
                ) : (
                  demoRequests.map((demo) => (
                    <tr key={demo._id}>
                      <td>
                        <div className={styles.storeName}>{demo.storeName}</div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>👤 {demo.ownerName}</div>
                      </td>
                      <td>
                        <div>📧 {demo.email}</div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>📞 {demo.phone}</div>
                      </td>
                      <td>
                        <code style={{ color: "#2563eb" }}>{demo.subdomain || "auto-generate"}</code>
                      </td>
                      <td>{demo.businessType || "Retail"}</td>
                      <td>
                        <span className={`${styles.badge} ${
                          demo.status === "Approved" ? styles.badgeStarter : styles.badgeEnterprise
                        }`}>
                          {demo.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {new Date(demo.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {demo.status !== "Approved" && (
                          <button
                            onClick={() => handleProvisionFromDemo(demo)}
                            className={`${styles.btnAction} ${styles.btnActionAccent}`}
                          >
                            ⚡ Provision Store
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Provision Store Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>Provision Merchant Store</h2>
            <p className={styles.modalSubtitle}>Configure tenant subdomain and plan parameters</p>

            {selectedDemoId && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "10px", marginBottom: "16px", fontSize: "0.85rem", color: "#047857" }}>
                ⚡ Pre-filled from Merchant Demo Request
              </div>
            )}

            {formError && <div className={styles.errorBanner}>{formError}</div>}

            <form onSubmit={handleCreateStore}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Store Brand Name *</label>
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
                <label className={styles.label}>Platform Subdomain *</label>
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
                  <option value="starter">Starter Plan (₹999/mo)</option>
                  <option value="pro">Pro Merchant Plan (₹2,499/mo)</option>
                  <option value="enterprise">Enterprise Plan</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={styles.btnPrimary}>
                  {submitting ? "Provisioning..." : "Create & Activate Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
