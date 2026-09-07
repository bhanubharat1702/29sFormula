'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

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

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLoginCallback
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
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
          <p className={styles.subtitle}>Sign in to your account</p>
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
                <a href="#" className={styles.forgotLink}>
                  Forgot Password?
                </a>
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
