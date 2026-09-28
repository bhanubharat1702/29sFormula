"use client";

import React from "react";
import styles from "./TrustIconBar.module.css";
import { renderTrustIcon } from "./TrustIconLibrary";

export interface TrustItemData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface TrustIconBarProps {
  showTrustMarquee?: boolean;
  trustMarqueeDirection?: "left" | "right" | string;
  trustMarqueeSpeed?: number;
  trustMarqueeItems?: TrustItemData[];
}

const defaultTrustItems: TrustItemData[] = [
  { id: "shipping", title: "EXPRESS SHIPPING", subtitle: "Fast 48hr Dispatch", icon: "shipping" },
  { id: "security", title: "100% SECURE CHECKOUT", subtitle: "256-Bit SSL Encrypted", icon: "security" },
  { id: "authenticity", title: "100% GENUINE PRODUCTS", subtitle: "100% Original Guarantee", icon: "authenticity" },
  { id: "returns", title: "EASY 7-DAY RETURNS", subtitle: "Hassle-Free Policy", icon: "returns" },
  { id: "support", title: "24/7 CUSTOMER SUPPORT", subtitle: "Dedicated Assistance", icon: "support" }
];

export default function TrustIconBar({
  showTrustMarquee = true,
  trustMarqueeDirection = "left",
  trustMarqueeSpeed = 35,
  trustMarqueeItems
}: TrustIconBarProps) {
  if (showTrustMarquee === false) return null;

  const rawItems = (trustMarqueeItems && trustMarqueeItems.length > 0) ? trustMarqueeItems : defaultTrustItems;
  // Duplicate items to ensure wide loop coverage
  const doubledItems = rawItems.length < 6 ? [...rawItems, ...rawItems] : rawItems;

  const animationDirection = trustMarqueeDirection === "right" ? "reverse" : "normal";
  const animationDuration = `${Math.max(10, Math.min(120, trustMarqueeSpeed || 35))}s`;

  return (
    <section className={styles.trustIconBarSection}>
      <div 
        className={styles.trustMarqueeTrack}
        style={{
          animationDirection: animationDirection,
          animationDuration: animationDuration
        }}
      >
        {/* Group 1 */}
        <div className={styles.trustMarqueeGroup}>
          {doubledItems.map((item, idx) => (
            <div key={`g1-${item.id || idx}-${idx}`} className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>
                {renderTrustIcon(item.icon)}
              </div>
              <span className={styles.trustTitle}>{item.title}</span>
            </div>
          ))}
        </div>

        {/* Group 2 (Duplicate for seamless loop) */}
        <div className={styles.trustMarqueeGroup} aria-hidden="true">
          {doubledItems.map((item, idx) => (
            <div key={`g2-${item.id || idx}-${idx}`} className={styles.trustItem}>
              <div className={styles.trustIconWrapper}>
                {renderTrustIcon(item.icon)}
              </div>
              <span className={styles.trustTitle}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
