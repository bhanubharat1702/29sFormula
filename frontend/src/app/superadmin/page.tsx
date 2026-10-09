"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { StoreItem, DemoRequestItem, CrmAnalytics, Stats, AdminUser, FeatureFlag, ConfirmModalData } from "./components/types";
import { LoginView } from "./components/layout/LoginView";
import { Sidebar } from "./components/layout/Sidebar";
import { TopHeader } from "./components/layout/TopHeader";
import { StatsGrid } from "./components/layout/StatsGrid";
import { ActionBar } from "./components/layout/ActionBar";
import { StoresTable } from "./components/stores/StoresTable";
import { DemoRequestsTable } from "./components/crm/DemoRequestsTable";
import { DemoRequestsCrmHeader } from "./components/crm/DemoRequestsCrmHeader";
import { DemoRequestsKanban } from "./components/crm/DemoRequestsKanban";
import { DemoRequestDetailModal } from "./components/crm/DemoRequestDetailModal";
import TabPlaceholder from "./components/common/TabPlaceholder";
import DashboardTab from "./components/DashboardTab";
import BillingTab from "./components/BillingTab";

import AnalyticsTab from "./components/AnalyticsTab";
import CommunicationsTab from "./components/CommunicationsTab";
import DomainsTab from "./components/DomainsTab";
import AuditLogTab from "./components/AuditLogTab";
import SettingsTab from "./components/settings/SettingsTab";
import CreateStoreModal from "./components/modals/CreateStoreModal";
import EditStoreModal from "./components/modals/EditStoreModal";
import { MerchantDetailsModal } from "./components/modals/MerchantDetailsModal";
import InviteAdminModal from "./components/modals/InviteAdminModal";
import ConfirmModal from "./components/modals/ConfirmModal";
import DeleteStoreModal from "./components/modals/DeleteStoreModal";
import ToastNotification from "./components/common/ToastNotification";
import { isTokenExpired } from "./utils/auth";

