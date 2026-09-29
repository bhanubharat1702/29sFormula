import React from "react";
import Link from "next/link";
import styles from "../page.module.css";

interface SidebarProps {
  platformName: string;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  storesCount: number;
  demoRequestsCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  platformName,
  activeTab,
  setActiveTab,
  storesCount,
  demoRequestsCount,
  onLogout
}) => {
  return (
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
            <span className={styles.menuBadge}>{storesCount}</span>
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
            <span className={styles.menuBadge}>{demoRequestsCount}</span>
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
        <button onClick={onLogout} className={styles.btnSecondary} style={{ width: "100%", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
