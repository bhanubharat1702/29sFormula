"use client";

import React from "react";
import styles from "../page.module.css";
import { ConfirmModalData } from "./types";

interface ConfirmModalProps {
  confirmModal: ConfirmModalData | null;
  onClose: () => void;
}

export default function ConfirmModal({ confirmModal, onClose }: ConfirmModalProps) {
  if (!confirmModal || !confirmModal.isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>{confirmModal.title}</h2>
        <p className={styles.modalSubtitle}>{confirmModal.message}</p>

        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            className={confirmModal.isDanger ? styles.btnActionDanger : styles.btnPrimary}
            onClick={confirmModal.onConfirm}
          >
            {confirmModal.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
