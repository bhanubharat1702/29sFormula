'use client';

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import styles from "./CheckoutDrawer.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckbox";
import { getAppliedCoupon } from "@/utils/cartSync";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Already loaded
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    // Script tag may already be injected (e.g. hot reload) — wait for it
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    const waitForRazorpay = (timeout: number) => {
      const start = Date.now();
      const poll = () => {
        if ((window as any).Razorpay) {
          resolve(true);
        } else if (Date.now() - start > timeout) {
          resolve(false);
        } else {
          setTimeout(poll, 100);
        }
      };
      poll();
    };

    if (existingScript) {
      // Script already in DOM, just wait for window.Razorpay
      waitForRazorpay(8000);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      // Give Razorpay a moment to initialize on the window object
      waitForRazorpay(5000);
    };
    script.onerror = () => {
      // Retry once after 1 second (handles transient network hiccups)
      setTimeout(() => {
        const retryScript = document.createElement("script");
        retryScript.src = "https://checkout.razorpay.com/v1/checkout.js";
        retryScript.async = true;
        retryScript.onload = () => waitForRazorpay(5000);
        retryScript.onerror = () => resolve(false);
        document.body.appendChild(retryScript);
      }, 1000);
    };
    document.body.appendChild(script);
  });
};

interface CartItem {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  size: string;
  quantity: number;
  imageFront?: string;
}

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  primaryColor: string;
  onOrderSuccess: (orderId: string, orderDetails: any) => void;
}

