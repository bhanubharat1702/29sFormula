"use client";

import React from "react";
import styles from "../../page.module.css";
import { EmailTemplateItem } from "../communicationsTypes";

interface EmailTemplatesTabProps {
  templates: EmailTemplateItem[];
  onOpenEdit: (tmpl: EmailTemplateItem) => void;
  onOpenPreview: (tmpl: EmailTemplateItem) => void;
}

export default function EmailTemplatesTab({
  templates,
  onOpenEdit,
  onOpenPreview
}: EmailTemplatesTabProps) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeaderRow} style={{ padding: "16px 20px" }}>
        <div>
          <h3 className={styles.tableTitle}>Platform Email Templates</h3>
          <p className={styles.tableSubtitle}>
            Editable transaction & notification templates with variable interpolation: <code>{"{{store_name}}"}</code>, <code>{"{{owner_name}}"}</code>, <code>{"{{plan}}"}</code>
          </p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Category</th>
              <th>Subject Line</th>
              <th>Variables</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tmpl) => (
              <tr key={tmpl.key}>
                <td>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{tmpl.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>key: {tmpl.key}</div>
                </td>
                <td>
                  <span className={styles.tableBadge} style={{ background: "#e0e7ff", color: "#3730a3" }}>
                    {tmpl.category}
                  </span>
                </td>
                <td style={{ maxWidth: "260px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ fontSize: "0.85rem", color: "#374151" }}>{tmpl.subject}</span>
                </td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {tmpl.variables.map((v) => (
                      <span key={v} style={{ fontSize: "0.7rem", padding: "2px 6px", background: "#f3f4f6", borderRadius: "4px", color: "#4b5563", fontFamily: "monospace" }}>
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={styles.tableBadge} style={{ background: tmpl.isTransactional ? "#dcfce7" : "#fef3c7", color: tmpl.isTransactional ? "#166534" : "#92400e" }}>
                    {tmpl.isTransactional ? "Transactional" : "Marketing"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                      onClick={() => onOpenPreview(tmpl)}
                    >
                      Preview & Test
                    </button>
                    <button
                      className={styles.btnSecondary}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                      onClick={() => onOpenEdit(tmpl)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
