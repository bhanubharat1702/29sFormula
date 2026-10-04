"use client";

import React, { useState } from "react";
import styles from "../../page.module.css";
import { StoreItem } from "../types";

interface DeleteStoreModalProps {
  store: StoreItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function DeleteStoreModal({ store, isOpen, onClose, onConfirm }: DeleteStoreModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !store) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your super admin password to confirm.");
      return;
    }
    setError("");
    onConfirm(password);
  };

  const businessName = store.businessName || store.name || "Unknown Store";
  const ownerName = store.ownerName || "Unknown Owner";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Delete Merchant Store</h2>
        <div style={{ marginBottom: "20px", color: "#374151" }}>
          <p style={{ marginBottom: "10px", fontWeight: 500, color: "#dc2626" }}>
            Are you sure you want to delete this merchant?
          </p>
          <p style={{ marginBottom: "5px" }}><strong>Business Name:</strong> {businessName}</p>
          <p style={{ marginBottom: "15px" }}><strong>Merchant Name:</strong> {ownerName}</p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            This is a PERMANENT ACTION. It will delete the store "{store.subdomain}" and all associated products, orders, and configuration data.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Super Admin Password</label>
            <input
              type="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              autoFocus
            />
            {error && <div style={{ color: "red", fontSize: "0.85rem", marginTop: "5px" }}>{error}</div>}
          </div>

          <div className={styles.modalActions} style={{ marginTop: "20px" }}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnActionDanger}>
              Delete Permanently
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
