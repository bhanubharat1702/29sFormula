"use client";

import React from "react";
import styles from "../page.module.css";

interface ToastNotificationProps {
  message: string | null;
}

export default function ToastNotification({ message }: ToastNotificationProps) {
  if (!message) return null;

  return (
    <div className={styles.toastBanner}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px", color: "#10b981" }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
