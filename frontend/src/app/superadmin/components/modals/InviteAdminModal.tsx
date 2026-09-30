"use client";

import React from "react";
import styles from "../../page.module.css";
import { AdminUser } from "../types";

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteName: string;
  setInviteName: (val: string) => void;
  inviteEmail: string;
  setInviteEmail: (val: string) => void;
  inviteRole: string;
  setInviteRole: (val: string) => void;
  admins: AdminUser[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  triggerToast: (msg: string) => void;
}

export default function InviteAdminModal({
  isOpen,
  onClose,
  inviteName,
  setInviteName,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  admins,
  setAdmins,
  triggerToast,
}: InviteAdminModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    const newAdmin: AdminUser = {
      id: String(Date.now()),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "Active",
      lastLogin: "Just now",
      twoFactor: true,
    };
    setAdmins([...admins, newAdmin]);
    onClose();
    setInviteName("");
    setInviteEmail("");
    triggerToast(`Admin invite dispatched to ${inviteEmail}`);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Invite Super Admin User</h2>
        <p className={styles.modalSubtitle}>Grant full platform management and role permissions.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Lee"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="jordan@ecommerce.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Assigned Role & Scope</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className={styles.input}
            >
              <option value="Super Admin">Super Admin (Full Root Privilege)</option>
              <option value="Security Lead">Security Lead (2FA & Audit Only)</option>
              <option value="Platform Support">Platform Support (Stores & Demo Requests)</option>
              <option value="Billing Lead">Billing Lead (Subscriptions & Gateways)</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
