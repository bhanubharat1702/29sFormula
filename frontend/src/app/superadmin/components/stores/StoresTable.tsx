import React, { useState, useEffect, useRef } from "react";
import styles from "../../page.module.css";
import { StoreItem } from "../types";

// Optional explicit storefront base-domain override. When left unset the base
// domain is resolved automatically at runtime, so nothing needs to be changed
// between local development and a deployed environment.
const STORE_BASE_DOMAIN_OVERRIDE = process.env.NEXT_PUBLIC_STORE_BASE_DOMAIN || "";

const LOCAL_HOST_RE = /localhost|127\.0\.0\.1|0\.0\.0\.0/;

// Strip protocol and path noise from a host string while preserving any port,
// e.g. "https://demo1.29sformula.com/admin" -> "demo1.29sformula.com".
const normalizeDomain = (value?: string): string =>
  (value || "").replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^\/\//, "").trim();

/**
 * Resolve the platform base domain with zero manual configuration:
 *  1. explicit NEXT_PUBLIC_STORE_BASE_DOMAIN override, if provided
 *  2. the current runtime host when it is localhost / an IP — so local
 *     development keeps serving <subdomain>.localhost:3000
 *  3. the store's own provisioned subdomain record — the live platform domain
 *     stamped onto each store at provisioning time (authoritative in prod)
 *  4. the current browser host, deriving the registrable root from the real
 *     request — fully dynamic across staging and production
 *  5. localhost:3000 as the last-resort local development fallback
 */
const resolveBaseDomain = (store: StoreItem): string => {
  if (STORE_BASE_DOMAIN_OVERRIDE) return normalizeDomain(STORE_BASE_DOMAIN_OVERRIDE);

  const runtimeHost = typeof window !== "undefined" ? window.location.host : "";

  // Local dev / IP host (may include a port like :3000) — keep it as-is.
  if (runtimeHost && LOCAL_HOST_RE.test(runtimeHost)) return runtimeHost;

  const subdomain = (store.subdomain || "").toLowerCase();
  const provisioned = store.domains?.find((d) => d.type === "subdomain")?.domain;

  if (provisioned) {
    const host = normalizeDomain(provisioned);
    if (subdomain && host.toLowerCase().startsWith(`${subdomain}.`)) {
      return host.substring(subdomain.length + 1);
    }
    return host;
  }

  if (runtimeHost) {
    const host = normalizeDomain(runtimeHost);
    const labels = host.split(".");
    // Production apex heuristic: keep the registrable root (last two labels),
    // so both "29sformula.com" and "demo1.29sformula.com" yield "29sformula.com".
    if (labels.length > 2) return labels.slice(-2).join(".");
    return host;
  }

  return "localhost:3000";
};

// http for localhost/IP targets, https everywhere else.
const getStoreProtocol = (domain: string): string => (LOCAL_HOST_RE.test(domain) ? "http" : "https");

// Fallback plan pricing (USD / month) when a store record has no explicit MRR.
const PLAN_MONTHLY_PRICES: Record<string, number> = {
  starter: 29,
  growth: 49,
  pro: 79,
  enterprise: 299,
};

// Helper to format date like "Nov 02, 2023"
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  } catch {
    return "—";
  }
};

// Resolve the human-readable billing cycle ("Monthly" / "Annual").
const getBillingCycle = (store: StoreItem): "monthly" | "annual" => {
  const raw = (store.billing?.billingCycle || "monthly").toLowerCase();
  return raw === "annual" ? "annual" : "monthly";
};

// Resolve the price text for the chosen plan + billing cycle, e.g. "$990/yr".
const getPlanPriceText = (store: StoreItem): string => {
  const planKey = (store.plan || "growth").toLowerCase();
  const monthly = PLAN_MONTHLY_PRICES[planKey] ?? 79;
  const cycle = getBillingCycle(store);
  const amount = cycle === "annual" ? monthly * 12 : monthly;
  return `$${amount.toLocaleString("en-US")}/${cycle === "annual" ? "yr" : "mo"}`;
};

