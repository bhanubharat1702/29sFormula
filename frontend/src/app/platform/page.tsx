"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function PlatformLandingPage() {
  const router = useRouter();

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Demo Request Form State
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [businessType, setBusinessType] = useState("Fashion & Retail");
  const [message, setMessage] = useState("");
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  // Super Admin Login Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";

  // Handle Demo Request Submission
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError(null);
    setDemoSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/platform/demo-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          ownerName,
          email,
          phone,
          subdomain,
          businessType,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit demo request.");

      setDemoSuccess(true);
    } catch (err: any) {
      setDemoError(err.message);
    } finally {
      setDemoSubmitting(false);
    }
  };

  // Handle Super Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/superadmin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Super Admin login failed.");

      // Save token to localStorage
      localStorage.setItem("superAdminToken", data.token);
      localStorage.setItem("superAdminData", JSON.stringify(data.admin));

      // Redirect to Super Admin Dashboard
      router.push("/superadmin");
    } catch (err: any) {
      setAdminError(err.message);
    } finally {
      setAdminSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          29s ENGINE <span className={styles.brandBadge}>SaaS OS</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Capabilities</a>
          <a href="#architecture" className={styles.navLink}>Multi-Tenancy</a>
          <a href="#pricing" className={styles.navLink}>SaaS Plans</a>
        </div>
        <div className={styles.navActions}>
          <button 
            className={styles.btnSecondary}
            onClick={() => setIsAdminModalOpen(true)}
          >
            🔑 Super Admin Login
          </button>
          <button 
            className={styles.btnPrimary}
            onClick={() => setIsDemoModalOpen(true)}
          >
            Request Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroTag}>
          <span>⚡ Multi-Tenant D2C E-Commerce Operating System</span>
        </div>
        <h1 className={styles.heroTitle}>
          Launch Your Custom D2C Store <br />
          <span className={styles.heroGradientText}>In Less Than 2 Minutes</span>
        </h1>
        <p className={styles.heroSubtitle}>
          The complete multi-tenant platform for modern Indian commerce. Instant tenant subdomains, zero-code storefront customizer, complete data isolation, and profit analytics.
        </p>
        <div className={styles.heroCtaGroup}>
          <button 
            className={styles.btnPrimary}
            style={{ padding: "0.95rem 2.2rem", fontSize: "1.02rem" }}
            onClick={() => setIsDemoModalOpen(true)}
          >
            Request Store Demo
          </button>
          <button 
            className={styles.btnSecondary}
            style={{ padding: "0.95rem 1.8rem", fontSize: "1.02rem" }}
            onClick={() => setIsAdminModalOpen(true)}
          >
            Super Admin Portal
          </button>
        </div>

        {/* Live Interactive Platform Preview */}
        <div className={styles.previewFrame}>
          <div className={styles.previewHeader}>
            <div className={styles.windowDots}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
            </div>
            <div className={styles.urlBar}>
              https://yourbrand.29sformula.com/admin
            </div>
            <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>
              ● Live Multi-Tenant Sandbox
            </div>
          </div>
          <div className={styles.previewBody}>
            <div className={styles.sidebarMock}>
              <div className={`${styles.mockItem} ${styles.mockItemActive}`}>📊 Dashboard Analytics</div>
              <div className={styles.mockItem}>🛍️ Products & Catalog</div>
              <div className={styles.mockItem}>📦 Orders & Deliveries</div>
              <div className={styles.mockItem}>🎨 Storefront Customizer</div>
              <div className={styles.mockItem}>🏷️ Discount Engine</div>
              <div className={styles.mockItem}>⚙️ Domain & Settings</div>
            </div>
            <div className={styles.dashboardMock}>
              <div className={styles.statsGridMock}>
                <div className={styles.statCardMock}>
                  <div className={styles.statLabelMock}>Today's Revenue</div>
                  <div className={styles.statValueMock}>₹48,250</div>
                  <div className={styles.statTrend}>↑ +18.4% vs yesterday</div>
                </div>
                <div className={styles.statCardMock}>
                  <div className={styles.statLabelMock}>Active Orders</div>
                  <div className={styles.statValueMock}>34</div>
                  <div className={styles.statTrend}>↑ 6 ready to dispatch</div>
                </div>
                <div className={styles.statCardMock}>
                  <div className={styles.statLabelMock}>Tenant Context</div>
                  <div className={styles.statValueMock} style={{ fontSize: "1.1rem", color: "#d4af37" }}>luxe.domain</div>
                  <div className={styles.statTrend}>SSL Active ✅</div>
                </div>
              </div>

              <div style={{ background: "#09090b", borderRadius: "10px", padding: "1.25rem", border: "1px solid #27272a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Recent Customer Orders</div>
                  <div style={{ fontSize: "0.8rem", color: "#d4af37" }}>Isolated Tenant Query</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#a1a1aa" }}>
                    <span>#ORD-8921 • Rahul Sharma</span>
                    <span style={{ color: "#10b981" }}>₹2,499 (Paid UPI)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#a1a1aa" }}>
                    <span>#ORD-8920 • Priya Patel</span>
                    <span style={{ color: "#f59e0b" }}>₹1,850 (Processing)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid ("What We Sell") */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>Platform Architecture</div>
          <h2 className={styles.sectionTitle}>Built For Modern D2C Brands</h2>
          <p className={styles.sectionSubtitle}>
            Solving high setup costs, technical friction, and manual order verification faced by Indian e-commerce merchants.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⚡</div>
            <h3 className={styles.cardTitle}>Multi-Tenant Engine</h3>
            <p className={styles.cardText}>
              Every merchant gets their own isolated tenant environment. Subdomain routing (`brand.29sformula.com`) works automatically with zero cross-tenant data leaks.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🎨</div>
            <h3 className={styles.cardTitle}>No-Code Customizer</h3>
            <p className={styles.cardText}>
              Merchants easily modify typography, color schemes, announcement banners, video backgrounds, and trust badges directly from their dashboard tab.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>👑</div>
            <h3 className={styles.cardTitle}>Super Admin Control Panel</h3>
            <p className={styles.cardText}>
              Platform managers can provision store instances, monitor total platform GMV, suspend/activate stores, and review incoming merchant demo requests.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>💳</div>
            <h3 className={styles.cardTitle}>Plug-and-Play Payment Provider</h3>
            <p className={styles.cardText}>
              Support for Razorpay, Cashfree, Paytm, and direct UPI. Merchants enter their API keys or UPI ID directly without platform fees.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📈</div>
            <h3 className={styles.cardTitle}>Real-time Profit Analytics</h3>
            <p className={styles.cardText}>
              Track revenue, Cost of Goods (COGS), profit margins, AOV, and customer order histories backed by high-performance MongoDB indexing.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🔒</div>
            <h3 className={styles.cardTitle}>Enterprise-Grade Security</h3>
            <p className={styles.cardText}>
              JWT token verification, bcrypt password hashing, API rate limiting, and Sentry exception capture configured out-of-the-box.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricingSection}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className={styles.sectionTag}>Transparent Plans</div>
          <h2 className={styles.sectionTitle}>Choose Your Growth Tier</h2>
        </div>

        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <div className={styles.planName}>Starter Store</div>
            <div className={styles.planPrice}>₹999 <span>/month</span></div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> 1 Subdomain Store</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Up to 100 Products</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Basic Analytics</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Standard Checkout</li>
            </ul>
            <button className={styles.btnSecondary} onClick={() => setIsDemoModalOpen(true)}>Request Starter Demo</button>
          </div>

          <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <div className={styles.planName}>Pro Merchant</div>
            <div className={styles.planPrice}>₹2,499 <span>/month</span></div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Custom CNAME Domain Support</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Unlimited Products & Orders</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Full Storefront Customizer</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Advanced Profit Analytics</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Priority Support</li>
            </ul>
            <button className={styles.btnPrimary} onClick={() => setIsDemoModalOpen(true)}>Request Pro Demo</button>
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.planName}>Enterprise SaaS</div>
            <div className={styles.planPrice}>Custom</div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Dedicated Database Instances</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Custom API Integrations</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> 99.9% SLA Guarantee</li>
              <li className={styles.featureItem}><span className={styles.featureCheck}>✓</span> Dedicated Account Manager</li>
            </ul>
            <button className={styles.btnSecondary} onClick={() => setIsDemoModalOpen(true)}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Merchant Demo Request Modal */}
      {isDemoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDemoModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsDemoModalOpen(false)}>✕</button>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Request a Store Demo</h3>
              <p className={styles.modalSubtitle}>Provide your brand details and our team will provision your trial store instance.</p>
            </div>

            {demoSuccess ? (
              <div className={styles.successBanner}>
                <h4>🎉 Request Submitted Successfully!</h4>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  Thank you, <strong>{ownerName}</strong>! We received your request for <strong>{storeName}</strong>. Our Super Admin team will review and provision your store instance within 24 hours.
                </p>
                <button 
                  className={styles.btnPrimary} 
                  style={{ marginTop: "1.25rem", width: "100%" }}
                  onClick={() => { setIsDemoModalOpen(false); setDemoSuccess(false); }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit}>
                {demoError && <div className={styles.errorBanner}>{demoError}</div>}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Store / Brand Name *</label>
                  <input 
                    type="text" 
                    required 
                    className={styles.input} 
                    placeholder="e.g. Organic Herbal Co."
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Owner Name *</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.input} 
                      placeholder="Your Name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      className={styles.input} 
                      placeholder="name@brand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      className={styles.input} 
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Requested Subdomain</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="mybrand (.29sformula.com)"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Message / Requirements</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Tell us about your products..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={demoSubmitting} 
                  className={styles.btnPrimary} 
                  style={{ width: "100%", marginTop: "0.5rem", padding: "0.85rem" }}
                >
                  {demoSubmitting ? "Submitting Request..." : "Submit Demo Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Super Admin Login Modal */}
      {isAdminModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAdminModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsAdminModalOpen(false)}>✕</button>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>🔑 Super Admin Portal</h3>
              <p className={styles.modalSubtitle}>Authenticate with administrative credentials to access platform telemetry and store provisioning.</p>
            </div>

            <div style={{ 
              background: "rgba(255,255,255,0.05)", 
              border: "1px dashed rgba(255,255,255,0.2)", 
              borderRadius: "10px", 
              padding: "0.85rem 1rem", 
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              color: "#d4d4d8"
            }}>
              <div>🧪 <strong>Testing Credentials:</strong></div>
              <div style={{ marginTop: "3px" }}><strong>Email:</strong> <code>superadmin@platform.com</code></div>
              <div><strong>Password:</strong> <code>SuperAdmin@2026</code></div>
            </div>

            <form onSubmit={handleAdminLogin}>
              {adminError && <div className={styles.errorBanner}>{adminError}</div>}

              <div className={styles.formGroup}>
                <label className={styles.label}>Super Admin Email</label>
                <input 
                  type="text" 
                  required 
                  className={styles.input} 
                  placeholder="superadmin@platform.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input 
                  type="password" 
                  required 
                  className={styles.input} 
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={adminSubmitting} 
                className={styles.btnPrimary} 
                style={{ width: "100%", marginTop: "0.5rem", padding: "0.85rem" }}
              >
                {adminSubmitting ? "Authenticating..." : "Login to Control Center"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div>29s ENGINE SaaS Platform © 2026 • Multi-Tenant D2C Operating System</div>
        <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#a1a1aa" }}>
          <button 
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setIsAdminModalOpen(true)}
          >
            Super Admin Control Center
          </button>
          {" | "}
          <Link href="/superadmin" style={{ color: "#a1a1aa" }}>Direct Dashboard Route</Link>
        </div>
      </footer>
    </div>
  );
}
