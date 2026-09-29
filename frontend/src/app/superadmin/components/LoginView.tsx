import React from "react";
import Link from "next/link";
import styles from "../page.module.css";

interface LoginViewProps {
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  loginSubmitting: boolean;
  loginError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginSubmitting,
  loginError,
  onSubmit
}) => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>STORE ENGINE</div>
        <p className={styles.loginSubtitle}>Super Admin Control Panel</p>

        <div className={styles.credBox}>
          <div>🧪 <strong>Testing Credentials:</strong></div>
          <div style={{ marginTop: "4px" }}>Email: <code>superadmin@platform.com</code></div>
          <div>Password: <code>SuperAdmin@2026</code></div>
        </div>

        {loginError && <div className={styles.errorBanner}>{loginError}</div>}

        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ color: "#d4d4d8" }}>Super Admin Email</label>
            <input 
              type="text" 
              required 
              placeholder="superadmin@platform.com"
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)} 
              className={styles.input}
              style={{ background: "#09090b", border: "1px solid #27272a", color: "#fff" }}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "24px" }}>
            <label className={styles.label} style={{ color: "#d4d4d8" }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••"
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              className={styles.input}
              style={{ background: "#09090b", border: "1px solid #27272a", color: "#fff" }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loginSubmitting}
            className={styles.btnPrimary}
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
          >
            {loginSubmitting ? "Authenticating..." : "Login to Control Panel"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem" }}>
          <Link href="/platform" style={{ color: "#a1a1aa", textDecoration: "none" }}>← Return to SaaS Platform Landing</Link>
        </div>
      </div>
    </div>
  );
};
