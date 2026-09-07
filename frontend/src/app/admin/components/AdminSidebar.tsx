import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

interface AdminSidebarProps {
  isMobileMenuOpen: boolean;
  activeTab: string;
  activeSubTab: string;
  customizeSubTab: string;
  setCustomizeSubTab: (val: any) => void;
  ordersDropdownOpen: boolean;
  productsDropdownOpen: boolean;
  onlineStoreDropdownOpen: boolean;
  setOrdersDropdownOpen: (val: boolean) => void;
  setProductsDropdownOpen: (val: boolean) => void;
  setOnlineStoreDropdownOpen: (val: boolean) => void;
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
  setCustomizeSubTab,
  ordersDropdownOpen,
  productsDropdownOpen,
  onlineStoreDropdownOpen,
  setOrdersDropdownOpen,
  setProductsDropdownOpen,
  setOnlineStoreDropdownOpen,
  setActiveTab,
  setActiveSubTab,
  setSelectedCategoryView,
  handleNavigationTrigger,
  setIsMobileMenuOpen,
  brandLogoType,
  brandLogoValue
}: AdminSidebarProps) {
  return (
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brandRow}>
            <span className={styles.brandName} style={{ display: 'flex', alignItems: 'center' }}>
              {brandLogoType === "image" && brandLogoValue ? (
                <img src={brandLogoValue} alt="Brand Logo" style={{ maxHeight: "30px", maxWidth: "150px", objectFit: "contain" }} />
              ) : (
                brandLogoValue || "29sFORMULA"
              )}
            </span>
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
                    ) : (activeTab === "online-store" && customizeSubTab === "marketing") ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.947 11.947 0 0 1 12 20c-1.18 0-2.31-.172-3.37-.492v-.271m0-.003c0-1.113.285-2.16.786-3.07M6 16.25a4.125 4.125 0 0 1 7.533 0M6 16.25c0-.18.01-.36.03-.538m10.22 0A10.287 10.287 0 0 0 12 14c-1.8 0-3.486.462-4.966 1.272m0-.112a4.125 4.125 0 0 1 6.536-3.567m-6.536 3.567A8.995 8.995 0 0 1 12 9.75c1.8 0 3.486.462 4.966 1.272M7.5 6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM5.25 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
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
                  ) : (activeTab === "online-store" && (customizeSubTab === "product" || customizeSubTab === "reviews" || customizeSubTab === "marketing")) ? (
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
                  ) : (activeTab === "online-store" && (customizeSubTab === "reviews" || customizeSubTab === "marketing")) ? (
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
                      Product Pages
                    </div>
                  </div>
                </div>

                {/* Item 3: Customer Reviews */}
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
                  ) : (activeTab === "online-store" && customizeSubTab === "marketing") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
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

                {/* Item 4: Marketing */}
                <div
                  onClick={() => {
                    setActiveTab("online-store");
                    setCustomizeSubTab("marketing");
                    if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "online-store" && customizeSubTab === "marketing" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "marketing" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                      </svg>
                      Marketing
                    </div>
                  </div>
                </div>
              </div>
            )}
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