export default function CheckoutDrawer({ isOpen, onClose, cartItems, primaryColor, onOrderSuccess }: CheckoutDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autofillInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);
  const [isSuccessExiting, setIsSuccessExiting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const parseSavedAddress = (fullAddress: any) => {
    if (!fullAddress) return { address: "", city: "", stateVal: "", pinCode: "" };
    if (typeof fullAddress === 'object') {
      return {
        address: fullAddress.address || fullAddress.street || fullAddress.addressLine1 || "",
        city: fullAddress.city || "",
        stateVal: fullAddress.state || fullAddress.stateVal || "",
        pinCode: fullAddress.pincode || fullAddress.pinCode || fullAddress.zip || ""
      };
    }
    let str = String(fullAddress).trim();
    if (!str) return { address: "", city: "", stateVal: "", pinCode: "" };

    // Try parsing if it's a JSON string
    if (str.startsWith("{") && str.endsWith("}")) {
      try {
        const obj = JSON.parse(str);
        if (obj && typeof obj === 'object') {
          return {
            address: obj.address || obj.street || obj.addressLine1 || "",
            city: obj.city || "",
            stateVal: obj.state || obj.stateVal || "",
            pinCode: obj.pincode || obj.pinCode || obj.zip || ""
          };
        }
      } catch (e) { }
    }

    // Extract 6-digit Indian pincode from the end (e.g. "- 400706" or "400706")
    let pinCode = "";
    const pinMatch = str.match(/(?:-\s*|\s+)(\d{6})\s*$/);
    if (pinMatch) {
      pinCode = pinMatch[1];
      str = str.replace(/(?:-\s*|\s+)\d{6}\s*$/, "").trim();
    }

    // Split remaining string by comma
    const parts = str.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      const stateVal = parts.pop() || "";
      const city = parts.pop() || "";
      const address = parts.join(", ");
      return { address, city, stateVal, pinCode };
    } else if (parts.length === 2) {
      return { address: parts[0], city: parts[1], stateVal: "", pinCode };
    } else {
      return { address: str, city: "", stateVal: "", pinCode };
    }
  };

  const applyCustomerDetails = (data: any) => {
    if (data.name) setName(data.name);
    if (data.email) setEmail(data.email);
    if (data.phone) setPhone(data.phone);
    if (data.address) {
      const parsed = parseSavedAddress(data.address);
      if (parsed.address) setAddress(parsed.address);
      if (parsed.city) setCity(parsed.city);
      if (parsed.stateVal) setStateVal(parsed.stateVal);
      if (parsed.pinCode) setPinCode(parsed.pinCode);
    }
  };

  // Prevent background scrolling when checkout popup is open
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setError(null);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      const session = localStorage.getItem("userSession");
      if (session) {
        try {
          const user = JSON.parse(session);
          setLoggedInUser(user);
          if (user.name) setName(user.name);
          if (user.email) setEmail(user.email);
          if (user.phone) setPhone(user.phone);
          if (user.address) {
            const parsed = parseSavedAddress(user.address);
            if (parsed.address) setAddress(parsed.address);
            if (parsed.city) setCity(parsed.city);
            if (parsed.stateVal) setStateVal(parsed.stateVal);
            if (parsed.pinCode) setPinCode(parsed.pinCode);
          }

          // Always fetch latest customer profile from backend to ensure cross-device consistency
          if (user.email) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/search?query=${encodeURIComponent(user.email)}`)
              .then(res => {
                if (res.ok) return res.json();
                throw new Error("Not found");
              })
              .then(data => {
                applyCustomerDetails(data);
              })
              .catch(err => console.log("No previous details found for autofill", err));
          }
        } catch (e) {
          console.error("Error parsing userSession:", e);
        }
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const activeCoupon = getAppliedCoupon();
      if (activeCoupon) {
        setAppliedCouponCode(activeCoupon.code);
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        let calcDiscount = 0;
        if (activeCoupon.type === 'percentage') {
          calcDiscount = Math.floor(subtotal * (activeCoupon.value / 100));
        } else {
          calcDiscount = activeCoupon.value;
        }
        setDiscount(calcDiscount);
      } else {
        setAppliedCouponCode(null);
        setDiscount(0);
      }
    }
  }, [isOpen, cartItems]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && data.brandLogoValue) {
            setBrandLogoValue(data.brandLogoValue);
          }
        })
        .catch(err => console.error("Error querying settings for checkout drawer:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = Math.max(0, subtotalAmount - discount);

  const handleAutoFetchAddress = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error("Failed to fetch address");

          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;

            const fetchedCity = addr.city || addr.town || addr.village || addr.county || "";
            if (fetchedCity) setCity(fetchedCity);

            const fetchedState = addr.state || "";
            if (fetchedState) setStateVal(fetchedState);

            const fetchedPin = addr.postcode || "";
            if (fetchedPin) setPinCode(fetchedPin);

            const road = addr.road || addr.suburb || "";
            const house = addr.house_number || "";
            const fullStreet = [house, road].filter(Boolean).join(", ");
            if (fullStreet) setAddress(fullStreet);
          }
        } catch (err) {
          console.error(err);
          setError("Could not automatically fetch your address. Please enter it manually.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (err) => {
        setIsFetchingLocation(false);
        setError("Location access denied or unavailable. Please enter your address manually.");
      }
    );
  };

  const handleAutofill = async () => {
    if (!searchQuery.trim() || !searchQuery.includes('@')) {
      setSearchError("Please enter a valid email address.");
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setSearchSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/request-autofill-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchQuery.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to request OTP.");
      }

      setOtpSent(true);
      setSearchSuccess("OTP sent successfully! Please check your email.");
      setTimeout(() => setSearchSuccess(null), 4000);
    } catch (err: any) {
      setSearchError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue.trim() || otpValue.trim().length !== 6) {
      setSearchError("Please enter a valid 6 Digit OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    setSearchError(null);
    setSearchSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/verify-autofill-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchQuery.trim(), otp: otpValue.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP.");
      }

      applyCustomerDetails(data);

      setIsSuccessExiting(false);
      setSearchSuccess(`Welcome back ${data.name}! Your details have been autofilled.`);
      setTimeout(() => {
        setIsSuccessExiting(true);
        setTimeout(() => {
          setSearchSuccess(null);
          setIsSuccessExiting(false);
        }, 500);
      }, 4000);

      // Hide OTP block after successful verification
      setTimeout(() => setIsReturningCustomer(false), 2000);

    } catch (err: any) {
      setSearchError(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const updateUserSessionOnOrder = (payload: any) => {
    try {
      const existing = localStorage.getItem("userSession");
      const sessionObj = existing ? JSON.parse(existing) : {};
      sessionObj.name = payload.customerName || sessionObj.name;
      sessionObj.email = payload.customerEmail || sessionObj.email;
      sessionObj.phone = payload.customerPhone || sessionObj.phone;
      sessionObj.address = payload.shippingAddress || sessionObj.address;
      localStorage.setItem("userSession", JSON.stringify(sessionObj));
    } catch (e) {
      console.error("Error updating userSession:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !stateVal || !pinCode) {
      setError("Please fill out all shipping details.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const orderPayload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: `${address}, ${city}, ${stateVal} - ${pinCode}`,
      cartItems: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.imageFront || ""
      })),
      totalAmount,
      paymentMethod
    };

    try {
      if (["Razorpay", "UPI", "Cards", "Net Banking"].includes(paymentMethod)) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Razorpay SDK failed to load. Are you online?");
        }

        const initRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/razorpay-init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalAmount, cartItems: orderPayload.cartItems })
        });

        if (!initRes.ok) {
          const errData = await initRes.json().catch(() => null);
          throw new Error(errData?.error || "Failed to initialize payment");
        }
        const initData = await initRes.json();
        if (!initData.order_id) throw new Error("Invalid payment initialization");

        const options = {
          key: "rzp_test_TQPDhHLa4xiz9t", // Test API Key
          amount: initData.amount,
          currency: initData.currency,
          name: brandLogoValue || "29sFORMULA",
          description: "Fine Artisan Perfumery",
          order_id: initData.order_id,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/razorpay-verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  orderPayload
                })
              });

              if (!verifyRes.ok) throw new Error("Payment verification failed");
              const verifyData = await verifyRes.json();
              if (verifyData.success && verifyData.orderId) {
                updateUserSessionOnOrder(orderPayload);
                setIsSubmitting(false);
                onOrderSuccess(verifyData.orderId, { ...orderPayload, orderId: verifyData.orderId });
              }
            } catch (err: any) {
              setError(err.message || "Payment verification failed.");
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: phone
          },
          theme: {
            color: primaryColor
          },
          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay via UPI",
                  instruments: [
                    { method: "upi" }
                  ]
                },
                other: {
                  name: "Other Payment Modes",
                  instruments: [
                    { method: "card" },
                    { method: "netbanking" },
                    { method: "wallet" }
                  ]
                }
              },
              sequence: ["block.upi", "block.other"],
              preferences: {
                show_default_blocks: false
              }
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setError("Payment failed. Please try again.");
          setIsSubmitting(false);
        });
        rzp.open();
        // Do not set isSubmitting(false) here, it will be handled by the handler or error event

      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Failed to place order. Please try again.");
        }

        const data = await res.json();
        if (data && data.orderId) {
          updateUserSessionOnOrder(orderPayload);
          onOrderSuccess(data.orderId, data);
        } else {
          throw new Error("Invalid order response from server.");
        }
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit checkout.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} data-lenis-prevent="true">
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()} style={{ '--primary-color': primaryColor, position: 'relative' } as React.CSSProperties}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}
        />
        <div className={styles.header}>
          <h2>CHECKOUT</h2>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.scrollContent}>

            {/* Returning Customer Section */}
            {!loggedInUser && (
              <div className={styles.section} style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <CustomCheckbox
                  checked={isReturningCustomer}
                  onChange={(e) => setIsReturningCustomer(e.target.checked)}
                  label={<span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#000000" }}>Are you a returning customer? Autofill your details!</span>}
                  style={{ '--checkbox-color': '#000' } as React.CSSProperties}
                />

                {isReturningCustomer && (
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {!otpSent ? (
                      <>
                        <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>Enter your registered email address to verify and load your shipping details.</p>
                        <div className={styles.inputRow}>
                          <input
                            ref={autofillInputRef}
                            type="email"
                            placeholder="Email Address"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.input}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={handleAutofill}
                            disabled={isSearching}
                            style={{
                              backgroundColor: "#000",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "10px 16px",
                              fontWeight: 400,
                              cursor: isSearching ? "not-allowed" : "pointer",
                              opacity: isSearching ? 0.7 : 1,
                              minWidth: "100px"
                            }}
                          >
                            {isSearching ? "Sending..." : "Get OTP"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>Enter the 6 Digit verification code sent to <strong>{searchQuery}</strong>.</p>
                        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                          <div className={styles.inputRow}>
                            <input
                              type="text"
                              placeholder="6 Digit OTP"
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value)}
                              maxLength={6}
                              className={styles.input}
                              style={{ flex: 1, letterSpacing: "2px", textAlign: "center", fontWeight: "normal" }}
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp}
                              style={{
                                backgroundColor: "#000",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "10px 16px",
                                fontWeight: 400,
                                cursor: isVerifyingOtp ? "not-allowed" : "pointer",
                                opacity: isVerifyingOtp ? 0.7 : 1,
                                minWidth: "120px"
                              }}
                            >
                              {isVerifyingOtp ? "Verifying..." : "Verify & Autofill"}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtpValue("");
                              setSearchError(null);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#4b5563",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              textDecoration: "underline",
                              alignSelf: "flex-start",
                              padding: 0
                            }}
                          >
                            Change Email Address
                          </button>
                        </div>
                      </>
                    )}
                    {searchError && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{searchError}</p>}
                    {searchSuccess && (
                      <div className={`${styles.successAlert} ${isSuccessExiting ? styles.slideOut : ''}`}>
                        <span>{searchSuccess}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact Details */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.section}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Delivery Address</h3>
                <button
                  type="button"
                  onClick={handleAutoFetchAddress}
                  disabled={isFetchingLocation}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: `1px solid #000`,
                    color: "#000",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: isFetchingLocation ? "not-allowed" : "pointer",
                    opacity: isFetchingLocation ? 0.7 : 1
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {isFetchingLocation ? "Fetching..." : "Auto Fetch"}
                </button>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>State</label>
                  <input
                    type="text"
                    required
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>PIN Code</label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Payment Method</h3>
              <div className={styles.paymentOptions}>

                <label className={`${styles.paymentLabel} ${paymentMethod === "UPI" ? styles.paymentLabelActive : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.radioInput}
                  />
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentName}>UPI</span>
                    <span className={styles.paymentDesc}>Pay instantly using UPI Apps.</span>
                  </div>
                </label>

                <label className={`${styles.paymentLabel} ${paymentMethod === "Cards" ? styles.paymentLabelActive : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Cards"
                    checked={paymentMethod === "Cards"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.radioInput}
                  />
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentName}>Credit / Debit Cards</span>
                    <span className={styles.paymentDesc}>Pay securely with your card.</span>
                  </div>
                </label>

                <label className={`${styles.paymentLabel} ${paymentMethod === "Net Banking" ? styles.paymentLabelActive : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Net Banking"
                    checked={paymentMethod === "Net Banking"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.radioInput}
                  />
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentName}>Net Banking</span>
                    <span className={styles.paymentDesc}>All major banks supported.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary details */}
            <div className={styles.summarySection}>
              <h3 className={styles.sectionTitle}>Order Summary</h3>
              <div className={styles.summaryList}>
                {cartItems.map((item, index) => (
                  <div key={index} className={styles.summaryItemRow}>
                    <span className={styles.itemName}>
                      {item.name} <span className={styles.itemSize}>({item.size})</span> x {item.quantity}
                    </span>
                    <div className={styles.itemPrice} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {item.strikePrice && item.strikePrice > item.price && (
                        <del style={{ color: "#ef4444", fontSize: "0.85em" }}>
                          ₹{(item.strikePrice * item.quantity).toLocaleString("en-IN")}.00
                        </del>
                      )}
                      <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.shippingRow}>
                <span>Shipping Fee</span>
                <span className={styles.freeBadge}>FREE</span>
              </div>
              {discount > 0 && (
                <div className={styles.discountRow}>
                  <span>Coupon {appliedCouponCode ? `(${appliedCouponCode})` : ''}</span>
                  <span className={styles.discountAmount}>-₹{discount.toLocaleString("en-IN")}.00</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span className={styles.totalVal}>₹{totalAmount.toLocaleString("en-IN")}.00</span>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="submit" disabled={isSubmitting || !(name.trim() && email.trim() && phone.trim() && address.trim() && city.trim() && stateVal.trim() && pinCode.trim())} className={styles.submitBtn}>
              {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
