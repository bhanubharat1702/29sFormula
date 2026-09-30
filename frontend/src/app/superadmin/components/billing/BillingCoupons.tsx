"use client";

import React from "react";
import styles from "../../page.module.css";
import { CouponItem } from "../billingTypes";

interface BillingCouponsProps {
  coupons: CouponItem[];
  onOpenCreateCoupon: () => void;
}

export default function BillingCoupons({ coupons, onOpenCreateCoupon }: BillingCouponsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          Discount Coupons & Credits
        </h3>
        <button className={styles.btnPrimary} onClick={onOpenCreateCoupon}>
          + Create Coupon Code
        </button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Redemptions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td style={{ fontWeight: 700, color: "#2563eb", fontFamily: "monospace" }}>{c.code}</td>
                <td style={{ fontSize: "0.85rem" }}>{c.description}</td>
                <td style={{ fontWeight: 600 }}>
                  {c.discountType === "percent" ? `${c.discountValue}% OFF` : `$${c.discountValue} FLAT`}
                </td>
                <td style={{ fontSize: "0.85rem" }}>
                  {c.timesRedeemed} / {c.maxRedemptions || "∞"}
                </td>
                <td>
                  <span style={{ color: "#166534", fontWeight: 600, fontSize: "0.8rem" }}>Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
