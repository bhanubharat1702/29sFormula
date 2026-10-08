"use client";

import React, { useState } from "react";

interface AdminTopHeaderProps {
  activeTab: string;
  activeSubTab?: string;
  settingsSubTab?: string;
  customizeSubTab?: string;
  storeSubdomain?: string;
  storeCustomDomain?: string;
}

const TAB_LABELS: Record<string, string> = {
  home: "Home",
  orders: "Orders",
  products: "Products",
  customers: "Customers",
  marketing: "Marketing",
  discounts: "Discounts",
  "online-store": "Online Store",
  settings: "Settings",
};

const SUBTAB_LABELS: Record<string, Record<string, string>> = {
  orders: {
    all: "All Orders",
    unfulfilled: "Unfulfilled Orders",
    unpaid: "Unpaid Orders",
    open: "Open Orders",
    closed: "Closed Orders",
    refunds: "Refund Requests",
    abandoned: "Abandoned Checkouts",
  },
  products: {
    all: "All Products",
    inventory: "Inventory Management",
    collections: "Collections",
    categories: "Categories",
    "gift-cards": "Gift Cards",
  },
  customers: {
    all: "All Customers",
    segments: "Customer Segments",
  },
  marketing: {
    overview: "Marketing Overview",
    campaigns: "Campaigns",
  },
  discounts: {
    all: "All Discounts",
    coupons: "Coupon Codes",
  },
  "online-store": {
    landing: "Landing Page Builder",
    "landing-page": "Landing Page Builder",
    product: "Product Page Customizer",
    "product-page": "Product Page Customizer",
    reviews: "Product Reviews & Social Proof",
    themes: "Themes",
  },
  settings: {
    general: "General Settings",
    markets: "Global Markets",
    domains: "Custom Domains",
    payments: "Payment Gateways",
    checkout: "Checkout Configuration",
    shipping: "Shipping & Delivery",
    taxes: "Taxes & Duties",
    notifications: "Customer Notifications",
    policies: "Legal Policies",
  },
};

export default function AdminTopHeader({
  activeTab,
  activeSubTab = "all",
  settingsSubTab = "general",
  customizeSubTab = "landing",
  storeSubdomain,
  storeCustomDomain,
}: AdminTopHeaderProps) {
  const [copied, setCopied] = useState(false);

  // Formulate exact domain link with localhost:3000 / custom domain support
  const rawSubdomain = storeSubdomain || storeCustomDomain || "demo1";
  let displayDomain = rawSubdomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (!displayDomain.includes(".") && !displayDomain.includes(":")) {
    displayDomain = `${displayDomain}.localhost:3000`;
  }

  const previewUrl =
    displayDomain.startsWith("http://") || displayDomain.startsWith("https://")
      ? displayDomain
      : `http://${displayDomain}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If on Dashboard (home), render Dashboard title on left and store URL on right in the same row
  if (activeTab === "home") {
    return (
      <div
        style={{
          padding: "16px 24px 20px 24px",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1
          style={{
            fontSize: "1.85rem",
            fontWeight: "800",
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.025em",
          }}
        >
          Dashboard
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.88rem",
              fontWeight: "600",
              color: "#2563eb",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
          >
            {displayDomain}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy Store Link"
            style={{
              background: "none",
              border: "none",
              padding: "4px 6px",
              color: copied ? "#16a34a" : "#64748b",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "4px",
              fontSize: "0.78rem",
              fontWeight: "600",
              transition: "all 0.15s ease",
            }}
          >
            {copied ? (
              <span style={{ color: "#16a34a" }}>Copied!</span>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  const category = TAB_LABELS[activeTab] || "Admin";

  let subTabKey = activeSubTab;
  if (activeTab === "settings") {
    subTabKey = settingsSubTab || "general";
  } else if (activeTab === "online-store") {
    subTabKey = customizeSubTab || "landing";
  }

  const pageTitle =
    (SUBTAB_LABELS[activeTab] && SUBTAB_LABELS[activeTab][subTabKey]) ||
    TAB_LABELS[activeTab] ||
    "Overview";

  return (
    <div
      style={{
        padding: "16px 24px 20px 24px",
        backgroundColor: "#fafafa",
        borderBottom: "1px solid #f1f5f9",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Top Breadcrumb & Store Domain Link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Breadcrumb Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.88rem",
            color: "#64748b",
            fontWeight: "500",
          }}
        >
          <span>{category}</span>
          <span style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>›</span>
          <span style={{ color: "#0f172a", fontWeight: "700" }}>{pageTitle}</span>
        </div>

        {/* Storefront Link & Copy URL */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.88rem",
              fontWeight: "600",
              color: "#2563eb",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
          >
            {displayDomain}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy Store Link"
            style={{
              background: "none",
              border: "none",
              padding: "4px 6px",
              color: copied ? "#16a34a" : "#64748b",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "4px",
              fontSize: "0.78rem",
              fontWeight: "600",
              transition: "all 0.15s ease",
            }}
          >
            {copied ? (
              <span style={{ color: "#16a34a" }}>Copied!</span>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Page Title */}
      <h1
        style={{
          fontSize: "1.85rem",
          fontWeight: "800",
          color: "#0f172a",
          margin: 0,
          letterSpacing: "-0.025em",
        }}
      >
        {pageTitle}
      </h1>
    </div>
  );
}
