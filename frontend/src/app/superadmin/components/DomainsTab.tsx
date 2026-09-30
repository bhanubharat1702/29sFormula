"use client";

import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import { DomainRecord, ReservedSubdomainItem, DomainSettings } from "./domainsTypes";
import { StoreItem } from "./types";
import { DomainsListTable } from "./domains/DomainsListTable";
import { ReservedSubdomainsTable } from "./domains/ReservedSubdomainsTable";
import { GlobalDomainSettingsForm } from "./domains/GlobalDomainSettingsForm";
import { AddCustomDomainModal } from "./domains/AddCustomDomainModal";
import { DnsInstructionsModal } from "./domains/DnsInstructionsModal";
import { BlockDomainModal } from "./domains/BlockDomainModal";
import { AddReservedSubdomainModal } from "./domains/AddReservedSubdomainModal";

interface DomainsTabProps {
  token: string;
  stores: StoreItem[];
  onShowToast: (msg: string) => void;
}

export default function DomainsTab({ token, stores, onShowToast }: DomainsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"domains" | "reserved" | "settings">("domains");
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [settings, setSettings] = useState<DomainSettings | null>(null);
  const [reservedList, setReservedList] = useState<ReservedSubdomainItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dnsFilter, setDnsFilter] = useState<string>("all");
  const [sslFilter, setSslFilter] = useState<string>("all");

  // Add Domain Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [redirectWww, setRedirectWww] = useState(true);
  const [redirectSubdomain, setRedirectSubdomain] = useState(true);
  const [addError, setAddError] = useState("");
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // DNS Details / Instructions Modal
  const [selectedDnsDomain, setSelectedDnsDomain] = useState<DomainRecord | null>(null);

  // Block Modal
  const [blockModalDomain, setBlockModalDomain] = useState<DomainRecord | null>(null);
  const [blockReason, setBlockReason] = useState("");

  // Add Reserved Modal
  const [isReservedModalOpen, setIsReservedModalOpen] = useState(false);
  const [newReservedSubdomain, setNewReservedSubdomain] = useState("");
  const [newReservedReason, setNewReservedReason] = useState("");

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDomains(data.domains || []);
        setSettings(data.settings || null);
      }
    } catch (err) {
      console.error("Fetch domains error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReserved = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/reserved", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReservedList(data);
      }
    } catch (err) {
      console.error("Fetch reserved error:", err);
    }
  };

  useEffect(() => {
    fetchDomains();
    fetchReserved();
  }, [token]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!selectedStoreId || !newDomain.trim()) {
      setAddError("Please select a merchant store and enter domain.");
      return;
    }

    setSubmittingAdd(true);
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          storeId: selectedStoreId,
          domain: newDomain.trim(),
          redirectWwwToRoot: redirectWww,
          redirectSubdomainToCustom: redirectSubdomain
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewDomain("");
        onShowToast(`Domain '${newDomain}' added successfully!`);
        fetchDomains();
        if (data.domain) {
          setSelectedDnsDomain(data.domain);
        }
      } else {
        setAddError(data.error || "Failed to add domain.");
      }
    } catch (err) {
      setAddError("Network error adding domain.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleRecheckDns = async (domainObj: DomainRecord) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/recheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain: domainObj.domain, storeId: domainObj.storeId })
      });
      const data = await res.json();
      if (res.ok) {
        onShowToast(data.message || `DNS re-verification succeeded for ${domainObj.domain}`);
        fetchDomains();
      } else {
        alert(data.error || "Re-check failed.");
      }
    } catch (err) {
      alert("Network error checking DNS.");
    }
  };

  const handleForceSslRenewal = async (domainObj: DomainRecord) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/force-ssl-renewal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain: domainObj.domain })
      });
      const data = await res.json();
      if (res.ok) {
        onShowToast(data.message || `SSL forcibly renewed for ${domainObj.domain}`);
        fetchDomains();
      }
    } catch (err) {
      alert("Error renewing SSL.");
    }
  };

  const handleSetPrimary = async (domainObj: DomainRecord) => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/set-primary", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ storeId: domainObj.storeId, domain: domainObj.domain })
      });
      if (res.ok) {
        onShowToast(`Primary domain set to '${domainObj.domain}'`);
        fetchDomains();
      }
    } catch (err) {
      alert("Error setting primary domain.");
    }
  };

  const handleBlockDomain = async () => {
    if (!blockModalDomain) return;
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain: blockModalDomain.domain, blockReason })
      });
      if (res.ok) {
        onShowToast(`Domain '${blockModalDomain.domain}' blocked.`);
        setBlockModalDomain(null);
        setBlockReason("");
        fetchDomains();
      }
    } catch (err) {
      alert("Error blocking domain.");
    }
  };

  const handleRemoveDomain = async (domainObj: DomainRecord) => {
    if (!confirm(`Are you sure you want to remove '${domainObj.domain}'?`)) return;
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ storeId: domainObj.storeId, domain: domainObj.domain })
      });
      if (res.ok) {
        onShowToast(`Domain '${domainObj.domain}' removed.`);
        fetchDomains();
      }
    } catch (err) {
      alert("Error removing domain.");
    }
  };

  const handleBulkReverify = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/bulk-reverify", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        onShowToast(data.message);
        fetchDomains();
      }
    } catch (err) {
      alert("Error running bulk reverify.");
    }
  };

  const handleAddReserved = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReservedSubdomain.trim()) return;
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/reserved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subdomain: newReservedSubdomain.trim(), reason: newReservedReason })
      });
      if (res.ok) {
        setIsReservedModalOpen(false);
        setNewReservedSubdomain("");
        setNewReservedReason("");
        onShowToast("Reserved subdomain added.");
        fetchReserved();
      }
    } catch (err) {
      alert("Error reserving subdomain.");
    }
  };

  const handleRemoveReserved = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/superadmin/domains/reserved/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onShowToast("Reserved subdomain unreserved.");
        fetchReserved();
      }
    } catch (err) {
      alert("Error removing reserved subdomain.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch("http://localhost:5001/api/superadmin/domains/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        onShowToast("Global domain settings updated.");
        fetchDomains();
      }
    } catch (err) {
      alert("Error saving domain settings.");
    }
  };

  // Filtered domains list
  const filteredDomains = domains.filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (dnsFilter !== "all" && d.dnsStatus !== dnsFilter) return false;
    if (sslFilter !== "all" && d.sslStatus !== sslFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDomain = d.domain.toLowerCase().includes(q);
      const matchStore = d.storeName.toLowerCase().includes(q);
      const matchSub = d.subdomain.toLowerCase().includes(q);
      const matchEmail = d.ownerEmail.toLowerCase().includes(q);
      if (!matchDomain && !matchStore && !matchSub && !matchEmail) return false;
    }
    return true;
  });

  const activeDomainsCount = domains.filter(d => d.dnsStatus === "active" || d.dnsStatus === "dns_verified" || d.sslStatus === "active").length;
  const pendingDomainsCount = domains.filter(d => d.dnsStatus === "pending").length;
  const failedDomainsCount = domains.filter(d => d.dnsStatus === "failed" || d.isBlocked).length;

  return (
    <div className={styles.tabContentContainer}>
      {/* Upper Navigation Tabs & Quick Action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={`${styles.btnSecondary} ${activeSubTab === "domains" ? styles.btnPrimary : ""}`}
            onClick={() => setActiveSubTab("domains")}
          >
            🌐 All Domains ({domains.length})
          </button>
          <button
            className={`${styles.btnSecondary} ${activeSubTab === "reserved" ? styles.btnPrimary : ""}`}
            onClick={() => setActiveSubTab("reserved")}
          >
            🔒 Reserved Subdomains ({reservedList.length})
          </button>
          <button
            className={`${styles.btnSecondary} ${activeSubTab === "settings" ? styles.btnPrimary : ""}`}
            onClick={() => setActiveSubTab("settings")}
          >
            ⚙️ Domain Settings & Limits
          </button>
        </div>

        {activeSubTab === "domains" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button className={styles.btnSecondary} onClick={handleBulkReverify} title="Bulk re-verify all pending DNS entries">
              🔄 Bulk Re-Verify DNS
            </button>
            <button className={styles.btnPrimary} onClick={() => { setAddError(""); setIsAddModalOpen(true); }}>
              + Add Custom Domain
            </button>
          </div>
        )}
      </div>

      {activeSubTab === "domains" && (
        <>
          {/* Summary Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Platform Domains</span>
              <span className={styles.statValue}>{domains.length}</span>
              <span className={styles.statSub}>Subdomains + Custom CNAMEs</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Active & Verified</span>
              <span className={styles.statValue} style={{ color: "#10b981" }}>{activeDomainsCount}</span>
              <span className={styles.statSub}>SSL Issued & Live</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Pending DNS Verification</span>
              <span className={styles.statValue} style={{ color: "#f59e0b" }}>{pendingDomainsCount}</span>
              <span className={styles.statSub}>Awaiting merchant CNAME</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Blocked / Failed</span>
              <span className={styles.statValue} style={{ color: "#ef4444" }}>{failedDomainsCount}</span>
              <span className={styles.statSub}>DNS or Security Issues</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search domain, store name, owner email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.formInput}
              style={{ maxWidth: "320px" }}
            />

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={styles.formInput} style={{ width: "160px" }}>
              <option value="all">All Types</option>
              <option value="custom">Custom CNAME</option>
              <option value="subdomain">Subdomain</option>
            </select>

            <select value={dnsFilter} onChange={(e) => setDnsFilter(e.target.value)} className={styles.formInput} style={{ width: "180px" }}>
              <option value="all">All DNS Statuses</option>
              <option value="dns_verified">DNS Verified</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed / Blocked</option>
            </select>

            <select value={sslFilter} onChange={(e) => setSslFilter(e.target.value)} className={styles.formInput} style={{ width: "180px" }}>
              <option value="all">All SSL Statuses</option>
              <option value="active">SSL Active</option>
              <option value="pending">SSL Pending</option>
              <option value="failed">SSL Failed</option>
            </select>
          </div>

          {/* Domains Table Component */}
          <DomainsListTable
            loading={loading}
            domains={filteredDomains}
            onViewDns={(domain) => setSelectedDnsDomain(domain)}
            onRecheckDns={handleRecheckDns}
            onForceSsl={handleForceSslRenewal}
            onSetPrimary={handleSetPrimary}
            onBlockDomain={(domain) => setBlockModalDomain(domain)}
            onRemoveDomain={handleRemoveDomain}
          />
        </>
      )}

      {/* Reserved Subdomains Sub-tab */}
      {activeSubTab === "reserved" && (
        <ReservedSubdomainsTable
          reservedList={reservedList}
          onOpenAddModal={() => setIsReservedModalOpen(true)}
          onRemoveReserved={handleRemoveReserved}
        />
      )}

      {/* Domain Settings Sub-tab */}
      {activeSubTab === "settings" && settings && (
        <GlobalDomainSettingsForm
          settings={settings}
          setSettings={setSettings}
          onSaveSettings={handleSaveSettings}
        />
      )}

      {/* Add Custom Domain Modal */}
      <AddCustomDomainModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDomain}
        stores={stores}
        selectedStoreId={selectedStoreId}
        setSelectedStoreId={setSelectedStoreId}
        newDomain={newDomain}
        setNewDomain={setNewDomain}
        redirectWww={redirectWww}
        setRedirectWww={setRedirectWww}
        redirectSubdomain={redirectSubdomain}
        setRedirectSubdomain={setRedirectSubdomain}
        addError={addError}
        submittingAdd={submittingAdd}
      />

      {/* DNS Instructions Modal */}
      <DnsInstructionsModal
        domainObj={selectedDnsDomain}
        onClose={() => setSelectedDnsDomain(null)}
      />

      {/* Block Domain Modal */}
      <BlockDomainModal
        domainObj={blockModalDomain}
        blockReason={blockReason}
        setBlockReason={setBlockReason}
        onClose={() => setBlockModalDomain(null)}
        onConfirmBlock={handleBlockDomain}
      />

      {/* Add Reserved Subdomain Modal */}
      <AddReservedSubdomainModal
        isOpen={isReservedModalOpen}
        newSubdomain={newReservedSubdomain}
        setNewSubdomain={setNewReservedSubdomain}
        newReason={newReservedReason}
        setNewReason={setNewReservedReason}
        onClose={() => setIsReservedModalOpen(false)}
        onSubmit={handleAddReserved}
      />
    </div>
  );
}