// Project the subscription validity date: trial end for trials, otherwise the
// next renewal one billing cycle ahead of provisioning.
const getValidTill = (store: StoreItem): string => {
  const status = (store.status || "").toLowerCase();
  if (status === "trial" && store.trialEndsAt) {
    return formatDate(store.trialEndsAt);
  }
  if (!store.createdAt) return "—";
  try {
    const d = new Date(store.createdAt);
    if (isNaN(d.getTime())) return "—";
    if (getBillingCycle(store) === "annual") d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);
    return formatDate(d.toISOString());
  } catch {
    return "—";
  }
};

// Build the display URL for a store.
const getStoreUrl = (store: StoreItem): string => {
  const sub = store.subdomain && store.subdomain !== "default" ? store.subdomain : "store";
  const runtimeHost = typeof window !== "undefined" ? window.location.host : "";

  // Locally every store is served as <subdomain>.localhost:<port> regardless of
  // any custom domain, so links stay navigable during development.
  if (runtimeHost && LOCAL_HOST_RE.test(runtimeHost)) return `${sub}.${runtimeHost}`;

  // Custom domains take precedence once deployed.
  if (store.customDomain) return normalizeDomain(store.customDomain);
  return `${sub}.${resolveBaseDomain(store)}`;
};

// Map a country name to its ISO 3166-1 alpha-2 code so we can render a crisp
// rectangular flag image instead of a platform-dependent emoji glyph.
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

