'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { fetchAndSyncUserCart } from "@/utils/cartSync";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPageClient({ initialColor }: { initialColor: string }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState<string>(initialColor);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [brandLogoType, setBrandLogoType] = useState<string>("text");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.primaryColor) setPrimaryColor(data.primaryColor);
          if (data.brandLogoType) setBrandLogoType(data.brandLogoType);
          if (data.brandLogoValue) setBrandLogoValue(data.brandLogoValue);
          if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
        }
      })
      .catch(err => console.error("Error querying settings:", err));

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        setSessionExpired(true);
      }
    }
  }, []);

  // Auto-dismiss the inactivity alert after 5 seconds
  useEffect(() => {
    if (!sessionExpired) return;
    const timer = setTimeout(() => setSessionExpired(false), 5000);
    return () => clearTimeout(timer);
  }, [sessionExpired]);

  useEffect(() => {
    if (!googleClientId) return;

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLoginCallback,
          auto_select: false,
          ux_mode: "popup",
        });
        const btnContainer = document.getElementById("google-signin-btn");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", width: "100%", text: "continue_with" }
          );
        }
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [googleClientId]);

  const handleGoogleLoginCallback = async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google Sign-In failed.");
      }

      setSuccess(true);
      localStorage.setItem("userSession", JSON.stringify(data));
      localStorage.setItem("lastActivityTime", Date.now().toString());
      await fetchAndSyncUserCart();

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Google Sign-In error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const isSystemAdmin = email.toLowerCase().trim() === "admin" && password === "admin";
    setIsAdmin(isSystemAdmin);

    if (isSystemAdmin) {
      // Admin dashboard login flow shortcut
      setIsLoading(false);
      setSuccess(true);
      localStorage.setItem("adminSession", "true");
      localStorage.setItem("lastActivityTime", Date.now().toString());
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setSuccess(true);
      localStorage.setItem("userSession", JSON.stringify(data));
      localStorage.setItem("lastActivityTime", Date.now().toString());
      await fetchAndSyncUserCart();

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password flow state: 'login' | 'request_email' | 'enter_otp' | 'success'
  const [resetStep, setResetStep] = useState<'login' | 'request_email' | 'enter_otp' | 'success'>('login');
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetOtp, setResetOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const newPasswordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const confirmPasswordTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleShowNewPassword = () => {
    if (newPasswordTimerRef.current) clearTimeout(newPasswordTimerRef.current);
    setShowNewPassword((prev) => {
      const nextState = !prev;
      if (nextState) {
        newPasswordTimerRef.current = setTimeout(() => {
          setShowNewPassword(false);
        }, 3000);
      }
      return nextState;
    });
  };

  const toggleShowConfirmPassword = () => {
    if (confirmPasswordTimerRef.current) clearTimeout(confirmPasswordTimerRef.current);
    setShowConfirmPassword((prev) => {
      const nextState = !prev;
      if (nextState) {
        confirmPasswordTimerRef.current = setTimeout(() => {
          setShowConfirmPassword(false);
        }, 3000);
      }
      return nextState;
    });
  };

  useEffect(() => {
    return () => {
      if (newPasswordTimerRef.current) clearTimeout(newPasswordTimerRef.current);
      if (confirmPasswordTimerRef.current) clearTimeout(confirmPasswordTimerRef.current);
    };
  }, []);

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/request-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to request password reset code.");
      }

      setResetStep('enter_otp');
      setResetMessage("Verification code sent! Please check your email inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to process request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Password reset failed.");
      }

      setResetStep('success');
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className={styles.loginContainer} style={{ backgroundColor: primaryColor }}>
      {/* Background branding texture */}
      {brandLogoType === "text" && (
        <div className={styles.brandBgPattern}>{brandLogoValue || "29sFORMULA"}</div>
      )}

      <div className={styles.loginCard}>
        {/* Back Link */}
        <Link href="/" className={styles.backHomeBtn}>
          ← Back to Storefront
        </Link>

        {/* Branding header */}
        <div className={styles.loginHeader}>
          {brandLogoType === "image" && brandLogoValue ? (
            <img src={brandLogoValue} alt="Brand Logo" style={{ maxHeight: "60px", maxWidth: "200px", objectFit: "contain", margin: "0 auto 10px auto" }} />
          ) : (
            <h1 className={styles.logoText}>{brandLogoValue || "29sFORMULA"}</h1>
          )}
          <p className={styles.subtitle}>
            {resetStep === 'login' && "Sign in to your account"}
            {resetStep === 'request_email' && "Reset your password"}
            {resetStep === 'enter_otp' && "Verify code & set new password"}
            {resetStep === 'success' && "Password updated successfully"}
          </p>
        </div>

        {success ? (
          <div className={styles.successState}>
            <div className={styles.checkCircle}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={styles.checkIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>{isAdmin ? "Admin Authorized" : "Welcome Back"}</h2>
            <p className={styles.successDesc}>Redirecting to {isAdmin ? "admin dashboard" : "homepage"}...</p>
          </div>
        ) : resetStep === 'request_email' ? (
          <form onSubmit={handleRequestResetOtp} className={styles.loginForm}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <p style={{ fontSize: "0.85rem", color: "#4b5563", margin: "0 0 10px 0" }}>
              Enter your account's email address. We will verify if it exists and send you a 6-digit verification code.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="resetEmail" className={styles.inputLabel}>
                Email Address
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="e.g. user@gmail.com"
                className={styles.textInput}
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.loginBtn}>
              {isLoading ? "Checking Email..." : "Send Verification Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setResetStep('login');
                setError(null);
              }}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}
            >
              Back to Sign In
            </button>
          </form>
        ) : resetStep === 'enter_otp' ? (
          <form onSubmit={handleResetPassword} className={styles.loginForm}>
            {error && <div className={styles.errorAlert}>{error}</div>}
            {resetMessage && <div style={{ backgroundColor: '#f0fdf4', borderLeft: '3px solid #16a34a', color: '#15803d', padding: '10px 12px', fontSize: '0.82rem', borderRadius: '4px' }}>{resetMessage}</div>}

            <p style={{ fontSize: "0.85rem", color: "#4b5563", margin: "0 0 10px 0" }}>
              Enter the 6-digit code sent to <strong>{resetEmail}</strong> and choose a new password.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="resetOtp" className={styles.inputLabel}>
                6-Digit Verification Code
              </label>
              <input
                type="text"
                id="resetOtp"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className={styles.textInput}
                style={{ letterSpacing: '3px', textAlign: 'center', fontWeight: 'bold' }}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="newPassword" className={styles.inputLabel}>
                New Password
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={styles.textInput}
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowNewPassword}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                >
                  {showNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={styles.textInput}
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={styles.loginBtn}>
              {isLoading ? "Updating Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setResetStep('request_email');
                setError(null);
              }}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}
            >
              Change Email
            </button>
          </form>
        ) : resetStep === 'success' ? (
          <div className={styles.successState}>
            <div className={styles.checkCircle}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={styles.checkIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Password Updated</h2>
            <p className={styles.successDesc}>Your password has been reset successfully.</p>
            <button
              type="button"
              onClick={() => {
                setResetStep('login');
                setError(null);
                setPassword("");
              }}
              className={styles.loginBtn}
              style={{ width: "100%", marginTop: "20px" }}
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div
              className={styles.inactivityAlert}
              style={{
                opacity: sessionExpired ? 1 : 0,
                pointerEvents: sessionExpired ? "auto" : "none",
                maxHeight: sessionExpired ? "80px" : "0px",
                marginBottom: sessionExpired ? undefined : 0,
                overflow: "hidden",
                transition: "opacity 0.5s ease, max-height 0.5s ease, margin 0.5s ease"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "18px", height: "18px", flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
              </svg>
              <span>You have been logged out automatically due to 30 minutes of inactivity.</span>
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@gmail.com"
                className={styles.textInput}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetStep('request_email');
                    setResetEmail(email);
                    setError(null);
                  }}
                  className={styles.forgotLink}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.textInput}
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.loginBtn}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <div id="google-signin-btn" className={styles.googleBtnContainer}></div>

            <div className={styles.registerPrompt}>
              <span>New to {brandLogoType === "text" ? (brandLogoValue || "29sFormula") : "our store"}?</span>
              <Link href="/register" className={styles.signUpLink}>
                Create an account
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
