import React from 'react';
import styles from '../../../page.module.css';

interface ReturnsSubTabProps {
    orders: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  
  isRefundFilterOpen: boolean;
  setIsRefundFilterOpen: (val: boolean) => void;
  refundStatusFilter: string;
  setRefundStatusFilter: (val: string) => void;
  isStatusFilterOpen: boolean;
  setIsStatusFilterOpen: (val: boolean) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (val: string) => void;
  fetchOrders: () => void;
  openStatusDropdownId: string | null;
  setOpenStatusDropdownId: (val: string | null) => void;
  handleUpdateReturnStatus: (id: string, status: string) => void;
  handleUpdateOrderStatus: (id: string, status: string) => void;
  handleUpdateRefundStatus?: (id: string, refundStatus: string) => void;
  setSelectedOrder: (order: any) => void;
  handleDeleteOrder: (id: string) => void;
}

export default function ReturnsSubTab({
  orders,
  searchQuery,
  setSearchQuery,
  
  isRefundFilterOpen,
  setIsRefundFilterOpen,
  refundStatusFilter,
  setRefundStatusFilter,
  isStatusFilterOpen,
  setIsStatusFilterOpen,
  orderStatusFilter,
  setOrderStatusFilter,
  fetchOrders,
  openStatusDropdownId,
  setOpenStatusDropdownId,
  handleUpdateReturnStatus,
  handleUpdateOrderStatus,
  handleUpdateRefundStatus,
  setSelectedOrder,
  handleDeleteOrder
}: ReturnsSubTabProps) {
  const [openActionDropdownId, setOpenActionDropdownId] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const activeSubTab = "returns" as string;

  return (
            <div className={styles.viewContainer} style={{ gap: "16px", marginTop: "-12px" }}>
              <div className={styles.desktopHeaderContainer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {activeSubTab === "returns" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6-6m0 0l6-6m-6 6h12" />
                    </svg>
                  ) : activeSubTab === "cancelled" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : activeSubTab === "completed" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
                    </svg>
                  )}
                  <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>
                    {activeSubTab === "returns" ? "Return Requests" : activeSubTab === "cancelled" ? "Cancelled" : activeSubTab === "completed" ? "Completed" : "Active Orders"}
                  </h1>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {activeSubTab === "cancelled" ? (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => setIsRefundFilterOpen(!isRefundFilterOpen)}
                        className={styles.selectInput}
                        style={{ padding: "6px 12px", minHeight: "36px", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "160px" }}
                      >
                        {refundStatusFilter === "All" ? "All Refund Statuses" : refundStatusFilter}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6b7280" style={{ width: "14px", height: "14px", transform: isRefundFilterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      {isRefundFilterOpen && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setIsRefundFilterOpen(false)} />
                          <div style={{ position: "absolute", top: "42px", left: 0, width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 110, overflow: "hidden" }}>
                            {["All", "Refunded", "Not Refunded"].map((opt) => (
                              <div
                                key={opt}
                                onClick={() => { setRefundStatusFilter(opt); setIsRefundFilterOpen(false); }}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  backgroundColor: refundStatusFilter === opt ? "#eff6ff" : "transparent",
                                  color: refundStatusFilter === opt ? "#2563eb" : "#374151",
                                  fontWeight: refundStatusFilter === opt ? 600 : 400
                                }}
                                onMouseEnter={(e) => { if (refundStatusFilter !== opt) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                onMouseLeave={(e) => { if (refundStatusFilter !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                              >
                                {opt === "All" ? "All Refund Statuses" : opt}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                        className={styles.selectInput}
                        style={{ padding: "6px 12px", minHeight: "36px", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "140px" }}
                      >
                        {orderStatusFilter === "All" ? "All Statuses" : orderStatusFilter}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6b7280" style={{ width: "14px", height: "14px", transform: isStatusFilterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      {isStatusFilterOpen && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setIsStatusFilterOpen(false)} />
                          <div style={{ position: "absolute", top: "42px", left: 0, width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 110, overflow: "hidden" }}>
                            {["All", "Processing", "Shipped"].map((opt) => (
                              <div
                                key={opt}
                                onClick={() => { setOrderStatusFilter(opt); setIsStatusFilterOpen(false); }}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  backgroundColor: orderStatusFilter === opt ? "#eff6ff" : "transparent",
                                  color: orderStatusFilter === opt ? "#2563eb" : "#374151",
                                  fontWeight: orderStatusFilter === opt ? 600 : 400
                                }}
                                onMouseEnter={(e) => { if (orderStatusFilter !== opt) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                onMouseLeave={(e) => { if (orderStatusFilter !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                              >
                                {opt === "All" ? "All Statuses" : opt}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => { setIsRefreshing(true); fetchOrders(); setTimeout(() => setIsRefreshing(false), 1000); }}
                    className={styles.addPerfumeBtn}
                    title="Reload Orders"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              
              

              <div className={styles.tablePanelFull}>
                <div className={styles.dashboardCard}>
<div className={styles.mobileHeaderContainer}>
                <div className={styles.mobileTitleRow}>
                  <div>
                    <h1 className={styles.mobileTitle}>
                      {activeSubTab === "returns" ? "Return Requests" : activeSubTab === "cancelled" ? "Cancelled" : activeSubTab === "completed" ? "Completed" : "Active Orders"}
                    </h1>
                    <div className={styles.mobileSubtitle}>{orders.length} orders</div>
                  </div>
                  <button className={styles.mobileRefreshBtn} onClick={() => { setIsRefreshing(true); fetchOrders(); setTimeout(() => setIsRefreshing(false), 1000); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }} className={isRefreshing ? styles.spinAnimation : ""}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                </div>
                
                <div className={styles.mobileFiltersScroll}>
                  {activeSubTab === "cancelled" ? (
                    <>
                      <div className={`${styles.mobileFilterPill} ${refundStatusFilter === 'All' ? styles.mobileFilterPillActive : ''}`} onClick={() => setRefundStatusFilter('All')}>
                        All <span className={styles.mobileFilterCount}>{orders.length}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${refundStatusFilter === 'Refunded' ? styles.mobileFilterPillActive : ''}`} onClick={() => setRefundStatusFilter('Refunded')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#166534' }}></div>
                        Refunded <span className={styles.mobileFilterCount}>{orders.filter((o:any)=>(o.refundStatus || "Not Refunded")==='Refunded').length}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${refundStatusFilter === 'Not Refunded' ? styles.mobileFilterPillActive : ''}`} onClick={() => setRefundStatusFilter('Not Refunded')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#b91c1c' }}></div>
                        Not Refunded <span className={styles.mobileFilterCount}>{orders.filter((o:any)=>(o.refundStatus || "Not Refunded")==='Not Refunded').length}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`${styles.mobileFilterPill} ${orderStatusFilter === 'All' ? styles.mobileFilterPillActive : ''}`} onClick={() => setOrderStatusFilter('All')}>
                        All <span className={styles.mobileFilterCount}>{orders.length}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${orderStatusFilter === 'Processing' ? styles.mobileFilterPillActive : ''}`} onClick={() => setOrderStatusFilter('Processing')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#b45309' }}></div>
                        Processing <span className={styles.mobileFilterCount}>{orders.filter((o:any)=>o.status==='Processing').length}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${orderStatusFilter === 'Shipped' ? styles.mobileFilterPillActive : ''}`} onClick={() => setOrderStatusFilter('Shipped')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#4338ca' }}></div>
                        Shipped <span className={styles.mobileFilterCount}>{orders.filter((o:any)=>o.status==='Shipped').length}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${orderStatusFilter === 'Delivered' ? styles.mobileFilterPillActive : ''}`} onClick={() => setOrderStatusFilter('Delivered')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#166534' }}></div>
                        Delivered <span className={styles.mobileFilterCount}>{orders.filter((o:any)=>o.status==='Delivered').length}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>



                  {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No orders placed in the system yet. Placed orders will show up here in real-time.</p>
                    </div>
                  ) : (
                    <div className={styles.tableResponsive} style={{ overflow: (openStatusDropdownId || openActionDropdownId) ? "visible" : "auto" }}>
                      <table className={styles.inventoryTable}>
                        <thead className={styles.hideOnMobile}>
                          {activeSubTab === "returns" ? (
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Items</th>
                              <th style={{ textAlign: 'center' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Amount</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          ) : (
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Items</th>
                              <th style={{ textAlign: 'center' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Amount</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          )}
                        </thead>
<tbody>
                          {(() => {
  const filteredOrders = orders
    .filter(o => !o.deletedByAdmin)
    .filter(o => {
      return o.status === "Return Requested" || 
             o.status === "Return Rejected" ||
             (o.returnRequest && o.returnRequest.status === "Pending");
    })
    .filter(o =>
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  if (filteredOrders.length === 0) {
    return (
      <tr>
        <td colSpan={10} style={{ padding: "40px 0" }}>
          <div className={styles.emptyState} style={{ border: "none", boxShadow: "none", background: "transparent" }}>
            <p>No orders found matching this criteria.</p>
          </div>
        </td>
      </tr>
    );
  }
  return filteredOrders.map((order, idx, arr) => {
                               const openUpwards = arr.length > 0 && idx >= arr.length - 2;
                               const isRejected = order.status === "Return Rejected" || order.returnRequest?.status === "Rejected";
                               return (
                                 <React.Fragment key={order._id}>
                                <tr className={styles.desktopRow} style={{ borderBottom: '1px solid #f9fafb', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                                    <td>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <span style={{ fontSize: '12px', color: '#374151' }}>{order.orderId ? (order.orderId.length > 12 ? order.orderId.substring(0, 4) + '...' + order.orderId.slice(-6) : order.orderId) : order._id.substring(order._id.length - 4)}</span>
                                        <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "8px", backgroundColor: "#fce7f3", color: "#be185d", width: "fit-content" }}>
                                          {order.returnRequest?.returnType?.toUpperCase() || "RETURN"}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '14px', color: '#000', textTransform: 'capitalize' }}>{order.customerName ? order.customerName.toLowerCase() : "N/A"}</span>
                                    </td>
                                    <td>
                                      <div style={{ maxWidth: '180px', fontSize: '0.85rem', color: '#6b7280' }}>
                                        {order.cartItems && order.cartItems.length > 0 
                                          ? order.cartItems.map((item: any, idx: number) => (
                                              <div key={idx} style={{ marginBottom: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                  <span style={{ color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                                                  <span style={{ backgroundColor: item.isGiftSet || item.name?.toLowerCase().includes('gift set') ? '#fef3c7' : '#f1f5f9', color: item.isGiftSet || item.name?.toLowerCase().includes('gift set') ? '#b45309' : '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, flexShrink: 0 }}>
                                                    {item.isGiftSet || item.name?.toLowerCase().includes('gift set') ? 'GIFT SET' : `${item.quantity}x ${item.size}`}
                                                  </span>
                                                </div>
                                                {(item.isGiftSet || (item.giftSetDetails && item.giftSetDetails.length > 0)) && (
                                                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px', paddingLeft: '4px' }}>
                                                    {item.giftSetDetails ? item.giftSetDetails.map((g: any) => g.name).join(', ') : item.size}
                                                  </div>
                                                )}
                                              </div>
                                            ))
                                          : "N/A"}
                                      </div>
                                    </td>
                                    <td style={{ textAlign: 'center', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                                      {order.cartItems ? order.cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 0}
                                    </td>
                                    <td style={{ textAlign: 'right', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                                      ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                        <span style={{
                                          display: "inline-block",
                                          padding: "4px 8px",
                                          borderRadius: "12px",
                                          fontSize: "0.75rem",
                                          fontWeight: 700,
                                          textTransform: "uppercase",
                                          backgroundColor: isRejected ? "#fef2f2" : "#fef3c7",
                                          color: isRejected ? "#b91c1c" : "#b45309",
                                          width: "fit-content"
                                        }}>
                                          {isRejected ? "REJECTED" : (order.returnRequest?.status || "Return Requested")}
                                        </span>
                                        {isRejected && (
                                          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: (order.refundStatus === "Refunded") ? "#166534" : "#991b1b" }}>
                                            {order.refundStatus === "Refunded" ? "Refunded" : "Not Refunded"}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={styles.tableDesc} style={{ whiteSpace: "normal" }}>
                                        {new Date(order.returnRequest?.createdAt || order.createdAt).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric"
                                        })}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <div style={{ position: "relative" }}>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setOpenActionDropdownId(openActionDropdownId === order._id ? null : order._id); }}
                                            title="Actions"
                                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#4b5563", padding: "4px", display: "flex", alignItems: "center" }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                            </svg>
                                          </button>
                                          {openActionDropdownId === order._id && (
                                            <>
                                              <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={(e) => { e.stopPropagation(); setOpenActionDropdownId(null); }} />
                                              <div style={{
                                                position: "absolute",
                                                right: 0,
                                                minWidth: "160px",
                                                background: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                                zIndex: 9999,
                                                overflow: "hidden",
                                                top: openUpwards ? "auto" : "100%",
                                                bottom: openUpwards ? "100%" : "auto",
                                                marginBottom: openUpwards ? "4px" : "0",
                                                marginTop: openUpwards ? "0" : "4px"
                                              }}>
                                                <div
                                                  onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setOpenActionDropdownId(null); }}
                                                  style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer", color: "#374151", fontWeight: 500 }}
                                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                >
                                                  View Details
                                                </div>
                                                {!isRejected ? (
                                                  <>
                                                    <div
                                                      onClick={(e) => { e.stopPropagation(); handleUpdateReturnStatus(order._id, "Approved"); setOpenActionDropdownId(null); }}
                                                      style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer", color: "#166534", fontWeight: 500 }}
                                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0fdf4")}
                                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                    >
                                                      Approve Return
                                                    </div>
                                                    <div
                                                      onClick={(e) => { e.stopPropagation(); handleUpdateReturnStatus(order._id, "Rejected"); setOpenActionDropdownId(null); }}
                                                      style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer", color: "#b91c1c", fontWeight: 500 }}
                                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                    >
                                                      Reject Return
                                                    </div>
                                                  </>
                                                ) : (
                                                  <>
                                                    <div
                                                      onClick={(e) => { e.stopPropagation(); handleUpdateRefundStatus?.(order._id, "Refunded"); setOpenActionDropdownId(null); }}
                                                      style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer", color: "#166534", fontWeight: 500 }}
                                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0fdf4")}
                                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                    >
                                                      Mark as Refunded
                                                    </div>
                                                    <div
                                                      onClick={(e) => { e.stopPropagation(); handleUpdateRefundStatus?.(order._id, "Not Refunded"); setOpenActionDropdownId(null); }}
                                                      style={{ padding: "8px 12px", fontSize: "0.85rem", cursor: "pointer", color: "#b91c1c", fontWeight: 500 }}
                                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                    >
                                                      Mark as Not Refunded
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className={styles.mobileCard} onClick={() => setSelectedOrder(order)}>
                                    <td colSpan={10} style={{ padding: 0, border: 'none' }}>
                                      <div className={styles.mobileCardContainer}>
                                        <div className={styles.mobileCardHeader}>
                                          <div>
                                            <div className={styles.mobileCustomerName}>{order.customerName ? order.customerName.toLowerCase() : "N/A"}</div>
                                            <div className={styles.mobileOrderMeta}>
                                              {order.orderId ? (order.orderId.length > 12 ? order.orderId.substring(0, 4) + '...' + order.orderId.slice(-6) : order.orderId) : `ORD-${order._id.substring(order._id.length - 4).toUpperCase()}`} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                          </div>
                                          <div style={{ textAlign: 'right' }}>
                                            <div className={styles.mobileOrderAmount}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</div>
                                            <div className={styles.mobileStatusBadge} style={{
                                              backgroundColor: order.status === 'Processing' ? '#fef3c7' : order.status === 'Dispatched' ? '#e0e7ff' : order.status === 'Delivered' ? '#f0fdf4' : order.status === 'Cancelled' ? '#f3f4f6' : '#fee2e2',
                                              color: order.status === 'Processing' ? '#b45309' : order.status === 'Dispatched' ? '#4338ca' : order.status === 'Delivered' ? '#166534' : order.status === 'Cancelled' ? '#4b5563' : '#b91c1c'
                                            }}>
                                              <div className={styles.mobileStatusDot} style={{
                                                backgroundColor: order.status === 'Processing' ? '#b45309' : order.status === 'Dispatched' ? '#4338ca' : order.status === 'Delivered' ? '#166534' : order.status === 'Cancelled' ? '#4b5563' : '#b91c1c'
                                              }}></div>
                                              {order.status}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className={styles.mobileProductsList}>
                                          {order.cartItems && order.cartItems.map((item: any, idx: number) => (
                                            <div key={idx} className={styles.mobileProductPill}>
                                              {item.name} · <span className={styles.mobileProductWeight}>{item.size} ×{item.quantity}</span>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className={styles.mobileItemsSummary}>
                                          {order.cartItems ? order.cartItems.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) : 0} items · {order.cartItems?.length || 0} products
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                             });})()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
