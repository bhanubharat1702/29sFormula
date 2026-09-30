"use client";

import React from "react";
import styles from "../../page.module.css";
import { DomainRecord } from "../domainsTypes";

interface BlockDomainModalProps {
  domainObj: DomainRecord | null;
  blockReason: string;
  setBlockReason: (val: string) => void;
  onClose: () => void;
  onConfirmBlock: () => void;
}

export const BlockDomainModal: React.FC<BlockDomainModalProps> = ({
  domainObj,
  blockReason,
  setBlockReason,
  onClose,
  onConfirmBlock
}) => {
  if (!domainObj) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>Block Domain (Abuse / Phishing)</h3>
            <p className={styles.modalSubtitle}>Instantly disable routing and revoke SSL</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <p style={{ fontSize: "14px", color: "#374151", marginBottom: "14px" }}>
            Are you sure you want to block <strong style={{ color: "#dc2626" }}>{domainObj.domain}</strong>?
          </p>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Reason for Blocking *</label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Trademark infringement, phishing report, spam policy violation"
              className={styles.formInput}
              rows={3}
              required
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnActionDanger} style={{ padding: "8px 16px" }} onClick={onConfirmBlock}>
            Block Domain
          </button>
        </div>
      </div>
    </div>
  );
};
