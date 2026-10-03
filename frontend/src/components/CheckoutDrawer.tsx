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

const loadExternalScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
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

  // Gateway Modal & Card States
  const [activeGatewayModal, setActiveGatewayModal] = useState<'stripe' | 'paypal' | 'phonepe' | 'paytm' | null>(null);
  const [gatewayData, setGatewayData] = useState<any>(null);
  const [pendingOrderPayload, setPendingOrderPayload] = useState<any>(null);

  // Stripe Card Input state
  const [stripeCardName, setStripeCardName] = useState("");
  const [stripeCardNumber, setStripeCardNumber] = useState("");
  const [stripeCardExp, setStripeCardExp] = useState("");
  const [stripeCardCvc, setStripeCardCvc] = useState("");
  const [isProcessingGateway, setIsProcessingGateway] = useState(false);

  // PhonePe / Paytm Mock/UPI state
  const [upiIdInput, setUpiIdInput] = useState("");

  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("");
  const [storeBusinessName, setStoreBusinessName] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);
  const [isSuccessExiting, setIsSuccessExiting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Saved Address Book state
  interface SavedAddressItem {
    _id?: string;
    label?: string;
    address: string;
    city: string;
    stateVal: string;
    pinCode: string;
    isDefault?: boolean;
  }

  const [savedAddresses, setSavedAddresses] = useState<SavedAddressItem[]>([]);
  const [activeAddress, setActiveAddress] = useState<SavedAddressItem | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [isAddressMode, setIsAddressMode] = useState<'summary' | 'list' | 'form'>('form');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [saveAddressForFuture, setSaveAddressForFuture] = useState<boolean>(true);
  const [newAddressLabel, setNewAddressLabel] = useState<string>("Home");

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

    let pinCode = "";
    const pinMatch = str.match(/(?:-\s*|\s+)(\d{6})\s*$/);
    if (pinMatch) {
      pinCode = pinMatch[1];
      str = str.replace(/(?:-\s*|\s+)\d{6}\s*$/, "").trim();
    }

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

    if (data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
      setSavedAddresses(data.addresses);
      const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
      if (defaultAddr) {
        const idStr = String(defaultAddr._id || defaultAddr.label || "0");
        setSelectedAddressId(idStr);
        setActiveAddress(defaultAddr);
        setAddress(defaultAddr.address || "");
        setCity(defaultAddr.city || "");
        setStateVal(defaultAddr.stateVal || "");
        setPinCode(defaultAddr.pinCode || "");
        setIsAddressMode('summary');
      } else {
        setIsAddressMode('form');
      }
    } else if (data.address) {
      const parsed = parseSavedAddress(data.address);
      if (parsed.address) {
        const singleAddr: SavedAddressItem = {
          _id: "default_1",
          label: "Home",
          address: parsed.address,
          city: parsed.city || "",
          stateVal: parsed.stateVal || "",
          pinCode: parsed.pinCode || "",
          isDefault: true
        };
        setSavedAddresses([singleAddr]);
        setSelectedAddressId("default_1");
        setActiveAddress(singleAddr);
        setAddress(parsed.address);
        if (parsed.city) setCity(parsed.city);
        if (parsed.stateVal) setStateVal(parsed.stateVal);
        if (parsed.pinCode) setPinCode(parsed.pinCode);
        setIsAddressMode('summary');
      } else {
        setIsAddressMode('form');
      }
    } else {
      setIsAddressMode('form');
    }
  };

  const handleSelectSavedAddress = (addr: SavedAddressItem) => {
    const idStr = String(addr._id || addr.label || "0");
    setSelectedAddressId(idStr);
    setActiveAddress(addr);
    setAddress(addr.address || "");
    setCity(addr.city || "");
    setStateVal(addr.stateVal || "");
    setPinCode(addr.pinCode || "");
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId("new");
    setActiveAddress(null);
    setEditingAddressId(null);
    setAddress("");
    setCity("");
    setStateVal("");
    setPinCode("");
  };

  const handleDeleteSavedAddress = async (e: React.MouseEvent, addrId?: string) => {
    e.stopPropagation();
    if (!addrId || !email) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/addresses/${addrId}?email=${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.addresses || [];
        setSavedAddresses(updated);
        if (selectedAddressId === addrId) {
          if (updated.length > 0) {
            handleSelectSavedAddress(updated[0]);
            setIsAddressMode('summary');
          } else {
            handleSelectNewAddress();
            setIsAddressMode('form');
          }
        }
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
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

  const [activeGateway, setActiveGateway] = useState<string>("razorpay");
  const [storeRazorpayKeyId, setStoreRazorpayKeyId] = useState<string>("");
  const [codEnabled, setCodEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/payment-config`, { cache: 'no-store' })
        .then(res => res.json())
        .then(config => {
          if (config) {
            if (config.activeGateway) {
              setActiveGateway(config.activeGateway.toLowerCase());
              setPaymentMethod(config.activeGateway.toLowerCase());
            }
            if (config.razorpayKeyId) setStoreRazorpayKeyId(config.razorpayKeyId);
            if (config.codEnabled !== undefined) setCodEnabled(config.codEnabled);
          }
        })
        .catch(err => console.error("Error querying payment config:", err));

      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.brandLogoValue) setBrandLogoValue(data.brandLogoValue);
            const sName = data.storeDetails?.businessName || data.businessName || "";
            if (sName) setStoreBusinessName(sName);
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

    if (editingAddressId && email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/addresses/${editingAddressId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          label: newAddressLabel || "Home",
          address,
          city,
          stateVal,
          pinCode
        })
      }).catch(err => console.error("Error updating address:", err));
    } else if (saveAddressForFuture && email && selectedAddressId === "new") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/customers/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          label: newAddressLabel || "Home",
          address,
          city,
          stateVal,
          pinCode,
          isDefault: savedAddresses.length === 0
        })
      }).catch(err => console.error("Error saving address for future:", err));
    }

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
      subtotal: subtotalAmount,
      discountCode: appliedCouponCode || "",
      discountAmount: discount,
      shippingCharge: 0,
      taxAmount: 0,
      totalAmount,
      paymentMethod
    };

    try {
      if (paymentMethod !== "COD") {
        const initRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/payment/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: orderPayload.cartItems,
            discountCode: appliedCouponCode || "",
            gateway: activeGateway
          })
        });

        if (!initRes.ok) {
          const errData = await initRes.json().catch(() => null);
          throw new Error(errData?.error || "Failed to initialize payment");
        }

        const initData = await initRes.json();
        setPendingOrderPayload(orderPayload);
        setGatewayData(initData);

        if (initData.gateway === "razorpay") {
          const isLoaded = await loadRazorpayScript();
          if (!isLoaded) {
            throw new Error("Razorpay SDK failed to load. Are you online?");
          }

          const options = {
            key: initData.key_id || storeRazorpayKeyId || "rzp_test_TQPDhHLa4xiz9t",
            amount: initData.amount,
            currency: initData.currency,
            name: storeBusinessName || (brandLogoValue && !brandLogoValue.startsWith("http") ? brandLogoValue : "MY STORE"),
            image: (brandLogoValue && (brandLogoValue.startsWith("http") || brandLogoValue.startsWith("/") || brandLogoValue.startsWith("data:"))) ? brandLogoValue : undefined,
            description: "E-Commerce Checkout",
            order_id: initData.order_id,
            handler: async function (response: any) {
              try {
                const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/payment/verify`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    gateway: "razorpay",
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
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function () {
            setError("Payment failed. Please try again.");
            setIsSubmitting(false);
          });
          rzp.open();
        } else if (initData.gateway === "stripe") {
          // Load Stripe SDK
          await loadExternalScript("https://js.stripe.com/v3/");
          setIsSubmitting(false);
          setActiveGatewayModal("stripe");
        } else if (initData.gateway === "paypal") {
          if (initData.clientId) {
            await loadExternalScript(`https://www.paypal.com/sdk/js?client-id=${initData.clientId}&currency=USD`);
          }
          setIsSubmitting(false);
          setActiveGatewayModal("paypal");
        } else if (initData.gateway === "phonepe") {
          if (initData.redirectUrl) {
            window.location.href = initData.redirectUrl;
            return;
          }
          setIsSubmitting(false);
          setActiveGatewayModal("phonepe");
        } else if (initData.gateway === "paytm") {
          if (initData.paytmUrl && initData.paytmParams) {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = initData.paytmUrl;
            Object.keys(initData.paytmParams).forEach((key) => {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = initData.paytmParams[key];
              form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
            return;
          }
          setIsSubmitting(false);
          setActiveGatewayModal("paytm");
        }
      } else {
        // Cash on Delivery Order
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

  const handleVerifyGatewayOrder = async (verificationBody: any) => {
    setIsProcessingGateway(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/orders/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...verificationBody,
          orderPayload: pendingOrderPayload
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Payment verification failed");
      }

      const verifyData = await res.json();
      if (verifyData.success && verifyData.orderId) {
        updateUserSessionOnOrder(pendingOrderPayload);
        setActiveGatewayModal(null);
        setIsProcessingGateway(false);
        onOrderSuccess(verifyData.orderId, { ...pendingOrderPayload, orderId: verifyData.orderId });
      } else {
        throw new Error("Payment authorization was not successful.");
      }
    } catch (err: any) {
      setError(err.message || "Payment verification failed.");
      setIsProcessingGateway(false);
    }
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeCardNumber || !stripeCardExp || !stripeCardCvc) {
      setError("Please fill out complete card details.");
      return;
    }

    setIsProcessingGateway(true);
    setError(null);

    try {
      if ((window as any).Stripe && gatewayData?.publishableKey && gatewayData?.clientSecret) {
        const stripe = (window as any).Stripe(gatewayData.publishableKey);
        const result = await stripe.confirmCardPayment(gatewayData.clientSecret, {
          payment_method: {
            card: {
              number: stripeCardNumber.replace(/\s+/g, ""),
              exp_month: parseInt(stripeCardExp.split("/")[0] || "12", 10),
              exp_year: parseInt(stripeCardExp.split("/")[1] || "28", 10),
              cvc: stripeCardCvc
            },
            billing_details: {
              name: stripeCardName || name,
              email,
              phone
            }
          }
        }).catch(() => null);

        if (result?.error) {
          throw new Error(result.error.message || "Card confirmation failed");
        }

        if (result?.paymentIntent && (result.paymentIntent.status === "succeeded" || result.paymentIntent.status === "requires_capture")) {
          await handleVerifyGatewayOrder({
            gateway: "stripe",
            stripe_payment_intent_id: result.paymentIntent.id
          });
          return;
        }
      }

      // If test mode or fallback sandbox without direct Stripe SDK client confirmation
      await handleVerifyGatewayOrder({
        gateway: "stripe",
        stripe_payment_intent_id: gatewayData?.paymentIntentId || `pi_mock_${Date.now()}`
      });
    } catch (err: any) {
      setError(err.message || "Failed to process Stripe card payment");
      setIsProcessingGateway(false);
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

              {/* Amazon-style Address Modes: summary | list | form */}

              {/* Mode A: Summary Card */}
              {isAddressMode === 'summary' && (
                <div className={styles.addressSummaryCard}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: "0 0 2px 0", color: "#111827" }}>
                      Delivering to {name || 'Customer'}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#374151", margin: "0 0 4px 0" }}>
                      {activeAddress?.city || city}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: 0, lineHeight: 1.4 }}>
                      {activeAddress ? `${activeAddress.address}, ${activeAddress.city}, ${activeAddress.stateVal} - ${activeAddress.pinCode}` : `${address}, ${city}, ${stateVal} - ${pinCode}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddressMode('list')}
                    className={styles.changeAddressLink}
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Mode B: Saved Address List */}
              {isAddressMode === 'list' && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    Your Saved Addresses
                  </p>
                  <div className={styles.addressCardsGrid}>
                    {savedAddresses.map((addr) => {
                      const addrId = String(addr._id || addr.label || "0");
                      const isSelected = selectedAddressId === addrId;
                      return (
                        <div
                          key={addrId}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`${styles.addressCard} ${isSelected ? styles.selectedAddressCard : ''}`}
                        >
                          <input
                            type="radio"
                            name="selectedAddressList"
                            checked={isSelected}
                            onChange={() => handleSelectSavedAddress(addr)}
                            style={{ accentColor: "#000", marginTop: "3px", cursor: "pointer" }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                              <span className={styles.addressLabelBadge}>{addr.label || "Home"}</span>
                              {addr.isDefault && (
                                <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#10b981", backgroundColor: "#ecfdf5", padding: "1px 6px", borderRadius: "4px" }}>
                                  Default
                                </span>
                              )}
                            </div>
                            <p className={styles.addressText}>
                              {addr.address}{addr.city ? `, ${addr.city}` : ''}{addr.stateVal ? `, ${addr.stateVal}` : ''}{addr.pinCode ? ` - ${addr.pinCode}` : ''}
                            </p>

                            {/* Action Buttons on Selected Card */}
                            {isSelected && (
                              <div className={styles.addressActionButtons}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSelectSavedAddress(addr);
                                    setIsAddressMode('summary');
                                  }}
                                  className={styles.deliverHereBtn}
                                >
                                  Deliver to this address
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAddressId(String(addr._id || ""));
                                    setSelectedAddressId(String(addr._id || ""));
                                    setAddress(addr.address || "");
                                    setCity(addr.city || "");
                                    setStateVal(addr.stateVal || "");
                                    setPinCode(addr.pinCode || "");
                                    setNewAddressLabel(addr.label || "Home");
                                    setIsAddressMode('form');
                                  }}
                                  className={styles.editAddrBtn}
                                >
                                  Edit address
                                </button>
                              </div>
                            )}
                          </div>

                          {addr._id && String(addr._id) !== "default_1" && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSavedAddress(e, String(addr._id))}
                              className={styles.deleteAddrBtn}
                              title="Delete address"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        handleSelectNewAddress();
                        setNewAddressLabel("Home");
                        setIsAddressMode('form');
                      }}
                      className={styles.addNewAddressBtn}
                    >
                      + Add a new delivery address
                    </button>
                  </div>
                </div>
              )}

              {/* Mode C: Address Form (No saved addresses OR adding new OR editing) */}
              {isAddressMode === 'form' && (
                <div>
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

                  {/* Auto-save & Label Options */}
                  <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <CustomCheckbox
                      id="saveAddressFuture"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      label="Save address for future checkouts"
                    />

                    {saveAddressForFuture && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4b5563" }}>Address Label:</label>
                        {["Home", "Work", "Other"].map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setNewAddressLabel(lbl)}
                            style={{
                              padding: "3px 10px",
                              borderRadius: "12px",
                              border: newAddressLabel === lbl ? "1.5px solid #000" : "1px solid #d1d5db",
                              backgroundColor: newAddressLabel === lbl ? "#000" : "#fff",
                              color: newAddressLabel === lbl ? "#fff" : "#374151",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    )}

                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (activeAddress) {
                            setIsAddressMode('summary');
                          } else {
                            setIsAddressMode('list');
                          }
                        }}
                        style={{
                          alignSelf: "flex-start",
                          background: "none",
                          border: "none",
                          color: "#6b7280",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          textDecoration: "underline",
                          marginTop: "8px",
                          padding: 0
                        }}
                      >
                        ← Cancel & Return to Saved Addresses
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Payment Method</h3>
              <div className={styles.paymentOptions}>

                {/* Online Payment Option corresponding to Merchant's chosen Active Gateway */}
                {activeGateway === "razorpay" && (
                  <label className={`${styles.paymentLabel} ${paymentMethod !== "COD" ? styles.paymentLabelActive : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod !== "COD"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Razorpay (UPI, Cards, Netbanking)</span>
                      <span className={styles.paymentDesc}>Pay securely with Google Pay, PhonePe, Paytm or Cards.</span>
                    </div>
                  </label>
                )}

                {activeGateway === "stripe" && (
                  <label className={`${styles.paymentLabel} ${paymentMethod !== "COD" ? styles.paymentLabelActive : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod !== "COD"}
                      onChange={() => setPaymentMethod("stripe")}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Stripe (Credit / Debit Cards)</span>
                      <span className={styles.paymentDesc}>Fast & 256-bit encrypted global card payments.</span>
                    </div>
                  </label>
                )}

                {activeGateway === "paypal" && (
                  <label className={`${styles.paymentLabel} ${paymentMethod !== "COD" ? styles.paymentLabelActive : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod !== "COD"}
                      onChange={() => setPaymentMethod("paypal")}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>PayPal Express Checkout</span>
                      <span className={styles.paymentDesc}>Pay conveniently with your PayPal balance or card.</span>
                    </div>
                  </label>
                )}

                {activeGateway === "phonepe" && (
                  <label className={`${styles.paymentLabel} ${paymentMethod !== "COD" ? styles.paymentLabelActive : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="phonepe"
                      checked={paymentMethod !== "COD"}
                      onChange={() => setPaymentMethod("phonepe")}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>PhonePe Payment Gateway</span>
                      <span className={styles.paymentDesc}>Direct UPI QR & PhonePe app payments.</span>
                    </div>
                  </label>
                )}

                {activeGateway === "paytm" && (
                  <label className={`${styles.paymentLabel} ${paymentMethod !== "COD" ? styles.paymentLabelActive : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paytm"
                      checked={paymentMethod !== "COD"}
                      onChange={() => setPaymentMethod("paytm")}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>PayTM Wallet & UPI</span>
                      <span className={styles.paymentDesc}>Instant checkout with PayTM Wallet and Netbanking.</span>
                    </div>
                  </label>
                )}

                {/* Cash on Delivery option if enabled by merchant */}
                {codEnabled !== false && (
                  <label className={`${styles.paymentLabel} ${paymentMethod === "COD" ? styles.paymentLabelActive : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className={styles.radioInput}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Cash on Delivery (COD)</span>
                      <span className={styles.paymentDesc}>Pay in cash upon doorstep delivery.</span>
                    </div>
                  </label>
                )}
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

        {/* --- INTERACTIVE PAYMENT GATEWAY MODALS --- */}
        {activeGatewayModal && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                  {activeGatewayModal === 'stripe' && 'Stripe Credit/Debit Card'}
                  {activeGatewayModal === 'paypal' && 'PayPal Express Checkout'}
                  {activeGatewayModal === 'phonepe' && 'PhonePe UPI & Wallet'}
                  {activeGatewayModal === 'paytm' && 'PayTM Wallet & Banking'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveGatewayModal(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#6b7280' }}
                >
                  ✕
                </button>
              </div>

              {error && (
                <div style={{ backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', color: '#dc2626', padding: '10px 12px', borderRadius: '4px', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {error}
                </div>
              )}

              {/* STRIPE CARD FORM MODAL */}
              {activeGatewayModal === 'stripe' && (
                <form onSubmit={handleStripeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '0.82rem', color: '#4b5563', margin: '0 0 4px 0' }}>
                    Amount to charge: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
                  </p>

                  <div className={styles.inputGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={stripeCardName}
                      onChange={(e) => setStripeCardName(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={stripeCardNumber}
                      onChange={(e) => setStripeCardNumber(e.target.value)}
                      maxLength={19}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputRow} style={{ gap: '10px' }}>
                    <div className={styles.inputGroup} style={{ margin: 0 }}>
                      <label className={styles.label}>Expires (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={stripeCardExp}
                        onChange={(e) => setStripeCardExp(e.target.value)}
                        maxLength={5}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup} style={{ margin: 0 }}>
                      <label className={styles.label}>CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={stripeCardCvc}
                        onChange={(e) => setStripeCardCvc(e.target.value)}
                        maxLength={4}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="submit"
                      disabled={isProcessingGateway}
                      style={{ flex: 1, backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', opacity: isProcessingGateway ? 0.7 : 1 }}
                    >
                      {isProcessingGateway ? 'Authorizing Card...' : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGatewayModal(null)}
                      style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '12px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* PAYPAL CHECKOUT MODAL */}
              {activeGatewayModal === 'paypal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>
                    Click below to complete authorization using your PayPal account or Card balance.
                  </p>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px 0' }}>Order ID: <strong>{gatewayData?.orderID || 'PAYPAL_ORDER'}</strong></p>
                    <button
                      type="button"
                      disabled={isProcessingGateway}
                      onClick={() => handleVerifyGatewayOrder({
                        gateway: 'paypal',
                        paypal_order_id: gatewayData?.orderID || `PAYPAL_${Date.now()}`
                      })}
                      style={{
                        width: '100%',
                        backgroundColor: '#ffc439',
                        color: '#111',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '24px',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {isProcessingGateway ? 'Capturing PayPal Funds...' : '💳 Authorize & Pay with PayPal'}
                    </button>
                  </div>
                </div>
              )}

              {/* PHONEPE UPI MODAL */}
              {activeGatewayModal === 'phonepe' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>
                    Enter your PhonePe VPA / UPI ID or scan QR code to authorize:
                  </p>
                  <input
                    type="text"
                    placeholder="yourname@ybl or @ibarap"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    disabled={isProcessingGateway}
                    onClick={() => handleVerifyGatewayOrder({
                      gateway: 'phonepe',
                      phonepe_transaction_id: gatewayData?.merchantTransactionId || `MT_${Date.now()}`
                    })}
                    style={{
                      width: '100%',
                      backgroundColor: '#5f259f',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isProcessingGateway ? 'Verifying PhonePe UPI Payment...' : 'Authorize PhonePe Payment'}
                  </button>
                </div>
              )}

              {/* PAYTM MODAL */}
              {activeGatewayModal === 'paytm' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>
                    Click below to complete payment authorization with Paytm Wallet / Banking:
                  </p>
                  <button
                    type="button"
                    disabled={isProcessingGateway}
                    onClick={() => handleVerifyGatewayOrder({
                      gateway: 'paytm',
                      paytm_order_id: gatewayData?.orderId || `PY_${Date.now()}`
                    })}
                    style={{
                      width: '100%',
                      backgroundColor: '#002e6e',
                      color: '#00baf2',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isProcessingGateway ? 'Verifying PayTM Txn...' : 'Pay with PayTM Wallet / Netbanking'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