// Rectangular country flag rendered as an <img> so it always shows as a small
// flag card rather than a "flag-like" emoji glyph.
const CountryFlag: React.FC<{ country?: string; label?: string }> = ({ country, label }) => {
  const [failed, setFailed] = useState(false);
  const code = countryToAlpha2(country);
  if (!code || failed) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={label || country || "Country flag"}
      onError={() => setFailed(true)}
      style={{
        width: "20px",
        height: "14px",
        objectFit: "cover",
        borderRadius: "2px",
        border: "1px solid rgba(15, 23, 42, 0.12)",
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
};

interface StoresTableProps {
  activeTab: string;
  loading: boolean;
  filteredStores: StoreItem[];
  onOpenEditModal: (store: StoreItem) => void;
  onToggleStatus: (store: StoreItem) => void;
  onDeleteStore: (store: StoreItem) => void;
  onSelectStore?: (store: StoreItem) => void;
  currentPage?: number;
  totalPages?: number;
  totalStores?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: "0.68rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#6b7280",
  padding: "12px 20px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  whiteSpace: "nowrap",
};

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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [brokenLogoIds, setBrokenLogoIds] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (activeTab !== "stores" && activeTab !== "dashboard") return null;

  const startItem = totalStores === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalStores || filteredStores.length);

  return (
    <div className={styles.settingsSectionCard} style={{ padding: 0, overflow: "hidden" }}>
      <table className={styles.table} style={{ width: "100%", borderCollapse: "collapse" }}>
        {/* Column headings */}
        <thead>
          <tr>
            <th style={thStyle}>Store</th>
            <th style={thStyle}>Plan</th>
            <th style={thStyle}>Owner</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: "right", width: "60px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                Loading merchant stores...
              </td>
            </tr>
          ) : filteredStores.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                No stores found.
              </td>
            </tr>
          ) : (
            filteredStores.map((store) => {
              const ownerName = store.ownerName || (typeof store.ownerId === "object" ? store.ownerId?.name : "") || "Kasper Lindqvist";
              const countryName = store.country || "India";
              const regionText = [store.state, countryName].filter(Boolean).join(", ");

              const storeInitials = store.name
                ? store.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                : "NF";

              const planName = (store.plan || "Growth").charAt(0).toUpperCase() + (store.plan || "Growth").slice(1).toLowerCase();
              const billingCycle = getBillingCycle(store);
              const cycleLabel = billingCycle === "annual" ? "Annual" : "Monthly";
              const priceText = getPlanPriceText(store);
              const validTill = getValidTill(store);

              const domainDisplay = getStoreUrl(store);
              const isCustom = Boolean(store.customDomain);

              return (
                <tr
                  key={store._id}
                  onClick={() => onSelectStore && onSelectStore(store)}
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {/* Column 1: Brand Logo + Brand Name + URL + URL Type */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {store.businessLogo && !brokenLogoIds[store._id] ? (
                        <img
                          src={store.businessLogo}
                          alt={store.name}
                          onError={() => setBrokenLogoIds((prev) => ({ ...prev, [store._id]: true }))}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#f9fafb",
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "8px",
                            backgroundColor: "#eef2ff",
                            color: "#4338ca",
                            fontWeight: 800,
                            fontSize: "0.88rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e0e7ff",
                            flexShrink: 0,
                            letterSpacing: "0.02em"
                          }}
                        >
                          {storeInitials}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", marginBottom: "3px", whiteSpace: "nowrap" }}>
                          {store.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <a
                            href={`${getStoreProtocol(domainDisplay)}://${domainDisplay}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: "#4f46e5",
                              fontSize: "0.82rem",
                              fontWeight: 500,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {domainDisplay}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: "4px",
                              backgroundColor: isCustom ? "#e0e7ff" : "#f1f5f9",
                              color: isCustom ? "#4338ca" : "#64748b",
                              border: `1px solid ${isCustom ? "#c7d2fe" : "#e2e8f0"}`,
                              whiteSpace: "nowrap",
                              flexShrink: 0
                            }}
                          >
                            {isCustom ? "Custom" : "Default"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Plan Name + Billing Cycle + Price + Valid Till */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>
                        {planName}
                      </span>
                      <span
                        style={{
                          fontSize: "0.64rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          backgroundColor: billingCycle === "annual" ? "#eef2ff" : "#f1f5f9",
                          color: billingCycle === "annual" ? "#4338ca" : "#64748b",
                          border: `1px solid ${billingCycle === "annual" ? "#c7d2fe" : "#e2e8f0"}`,
                          letterSpacing: "0.03em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {cycleLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>
                      {priceText}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "3px", whiteSpace: "nowrap" }}>
                      Valid till {validTill}
                    </div>
                  </td>

                  {/* Column 3: Owner Name + Country & State */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0f172a", marginBottom: "3px", whiteSpace: "nowrap" }}>
                      {ownerName}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CountryFlag country={countryName} label={countryName} />
                      <span>{regionText}</span>
                    </div>
                  </td>

                  {/* Column 4: Status Badge */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        backgroundColor: store.isActive !== false ? "#ecfdf5" : "#fef2f2",
                        color: store.isActive !== false ? "#047857" : "#991b1b",
                        border: `1px solid ${store.isActive !== false ? "#a7f3d0" : "#fecaca"}`,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: store.isActive !== false ? "#059669" : "#dc2626" }} />
                      {store.isActive !== false ? "Active" : "Suspended"}
                    </span>
                  </td>

                  {/* Column 5: 3-dot Action Menu */}
                  <td style={{ padding: "14px 20px", textAlign: "right", position: "relative" }}>
                    <div
                      ref={openDropdownId === store._id ? dropdownRef : null}
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === store._id ? null : store._id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          lineHeight: 1
                        }}
                        title="More actions"
                      >
                        ⋯
                      </button>

                      {openDropdownId === store._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            marginTop: "4px",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                            border: "1px solid #e2e8f0",
                            zIndex: 100,
                            minWidth: "160px",
                            overflow: "hidden",
                            padding: "4px 0",
                            textAlign: "left"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null);
                              onOpenEditModal(store);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "8px 14px",
                              fontSize: "0.82rem",
                              color: "#334155",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 500
                            }}
                          >
                            Edit Store
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null);
                              onToggleStatus(store);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "8px 14px",
                              fontSize: "0.82rem",
                              color: "#334155",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 500
                            }}
                          >
                            {store.isActive ? "Suspend Store" : "Activate Store"}
                          </button>
                          {store.subdomain !== "default" && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null);
                                onDeleteStore(store);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "8px 14px",
                                fontSize: "0.82rem",
                                color: "#dc2626",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 500
                              }}
                            >
                              Delete Store
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
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
