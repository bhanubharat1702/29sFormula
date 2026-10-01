import React from "react";
import styles from "../../page.module.css";

interface TopHeaderProps {
  activeTab: string;
  onOpenCreateModal: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenCreateModal,
  onToggleMobileMenu
}) => {
  if (activeTab === "settings") return null;

  return (
    <header className={styles.topHeader}>
      <div className={styles.topHeaderLeft}>
        {onToggleMobileMenu && (
          <button
            className={styles.mobileMenuToggleBtn}
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.headerActions}>
        <button className={styles.btnPrimary} onClick={onOpenCreateModal}>
          <span className={styles.btnIcon}>+</span>
          <span className={styles.btnText}>Provision New Store</span>
        </button>
      </div>
    </header>
  );
};

