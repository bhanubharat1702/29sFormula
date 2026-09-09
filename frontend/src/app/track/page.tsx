'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar/Navbar";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  cartItems: {
    productId: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  deletedByAdmin?: boolean;
  cancellationReason?: string;
  refundStatus?: string;
  createdAt: string;
  returnRequest?: {
    status: string;
    reason: string;
    images: string[];
    adminNotes?: string;
  } | null;
}

export default function TrackOrderPage() {
  const [queryInput, setQueryInput] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnType, setReturnType] = useState("Replacement");
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [modalOrderId, setModalOrderId] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>(
    "#57bc74"
  );

  // Session is now handled by Navbar
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [isCartClosing, setIsCartClosing] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const [cartError, setCartError] = useState<string | null>(null);

  const showCartError = (msg: string) => {
    setCartError(msg);
    setTimeout(() => setCartError(null), 3000);
  };

  const loadCart = () => {
    if (typeof window !== "undefined") {
      const items = localStorage.getItem("cart");
      if (items) {
        try {
          setCartItems(JSON.parse(items));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    if (showCartDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCartDrawer]);

  const handleCloseCart = () => {
    setIsCartClosing(true);
    setTimeout(() => {
      setShowCartDrawer(false);
      setIsCartClosing(false);
    }, 300);
  };

  const initiateCheckout = () => {
    setShowCartDrawer(false);
    setShowCheckoutDrawer(true);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      const updated = cartItems.filter((_, idx) => idx !== index);
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    } else {
      const item = cartItems[index];
      if (item.availableQuantity !== undefined && newQuantity > item.availableQuantity) {
        showCartError(`Only ${item.availableQuantity} units available for ${item.name} (${item.size})`);
        const updated = [...cartItems];
        updated[index].quantity = item.availableQuantity;
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        return;
      }
      const updated = [...cartItems];
      updated[index].quantity = newQuantity;
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    loadCart();
    const handleStorageChange = () => loadCart();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data && data.primaryColor) {
          setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
        }
      })
      .catch(err => console.warn("Failed to load storefront theme color:", err));

    // Auto-fetch orders if user is logged in
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user && user.email) {
          // fetchOrderData is defined below, but since useEffect runs after render, it will be available in the closure
          fetchOrderData(user.email);
        }
      } catch (e) {
        console.error("Error parsing userSession for tracking:", e);
      }
    }
  }, []);

  const fetchOrderData = async (queryStr: string) => {
    setLoading(true);
    setError(null);
    setCurrentOrder(null);
    setHistory([]);
    setCancelSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/track?query=${encodeURIComponent(queryStr.trim())}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No order matched these details.");
      }
      setCurrentOrder(data.currentOrder);
      setHistory(data.history || []);
      
      setTimeout(() => {
        if (resultsRef.current) {
          const targetPosition = resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          const duration = 1200; // 1.2 seconds
          let start: number | null = null;

          // easeInOutCubic: slow start, speed increase in middle, slow end
          const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic(percent));
            
            if (progress < duration) {
              window.requestAnimationFrame(step);
            }
          };

          window.requestAnimationFrame(step);
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to find order.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput) return;
    await fetchOrderData(queryInput);
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    setShowCancelConfirmModal(true);
  };

  const confirmOrderCancellation = async () => {
    if (!currentOrder) return;
    setShowCancelConfirmModal(false);
    setIsCancelling(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${currentOrder._id}/cancel`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order cancellation failed.");
      }
      setCurrentOrder(data);
      setCancelSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");
      
      setProofImages(prev => [...prev, data.url]);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveProofImage = (indexToRemove: number) => {
    setProofImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalOrderId) return;
    if (!returnReason.trim()) {
      alert("Please state the reason for your return.");
      return;
    }

    setIsReturning(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/${modalOrderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: returnReason,
          returnType: returnType,
          images: proofImages
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit return request.");
      }

      if (currentOrder && currentOrder._id === modalOrderId) {
        setCurrentOrder(data);
      }
      
      setHistory(prevHistory => 
        prevHistory.map(order => order._id === modalOrderId ? data : order)
      );

      setReturnSuccess(true);
      setShowReturnModal(false);
      setReturnReason("");
      setReturnType("Replacement");
      setProofImages([]);
      setModalOrderId(null);
    } catch (err: any) {
      setError(err.message || "Failed to submit return request.");
    } finally {
      setIsReturning(false);
    }
  };

  const isReturnEligible = (order: any) => {
    // If a request is already submitted, they are no longer eligible to create another one
    if (order.returnRequest || order.status === "Return Requested" || order.status === "Return Approved" || order.status === "Return Rejected") return false;
    if (order.status !== "Delivered") return false;
    const orderDate = order.updatedAt ? new Date(order.updatedAt) : new Date(order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <div suppressHydrationWarning className={styles.page}>

      {/* Navigation Header */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>TRACK & CANCEL ORDER</h1>
          <p className={styles.pageSubtitle}>Enter your order details below to monitor status or cancel processing orders.</p>

          {/* Form Box */}
          <div className={styles.formCard}>
            <form onSubmit={handleTrackSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Order ID, Email, or Phone Number</label>
                <input
                  type="text"
                  required
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.searchBtn} style={{ marginTop: "15px" }}>
                {loading ? "Searching..." : "Track Order"}
              </button>
            </form>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}
          {cancelSuccess && <div className={styles.successAlert}>Your order has been cancelled successfully.</div>}

          {/* Tracking Results */}
          {currentOrder && (() => {
            const order = currentOrder;
            return (
              <div ref={resultsRef}>
              <div className={styles.resultsContainer}>
              {/* Timeline Progress */}
              <div className={styles.timelineCard}>
                <h3 className={styles.cardHeader}>Delivery Progress</h3>

                <div className={styles.timeline}>
                  {order.status === "Cancelled" ? (
                    <>
                      {/* Step 1: Placed */}
                      <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                        <div className={styles.stepCircle}>✓</div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Order Placed</span>
                          <span className={styles.stepDesc}>Order successfully received.</span>
                        </div>
                      </div>

                      <div className={`${styles.stepLine} ${styles.lineActive}`} />

                      {/* Step 2: Cancelled */}
                      <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                        <div className={styles.stepCircle}>✓</div>
                        <div className={styles.stepInfo} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={styles.stepTitle}>{order.deletedByAdmin ? "CANCELLED BY OWNER" : "ORDER CANCELLED"}</span>
                          <span className={styles.stepDesc}>
                            {order.paymentMethod === "COD" 
                              ? "This order has been cancelled and will not be dispatched."
                              : "This order has been cancelled."}
                          </span>
                          {order.cancellationReason && (
                            <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', borderRadius: '4px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#991b1b', display: 'block' }}>Reason for cancellation:</span>
                              <span style={{ fontSize: '0.85rem', color: '#7f1d1d', marginTop: '2px', display: 'block' }}>{order.cancellationReason}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {order.paymentMethod !== "COD" && (
                        <>
                          <div className={`${styles.stepLine} ${order.refundStatus === "Refunded" ? styles.lineActive : ""}`} />
                          
                          {/* Step 3: Refund */}
                          <div className={`${styles.timelineStep} ${order.refundStatus === "Refunded" ? styles.stepActive : ""}`}>
                            <div className={styles.stepCircle}>
                              {order.refundStatus === "Refunded" ? "✓" : "3"}
                            </div>
                            <div className={styles.stepInfo}>
                              <span className={styles.stepTitle}>Refund {order.refundStatus === "Refunded" ? "Processed" : "Pending"}</span>
                              <span className={styles.stepDesc}>
                                {order.refundStatus === "Refunded" 
                                  ? "Refund successfully returned to original payment method." 
                                  : "Refund is pending processing."}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Step 1: Placed */}
                      <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                        <div className={styles.stepCircle}>✓</div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Order Placed</span>
                          <span className={styles.stepDesc}>Fulfillment processing.</span>
                        </div>
                      </div>

                      {/* Line connector */}
                      <div className={`${styles.stepLine} ${["Shipped", "Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(order.status) ? styles.lineActive : ""}`} />

                      {/* Step 2: Shipped */}
                      <div className={`${styles.timelineStep} ${["Shipped", "Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(order.status) ? styles.stepActive : ""}`}>
                        <div className={styles.stepCircle}>
                          {["Shipped", "Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(order.status) ? "✓" : "2"}
                        </div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Shipped</span>
                          <span className={styles.stepDesc}>Dispatched with courier tracking.</span>
                        </div>
                      </div>

                      {/* Line connector */}
                      <div className={`${styles.stepLine} ${["Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(order.status) ? styles.lineActive : ""}`} />

                      {/* Step 3: Delivered */}
                      <div className={`${styles.timelineStep} ${(["Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(order.status) || order.returnRequest) ? styles.stepActive : ""}`}>
                        <div className={styles.stepCircle}>
                          {(["Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(order.status) || order.returnRequest) ? "✓" : "3"}
                        </div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Delivered</span>
                          <span className={styles.stepDesc}>Doorstep delivery completed.</span>
                        </div>
                      </div>

                      {(order.returnRequest || ["Return Requested", "Return Approved", "Return Rejected"].includes(order.status)) && (
                        <>
                          <div className={`${styles.stepLine} ${styles.lineActive}`} />

                          {/* Step 4: Return Requested */}
                          <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                            <div className={styles.stepCircle}>✓</div>
                            <div className={styles.stepInfo}>
                              <span className={styles.stepTitle}>Return Requested</span>
                              <span className={styles.stepDesc}>Damage report submitted.</span>
                            </div>
                          </div>
                          
                          <div className={`${styles.stepLine} ${["Return Approved", "Return Rejected"].includes(order.status) ? styles.lineActive : ""}`} />

                          {/* Step 5: Return Decision */}
                          <div className={`${styles.timelineStep} ${["Return Approved", "Return Rejected"].includes(order.status) ? (order.status === "Return Rejected" ? styles.stepActiveError : styles.stepActive) : ""}`}>
                            <div className={styles.stepCircle} style={order.status === "Return Rejected" ? { backgroundColor: "#ef4444", color: "#fff", borderColor: "#ef4444" } : {}}>
                              {order.status === "Return Approved" ? "✓" : order.status === "Return Rejected" ? "✕" : "5"}
                            </div>
                            <div className={styles.stepInfo}>
                              <span className={styles.stepTitle} style={order.status === "Return Rejected" ? { color: "#ef4444" } : {}}>
                                {order.status === "Return Approved" ? "Return Approved" : order.status === "Return Rejected" ? "Return Rejected" : "Under Review"}
                              </span>
                              <span className={styles.stepDesc}>
                                {order.status === "Return Approved" 
                                  ? "Your return request has been approved." 
                                  : order.status === "Return Rejected" 
                                    ? "Your return request was declined." 
                                    : "Our team is reviewing your claim."}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {returnSuccess && (
                    <div className={styles.successBanner} style={{ marginTop: "20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "24px", height: "24px", flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <div>
                        <strong>Return Requested Successfully!</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem" }}>Our support team will review your request shortly.</p>
                      </div>
                    </div>
                  )}

                  {/* Return Request Status details */}
                  {order.returnRequest && (
                    <div style={{
                      marginTop: "20px",
                      padding: "16px",
                      borderRadius: "8px",
                      borderLeft: "4px solid " + (
                        order.returnRequest.status === "Approved" ? "#10b981" :
                        order.returnRequest.status === "Rejected" ? "#ef4444" : "#f59e0b"
                      ),
                      backgroundColor: (
                        order.returnRequest.status === "Approved" ? "#ecfdf5" :
                        order.returnRequest.status === "Rejected" ? "#fef2f2" : "#fffbeb"
                      ),
                      color: (
                        order.returnRequest.status === "Approved" ? "#065f46" :
                        order.returnRequest.status === "Rejected" ? "#991b1b" : "#92400e"
                      )
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: (
                            order.returnRequest.status === "Approved" ? "#10b981" :
                            order.returnRequest.status === "Rejected" ? "#ef4444" : "#f59e0b"
                          )
                        }} />
                        <strong style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Return Status: {order.returnRequest.status}
                        </strong>
                      </div>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", opacity: 0.9 }}>
                        <strong>Reason:</strong> {order.returnRequest.reason}
                      </p>
                      {order.returnRequest.adminNotes && (
                        <p style={{ margin: "6px 0 0 0", fontSize: "0.85rem", fontStyle: "italic", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "6px" }}>
                          <strong>Note from support:</strong> {order.returnRequest.adminNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Cancel Button Option */}
                {order.status === "Processing" && (
                  <div className={styles.cancellationBlock}>
                    <p className={styles.cancellationWarning}>
                      Need to make changes? You can cancel your order while it is still in the processing stage.
                    </p>
                    <button 
                      onClick={handleCancelOrder} 
                      disabled={isCancelling} 
                      className={styles.cancelBtn}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}

                {/* Return Request Option */}
                {isReturnEligible(order) && (
                  <div className={styles.cancellationBlock} style={{ borderLeftColor: "#f59e0b", backgroundColor: "#fffbeb" }}>
                    <p className={styles.cancellationWarning} style={{ color: "#92400e" }}>
                      Not satisfied? You can request a return for this delivered order.
                    </p>
                    <button 
                      onClick={() => {
                        setModalOrderId(order._id);
                        setShowReturnModal(true);
                      }} 
                      className={styles.cancelBtn}
                      style={{ backgroundColor: "#f59e0b", borderColor: "#f59e0b", color: "#fff" }}
                    >
                      Request Return (Damaged Product)
                    </button>
                  </div>
                )}
              </div>

              {/* Order Invoice Details summary */}
              <div className={styles.detailsCard}>
                <h3 className={styles.cardHeader}>Order Details</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Order ID:</span>
                    <span className={styles.orderIdVal} style={{ color: '#000000' }}>{order.orderId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Recipient:</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Shipping Address:</span>
                    <span className={styles.addressVal}>{order.shippingAddress}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Payment Method:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                <div className={styles.itemsBlock}>
                  <h4 style={{ margin: "20px 0 10px 0", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#888" }}>Items Summary</h4>
                  <div className={styles.itemsList}>
                    {order.cartItems.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        {item.image && (
                          <img src={item.image} alt={item.name} className={styles.itemImage} />
                        )}
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#111" }}>{item.name}</span>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "#6b7280" }}>Volume: {item.size} | Qty: {item.quantity}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.totalBlock}>
                  <span>Total Amount Paid</span>
                  <span className={styles.totalPrice}>₹{order.totalAmount.toLocaleString("en-IN")}.00</span>
                </div>
              </div>
            </div>
            
            {/* Previous Order History */}
            {history.length > 0 && (
              <div className={styles.historyContainer} style={{ marginTop: "40px" }}>
                <h3 className={styles.pageSubtitle} style={{ textAlign: "left", marginBottom: "20px", color: "#111", fontWeight: 700 }}>Previous Order History</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #eaeaea", backgroundColor: "#f9fafb" }}>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>OrderId</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>Date</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>Total</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((histOrder, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eaeaea" }}>
                          <td style={{ padding: "16px", fontSize: "0.85rem", fontWeight: 600, color: "#111" }}>
                            <button
                              type="button"
                              onClick={() => {
                                setQueryInput(histOrder.orderId);
                                fetchOrderData(histOrder.orderId);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#4b5563',
                                cursor: 'pointer',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                padding: 0
                              }}
                            >
                              {histOrder.orderId}
                            </button>
                          </td>
                          <td style={{ padding: "16px", fontSize: "0.85rem", color: "#4b5563" }}>{new Date(histOrder.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: "16px", fontSize: "0.85rem", fontWeight: 700 }}>₹{histOrder.totalAmount.toLocaleString("en-IN")}.00</td>
                          <td style={{ padding: "16px", fontSize: "0.85rem" }}>
                            <span style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              fontSize: "0.75rem", 
                              fontWeight: 700, 
                              backgroundColor: histOrder.status === "Delivered" ? "#d1fae5" : histOrder.status === "Cancelled" ? "#fee2e2" : "#fef3c7",
                              color: histOrder.status === "Delivered" ? "#065f46" : histOrder.status === "Cancelled" ? "#991b1b" : "#92400e",
                              display: "inline-block"
                            }}>
                              {histOrder.status === "Cancelled" && histOrder.deletedByAdmin ? "Cancelled by owner" : histOrder.status}
                            </span>
                            {histOrder.status === "Cancelled" && histOrder.cancellationReason && (
                              <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#7f1d1d', backgroundColor: '#fef2f2', padding: '4px 6px', borderRadius: '4px', borderLeft: '2px solid #ef4444' }}>
                                <span style={{ fontWeight: 600 }}>Reason:</span> {histOrder.cancellationReason}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </div>
            );
          })()}
        </div>
      </main>

      {/* Return Request Damage Popup Modal */}
      {showReturnModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#1e293b" }}>
                REQUEST RETURN FOR DAMAGE
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setProofImages([]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 0,
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitReturnRequest} style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px", overflowY: "auto", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                    Resolution Preference
                  </label>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                      <input 
                        type="radio" 
                        name="returnType" 
                        value="Replacement" 
                        checked={returnType === "Replacement"} 
                        onChange={() => setReturnType("Replacement")}
                        style={{ accentColor: primaryColor, width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      Exchange / Replacement
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                      <input 
                        type="radio" 
                        name="returnType" 
                        value="Refund" 
                        checked={returnType === "Refund"} 
                        onChange={() => setReturnType("Refund")}
                        style={{ accentColor: primaryColor, width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      Refund
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                    Reason for Return (Explain transit damage)
                  </label>
                  <textarea
                    required
                    placeholder="e.g. Received bottle broken inside the package during transit..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.88rem",
                      color: "#0f172a",
                      minHeight: "100px",
                      resize: "vertical",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                    Upload Proof Images of Damage
                  </label>
                  
                  {/* Upload Trigger button */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <label style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      backgroundColor: "#f1f5f9",
                      border: "1px dashed #cbd5e1",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#475569",
                      cursor: isUploading ? "not-allowed" : "pointer",
                      transition: "all 0.2s"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                      {isUploading ? "Uploading..." : "Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleReturnImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>

                  {/* Uploaded images display list */}
                  {proofImages.length > 0 && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                      {proofImages.map((url, idx) => (
                        <div key={idx} style={{ position: "relative", width: "70px", height: "70px", borderRadius: "6px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                          <img src={url} alt="Proof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => handleRemoveProofImage(idx)}
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Action buttons Footer */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                padding: "16px 24px",
                borderTop: "1px solid #f1f5f9",
                backgroundColor: "#ffffff",
                flexShrink: 0
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowReturnModal(false);
                    setReturnReason("");
                    setProofImages([]);
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReturning || isUploading || returnReason.trim().length === 0 || proofImages.length === 0}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    backgroundColor: (isReturning || isUploading || returnReason.trim().length === 0 || proofImages.length === 0) ? "#000000" : (primaryColor && primaryColor !== "#ffffff" && primaryColor !== "#fafafa" && primaryColor !== "#f9fafb" ? primaryColor : "#000000"),
                    opacity: (isReturning || isUploading || returnReason.trim().length === 0 || proofImages.length === 0) ? 0.4 : 1,
                    color: "#ffffff",
                    cursor: (isReturning || isUploading || returnReason.trim().length === 0 || proofImages.length === 0) ? "not-allowed" : "pointer"
                  }}
                >
                  {isReturning ? "Submitting..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cart Slider Drawer Overlay */}
      {showCartDrawer && (
        <div className={`${styles.cartOverlay} ${isCartClosing ? styles.cartOverlayClosing : ""}`} onClick={handleCloseCart}>
          <div className={`${styles.cartDrawer} ${isCartClosing ? styles.cartDrawerClosing : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartDrawerHeader}>
              <div className={styles.cartHeaderLeft}>
                <span>CART</span>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className={styles.cartCountBadge}>
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button 
                aria-label="Close cart" 
                className={styles.closeCartBtn} 
                onClick={handleCloseCart}
              >
                ✕
              </button>
            </div>
            {cartError && (
              <div style={{ backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', color: '#dc2626', padding: '12px', fontSize: '0.85rem', borderRadius: '4px', margin: '15px 20px 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{cartError}</span>
              </div>
            )}

            {cartItems.length > 0 ? (
              <div className={styles.cartDrawerBody}>
                <div className={styles.cartItemsList}>
                  {cartItems.map((item, index) => (
                    <div key={`${item._id}-${item.size}`} className={styles.cartItemRow}>
                      <img src={item.imageFront} alt={item.name} className={styles.cartItemImg} loading="lazy" />
                      <div className={styles.cartItemInfo}>
                        <div className={styles.cartItemHeaderRow}>
                          <h4 className={styles.cartItemName}>{item.name.toUpperCase()}</h4>
                          <div style={{ fontWeight: 400, color: "#111827", fontSize: "1rem", whiteSpace: "nowrap", marginLeft: "10px" }}>
                            ₹ {(item.price * item.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <p className={styles.cartItemSize} style={{ marginTop: "4px" }}>{item.size}</p>
                        
                        <div className={styles.cartItemPriceBlock} style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px", marginBottom: "8px" }}>
                          {item.strikePrice && item.strikePrice > item.price ? (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ color: "#ef4444", fontSize: "0.85em", fontWeight: 400 }}>
                                  -{Math.round(((item.strikePrice - item.price) / item.strikePrice) * 100)}%
                                </span>
                                <span style={{ fontWeight: 400, color: "#111827", fontSize: "1rem" }}>
                                  ₹ {item.price.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <span style={{ color: "#9ca3af", fontSize: "0.8em" }}>
                                M.R.P: <del>₹ {item.strikePrice.toLocaleString("en-IN")}</del>
                              </span>
                            </>
                          ) : (
                            <span style={{ fontWeight: 400, color: "#111827", fontSize: "1rem" }}>
                              ₹ {item.price.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        
                        <div className={styles.cartItemControlsRow}>
                          <div className={styles.qtyControlRow}>
                            <button onClick={() => updateQuantity(index, item.quantity - 1)} className={styles.qtyBtn}>−</button>
                            <span className={styles.qtyVal}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, item.quantity + 1)} className={styles.qtyBtn}>+</button>
                          </div>
                          
                          <button onClick={() => updateQuantity(index, 0)} className={styles.removeCartItemBtn} title="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 16, height: 16 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.cartDrawerFooter}>
                  <div className={styles.cartDrawerDivider}></div>
                  

                  
                  <div className={styles.totalContainer}>
                    <span className={styles.totalTitle}>Estimated total</span>
                    <span className={styles.totalVal}>Rs. {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("en-IN")}.00</span>
                  </div>
                  
                  <p className={styles.taxSubtext}>
                    Duties and taxes included. Shipping is calculated at checkout.
                  </p>
                  
                  <button className={styles.checkoutBtn} onClick={initiateCheckout}>
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.cartDrawerEmpty}>
                <h2 className={styles.cartEmptyHeading}>YOUR CART IS EMPTY</h2>
                <p className={styles.cartEmptySubtext}>
                  Have an account? <Link href="/login" className={styles.cartLoginLink} onClick={handleCloseCart}>Log in</Link> to check out faster.
                </p>
                <button className={styles.continueBtn} onClick={handleCloseCart}>
                  Continue shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCheckoutDrawer && (
        <CheckoutDrawer 
          isOpen={showCheckoutDrawer} 
          onClose={() => setShowCheckoutDrawer(false)} 
          cartItems={cartItems}
          primaryColor={primaryColor}
          onOrderSuccess={(orderId, orderDetails) => {
            setShowCheckoutDrawer(false);
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));
            setCompletedOrderId(orderId);
            setCompletedOrderDetails(orderDetails);
            setShowSuccessModal(true);
          }}
        />
      )}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        orderId={completedOrderId}
        orderDetails={completedOrderDetails}
        onClose={() => setShowSuccessModal(false)}
        primaryColor={primaryColor}
      />

      {/* Custom Order Cancel Confirmation Modal */}
      {showCancelConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCancelConfirmModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Cancel Order</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowCancelConfirmModal(false)}>✕</button>
            </div>
            <p className={styles.modalBodyText}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className={styles.modalFooterBtns}>
              <button className={styles.modalCancelBtn} onClick={() => setShowCancelConfirmModal(false)}>
                Keep Order
              </button>
              <button className={styles.modalConfirmBtn} onClick={confirmOrderCancellation}>
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
