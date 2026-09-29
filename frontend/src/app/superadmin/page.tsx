"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface StoreItem {
  _id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  ownerId?: { name?: string; email?: string } | string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessName?: string;
  businessType?: string;
  country?: string;
  currency?: string;
  productCount?: number;
  orderCount?: number;
  plan?: string;
  status?: string;
  isActive?: boolean;
  internalNotes?: string;
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
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "stores"
    | "demo-requests"
    | "billing"
    | "analytics"
    | "communications"
    | "domains"
    | "audit-log"
    | "settings"
  >("dashboard");
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
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPlan, setNewPlan] = useState("pro");
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Store Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editSubdomain, setEditSubdomain] = useState("");
  const [editCustomDomain, setEditCustomDomain] = useState("");
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editOwnerEmail, setEditOwnerEmail] = useState("");
  const [editOwnerPhone, setEditOwnerPhone] = useState("");
  const [editPlan, setEditPlan] = useState("pro");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editBusinessType, setEditBusinessType] = useState("retail");
  const [editInternalNotes, setEditInternalNotes] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  // Platform Settings State (10 Sections)
  const [activeSettingsSection, setActiveSettingsSection] = useState<
    | "general"
    | "admin-users"
    | "security"
    | "tenant-defaults"
    | "feature-flags"
    | "integrations"
    | "legal"
    | "maintenance"
    | "api-webhooks"
    | "branding"
  >("general");

  const navTabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkTabScroll = () => {
    if (navTabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navTabsRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkTabScroll();
    window.addEventListener("resize", checkTabScroll);
    return () => window.removeEventListener("resize", checkTabScroll);
  }, []);

  useEffect(() => {
    checkTabScroll();
  }, [activeTab]);

  const scrollTabs = (direction: "left" | "right") => {
    if (navTabsRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      navTabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel: string;
    isDanger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // 1. General Settings
  const [platformName, setPlatformName] = useState("E-Commerce Platform");
  const [platformLogo, setPlatformLogo] = useState("/logo.png");
  const [supportEmail, setSupportEmail] = useState("support@ecommerce.com");
  const [timezone, setTimezone] = useState("Asia/Kolkata (UTC+05:30)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [language, setLanguage] = useState("English (US)");
  const [baseDomain, setBaseDomain] = useState("ecommerce.com");

  // 2. Admin Users & Roles
  const [admins, setAdmins] = useState([
    { id: "1", name: "Bhanu Bharat", email: "bhanu@ecommerce.com", role: "Super Admin", status: "Active", lastLogin: "2 mins ago", twoFactor: true },
    { id: "2", name: "Sarah Jenkins", email: "sarah.admin@ecommerce.com", role: "Security Lead", status: "Active", lastLogin: "3 hours ago", twoFactor: true },
    { id: "3", name: "Alex Rivera", email: "alex.dev@ecommerce.com", role: "Platform Support", status: "Inactive", lastLogin: "5 days ago", twoFactor: false },
  ]);
  const [isInviteAdminOpen, setIsInviteAdminOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Super Admin");

  // 3. Security
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState("60");
  const [ipAllowlist, setIpAllowlist] = useState("192.168.1.1/32\n10.0.0.0/16");
  const [loginAlertEmail, setLoginAlertEmail] = useState(true);
  const [loginAlertSlack, setLoginAlertSlack] = useState(true);

  // 4. Tenant Defaults
  const [trialLengthDays, setTrialLengthDays] = useState(14);
  const [reservedSubdomains, setReservedSubdomains] = useState("admin, app, api, superadmin, mail, billing, assets, static, demo, test");
  const [defaultTheme, setDefaultTheme] = useState("Modern Minimalist");
  const [autoProvisionSampleData, setAutoProvisionSampleData] = useState(true);
  const [selfServeSignup, setSelfServeSignup] = useState(true);

  // 5. Feature Flags
  const [featureFlags, setFeatureFlags] = useState([
    { key: "multi_currency_checkout", name: "Multi-Currency Checkout Engine", enabled: true, rollout: 100, plans: "Pro, Enterprise" },
    { key: "ai_product_description", name: "AI Product Content Generator", enabled: true, rollout: 50, plans: "Enterprise" },
    { key: "custom_domain_ssl_auto", name: "Automated Custom SSL Provisioning", enabled: true, rollout: 100, plans: "Starter, Pro, Enterprise" },
    { key: "pos_inventory_sync", name: "Omnichannel POS Inventory Sync", enabled: false, rollout: 10, plans: "Enterprise" },
    { key: "whatsapp_order_notifications", name: "WhatsApp Business Notifications", enabled: true, rollout: 100, plans: "Pro, Enterprise" },
  ]);

  // 6. Integrations
  const [stripePublishableKey, setStripePublishableKey] = useState("pk_live_51Nx89aB9918273645");
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_live_51Nx89aB99018273645");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("whsec_9918273645102938");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_live_891273910");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("rzp_secret_9918273645");
  const [emailProvider, setEmailProvider] = useState("SendGrid API");
  const [emailApiKey, setEmailApiKey] = useState("SG.x9871239102.9918273645");
  const [senderEmail, setSenderEmail] = useState("noreply@ecommerce.com");
  const [s3Bucket, setS3Bucket] = useState("ecommerce-platform-assets");
  const [s3Region, setS3Region] = useState("ap-south-1 (Mumbai)");
  const [s3AccessKey, setS3AccessKey] = useState("AKIAIOSFODNN7EXAMPLE");
  const [s3SecretKey, setS3SecretKey] = useState("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
  const [dnsProvider, setDnsProvider] = useState("Cloudflare Enterprise DNS");
  const [analyticsId, setAnalyticsId] = useState("G-998127364");

  // 7. Legal & Compliance
  const [termsVersion, setTermsVersion] = useState("v2.4 (Updated Aug 2026)");
  const [privacyVersion, setPrivacyVersion] = useState("v2.1 (Updated Jul 2026)");
  const [gdprExportHours, setGdprExportHours] = useState(24);
  const [gdprDeleteGraceDays, setGdprDeleteGraceDays] = useState(30);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(365);
  const [financialRetentionYears, setFinancialRetentionYears] = useState(7);

  // 8. Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("Scheduled platform maintenance in progress. Storefronts remain active.");
  const [backupSchedule, setBackupSchedule] = useState("Daily at 03:00 UTC");
  const [lastBackupTime, setLastBackupTime] = useState("Today at 03:00 UTC");
  const [backupStatus, setBackupStatus] = useState("Healthy (Auto-synced)");

  // 9. API & Webhooks
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production Backend Master Key", key: "pk_live_8921a99812", createdAt: "2026-01-15", status: "Active" },
    { id: "2", name: "Zapier Partner Connector Key", key: "pk_live_4490f11029", createdAt: "2026-04-10", status: "Active" },
  ]);
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.ecommerce.com/events");
  const [starterLimit, setStarterLimit] = useState(60);
  const [proLimit, setProLimit] = useState(300);
  const [enterpriseLimit, setEnterpriseLimit] = useState(1200);

  // 10. Platform Branding
  const [landingTitle, setLandingTitle] = useState("Launch Your Multi-Tenant E-Commerce Brand");
  const [landingSubtitle, setLandingSubtitle] = useState("High-performance storefronts, native payments, inventory management, and custom domains.");
  const [demoFields, setDemoFields] = useState({
    name: true,
    email: true,
    phone: true,
    revenue: true,
    type: true,
  });
  const [emailHeaderLogo, setEmailHeaderLogo] = useState("https://ecommerce.com/assets/email-header.png");
  const [emailFooterText, setEmailFooterText] = useState("© 2026 E-Commerce Platform Inc. All rights reserved.");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      const res = await fetch(`${API_BASE}/api/superadmin/tenants`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newStoreName,
          subdomain: newSubdomain,
          customDomain: newPlan === "starter" ? "" : newCustomDomain,
          ownerName: newOwnerName || `${newStoreName} Owner`,
          ownerEmail: newOwnerEmail,
          ownerPhone: newOwnerPhone,
          password: newPassword || "Merchant123!",
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
      setNewOwnerName("");
      setNewOwnerEmail("");
      setNewOwnerPhone("");
      setNewPassword("");
      setSelectedDemoId(null);
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (store: StoreItem) => {
    setEditingStoreId(store._id);
    setEditStoreName(store.name || "");
    setEditSubdomain(store.subdomain || "");
    setEditCustomDomain(store.customDomain || "");
    setEditOwnerName(store.ownerName || (typeof store.ownerId === "object" ? store.ownerId?.name : "") || "");
    setEditOwnerEmail(store.ownerEmail || (typeof store.ownerId === "object" ? store.ownerId?.email : "") || "");
    setEditOwnerPhone(store.ownerPhone || "");
    setEditPlan(store.plan || "pro");
    setEditIsActive(store.isActive ?? true);
    setEditBusinessType(store.businessType || "retail");
    setEditInternalNotes(store.internalNotes || "");
    setEditFormError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEditStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreId) return;
    setEditSubmitting(true);
    setEditFormError(null);
    const token = localStorage.getItem("superAdminToken");

    try {
      const res = await fetch(`${API_BASE}/api/superadmin/tenants/${editingStoreId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editStoreName,
          subdomain: editSubdomain,
          customDomain: editCustomDomain,
          ownerName: editOwnerName,
          ownerEmail: editOwnerEmail,
          ownerPhone: editOwnerPhone,
          plan: editPlan,
          isActive: editIsActive,
          businessType: editBusinessType,
          internalNotes: editInternalNotes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update tenant account.");

      setIsEditModalOpen(false);
      setEditingStoreId(null);
      fetchData();
    } catch (err: any) {
      setEditFormError(err.message);
    } finally {
      setEditSubmitting(false);
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
      const res = await fetch(`${API_BASE}/api/superadmin/tenants/${storeId}`, {
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
          <div className={styles.loginLogo}>STORE ENGINE</div>
          <p className={styles.loginSubtitle}>Super Admin Control Panel</p>

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
          <div className={styles.sidebarHeaderTop}>
            <div className={styles.brandRow}>
              <div className={styles.brandLeft}>
                <div className={styles.brandLogoCircle}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px", color: "#ffffff" }}>
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 3a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 12 5Zm-4 2.5a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 8 7.5Zm-2.5 4a1.5 1.5 0 1 1 1.5 1.5A1.5 1.5 0 0 1 5.5 11.5Zm2.5 4a1.5 1.5 0 1 1 1.5 1.5A1.5 1.5 0 0 1 8 15.5Zm4 2.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 18Zm4-2.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 15.5Zm2.5-4a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 18.5 11.5Zm-2.5-4a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 16 7.5Z"/>
                  </svg>
                </div>
                <div className={styles.brandNameDropdown}>
                  <span className={styles.brandNameTitle}>{platformName || "Control Panel"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px", color: "#6b7280" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              <button className={styles.sidebarCollapseBtn} title="Toggle Sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px", color: "#374151" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 5v14" />
                </svg>
              </button>
            </div>

            <div className={styles.sidebarSearchWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.sidebarSearchIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input type="text" placeholder="Search..." className={styles.sidebarSearchInput} />
              <kbd className={styles.sidebarKbdBadge}>⌘1</kbd>
            </div>
          </div>

          <nav className={styles.navMenu}>
            <button 
              className={`${styles.menuItem} ${activeTab === "dashboard" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Dashboard</span>
              </div>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "stores" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("stores")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 .75.75v15.75a.75.75 0 0 1-.75.75H13.5Z" />
                </svg>
                <span>Merchant Stores</span>
              </div>
              <span className={styles.menuBadge}>{stores.length}</span>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "demo-requests" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("demo-requests")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span>Demo Requests</span>
              </div>
              <span className={styles.menuBadge}>{demoRequests.length}</span>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "billing" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("billing")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span>Billing</span>
              </div>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "analytics" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                <span>Analytics</span>
              </div>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "communications" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("communications")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span>Communications</span>
              </div>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "domains" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("domains")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-18.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                </svg>
                <span>Domains</span>
              </div>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "audit-log" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("audit-log")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
                </svg>
                <span>Audit Logs</span>
              </div>
            </button>

            <button 
              className={`${styles.menuItem} ${activeTab === "settings" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>

        <div>
          <Link href="/platform" className={styles.btnSecondary} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-18.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
            </svg>
            <span>SaaS Landing Page</span>
          </Link>
          <button onClick={handleLogout} className={styles.btnSecondary} style={{ width: "100%", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        {activeTab !== "settings" && (
          <header className={styles.topHeader}>
            <div className={styles.titleGroup}>
              <h1>
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "stores" && "Merchant Stores"}
                {activeTab === "demo-requests" && "Demo Requests"}
                {activeTab === "billing" && "Billing & Subscriptions"}
                {activeTab === "analytics" && "Platform Analytics"}
                {activeTab === "communications" && "Communications"}
                {activeTab === "domains" && "Custom Domains"}
                {activeTab === "audit-log" && "Audit Logs"}
              </h1>
              <p>Manage multi-tenant merchant stores, custom domains, and platform operations</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnPrimary} onClick={() => { setSelectedDemoId(null); setIsModalOpen(true); }}>
                + Provision New Store
              </button>
            </div>
          </header>
        )}

        {/* Stats Grid */}
        {(activeTab === "dashboard" || activeTab === "stores") && (
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
        )}

        {/* Action Bar */}
        {(activeTab === "dashboard" || activeTab === "stores" || activeTab === "demo-requests") && (
          <div className={styles.actionBar}>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0c0a09" }}>
              {activeTab === "demo-requests" ? "Incoming Merchant Demo Requests" : "Provisioned Merchant Stores"}
            </div>

            {(activeTab === "dashboard" || activeTab === "stores") && (
              <input
                type="text"
                placeholder="Search stores by name, subdomain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            )}
          </div>
        )}

        {/* Stores Table */}
        {(activeTab === "stores" || activeTab === "dashboard") && (
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
                        <div className={styles.subdomain}>
                          <a
                            href={`http://${store.subdomain}.localhost:3000`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {store.subdomain}.localhost:3000
                          </a>
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
                            onClick={() => handleOpenEditModal(store)}
                            className={styles.btnAction}
                            style={{ background: "#f3f4f6", color: "#374151" }}
                          >
                            Edit
                          </button>
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

        {/* Placeholders for pending tabs */}
        {activeTab === "billing" && (
          <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Billing & Subscriptions</div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>No billing records configured yet.</div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Platform Analytics</div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Analytics data will appear here.</div>
          </div>
        )}

        {activeTab === "communications" && (
          <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Merchant Communications</div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>No broadcast messages sent yet.</div>
          </div>
        )}

        {activeTab === "domains" && (
          <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-18.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>Custom Domains & DNS</div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>No custom domains configured.</div>
          </div>
        )}

        {activeTab === "audit-log" && (
          <div className={styles.tableCard} style={{ padding: "48px 24px", textAlign: "center", color: "#6b7280" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px auto", color: "#9ca3af", display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "#111827", marginBottom: "4px" }}>System Audit Logs</div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Audit logging is active.</div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className={styles.settingsSectionCard}>
            {/* Breadcrumb Header */}
            <div className={styles.settingsHorizontalHeader}>
              <button className={styles.settingsBreadcrumbBack} onClick={() => setActiveTab("dashboard")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px", color: "#6b7280" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span style={{ color: "#6b7280", fontWeight: 400 }}>Settings</span>
              </button>
              <span style={{ color: "#9ca3af", margin: "0 2px" }}>&rsaquo;</span>
              <span style={{ color: "#000000", fontWeight: 400 }}>
                {
                  {
                    "general": "General",
                    "admin-users": "Admin Users",
                    "security": "Security",
                    "tenant-defaults": "Tenant Defaults",
                    "feature-flags": "Feature Flags",
                    "integrations": "Integrations",
                    "legal": "Legal & Compliance",
                    "maintenance": "Maintenance",
                    "api-webhooks": "API & Webhooks",
                    "branding": "Branding",
                  }[activeSettingsSection]
                }
              </span>
            </div>

            {/* Horizontal Sub-Nav Tabs with << and >> controls */}
            <div className={styles.settingsSubNavContainer}>
              {canScrollLeft && (
                <button
                  type="button"
                  className={`${styles.tabScrollArrow} ${styles.tabScrollArrowLeft}`}
                  onClick={() => scrollTabs("left")}
                  title="Scroll Left"
                >
                  &laquo;
                </button>
              )}

              <div
                ref={navTabsRef}
                className={styles.settingsHorizontalTabs}
                onScroll={checkTabScroll}
              >
                {[
                  { id: "general", label: "General" },
                  { id: "admin-users", label: "Admin Users" },
                  { id: "security", label: "Security" },
                  { id: "tenant-defaults", label: "Tenant Defaults" },
                  { id: "feature-flags", label: "Feature Flags" },
                  { id: "integrations", label: "Integrations" },
                  { id: "legal", label: "Legal & Compliance" },
                  { id: "maintenance", label: "Maintenance" },
                  { id: "api-webhooks", label: "API & Webhooks" },
                  { id: "branding", label: "Branding" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.settingsHorizontalTab} ${activeSettingsSection === item.id ? styles.settingsHorizontalTabActive : ""}`}
                    onClick={() => setActiveSettingsSection(item.id as any)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  className={`${styles.tabScrollArrow} ${styles.tabScrollArrowRight}`}
                  onClick={() => scrollTabs("right")}
                  title="Scroll Right"
                >
                  &raquo;
                </button>
              )}
            </div>

            {/* Content Area */}
            <div>
              {/* 1. General */}
              {activeSettingsSection === "general" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>General Settings</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>
                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Platform Name</label>
                      <input type="text" className={styles.input} value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Logo URL</label>
                      <input type="text" className={styles.input} value={platformLogo} onChange={(e) => setPlatformLogo(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Support Email</label>
                      <input type="email" className={styles.input} value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Base Domain</label>
                      <input type="text" className={styles.input} value={baseDomain} onChange={(e) => setBaseDomain(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Timezone</label>
                      <select className={styles.input} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                        <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                        <option value="UTC (UTC+00:00)">UTC (UTC+00:00)</option>
                        <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Currency</label>
                      <select className={styles.input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                      </select>
                    </div>
                    <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                      <label className={styles.label}>Language</label>
                      <select className={styles.input} value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="English (US)">English (US)</option>
                        <option value="Spanish (ES)">Spanish (ES)</option>
                        <option value="Hindi (IN)">Hindi (IN)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Admin Users */}
              {activeSettingsSection === "admin-users" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Admin Users & Roles</h3>
                    <button className={styles.btnPrimary} onClick={() => setIsInviteAdminOpen(true)}>
                      + Invite Admin
                    </button>
                  </div>
                  <div className={styles.tableCard}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>2FA</th>
                          <th>Last Active</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin) => (
                          <tr key={admin.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{admin.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{admin.email}</div>
                            </td>
                            <td>{admin.role}</td>
                            <td>{admin.twoFactor ? "Enforced" : "Pending"}</td>
                            <td style={{ fontSize: "0.82rem", color: "#6b7280" }}>{admin.lastLogin}</td>
                            <td>
                              <span className={admin.status === "Active" ? styles.statusActive : styles.statusSuspended}>
                                {admin.status}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                className={admin.status === "Active" ? styles.btnActionDanger : styles.btnAction}
                                onClick={() => {
                                  setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a));
                                  triggerToast(`Updated ${admin.name}`);
                                }}
                              >
                                {admin.status === "Active" ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. Security */}
              {activeSettingsSection === "security" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Security Rules</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleLabel}>Mandatory 2-Factor Authentication (2FA)</div>
                    <input type="checkbox" checked={enforce2FA} onChange={(e) => setEnforce2FA(e.target.checked)} style={{ width: "18px", height: "18px" }} />
                  </div>
                  <div className={styles.settingsGrid} style={{ marginTop: "16px" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Min Password Length</label>
                      <input type="number" className={styles.input} value={minPasswordLength} onChange={(e) => setMinPasswordLength(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Password Expiry (Days)</label>
                      <input type="number" className={styles.input} value={passwordExpiryDays} onChange={(e) => setPasswordExpiryDays(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Session Timeout</label>
                      <select className={styles.input} value={sessionTimeoutMins} onChange={(e) => setSessionTimeoutMins(e.target.value)}>
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">60 Minutes</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Login Alerts</label>
                      <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                          <input type="checkbox" checked={loginAlertEmail} onChange={(e) => setLoginAlertEmail(e.target.checked)} /> Email
                        </label>
                        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                          <input type="checkbox" checked={loginAlertSlack} onChange={(e) => setLoginAlertSlack(e.target.checked)} /> Slack
                        </label>
                      </div>
                    </div>
                    <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                      <label className={styles.label}>IP Allowlist</label>
                      <textarea className={styles.input} rows={2} value={ipAllowlist} onChange={(e) => setIpAllowlist(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Tenant Defaults */}
              {activeSettingsSection === "tenant-defaults" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Tenant Defaults</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>
                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Trial Length (Days)</label>
                      <input type="number" className={styles.input} value={trialLengthDays} onChange={(e) => setTrialLengthDays(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Default Theme</label>
                      <select className={styles.input} value={defaultTheme} onChange={(e) => setDefaultTheme(e.target.value)}>
                        <option value="Modern Minimalist">Modern Minimalist</option>
                        <option value="Boutique Luxury">Boutique Luxury</option>
                      </select>
                    </div>
                    <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                      <label className={styles.label}>Reserved Subdomains</label>
                      <textarea className={styles.input} rows={2} value={reservedSubdomains} onChange={(e) => setReservedSubdomains(e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleLabel}>Auto-provision Sample Data</div>
                    <input type="checkbox" checked={autoProvisionSampleData} onChange={(e) => setAutoProvisionSampleData(e.target.checked)} style={{ width: "18px", height: "18px" }} />
                  </div>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleLabel}>Enable Open Signups</div>
                    <input type="checkbox" checked={selfServeSignup} onChange={(e) => setSelfServeSignup(e.target.checked)} style={{ width: "18px", height: "18px" }} />
                  </div>
                </div>
              )}

              {/* 5. Feature Flags */}
              {activeSettingsSection === "feature-flags" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Feature Flags</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>
                  <div className={styles.tableCard}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Enabled</th>
                          <th>Rollout %</th>
                          <th>Plans</th>
                        </tr>
                      </thead>
                      <tbody>
                        {featureFlags.map((flag, idx) => (
                          <tr key={flag.key}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{flag.name}</div>
                              <div className={styles.subdomain}>{flag.key}</div>
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={flag.enabled}
                                onChange={(e) => {
                                  const updated = [...featureFlags];
                                  updated[idx].enabled = e.target.checked;
                                  setFeatureFlags(updated);
                                }}
                                style={{ width: "18px", height: "18px" }}
                              />
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={flag.rollout}
                                  onChange={(e) => {
                                    const updated = [...featureFlags];
                                    updated[idx].rollout = Number(e.target.value);
                                    setFeatureFlags(updated);
                                  }}
                                  style={{ width: "80px" }}
                                />
                                <span style={{ fontSize: "0.82rem" }}>{flag.rollout}%</span>
                              </div>
                            </td>
                            <td style={{ fontSize: "0.82rem", color: "#6b7280" }}>{flag.plans}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. Integrations */}
              {activeSettingsSection === "integrations" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Integrations</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>

                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Stripe Publishable Key</label>
                      <input type="text" className={styles.input} value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Stripe Secret Key</label>
                      <div className={styles.secretInputGroup}>
                        <input type={showSecrets["stripeSecret"] ? "text" : "password"} className={styles.input} value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} />
                        <button className={styles.btnSecondary} onClick={() => toggleSecret("stripeSecret")}>
                          {showSecrets["stripeSecret"] ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Razorpay Key ID</label>
                      <input type="text" className={styles.input} value={razorpayKeyId} onChange={(e) => setRazorpayKeyId(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Razorpay Secret Key</label>
                      <div className={styles.secretInputGroup}>
                        <input type={showSecrets["razorpaySecret"] ? "text" : "password"} className={styles.input} value={razorpayKeySecret} onChange={(e) => setRazorpayKeySecret(e.target.value)} />
                        <button className={styles.btnSecondary} onClick={() => toggleSecret("razorpaySecret")}>
                          {showSecrets["razorpaySecret"] ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>S3 Bucket</label>
                      <input type="text" className={styles.input} value={s3Bucket} onChange={(e) => setS3Bucket(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>AWS Region</label>
                      <input type="text" className={styles.input} value={s3Region} onChange={(e) => setS3Region(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>S3 Access Key</label>
                      <input type="text" className={styles.input} value={s3AccessKey} onChange={(e) => setS3AccessKey(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>S3 Secret Key</label>
                      <div className={styles.secretInputGroup}>
                        <input type={showSecrets["s3Secret"] ? "text" : "password"} className={styles.input} value={s3SecretKey} onChange={(e) => setS3SecretKey(e.target.value)} />
                        <button className={styles.btnSecondary} onClick={() => toggleSecret("s3Secret")}>
                          {showSecrets["s3Secret"] ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Provider</label>
                      <select className={styles.input} value={emailProvider} onChange={(e) => setEmailProvider(e.target.value)}>
                        <option value="SendGrid API">SendGrid</option>
                        <option value="Amazon SES">Amazon SES</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Sender Email</label>
                      <input type="email" className={styles.input} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Legal & Compliance */}
              {activeSettingsSection === "legal" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Legal & Compliance</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>
                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Terms Version</label>
                      <input type="text" className={styles.input} value={termsVersion} onChange={(e) => setTermsVersion(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Privacy Version</label>
                      <input type="text" className={styles.input} value={privacyVersion} onChange={(e) => setPrivacyVersion(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>GDPR Export SLA (Hours)</label>
                      <input type="number" className={styles.input} value={gdprExportHours} onChange={(e) => setGdprExportHours(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>GDPR Delete Grace Period (Days)</label>
                      <input type="number" className={styles.input} value={gdprDeleteGraceDays} onChange={(e) => setGdprDeleteGraceDays(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Audit Retention (Days)</label>
                      <input type="number" className={styles.input} value={auditLogRetentionDays} onChange={(e) => setAuditLogRetentionDays(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Financial Log Retention (Years)</label>
                      <input type="number" className={styles.input} value={financialRetentionYears} onChange={(e) => setFinancialRetentionYears(Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Maintenance */}
              {activeSettingsSection === "maintenance" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Maintenance</h3>
                  </div>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleLabel}>Maintenance Mode</div>
                    <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} style={{ width: "18px", height: "18px" }} />
                  </div>
                  {maintenanceMode && (
                    <div className={styles.formGroup} style={{ marginTop: "12px" }}>
                      <label className={styles.label}>Banner Message</label>
                      <input type="text" className={styles.input} value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} />
                    </div>
                  )}

                  <div className={styles.statsGrid} style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Backup Schedule</div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "4px" }}>{backupSchedule}</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Last Backup</div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "4px" }}>{lastBackupTime}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button className={styles.btnSecondary} onClick={() => triggerToast("Migrations executed.")}>
                      Run Migrations
                    </button>
                    <button className={styles.btnSecondary} onClick={() => triggerToast("Cache cleared.")}>
                      Clear Cache
                    </button>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Backup triggered.")}>
                      Run Backup
                    </button>
                  </div>
                </div>
              )}

              {/* 9. API & Webhooks */}
              {activeSettingsSection === "api-webhooks" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>API & Webhooks</h3>
                    <button
                      className={styles.btnPrimary}
                      onClick={() => {
                        const newKey = {
                          id: String(Date.now()),
                          name: `API Key ${apiKeys.length + 1}`,
                          key: `pk_live_${Math.random().toString(36).substring(2, 10)}`,
                          createdAt: new Date().toISOString().split("T")[0],
                          status: "Active"
                        };
                        setApiKeys([...apiKeys, newKey]);
                        triggerToast("Key generated");
                      }}
                    >
                      + Generate Key
                    </button>
                  </div>

                  <div className={styles.tableCard} style={{ marginBottom: "20px" }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Key</th>
                          <th>Created</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiKeys.map((k) => (
                          <tr key={k.id}>
                            <td style={{ fontWeight: 600 }}>{k.name}</td>
                            <td className={styles.subdomain}>{k.key}</td>
                            <td style={{ fontSize: "0.82rem", color: "#6b7280" }}>{k.createdAt}</td>
                            <td><span className={styles.statusActive}>{k.status}</span></td>
                            <td style={{ textAlign: "right" }}>
                              <button className={styles.btnActionDanger} onClick={() => { setApiKeys(apiKeys.filter((x) => x.id !== k.id)); triggerToast("Revoked"); }}>
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Starter Rate Limit (Req/min)</label>
                      <input type="number" className={styles.input} value={starterLimit} onChange={(e) => setStarterLimit(Number(e.target.value))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Pro Rate Limit (Req/min)</label>
                      <input type="number" className={styles.input} value={proLimit} onChange={(e) => setProLimit(Number(e.target.value))} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                      <label className={styles.label}>Enterprise Rate Limit (Req/min)</label>
                      <input type="number" className={styles.input} value={enterpriseLimit} onChange={(e) => setEnterpriseLimit(Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              {/* 10. Branding */}
              {activeSettingsSection === "branding" && (
                <div>
                  <div className={styles.settingsHeader}>
                    <h3 className={styles.settingsTitle}>Branding</h3>
                    <button className={styles.btnPrimary} onClick={() => triggerToast("Saved")}>
                      Save Changes
                    </button>
                  </div>
                  <div className={styles.settingsGrid}>
                    <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                      <label className={styles.label}>Landing Page Title</label>
                      <input type="text" className={styles.input} value={landingTitle} onChange={(e) => setLandingTitle(e.target.value)} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.settingsGridFull}`}>
                      <label className={styles.label}>Landing Page Subtitle</label>
                      <textarea className={styles.input} rows={2} value={landingSubtitle} onChange={(e) => setLandingSubtitle(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Logo URL</label>
                      <input type="text" className={styles.input} value={emailHeaderLogo} onChange={(e) => setEmailHeaderLogo(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Footer Text</label>
                      <input type="text" className={styles.input} value={emailFooterText} onChange={(e) => setEmailFooterText(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Provision Store Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{ maxWidth: "560px" }}>
            <h2 className={styles.modalTitle}>Provision Merchant Store</h2>
            <p className={styles.modalSubtitle}>Configure tenant details, owner credentials, and subscription plan</p>

            {selectedDemoId && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "10px", marginBottom: "16px", fontSize: "0.85rem", color: "#047857" }}>
                ⚡ Pre-filled from Merchant Demo Request
              </div>
            )}

            {formError && <div className={styles.errorBanner}>{formError}</div>}

            <form onSubmit={handleCreateStore}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Store / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Fashion"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subdomain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. acmefashion"
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Subscription Plan *</label>
                  <select
                    value={newPlan}
                    onChange={(e) => {
                      setNewPlan(e.target.value);
                      if (e.target.value === "starter") setNewCustomDomain("");
                    }}
                    className={styles.input}
                  >
                    <option value="starter">Starter Plan (₹999/mo)</option>
                    <option value="pro">Pro Merchant Plan (₹2,499/mo)</option>
                    <option value="enterprise">Enterprise Plan</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ opacity: newPlan === "starter" ? 0.6 : 1 }}>
                    Custom CNAME Domain {newPlan === "starter" ? "(Pro/Enterprise Only)" : "(Optional)"}
                  </label>
                  <input
                    type="text"
                    placeholder={newPlan === "starter" ? "Requires Pro or Enterprise plan" : "e.g. store.acmefashion.com"}
                    value={newPlan === "starter" ? "" : newCustomDomain}
                    disabled={newPlan === "starter"}
                    onChange={(e) => setNewCustomDomain(e.target.value)}
                    className={styles.input}
                    style={{
                      backgroundColor: newPlan === "starter" ? "#f3f4f6" : "#ffffff",
                      cursor: newPlan === "starter" ? "not-allowed" : "text"
                    }}
                  />
                  {newPlan === "starter" && (
                    <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
                      🔒 Custom CNAME Domain is available on Pro or Enterprise plans only.
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@acmefashion.com"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Owner Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                />
                <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
                  🔑 Merchant will be required to change this password upon first login.
                </span>
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

      {/* Edit Tenant Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{ maxWidth: "560px" }}>
            <h2 className={styles.modalTitle}>Edit Tenant Account</h2>
            <p className={styles.modalSubtitle}>Update store parameters, owner details, and plan configuration</p>

            {editFormError && <div className={styles.errorBanner}>{editFormError}</div>}

            <form onSubmit={handleSaveEditStore}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Store Name *</label>
                  <input
                    type="text"
                    required
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subdomain *</label>
                  <input
                    type="text"
                    required
                    value={editSubdomain}
                    onChange={(e) => setEditSubdomain(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Subscription Plan</label>
                  <select
                    value={editPlan}
                    onChange={(e) => {
                      setEditPlan(e.target.value);
                      if (e.target.value === "starter") setEditCustomDomain("");
                    }}
                    className={styles.input}
                  >
                    <option value="starter">Starter Plan</option>
                    <option value="pro">Pro Merchant Plan</option>
                    <option value="enterprise">Enterprise Plan</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ opacity: editPlan === "starter" ? 0.6 : 1 }}>
                    Custom CNAME Domain {editPlan === "starter" ? "(Pro/Enterprise Only)" : ""}
                  </label>
                  <input
                    type="text"
                    placeholder={editPlan === "starter" ? "Requires Pro or Enterprise plan" : "e.g. store.custombrand.com"}
                    value={editPlan === "starter" ? "" : editCustomDomain}
                    disabled={editPlan === "starter"}
                    onChange={(e) => setEditCustomDomain(e.target.value)}
                    className={styles.input}
                    style={{
                      backgroundColor: editPlan === "starter" ? "#f3f4f6" : "#ffffff",
                      cursor: editPlan === "starter" ? "not-allowed" : "text"
                    }}
                  />
                  {editPlan === "starter" && (
                    <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px", display: "block" }}>
                      🔒 Custom CNAME Domain is available on Pro or Enterprise plans only.
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Full Name</label>
                  <input
                    type="text"
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Email</label>
                  <input
                    type="email"
                    value={editOwnerEmail}
                    onChange={(e) => setEditOwnerEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Phone</label>
                  <input
                    type="text"
                    value={editOwnerPhone}
                    onChange={(e) => setEditOwnerPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Business Type</label>
                  <select
                    value={editBusinessType}
                    onChange={(e) => setEditBusinessType(e.target.value)}
                    className={styles.input}
                  >
                    <option value="retail">Retail Store</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="electronics">Electronics & Tech</option>
                    <option value="food">Food & Grocery</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Account Status</label>
                  <select
                    value={editIsActive ? "active" : "suspended"}
                    onChange={(e) => setEditIsActive(e.target.value === "active")}
                    className={styles.input}
                  >
                    <option value="active">● Active</option>
                    <option value="suspended">● Suspended</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Internal Super Admin Notes</label>
                <textarea
                  rows={2}
                  placeholder="Private notes about this tenant..."
                  value={editInternalNotes}
                  onChange={(e) => setEditInternalNotes(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={editSubmitting} className={styles.btnPrimary}>
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Super Admin Modal */}
      {isInviteAdminOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>Invite Super Admin User</h2>
            <p className={styles.modalSubtitle}>Grant full platform management and role permissions.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inviteName || !inviteEmail) return;
                const newAdmin = {
                  id: String(Date.now()),
                  name: inviteName,
                  email: inviteEmail,
                  role: inviteRole,
                  status: "Active",
                  lastLogin: "Just now",
                  twoFactor: true,
                };
                setAdmins([...admins, newAdmin]);
                setIsInviteAdminOpen(false);
                setInviteName("");
                setInviteEmail("");
                triggerToast(`Admin invite dispatched to ${inviteEmail}`);
              }}
            >
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@ecommerce.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Assigned Role & Scope</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className={styles.input}
                >
                  <option value="Super Admin">Super Admin (Full Root Privilege)</option>
                  <option value="Security Lead">Security Lead (2FA & Audit Only)</option>
                  <option value="Platform Support">Platform Support (Stores & Demo Requests)</option>
                  <option value="Billing Lead">Billing Lead (Subscriptions & Gateways)</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsInviteAdminOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>{confirmModal.title}</h2>
            <p className={styles.modalSubtitle}>{confirmModal.message}</p>

            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button
                className={confirmModal.isDanger ? styles.btnActionDanger : styles.btnPrimary}
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px", color: "#10b981" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

