"use client";

import React from "react";
import styles from "@/app/page.module.css";

interface TrustIconBarProps {
  primaryColor?: string;
  isMobile?: boolean;
}

const trustItems = [
  {
    id: "shipping",
    title: "EXPRESS SHIPPING",
    subtitle: "Fast 48hr Dispatch",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: "36px", height: "36px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v11.177M14.25 7.5v6.75m0 0h5.25"
        />
      </svg>
    ),
  },
  {
    id: "security",
    title: "100% SECURE CHECKOUT",
    subtitle: "256-Bit SSL Encrypted",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: "36px", height: "36px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    id: "authenticity",
    title: "100% GENUINE PRODUCTS",
    subtitle: "100% Original Guarantee",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: "36px", height: "36px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "EASY 7-DAY RETURNS",
    subtitle: "Hassle-Free Policy",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: "36px", height: "36px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
  {
    id: "support",
    title: "24/7 CUSTOMER SUPPORT",
    subtitle: "Dedicated Assistance",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: "36px", height: "36px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
        />
      </svg>
    ),
  },
];

const doubledItems = [...trustItems, ...trustItems];

export default function TrustIconBar({ primaryColor, isMobile }: TrustIconBarProps) {
  return (
    <section className={styles.trustIconBarSection}>
      <div className={styles.trustMarqueeTrack}>
        {/* Group 1 */}
        <div className={styles.trustMarqueeGroup}>
          {doubledItems.map((item, idx) => (
            <div key={`g1-${item.id}-${idx}`} className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>{item.icon}</div>
              <div className={styles.trustTextWrapper}>
                <span className={styles.trustTitle}>{item.title}</span>
                <span className={styles.trustSubtitle}>{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Group 2 (Duplicate for seamless loop) */}
        <div className={styles.trustMarqueeGroup} aria-hidden="true">
          {doubledItems.map((item, idx) => (
            <div key={`g2-${item.id}-${idx}`} className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>{item.icon}</div>
              <div className={styles.trustTextWrapper}>
                <span className={styles.trustTitle}>{item.title}</span>
                <span className={styles.trustSubtitle}>{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
