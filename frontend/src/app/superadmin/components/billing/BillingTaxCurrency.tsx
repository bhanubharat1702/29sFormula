"use client";

import React from "react";
import styles from "../../page.module.css";
import { TaxCurrencyConfigItem } from "../billingTypes";

interface BillingTaxCurrencyProps {
  taxConfigs: TaxCurrencyConfigItem[];
  onUpdateTaxRate: (id: string, taxRatePercent: number) => void;
}

export default function BillingTaxCurrency({ taxConfigs, onUpdateTaxRate }: BillingTaxCurrencyProps) {
  return (
    <div className={styles.tableCard}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          Regional Tax Rates (GST / VAT) & Multi-Currency Rules
        </h3>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Country</th>
            <th>Tax Label</th>
            <th>Tax Rate (%)</th>
            <th>Currency</th>
            <th>Exchange Rate to USD</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxConfigs.map((tax) => (
            <tr key={tax._id}>
              <td style={{ fontWeight: 600 }}>{tax.country}</td>
              <td>{tax.taxName}</td>
              <td style={{ fontWeight: 700 }}>{tax.taxRatePercent}%</td>
              <td style={{ fontWeight: 600, color: "#2563eb" }}>{tax.currencyCode}</td>
              <td style={{ fontSize: "0.85rem" }}>1 {tax.currencyCode} = ${tax.exchangeRateToUSD} USD</td>
              <td>
                <button
                  className={styles.btnSecondary}
                  style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                  onClick={() => {
                    const newRate = prompt(`Enter new tax rate (%) for ${tax.country}:`, String(tax.taxRatePercent));
                    if (newRate !== null) onUpdateTaxRate(tax._id, Number(newRate));
                  }}
                >
                  Update Tax Rate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