export default function SuperAdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation & Data
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [storeStatusFilter, setStoreStatusFilter] = useState("all");

  // Store Pagination State (Issue 8)
  const [storePage, setStorePage] = useState(1);
  const [storeLimit, setStoreLimit] = useState(10);
  const [totalStoresCount, setTotalStoresCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(1);

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [newStoreName, setNewStoreName] = useState("");
  const [newSubdomain, setNewSubdomain] = useState("");
  const [newBusinessLogo, setNewBusinessLogo] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("retail");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPlan, setNewPlan] = useState("pro");
  const [newCustomDomain, setNewCustomDomain] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editSubdomain, setEditSubdomain] = useState("");
  const [editBusinessLogo, setEditBusinessLogo] = useState("");
  const [editPlan, setEditPlan] = useState("pro");
  const [editCustomDomain, setEditCustomDomain] = useState("");
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editOwnerEmail, setEditOwnerEmail] = useState("");
  const [editOwnerPhone, setEditOwnerPhone] = useState("");
  const [editBusinessType, setEditBusinessType] = useState("retail");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editInternalNotes, setEditInternalNotes] = useState("");
  const [editFormError, setEditFormError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Detail Modal
  const [selectedDetailStore, setSelectedDetailStore] = useState<StoreItem | null>(null);

  // CRM State
  const [crmViewMode, setCrmViewMode] = useState<"kanban" | "table">("kanban");
  const [selectedLead, setSelectedLead] = useState<DemoRequestItem | null>(null);
  const [crmAnalytics, setCrmAnalytics] = useState<CrmAnalytics | null>(null);
  const [selectedStageFilter, setSelectedStageFilter] = useState("all");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("all");

  // Settings sub-navigation
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

  // Toast & Modal Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalData | null>(null);
  const [deleteStoreModalStore, setDeleteStoreModalStore] = useState<StoreItem | null>(null);

  // Extended Settings State
  const [platformName, setPlatformName] = useState("Multi-Tenant E-Commerce");
  const [platformLogo, setPlatformLogo] = useState("/logo.png");
  const [supportEmail, setSupportEmail] = useState("support@ecommerce.com");
  const [baseDomain, setBaseDomain] = useState("localhost:3000");
  const [timezone, setTimezone] = useState("Asia/Kolkata (UTC+05:30)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [language, setLanguage] = useState("English (US)");

  const [enforce2FA, setEnforce2FA] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState(10);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState("30");
  const [loginAlertEmail, setLoginAlertEmail] = useState(true);
  const [loginAlertSlack, setLoginAlertSlack] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState("192.168.1.1/24, 10.0.0.0/8");

  const [trialLengthDays, setTrialLengthDays] = useState(14);
  const [defaultTheme, setDefaultTheme] = useState("Modern Minimalist");
  const [reservedSubdomains, setReservedSubdomains] = useState("api, admin, superadmin, app, test, dev, staging, mail, shop");
  const [autoProvisionSampleData, setAutoProvisionSampleData] = useState(true);
  const [selfServeSignup, setSelfServeSignup] = useState(false);

  const [stripePublishableKey, setStripePublishableKey] = useState("pk_test_51Nx...example");
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_test_51Nx...secret");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_998188188");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("rzp_secret_key_sample");
  const [s3Bucket, setS3Bucket] = useState("ecommerce-tenant-assets");
  const [s3Region, setS3Region] = useState("ap-south-1");
  const [s3AccessKey, setS3AccessKey] = useState("AKIAIOSFODNN7EXAMPLE");
  const [s3SecretKey, setS3SecretKey] = useState("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const [emailProvider, setEmailProvider] = useState("SendGrid API");
  const [senderEmail, setSenderEmail] = useState("noreply@ecommerce.com");

  const [termsVersion, setTermsVersion] = useState("v2.4 (Updated Aug 2024)");
  const [privacyVersion, setPrivacyVersion] = useState("v1.8 (GDPR Compliant)");
  const [gdprExportHours, setGdprExportHours] = useState(24);
  const [gdprDeleteGraceDays, setGdprDeleteGraceDays] = useState(30);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(365);
  const [financialRetentionYears, setFinancialRetentionYears] = useState(7);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("Scheduled maintenance in progress. Backend operations paused.");
  const [backupSchedule, setBackupSchedule] = useState("Daily at 02:00 UTC");
  const [lastBackupTime, setLastBackupTime] = useState("Today, 02:00 UTC (Successful)");

  const [starterLimit, setStarterLimit] = useState(60);
  const [proLimit, setProLimit] = useState(300);
  const [enterpriseLimit, setEnterpriseLimit] = useState(1200);

  const [landingTitle, setLandingTitle] = useState("Launch Your Multi-Vendor E-Commerce Platform");
  const [landingSubtitle, setLandingSubtitle] = useState("Enterprise SaaS framework for modern hyper-scalable merchant stores");
  const [emailHeaderLogo, setEmailHeaderLogo] = useState("https://cdn.ecommerce.com/logo.png");
  const [emailFooterText, setEmailFooterText] = useState("© 2026 E-Commerce SaaS Inc. All rights reserved.");

  const [isInviteAdminOpen, setIsInviteAdminOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Super Admin");

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: "1", name: "Root Admin", email: "root@ecommerce.com", role: "Super Admin", status: "Active", lastLogin: "Active now", twoFactor: true },
    { id: "2", name: "Sarah Jenkins", email: "sarah@ecommerce.com", role: "Platform Support", status: "Active", lastLogin: "2 hours ago", twoFactor: true },
    { id: "3", name: "Alex Rivera", email: "alex@ecommerce.com", role: "Security Lead", status: "Inactive", lastLogin: "3 days ago", twoFactor: false },
  ]);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    { name: "Multi-Currency Checkout", key: "multi_currency_v2", enabled: true, rollout: 100, plans: "Pro, Enterprise" },
    { name: "AI Product Description Generator", key: "ai_copywriter", enabled: true, rollout: 50, plans: "All Plans" },
    { name: "Custom CNAME SSL Automation", key: "auto_ssl_cname", enabled: false, rollout: 0, plans: "Enterprise" },
    { name: "WhatsApp Order Notifications", key: "whatsapp_gateway", enabled: true, rollout: 100, plans: "Pro, Enterprise" },
  ]);

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Zapier Integration Key", key: "pk_live_898231920831", createdAt: "2026-01-15", status: "Active" },
    { id: "2", name: "Mobile App Webhook Secret", key: "pk_live_112093849182", createdAt: "2026-02-01", status: "Active" },
  ]);

  const navTabsRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleUnauthorized = (reason = "Your session has expired. Please log in again.") => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminData");
    setIsAuthenticated(false);
    if (reason) setLoginError(reason);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("superAdminToken");
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      handleUnauthorized(token ? "Your session has expired. Please log in again." : "");
    }

    const interval = setInterval(() => {
      const activeToken = localStorage.getItem("superAdminToken");
      if (activeToken && isTokenExpired(activeToken)) {
        handleUnauthorized("Your session has expired. Please log in again.");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkTabScroll = () => {
    if (navTabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navTabsRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    if (activeTab === "settings") {
      setTimeout(() => {
        checkTabScroll();
      }, 50);
    }
  }, [activeTab, activeSettingsSection]);

  const scrollTabs = (direction: "left" | "right") => {
    if (navTabsRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      navTabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkTabScroll, 300);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("superAdminToken", data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.message || "Invalid Super Admin credentials.");
      }
    } catch {
      setLoginError("Failed to connect to backend server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("superAdminToken");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const storesUrl = `http://localhost:5001/api/superadmin/stores?page=${storePage}&limit=${storeLimit}&status=${storeStatusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const [storesRes, statsRes, demoRes] = await Promise.all([
        fetch(storesUrl, { headers }),
        fetch("http://localhost:5001/api/superadmin/stats", { headers }),
        fetch("http://localhost:5001/api/superadmin/demo-requests", { headers }),
      ]);

      if (storesRes.status === 401 || statsRes.status === 401 || demoRes.status === 401) {
        localStorage.removeItem("superAdminToken");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (storesRes.ok) {
        const storesData = await storesRes.json();
        if (Array.isArray(storesData)) {
          setStores(storesData);
          setTotalStoresCount(storesData.length);
          setTotalPagesCount(1);
        } else if (storesData.stores) {
          setStores(storesData.stores);
          setTotalStoresCount(storesData.total || storesData.stores.length);
          setTotalPagesCount(storesData.totalPages || 1);
        }
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (demoRes.ok) {
        const demoData = await demoRes.json();
        setDemoRequests(demoData);
      }
    } catch (err) {
      console.error("Failed to fetch superadmin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, storePage, storeLimit, storeStatusFilter]);

  const fetchCrmAnalytics = async () => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/demo-requests/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCrmAnalytics(data);
      }
    } catch (err) {
      console.error("Failed to fetch CRM analytics:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "demo-requests") {
      fetchCrmAnalytics();
    }
  }, [isAuthenticated, activeTab]);

  const handleUpdateLeadStage = async (id: string, stage: string, notes?: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/stage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Lead stage updated to ${stage}`);
        fetchData();
        fetchCrmAnalytics();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to update lead stage:", err);
    }
  };

  const handleAssignLeadOwner = async (id: string, ownerName: string, ownerEmail: string, ownerId: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ownerName, ownerEmail, ownerId }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Lead assigned to ${ownerName}`);
        fetchData();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to assign owner:", err);
    }
  };

  const handleUpdateLeadPriority = async (id: string, priority: "Low" | "Medium" | "High" | "Urgent") => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/priority`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Priority set to ${priority}`);
        fetchData();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  const handleAddLeadNote = async (id: string, noteText: string, followUpReminder?: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noteText, followUpReminder }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast("Note added to lead timeline");
        fetchData();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const handleScheduleDemo = async (id: string, date: string, meetingUrl: string, notes?: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/schedule-demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, meetingUrl, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast("Demo scheduled & meeting link logged!");
        fetchData();
        fetchCrmAnalytics();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to schedule demo:", err);
    }
  };

  const handleSendLeadEmail = async (id: string, templateType: string, customSubject?: string, customBody?: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateType, customSubject, customBody }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast("Email template logged & sent!");
        fetchData();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  };

  const handleMarkLeadLost = async (id: string, lossReason: string, lossNotes?: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/mark-lost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lossReason, lossNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Lead marked as Lost (${lossReason})`);
        fetchData();
        fetchCrmAnalytics();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to mark lost:", err);
    }
  };

  const handleToggleLeadSpam = async (id: string) => {
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}/mark-spam`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(data.message);
        fetchData();
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead(data.request);
        }
      }
    } catch (err) {
      console.error("Failed to toggle spam:", err);
    }
  };

  const handleDeleteLead = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Lead Request",
      message: "Are you sure you want to permanently delete this lead request from CRM?",
      actionLabel: "Delete Lead",
      isDanger: true,
      onConfirm: async () => {
        const token = localStorage.getItem("superAdminToken");
        try {
          const res = await fetch(`http://localhost:5001/api/superadmin/demo-requests/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            triggerToast("Lead deleted successfully.");
            if (selectedLead && selectedLead._id === id) {
              setSelectedLead(null);
            }
            fetchData();
            fetchCrmAnalytics();
          }
        } catch (err) {
          console.error("Failed to delete lead:", err);
        } finally {
          setConfirmModal(null);
        }
      },
    });
  };

  const handleExportCrmCsv = () => {
    const token = localStorage.getItem("superAdminToken");
    window.open(`http://localhost:5001/api/superadmin/demo-requests/export?token=${token}`, "_blank");
  };

  const filteredDemoRequests = demoRequests.filter((d) => {
    if (selectedStageFilter !== "all") {
      const stage = d.pipelineStage || (d.status === "Approved" ? "Won" : d.status === "Rejected" ? "Lost" : d.status === "Contacted" ? "Contacted" : "New");
      if (stage !== selectedStageFilter) return false;
    }
    if (selectedPriorityFilter !== "all") {
      if ((d.priority || "Medium") !== selectedPriorityFilter) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchStore = (d.storeName || "").toLowerCase().includes(q);
      const matchOwner = (d.ownerName || "").toLowerCase().includes(q);
      const matchEmail = (d.email || "").toLowerCase().includes(q);
      const matchPhone = (d.phone || "").toLowerCase().includes(q);
      const matchWebsite = (d.currentWebsite || "").toLowerCase().includes(q);
      if (!matchStore && !matchOwner && !matchEmail && !matchPhone && !matchWebsite) return false;
    }
    return true;
  });

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (newPlan === "starter" && newCustomDomain.trim()) {
      setFormError("Custom CNAME domains require a Pro or Enterprise plan.");
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStoreName,
          subdomain: newSubdomain.toLowerCase().trim(),
          businessLogo: newBusinessLogo.trim() || undefined,
          businessType: newBusinessType,
          ownerEmail: newOwnerEmail,
          ownerName: newOwnerName,
          ownerPhone: newOwnerPhone,
          password: newPassword,
          plan: newPlan,
          customDomain: newCustomDomain.trim() || undefined,
          demoRequestId: selectedDemoId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setNewStoreName("");
        setNewSubdomain("");
        setNewBusinessLogo("");
        setNewBusinessType("retail");
        setNewOwnerEmail("");
        setNewOwnerName("");
        setNewOwnerPhone("");
        setNewPassword("");
        setNewPlan("pro");
        setNewCustomDomain("");
        setSelectedDemoId(null);
        triggerToast("Store provisioned successfully!");
        fetchData();
      } else {
        setFormError(data.message || data.error || "Failed to create merchant store.");
      }
    } catch {
      setFormError("Network error provisioning merchant store.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (store: StoreItem) => {
    setEditingStoreId(store._id);
    setEditStoreName(store.name);
    setEditSubdomain(store.subdomain);
    setEditBusinessLogo(store.businessLogo || "");
    setEditPlan(store.plan || "pro");
    setEditCustomDomain(store.customDomain || "");
    setEditOwnerName(store.ownerName || "");
    setEditOwnerEmail(store.ownerEmail || "");
    setEditOwnerPhone(store.ownerPhone || "");
    setEditBusinessType(store.businessType || "retail");
    setEditIsActive(store.isActive ?? true);
    setEditInternalNotes(store.internalNotes || "");
    setEditFormError("");
    setIsEditModalOpen(true);
  };

  const handleSaveEditStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreId) return;
    setEditFormError("");
    if (editPlan === "starter" && editCustomDomain.trim()) {
      setEditFormError("Custom CNAME domains require a Pro or Enterprise plan.");
      return;
    }
    setEditSubmitting(true);
    const token = localStorage.getItem("superAdminToken");
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/stores/${editingStoreId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editStoreName,
          subdomain: editSubdomain.toLowerCase().trim(),
          businessLogo: editBusinessLogo.trim(),
          plan: editPlan,
          customDomain: editCustomDomain.trim() || undefined,
          ownerName: editOwnerName,
          ownerEmail: editOwnerEmail,
          ownerPhone: editOwnerPhone,
          businessType: editBusinessType,
          isActive: editIsActive,
          internalNotes: editInternalNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditModalOpen(false);
        triggerToast("Tenant updated successfully!");
        fetchData();
      } else {
        setEditFormError(data.message || data.error || "Failed to update tenant.");
      }
    } catch {
      setEditFormError("Network error updating tenant.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleToggleStatus = async (store: StoreItem) => {
    const action = store.isActive ? "suspend" : "activate";
    setConfirmModal({
      isOpen: true,
      title: `${action.toUpperCase()} Merchant Store`,
      message: `Are you sure you want to ${action} "${store.name}" (${store.subdomain})?`,
      actionLabel: action === "suspend" ? "Suspend Account" : "Activate Account",
      isDanger: action === "suspend",
      onConfirm: async () => {
        setConfirmModal(null);
        const token = localStorage.getItem("superAdminToken");
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          const res = await fetch(`${apiBase}/api/superadmin/stores/${store._id}/toggle-status`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (res.ok) {
            triggerToast(`Store ${store.name} ${action}ed.`);
            fetchData();
          } else {
            const errData = await res.json().catch(() => ({}));
            alert(errData.error || `Failed to ${action} store.`);
          }
        } catch {
          alert(`Network error toggling status.`);
        }
      },
    });
  };

  const handleDeleteStore = (store: StoreItem) => {
    setDeleteStoreModalStore(store);
  };

  const executeDeleteStore = async (password: string) => {
    if (!deleteStoreModalStore) return;
    const token = localStorage.getItem("superAdminToken");
    const targetStoreId = deleteStoreModalStore._id;
    const targetSubdomain = deleteStoreModalStore.subdomain;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiBase}/api/superadmin/stores/${targetStoreId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // forcePurge: permanently delete every merchant record and uploaded media.
        body: JSON.stringify({
          password,
          forcePurge: true,
          reason: "Super admin permanent account deletion"
        }),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast(
          data?.message ||
          `Store ${targetSubdomain} and all associated merchant data were permanently deleted.`
        );
        setDeleteStoreModalStore(null);
        // Close any open detail view for the store that was just purged.
        setSelectedDetailStore((prev) => (prev && prev._id === targetStoreId ? null : prev));
        fetchData();
      } else {
        alert(data.error || "Failed to delete store.");
      }
    } catch {
      alert("Network error deleting store.");
    }
  };

  const handleProvisionFromDemo = (demo: DemoRequestItem) => {
    setSelectedDemoId(demo._id);
    setNewStoreName(demo.storeName);
    setNewSubdomain(demo.subdomain || demo.storeName.toLowerCase().replace(/[^a-z0-9]/g, ""));
    setNewOwnerName(demo.ownerName);
    setNewOwnerEmail(demo.email);
    setNewOwnerPhone(demo.phone || "");
    setNewPlan(demo.plan || "pro");
    setNewPassword("MerchantPass123!");
    setFormError("");
    setIsModalOpen(true);
  };

  const filteredStores = stores.filter((store) => {
    const name = store.name || "";
    const subdomain = store.subdomain || "";
    const customDomain = store.customDomain || "";
    const query = (searchQuery || "").toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(query) ||
      subdomain.toLowerCase().includes(query) ||
      customDomain.toLowerCase().includes(query);

    const matchesStatus =
      storeStatusFilter === "all"
        ? true
        : storeStatusFilter === "active"
          ? Boolean(store.isActive)
          : !store.isActive;

    return matchesSearch && matchesStatus;
  });

  // Early return for login view
  if (!isAuthenticated) {
    return (
      <LoginView
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginSubmitting={false}
        loginError={loginError || null}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className={`${styles.adminPageWrapper} ${isSidebarCollapsed ? styles.adminPageCollapsed : ""}`}>
      <Sidebar
        platformName={platformName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storesCount={stores.length}
        demoRequestsCount={demoRequests.length}
        onLogout={handleLogout}
        isOpenMobileMenu={isOpenMobileMenu}
        onCloseMobileMenu={() => setIsOpenMobileMenu(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      <main className={styles.mainContent}>

        {activeTab === "dashboard" && (
          <DashboardTab
            stats={stats}
            stores={stores}
            setActiveTab={setActiveTab}
            onOpenCreateModal={() => {
              setSelectedDemoId(null);
              setFormError("");
              setIsModalOpen(true);
            }}
            onSelectStore={(store) => setSelectedDetailStore(store)}
          />
        )}

        {activeTab === "stores" && (
          <>
            <StatsGrid stats={stats} activeTab={activeTab} />
            <ActionBar
              activeTab={activeTab}
              storeStatusFilter={storeStatusFilter}
              setStoreStatusFilter={setStoreStatusFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <StoresTable
              activeTab={activeTab}
              loading={loading}
              filteredStores={filteredStores}
              onOpenEditModal={handleOpenEditModal}
              onToggleStatus={handleToggleStatus}
              onDeleteStore={handleDeleteStore}
              onSelectStore={(store) => setSelectedDetailStore(store)}
              currentPage={storePage}
              totalPages={totalPagesCount}
              totalStores={totalStoresCount}
              pageSize={storeLimit}
              onPageChange={(page) => setStorePage(page)}
              onPageSizeChange={(size) => {
                setStoreLimit(size);
                setStorePage(1);
              }}
            />
          </>
        )}


        {activeTab === "demo-requests" && (
          <div>
            <DemoRequestsCrmHeader
              analytics={crmAnalytics}
              viewMode={crmViewMode}
              setViewMode={setCrmViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStageFilter={selectedStageFilter}
              setSelectedStageFilter={setSelectedStageFilter}
              selectedPriorityFilter={selectedPriorityFilter}
              setSelectedPriorityFilter={setSelectedPriorityFilter}
              onExportCsv={handleExportCrmCsv}
              onOpenCreateLeadModal={() => {
                setSelectedDemoId(null);
                setFormError("");
                setIsModalOpen(true);
              }}
            />

            {crmViewMode === "kanban" ? (
              <DemoRequestsKanban
                demoRequests={filteredDemoRequests}
                onSelectLead={(demo) => setSelectedLead(demo)}
                onUpdateStage={handleUpdateLeadStage}
                onConvert={handleProvisionFromDemo}
              />
            ) : (
              <DemoRequestsTable
                activeTab={activeTab}
                loading={loading}
                demoRequests={filteredDemoRequests}
                onSelectLead={(demo) => setSelectedLead(demo)}
                onProvisionFromDemo={handleProvisionFromDemo}
                onUpdateStage={handleUpdateLeadStage}
                onDeleteLead={handleDeleteLead}
              />
            )}
          </div>
        )}

        {activeTab === "billing" && (
          <BillingTab
            token={localStorage.getItem("superAdminToken") || ""}
            onShowToast={triggerToast}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            token={localStorage.getItem("superAdminToken") || ""}
            onShowToast={triggerToast}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === "communications" && (
          <CommunicationsTab
            token={localStorage.getItem("superAdminToken") || ""}
            onShowToast={triggerToast}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === "domains" && (
          <DomainsTab
            token={localStorage.getItem("superAdminToken") || ""}
            stores={stores}
            onShowToast={triggerToast}
            onUnauthorized={handleUnauthorized}
          />
        )}

        {activeTab === "audit-log" && (
          <AuditLogTab
            token={localStorage.getItem("superAdminToken") || ""}
            onShowToast={triggerToast}
            onUnauthorized={handleUnauthorized}
          />
        )}

        <TabPlaceholder activeTab={activeTab} />

        {activeTab === "settings" && (
          <SettingsTab
            setActiveTab={setActiveTab}
            activeSettingsSection={activeSettingsSection}
            setActiveSettingsSection={setActiveSettingsSection}
            navTabsRef={navTabsRef}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            scrollTabs={scrollTabs}
            checkTabScroll={checkTabScroll}
            triggerToast={triggerToast}
            platformName={platformName}
            setPlatformName={setPlatformName}
            platformLogo={platformLogo}
            setPlatformLogo={setPlatformLogo}
            supportEmail={supportEmail}
            setSupportEmail={setSupportEmail}
            baseDomain={baseDomain}
            setBaseDomain={setBaseDomain}
            timezone={timezone}
            setTimezone={setTimezone}
            currency={currency}
            setCurrency={setCurrency}
            language={language}
            setLanguage={setLanguage}
            admins={admins}
            setAdmins={setAdmins}
            setIsInviteAdminOpen={setIsInviteAdminOpen}
            enforce2FA={enforce2FA}
            setEnforce2FA={setEnforce2FA}
            minPasswordLength={minPasswordLength}
            setMinPasswordLength={setMinPasswordLength}
            passwordExpiryDays={passwordExpiryDays}
            setPasswordExpiryDays={setPasswordExpiryDays}
            sessionTimeoutMins={sessionTimeoutMins}
            setSessionTimeoutMins={setSessionTimeoutMins}
            loginAlertEmail={loginAlertEmail}
            setLoginAlertEmail={setLoginAlertEmail}
            loginAlertSlack={loginAlertSlack}
            setLoginAlertSlack={setLoginAlertSlack}
            ipAllowlist={ipAllowlist}
            setIpAllowlist={setIpAllowlist}
            trialLengthDays={trialLengthDays}
            setTrialLengthDays={setTrialLengthDays}
            defaultTheme={defaultTheme}
            setDefaultTheme={setDefaultTheme}
            reservedSubdomains={reservedSubdomains}
            setReservedSubdomains={setReservedSubdomains}
            autoProvisionSampleData={autoProvisionSampleData}
            setAutoProvisionSampleData={setAutoProvisionSampleData}
            selfServeSignup={selfServeSignup}
            setSelfServeSignup={setSelfServeSignup}
            featureFlags={featureFlags}
            setFeatureFlags={setFeatureFlags}
            stripePublishableKey={stripePublishableKey}
            setStripePublishableKey={setStripePublishableKey}
            stripeSecretKey={stripeSecretKey}
            setStripeSecretKey={setStripeSecretKey}
            razorpayKeyId={razorpayKeyId}
            setRazorpayKeyId={setRazorpayKeyId}
            razorpayKeySecret={razorpayKeySecret}
            setRazorpayKeySecret={setRazorpayKeySecret}
            s3Bucket={s3Bucket}
            setS3Bucket={setS3Bucket}
            s3Region={s3Region}
            setS3Region={setS3Region}
            s3AccessKey={s3AccessKey}
            setS3AccessKey={setS3AccessKey}
            s3SecretKey={s3SecretKey}
            setS3SecretKey={setS3SecretKey}
            showSecrets={showSecrets}
            toggleSecret={toggleSecret}
            emailProvider={emailProvider}
            setEmailProvider={setEmailProvider}
            senderEmail={senderEmail}
            setSenderEmail={setSenderEmail}
            termsVersion={termsVersion}
            setTermsVersion={setTermsVersion}
            privacyVersion={privacyVersion}
            setPrivacyVersion={setPrivacyVersion}
            gdprExportHours={gdprExportHours}
            setGdprExportHours={setGdprExportHours}
            gdprDeleteGraceDays={gdprDeleteGraceDays}
            setGdprDeleteGraceDays={setGdprDeleteGraceDays}
            auditLogRetentionDays={auditLogRetentionDays}
            setAuditLogRetentionDays={setAuditLogRetentionDays}
            financialRetentionYears={financialRetentionYears}
            setFinancialRetentionYears={setFinancialRetentionYears}
            maintenanceMode={maintenanceMode}
            setMaintenanceMode={setMaintenanceMode}
            maintenanceMessage={maintenanceMessage}
            setMaintenanceMessage={setMaintenanceMessage}
            backupSchedule={backupSchedule}
            lastBackupTime={lastBackupTime}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            starterLimit={starterLimit}
            setStarterLimit={setStarterLimit}
            proLimit={proLimit}
            setProLimit={setProLimit}
            enterpriseLimit={enterpriseLimit}
            setEnterpriseLimit={setEnterpriseLimit}
            landingTitle={landingTitle}
            setLandingTitle={setLandingTitle}
            landingSubtitle={landingSubtitle}
            setLandingSubtitle={setLandingSubtitle}
            emailHeaderLogo={emailHeaderLogo}
            setEmailHeaderLogo={setEmailHeaderLogo}
            emailFooterText={emailFooterText}
            setEmailFooterText={setEmailFooterText}
          />
        )}
      </main>

      <CreateStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStore}
        selectedDemoId={selectedDemoId}
        formError={formError}
        submitting={submitting}
        newStoreName={newStoreName}
        setNewStoreName={setNewStoreName}
        newSubdomain={newSubdomain}
        setNewSubdomain={setNewSubdomain}
        newBusinessLogo={newBusinessLogo}
        setNewBusinessLogo={setNewBusinessLogo}
        newBusinessType={newBusinessType}
        setNewBusinessType={setNewBusinessType}
        newPlan={newPlan}
        setNewPlan={setNewPlan}
        newCustomDomain={newCustomDomain}
        setNewCustomDomain={setNewCustomDomain}
        newOwnerName={newOwnerName}
        setNewOwnerName={setNewOwnerName}
        newOwnerEmail={newOwnerEmail}
        setNewOwnerEmail={setNewOwnerEmail}
        newOwnerPhone={newOwnerPhone}
        setNewOwnerPhone={setNewOwnerPhone}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
      />

      <EditStoreModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveEditStore}
        editFormError={editFormError}
        editSubmitting={editSubmitting}
        editStoreName={editStoreName}
        setEditStoreName={setEditStoreName}
        editSubdomain={editSubdomain}
        setEditSubdomain={setEditSubdomain}
        editBusinessLogo={editBusinessLogo}
        setEditBusinessLogo={setEditBusinessLogo}
        editPlan={editPlan}
        setEditPlan={setEditPlan}
        editCustomDomain={editCustomDomain}
        setEditCustomDomain={setEditCustomDomain}
        editOwnerName={editOwnerName}
        setEditOwnerName={setEditOwnerName}
        editOwnerEmail={editOwnerEmail}
        setEditOwnerEmail={setEditOwnerEmail}
        editOwnerPhone={editOwnerPhone}
        setEditOwnerPhone={setEditOwnerPhone}
        editBusinessType={editBusinessType}
        setEditBusinessType={setEditBusinessType}
        editIsActive={editIsActive}
        setEditIsActive={setEditIsActive}
        editInternalNotes={editInternalNotes}
        setEditInternalNotes={setEditInternalNotes}
      />

      <InviteAdminModal
        isOpen={isInviteAdminOpen}
        onClose={() => setIsInviteAdminOpen(false)}
        inviteName={inviteName}
        setInviteName={setInviteName}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        admins={admins}
        setAdmins={setAdmins}
        triggerToast={triggerToast}
      />

      <ConfirmModal
        confirmModal={confirmModal}
        onClose={() => setConfirmModal(null)}
      />

      <DeleteStoreModal
        store={deleteStoreModalStore}
        isOpen={!!deleteStoreModalStore}
        onClose={() => setDeleteStoreModalStore(null)}
        onConfirm={executeDeleteStore}
      />

      <MerchantDetailsModal
        store={selectedDetailStore}
        onClose={() => setSelectedDetailStore(null)}
        onOpenEdit={(store) => {
          setSelectedDetailStore(null);
          handleOpenEditModal(store);
        }}
        onToggleStatus={(store) => {
          handleToggleStatus(store);
          setSelectedDetailStore((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
        }}
        onDeleteStore={(store) => {
          setSelectedDetailStore(null);
          handleDeleteStore(store);
        }}
      />

      <DemoRequestDetailModal
        demo={selectedLead}
        admins={admins}
        onClose={() => setSelectedLead(null)}
        onUpdateStage={handleUpdateLeadStage}
        onAssignOwner={handleAssignLeadOwner}
        onUpdatePriority={handleUpdateLeadPriority}
        onAddNote={handleAddLeadNote}
        onScheduleDemo={handleScheduleDemo}
        onSendEmail={handleSendLeadEmail}
        onConvert={(demo) => {
          setSelectedLead(null);
          handleProvisionFromDemo(demo);
        }}
        onMarkLost={handleMarkLeadLost}
        onToggleSpam={handleToggleLeadSpam}
        onDelete={handleDeleteLead}
      />

      <ToastNotification message={toastMessage} />
    </div>
  );
}
