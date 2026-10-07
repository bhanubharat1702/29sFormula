"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      color: "#111827",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      textAlign: "center",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: "520px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Amazon-style Sad Dog Illustration */}
        <div style={{ width: "180px", height: "180px", marginBottom: "20px" }}>
          <img
            src="/images/sad_dog.jpg"
            alt="Page not found"
            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px" }}
          />
        </div>

        <div style={{
          display: "inline-flex",
          padding: "4px 12px",
          borderRadius: "9999px",
          backgroundColor: "#f3f4f6",
          color: "#4b5563",
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "12px"
        }}>
          Error 404
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: "0 0 10px 0" }}>
          Looking for something?
        </h1>

        <p style={{ fontSize: "0.95rem", color: "#4b5563", lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: "420px" }}>
          We're sorry. The Web address you entered is not a functioning page on our site or has been moved.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              padding: "11px 24px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.85rem",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            Go to Storefront Home
          </Link>
          <Link
            href="/shop"
            style={{
              padding: "11px 24px",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              fontWeight: 600,
              fontSize: "0.85rem",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
