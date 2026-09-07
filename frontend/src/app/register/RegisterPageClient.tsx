'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../login/page.module.css";

export default function RegisterPageClient({ initialColor }: { initialColor: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<string>(initialColor);
  const [brandLogoType, setBrandLogoType] = useState<string>("text");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.primaryColor) {
            setPrimaryColor(data.primaryColor);
            if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
          }
          if (data.brandLogoType) setBrandLogoType(data.brandLogoType);
          if (data.brandLogoValue) setBrandLogoValue(data.brandLogoValue);
        }
      })
      .catch(err => console.error("Error querying settings:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className={styles.loginContainer} style={{ backgroundColor: primaryColor }}>
      {brandLogoType === "text" && (
        <div className={styles.brandBgPattern}>{brandLogoValue || "29sFORMULA"}</div>
      )}

      <div className={styles.loginCard}>
        <Link href="/" className={styles.backHomeBtn}>
          ← Back to Storefront
        </Link>

        <div className={styles.loginHeader}>
          {brandLogoType === "image" && brandLogoValue ? (
            <img src={brandLogoValue} alt="Brand Logo" style={{ maxHeight: "60px", maxWidth: "200px", objectFit: "contain", margin: "0 auto 10px auto" }} />
          ) : (
            <h1 className={styles.logoText}>{brandLogoValue || "29sFORMULA"}</h1>
          )}
          <p className={styles.subtitle}>Create your premium account</p>
        </div>

        {success ? (
          <div className={styles.successState}>
            <div className={styles.checkCircle}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={styles.checkIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Account Created</h2>
            <p className={styles.successDesc}>Redirecting to login screen...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shagun Chahar"
                className={styles.textInput}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hello@29sformula.in"
                className={styles.textInput}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className={styles.textInput}
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.loginBtn}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className={styles.registerPrompt}>
              <span>Already have an account?</span>
              <Link href="/login" className={styles.signUpLink}>
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
