import React from 'react';
import styles from '../../page.module.css';

interface CustomersTabProps {
  activeTab: any;
  customers: any;
  setSelectedCustomer: any;
  setDeleteCustomerTargetId: any;
}

export default function CustomersTab({
  activeTab,
  customers,
  setSelectedCustomer,
  setDeleteCustomerTargetId
}: CustomersTabProps) {
  return (
    <>
          {activeTab === "customers" && (
            <div className={styles.viewContainer}>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Desktop Heading */}
                <div className={styles.hideOnMobile}>
                  <h1 className={styles.pageHeading} style={{ margin: 0 }}>Customers Directory</h1>
                </div>

                {/* Mobile Heading */}
                <div className={styles.showOnMobile} style={{ marginTop: "-10px", marginBottom: "5px" }}>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#111827", letterSpacing: "-0.02em" }}>Customers Directory</h1>
                </div>

                <div className={styles.dashboardCard} style={{ marginTop: 0 }}>
                {customers.length > 0 ? (
                  <>
                    {/* Desktop View */}
                    <div className={styles.hideOnMobile} style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #e5e7eb", fontSize: "0.82rem", color: "#6b7280", textTransform: "uppercase" }}>
                            <th style={{ padding: "12px 16px" }}>CustomerName</th>
                            <th style={{ padding: "12px 16px" }}>EmailAddress</th>
                            <th style={{ padding: "12px 16px" }}>Phone</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>TotalOrders</th>
                            <th style={{ padding: "12px 16px", textAlign: "right" }}>TotalSpend</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map((cust: any, idx: number) => (
                            <tr
                              key={idx}
                              style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", transition: "background-color 0.2s" }}
                              onClick={() => setSelectedCustomer(cust)}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>
                                {cust.name}
                              </td>
                              <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#4b5563" }}>
                                {cust.email}
                              </td>
                              <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#4b5563" }}>
                                {cust.phone}
                              </td>
                              <td style={{ padding: "14px 16px", fontSize: "0.88rem", fontWeight: 600, textAlign: "center", color: "#111827" }}>
                                {cust.totalOrders}
                              </td>
                              <td style={{ padding: "14px 16px", fontSize: "0.88rem", fontWeight: 700, textAlign: "right", color: "#000" }}>
                                ₹{cust.totalSpend.toLocaleString("en-IN")}.00
                              </td>
                              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeleteCustomerTargetId(cust._id); }}
                                  className={styles.deleteActionBtn}
                                  style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                  title="Delete Customer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View */}
                    <div className={styles.showOnMobile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {customers.map((cust: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "14px",
                            padding: "20px",
                            backgroundColor: "#ffffff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                          }}
                          onClick={() => setSelectedCustomer(cust)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <h3 style={{ margin: "0 0 2px 0", fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>{cust.name}</h3>
                              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                {cust.email}
                              </p>
                              {cust.phone && (
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                  </svg>
                                  {cust.phone}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteCustomerTargetId(cust._id); }}
                              style={{ padding: "8px", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#ef4444", border: "none", cursor: "pointer" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", paddingTop: "14px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontSize: "0.72rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Orders</span>
                              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>{cust.totalOrders}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                              <span style={{ fontSize: "0.72rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Spend</span>
                              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#000" }}>₹{cust.totalSpend.toLocaleString("en-IN")}.00</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>No customer directory records found.</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.82rem" }}>Customers will appear here automatically once their checkouts create orders.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Redesigned Marketing Campaigns & Promos Tab */}
    </>
  );
}
