"use client";

import React, { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    try {
      Sentry.captureException(error);
    } catch (e) {}

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#ffffff", color: "#111827", fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Dog Illustration */}
            <div style={{ width: "190px", height: "190px", marginBottom: "20px" }}>
              <img
                src="/images/sad_dog.jpg"
                alt="Error"
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px" }}
              />
            </div>

            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: "0 0 10px 0" }}>
              {!isOnline ? "Please connect to the internet" : "Something went wrong"}
            </h1>

            <p style={{ fontSize: "0.95rem", color: "#4b5563", lineHeight: 1.5, margin: "0 0 24px 0" }}>
              {!isOnline
                ? "Your device appears to be offline. Please check your network connection and try again."
                : "We couldn’t reach the server. Please check your internet connection or try again."}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: "11px 26px",
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)"
                }}
              >
                Try Again
              </button>

              <a
                href="/"
                style={{
                  padding: "11px 22px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                Home Page
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
