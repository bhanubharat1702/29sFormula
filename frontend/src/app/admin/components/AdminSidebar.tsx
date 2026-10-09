import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

interface AdminSidebarProps {
  isMobileMenuOpen: boolean;
  activeTab: string;
  activeSubTab: string;
  customizeSubTab: string;
  settingsSubTab?: string;
  setCustomizeSubTab: (val: any) => void;
  setSettingsSubTab?: (val: any) => void;
  ordersDropdownOpen: boolean;
  productsDropdownOpen: boolean;
  onlineStoreDropdownOpen: boolean;
  settingsDropdownOpen?: boolean;
  setOrdersDropdownOpen: (val: boolean) => void;
  setProductsDropdownOpen: (val: boolean) => void;
  setOnlineStoreDropdownOpen: (val: boolean) => void;
  setSettingsDropdownOpen?: (val: boolean) => void;
  setActiveTab: (val: any) => void;
  setActiveSubTab: (val: any) => void;
  setSelectedCategoryView: (val: string | null) => void;
  handleNavigationTrigger: (tab: any) => void;
  setIsMobileMenuOpen?: (val: boolean) => void;
  brandLogoType?: string;
  brandLogoValue?: string;
}

export default function AdminSidebar({
  isMobileMenuOpen,
  activeTab,
  activeSubTab,
  customizeSubTab,
  settingsSubTab = "general",
  setCustomizeSubTab,
  setSettingsSubTab,
  ordersDropdownOpen,
  productsDropdownOpen,
  onlineStoreDropdownOpen,
  settingsDropdownOpen = false,
  setOrdersDropdownOpen,
  setProductsDropdownOpen,
  setOnlineStoreDropdownOpen,
  setSettingsDropdownOpen,
  setActiveTab,
  setActiveSubTab,
  setSelectedCategoryView,
  handleNavigationTrigger,
  setIsMobileMenuOpen,
  brandLogoType,
  brandLogoValue,
  storeBusinessName
}: AdminSidebarProps & { storeBusinessName?: string }) {
  const isImageLogo = brandLogoType === "image" || (brandLogoValue && (brandLogoValue.startsWith('http') || brandLogoValue.startsWith('/') || brandLogoValue.startsWith('data:')));
  const displayBrandName = storeBusinessName || (brandLogoType === "text" && brandLogoValue && !brandLogoValue.startsWith('http') ? brandLogoValue : "");

  return (
    <aside data-allow-suspended="true" className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarTop}>
        <div className={styles.sidebarHeaderTop}>
          <div className={styles.brandRow}>
            <div className={styles.brandLeft}>
              <div className={styles.brandLogoCircle}>
                {isImageLogo && brandLogoValue ? (
                  <img src={brandLogoValue} alt="Brand Logo" style={{ maxHeight: "20px", maxWidth: "32px", objectFit: "contain" }} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px", color: "#ffffff" }}>
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 3a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 12 5Zm-4 2.5a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 8 7.5Zm-2.5 4a1.5 1.5 0 1 1 1.5 1.5A1.5 1.5 0 0 1 5.5 11.5Zm2.5 4a1.5 1.5 0 1 1 1.5 1.5A1.5 1.5 0 0 1 8 15.5Zm4 2.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 18Zm4-2.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 15.5Zm2.5-4a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 18.5 11.5Zm-2.5-4a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 16 7.5Z" />
                  </svg>
                )}
              </div>
              <div className={styles.brandNameDropdown} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.brandNameTitle}>
                  {displayBrandName || (isImageLogo ? "My Store" : "My Store")}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px", color: "#6b7280" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            <button className={styles.sidebarCollapseBtn} title="Toggle Sidebar" onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px", color: "#374151" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 5v14" />
              </svg>
            </button>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <div>
            <div
              onClick={() => handleNavigationTrigger("home")}
              className={`${styles.menuItem} ${activeTab === "home" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Dashboard</span>
              </div>
            </div>
          </div>

          <div>
            <div
              onClick={() => {
                if (!isMobileMenuOpen) {
                  handleNavigationTrigger("orders");
                } else {
                  setProductsDropdownOpen(false);
                  setOnlineStoreDropdownOpen(false);
                }
                setOrdersDropdownOpen(!ordersDropdownOpen);
              }}
              className={`${styles.menuItem} ${activeTab === "orders" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
                </svg>
                <span>Orders</span>
              </div>
            </div>

            {((ordersDropdownOpen) || (!isMobileMenuOpen && activeTab === "orders")) && (
              <div className={styles.subMenuContainer}>
                {/* Item 1: Active Orders */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setActiveSubTab("all");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "orders" && activeSubTab === "all" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "orders" && (activeSubTab === "returns" || activeSubTab === "cancelled" || activeSubTab === "completed") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "all" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192" />
                      </svg>
                      Active Orders
                    </div>
                  </div>
                </div>

                {/* Item 2: Returns (New Tab) */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setActiveSubTab("returns");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "orders" && activeSubTab === "returns" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "orders" && (activeSubTab === "cancelled" || activeSubTab === "completed") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "returns" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6-6m0 0l6-6m-6 6h12" />
                      </svg>
                      Returns
                    </div>
                  </div>
                </div>

                {/* Item 3: Cancelled */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setActiveSubTab("cancelled");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "orders" && activeSubTab === "cancelled" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "orders" && activeSubTab === "completed" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "cancelled" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cancelled
                    </div>
                  </div>
                </div>

                {/* Item 3: Completed Orders */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setActiveSubTab("completed");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "orders" && activeSubTab === "completed" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "completed" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div
              onClick={() => {
                if (!isMobileMenuOpen) {
                  handleNavigationTrigger("products");
                } else {
                  setOrdersDropdownOpen(false);
                  setOnlineStoreDropdownOpen(false);
                }
                setProductsDropdownOpen(!productsDropdownOpen);
              }}
              className={`${styles.menuItem} ${activeTab === "products" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                <span>Products</span>
              </div>
            </div>

            {/* Sub-menu dropdown */}
            {((productsDropdownOpen) || (!isMobileMenuOpen && activeTab === "products")) && (
              <div className={styles.subMenuContainer}>
                {/* Item 1: All Products */}
                <div
                  onClick={() => {
                    setActiveTab("products");
                    setActiveSubTab("all");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "products" && activeSubTab === "all" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "products" && activeSubTab === "categories" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "products" && activeSubTab === "all" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    All Products
                  </div>
                </div>

                {/* Item 2: Categories */}
                <div
                  onClick={() => {
                    setActiveTab("products");
                    setActiveSubTab("categories");
                    setSelectedCategoryView(null);
                    if (isMobileMenuOpen && setIsMobileMenuOpen) {
                      setIsMobileMenuOpen(false);
                      setProductsDropdownOpen(false);
                    }
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "products" && activeSubTab === "categories" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "products" && activeSubTab === "categories" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                      </svg>
                      Categories
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => handleNavigationTrigger("customers")}
            className={`${styles.menuItem} ${activeTab === "customers" ? styles.menuItemActive : ""}`}
          >
            <div className={styles.menuItemLeft}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>Customers</span>
            </div>
          </div>



          <div
            onClick={() => handleNavigationTrigger("discounts")}
            className={`${styles.menuItem} ${activeTab === "discounts" ? styles.menuItemActive : ""}`}
          >
            <div className={styles.menuItemLeft}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3zM6 7.5h.008v.008H6V7.5zM14.25 14.25l3.5-3.5" />
              </svg>
              <span>Discounts</span>
            </div>
          </div>

          <div
            onClick={() => {
              if (!isMobileMenuOpen) {
                handleNavigationTrigger("online-store");
              } else {
                setOrdersDropdownOpen(false);
                setProductsDropdownOpen(false);
              }
              setOnlineStoreDropdownOpen(!onlineStoreDropdownOpen);
            }}
            className={`${styles.menuItem} ${styles.hideOnMobile} ${activeTab === "online-store" ? styles.menuItemActive : ""}`}
          >
            <div className={styles.menuItemLeft}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
              </svg>
              <span>Online Store</span>
            </div>
          </div>

          {((onlineStoreDropdownOpen) || (!isMobileMenuOpen && activeTab === "online-store")) && (
            <div className={`${styles.subMenuContainer} ${styles.hideOnMobile}`}>
              {/* Item 1: Landing Page */}
              <div
                onClick={() => {
                  setActiveTab("online-store");
                  setCustomizeSubTab("landing");
                  if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={styles.subMenuItem}
              >
                {activeTab === "online-store" && customizeSubTab === "landing" ? (
                  <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : activeTab === "online-store" && (customizeSubTab === "product" || customizeSubTab === "reviews") ? (
                  <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                )}
                <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "landing" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Landing Page
                  </div>
                </div>
              </div>

              {/* Item 2: Product Pages */}
              <div
                onClick={() => {
                  setActiveTab("online-store");
                  setCustomizeSubTab("product");
                  if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={styles.subMenuItem}
              >
                {activeTab === "online-store" && customizeSubTab === "product" ? (
                  <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (activeTab === "online-store" && customizeSubTab === "reviews") ? (
                  <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                )}
                <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "product" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Product Page
                  </div>
                </div>
              </div>



              {/* Item 4: Customer Reviews */}
              <div
                onClick={() => {
                  setActiveTab("online-store");
                  setCustomizeSubTab("reviews");
                  if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={styles.subMenuItem}
              >
                {activeTab === "online-store" && customizeSubTab === "reviews" ? (
                  <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                )}
                <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "reviews" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    Customer Reviews
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <div
              onClick={() => {
                if (!isMobileMenuOpen) {
                  handleNavigationTrigger("settings");
                } else {
                  setOrdersDropdownOpen(false);
                  setProductsDropdownOpen(false);
                  setOnlineStoreDropdownOpen(false);
                }
                if (setSettingsDropdownOpen) setSettingsDropdownOpen(!settingsDropdownOpen);
              }}
              className={`${styles.menuItem} ${activeTab === "settings" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </div>
            </div>

            {((settingsDropdownOpen) || (!isMobileMenuOpen && activeTab === "settings")) && (
              <div className={styles.subMenuContainer}>
                {/* Item 1: General & Identity */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("general");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "general" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "domain" || settingsSubTab === "payments" || settingsSubTab === "shipping" || settingsSubTab === "markets" || settingsSubTab === "notifications" || settingsSubTab === "policies" || settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "general" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm0 0h10.5m-10.5 0H3.75m9.75 6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm0 0h7.5m-7.5 0H3.75m12 6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm0 0h4.5m-4.5 0H3.75" />
                      </svg>
                      General
                    </div>
                  </div>
                </div>

                {/* Item 2: Domain */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("domain");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "domain" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "payments" || settingsSubTab === "shipping" || settingsSubTab === "markets" || settingsSubTab === "notifications" || settingsSubTab === "policies" || settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "domain" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-17.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                      </svg>
                      Domain
                    </div>
                  </div>
                </div>

                {/* Item 3: Payments & Checkout */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("payments");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "payments" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "shipping" || settingsSubTab === "markets" || settingsSubTab === "notifications" || settingsSubTab === "policies" || settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "payments" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>
                      Payments
                    </div>
                  </div>
                </div>

                {/* Item 4: Shipping & Delivery */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("shipping");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "shipping" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "markets" || settingsSubTab === "notifications" || settingsSubTab === "policies" || settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "shipping" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5" />
                      </svg>
                      Shipping & Delivery
                    </div>
                  </div>
                </div>

                {/* Item 4.5: Global Markets */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("markets");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "markets" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "notifications" || settingsSubTab === "policies" || settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "markets" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                      </svg>
                      Global Markets
                    </div>
                  </div>
                </div>

                {/* Item 4.5: Notifications & Email */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("notifications");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "notifications" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "policies" || settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "notifications" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                      </svg>
                      Notifications & Email
                    </div>
                  </div>
                </div>

                {/* Item 5: Policies & Legal */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("policies");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "policies" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : activeTab === "settings" && (settingsSubTab === "integrations" || settingsSubTab === "trust") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "policies" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      Policies & Legal
                    </div>
                  </div>
                </div>

                {/* Item 6: Social & Integrations */}
                <div
                  onClick={() => {
                    setActiveTab("settings");
                    if (setSettingsSubTab) setSettingsSubTab("integrations");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "settings" && settingsSubTab === "integrations" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "settings" && settingsSubTab === "integrations" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                      Social & Integrations
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      <a href="#" onClick={(e) => { e.preventDefault(); handleNavigationTrigger("logout"); }} className={styles.logoutLink}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        <span>Logout</span>
      </a>
    </aside>
  );
}
