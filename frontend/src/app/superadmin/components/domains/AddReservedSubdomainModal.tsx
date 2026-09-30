"use client";

import React from "react";
import styles from "../../page.module.css";

interface AddReservedSubdomainModalProps {
  isOpen: boolean;
  newSubdomain: string;
  setNewSubdomain: (val: string) => void;
  newReason: string;
  setNewReason: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddReservedSubdomainModal: React.FC<AddReservedSubdomainModalProps> = ({
  isOpen,
  newSubdomain,
  setNewSubdomain,
  newReason,
  setNewReason,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Reserve System Subdomain</h3>
            <p className={styles.modalSubtitle}>Prevent merchants from registering system prefixes</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Subdomain Prefix *</label>
              <input
                type="text"
                placeholder="e.g. portal, help, status, billing"
                value={newSubdomain}
                onChange={(e) => setNewSubdomain(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Reason for Reservation</label>
              <input
                type="text"
                placeholder="e.g. System core endpoint protection"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>Reserve Subdomain</button>
          </div>
        </form>
      </div>
    </div>
  );
};
