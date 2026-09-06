import React from 'react';
import styles from '../../page.module.css';

interface DiscountsTabProps {
  activeTab: any;
  handleCreateDiscount: any;
  discountError: any;
  newDiscountCode: any;
  setNewDiscountCode: any;
  newDiscountType: any;
  setNewDiscountType: any;
  newDiscountValue: any;
  setNewDiscountValue: any;
  newDiscountMinOrder: any;
  setNewDiscountMinOrder: any;
  discountsList: any;
  setDeleteDiscountConfirmId: any;

}

export default function DiscountsTab({
  activeTab,
  handleCreateDiscount,
  discountError,
  newDiscountCode,
  setNewDiscountCode,
  newDiscountType,
  setNewDiscountType,
  newDiscountValue,
  setNewDiscountValue,
  newDiscountMinOrder,
  setNewDiscountMinOrder,
  discountsList,
  setDeleteDiscountConfirmId,
  
}: DiscountsTabProps) {
  return (
    <>
          {activeTab === "discounts" && (
            <div className={styles.viewContainer}>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Desktop Heading */}
                <div className={styles.hideOnMobile}>
                  <h1 className={styles.pageHeading} style={{ margin: 0 }}>Discount Coupons & Promotion Codes</h1>
                </div>

                {/* Mobile Heading */}
                <div className={styles.showOnMobile} style={{ marginTop: "-10px", marginBottom: "5px" }}>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#111827", letterSpacing: "-0.02em" }}>Discount Coupons</h1>
                </div>

              <div className={styles.discountsGrid}>
                {/* Form to create discount */}
                <div className={styles.dashboardCard} style={{ padding: "25px", height: "fit-content", background: "linear-gradient(145deg, #ffffff, #f8fafc)", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
                    <div style={{ backgroundColor: "#f3f4f6", padding: "8px", borderRadius: "8px", color: "#000000" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Generate Coupon</h3>
                  </div>
                  
                  <form onSubmit={handleCreateDiscount}>
                    {discountError && <div className={styles.errorBanner} style={{ padding: "10px 14px", fontSize: "0.85rem", marginBottom: "20px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>{discountError}</div>}
                    
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Coupon Code <span style={{ color: "#ef4444" }}>*</span></label>
                      <input
                        type="text"
                        value={newDiscountCode}
                        onChange={(e) => setNewDiscountCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                        placeholder="e.g. SUMMER2024"
                        style={{ padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", transition: "border-color 0.2s", outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "#000000"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        required
                      />
                    </div>
                    
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Discount Type <span style={{ color: "#ef4444" }}>*</span></label>
                      <select
                        value={newDiscountType}
                        onChange={(e) => setNewDiscountType(e.target.value)}
                        style={{ padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", cursor: "pointer", outline: "none", appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23475569\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        onFocus={(e) => e.target.style.borderColor = "#000000"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Flat Amount (₹)</option>
                      </select>
                    </div>
                    
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Discount Value <span style={{ color: "#ef4444" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 700, fontSize: "0.9rem" }}>
                          {newDiscountType === "percentage" ? "%" : "₹"}
                        </span>
                        <input
                          type="number"
                          value={newDiscountValue}
                          onChange={(e) => setNewDiscountValue(e.target.value)}
                          placeholder={newDiscountType === "percentage" ? "10" : "150"}
                          style={{ padding: "10px 12px 10px 32px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", outline: "none" }}
                          onFocus={(e) => e.target.style.borderColor = "#000000"}
                          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                          required
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Minimum Order Amount (₹) <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Optional)</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 700, fontSize: "0.9rem" }}>
                          ₹
                        </span>
                        <input
                          type="number"
                          value={newDiscountMinOrder}
                          onChange={(e) => setNewDiscountMinOrder(e.target.value)}
                          placeholder="e.g. 500"
                          style={{ padding: "10px 12px 10px 32px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", outline: "none" }}
                          onFocus={(e) => e.target.style.borderColor = "#000000"}
                          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#000000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        width: "100%",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1f2937"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#000000"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* List of active discount coupons */}
                <div className={styles.dashboardCard} style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "15px" }}>Active Storefront Coupons</h3>
                  {discountsList.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
                      {discountsList.map((disc: any) => (
                        <div key={disc._id} className={styles.couponCard}>
                          <div>
                            <div style={{ fontWeight: 800, fontFamily: "monospace", fontSize: "1.2rem", color: "#111827", letterSpacing: "1px" }}>{disc.code}</div>
                            <div style={{ fontSize: "0.85rem", color: "#111827", fontWeight: 700, marginTop: "4px" }}>
                              {disc.type === "percentage" ? `${disc.value}% OFF` : `₹${disc.value.toLocaleString("en-IN")} FLAT OFF`}
                              {disc.minOrderAmount > 0 && <span style={{ color: "#64748b", fontWeight: 500, marginLeft: "8px" }}>| Min ₹{disc.minOrderAmount.toLocaleString("en-IN")}</span>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDeleteDiscountConfirmId(disc._id)}
                            style={{ backgroundColor: "#ef4444", border: "none", color: "#ffffff", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", padding: "8px 12px", borderRadius: "6px", transition: "background-color 0.2s" }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "40px 10px", textAlign: "center", color: "#6b7280", fontSize: "0.88rem" }}>
                      No active discount coupons found. Create one using the form on the left!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

    </>
  );
}
