'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [supportText, setSupportText] = useState<string>("");
  const [careersText, setCareersText] = useState<string>("");
  const [tradeEnquiryText, setTradeEnquiryText] = useState<string>("");
  const [aboutUsText, setAboutUsText] = useState<string>("");
  const [instagramLink, setInstagramLink] = useState<string>("#");
  const [facebookLink, setFacebookLink] = useState<string>("#");
  const [contactLink, setContactLink] = useState<string>("#");
  const [contactUsText, setContactUsText] = useState<string>("");
  const [returnPolicyText, setReturnPolicyText] = useState<string>("");
  const [shippingPolicyText, setShippingPolicyText] = useState<string>("");
  const [brandLogoType, setBrandLogoType] = useState<string>("text");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.supportText) setSupportText(data.supportText);
        if (data.careersText) setCareersText(data.careersText);
        if (data.tradeEnquiryText) setTradeEnquiryText(data.tradeEnquiryText);
        if (data.aboutUsText) setAboutUsText(data.aboutUsText);
        if (data.instagramLink) setInstagramLink(data.instagramLink);
        if (data.facebookLink) setFacebookLink(data.facebookLink);
        if (data.contactLink) setContactLink(data.contactLink);
        if (data.contactUsText) setContactUsText(data.contactUsText);
        if (data.returnPolicyText) setReturnPolicyText(data.returnPolicyText);
        if (data.shippingPolicyText) setShippingPolicyText(data.shippingPolicyText);
        if (data.brandLogoType) setBrandLogoType(data.brandLogoType);
        if (data.brandLogoValue) setBrandLogoValue(data.brandLogoValue);
      })
      .catch(err => console.warn("Failed to load policies for footer:", err));
  }, []);

  const getPopupTitle = () => {
    switch (activePopup) {
      case 'support': return 'Support';
      case 'careers': return 'Careers';
      case 'trade': return 'Trade Enquiry';
      case 'about': return 'About Us';
      case 'contact': return 'Contact Us';
      case 'return': return 'Return Policy';
      case 'shipping': return 'Shipping Policy';
      default: return '';
    }
  };

  const getPopupContent = () => {
    switch (activePopup) {
      case 'support': return supportText;
      case 'careers': return careersText;
      case 'trade': return tradeEnquiryText;
      case 'about': return aboutUsText;
      case 'contact': return contactUsText;
      case 'return': return returnPolicyText;
      case 'shipping': return shippingPolicyText;
      default: return '';
    }
  };


  const formatUrl = (url: string) => {
    if (!url || url === "#") return "#";
    if (url.startsWith("/")) return url;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <>
      {/* 11. Footer Section */}
      <footer className={styles.footerSection}>
        {/* Column 1: Quick Links */}
        <div className={styles.footerCol}>
          <h3 className={styles.footerColTitle}>QUICK LINKS</h3>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/shop" className={styles.footerLink}>All Products</Link>
            <button onClick={() => setActivePopup('contact')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Contact Us</button>
            <button onClick={() => setActivePopup('return')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Return Policy</button>
            <button onClick={() => setActivePopup('shipping')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Shipping Policy</button>
          </div>
        </div>

        {/* Column 2: Get in Touch */}
        <div className={styles.footerCol}>
          <h3 className={styles.footerColTitle}>GET IN TOUCH</h3>
          <div className={styles.footerLinks}>
            <button onClick={() => setActivePopup('support')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Support</button>
            <button onClick={() => setActivePopup('careers')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Careers</button>
            <button onClick={() => setActivePopup('trade')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Trade Enquiry</button>
            <button onClick={() => setActivePopup('about')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>About Us</button>
          </div>
        </div>

        {/* Column 3: Connect */}
        <div className={styles.footerCol}>
          <h3 className={styles.footerColTitle}>CONNECT</h3>
          <div className={styles.footerLinks}>
            <a href={formatUrl(instagramLink)} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Instagram</a>
            <a href={formatUrl(facebookLink)} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Facebook</a>
            <a href={formatUrl(contactLink)} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Contact</a>
          </div>
        </div>

        {/* Column 4: Subscribe */}
        <div className={styles.footerCol}>


          <div className={styles.footerSecureCheckout}>
            <p className={styles.secureCheckoutTitle}>Secure checkout with</p>
            <div className={styles.paymentGrid}>
              {/* Razorpay */}
              <div className={styles.paymentBadge}>
                <span style={{ color: '#0b72e7', fontWeight: 900 }}>Razorpay</span>
              </div>
              {/* G Pay */}
              <div className={styles.paymentBadge}>
                <span style={{ color: '#4285F4', fontWeight: 700 }}>G</span>
                <span style={{ color: '#EA4335', fontWeight: 700 }}>P</span>
                <span style={{ color: '#FBBC05', fontWeight: 700 }}>a</span>
                <span style={{ color: '#34A853', fontWeight: 700 }}>y</span>
              </div>
              {/* Paytm */}
              <div className={styles.paymentBadge}>
                <span style={{ color: '#00baf2', fontWeight: 800 }}>pay</span>
                <span style={{ color: '#002e6e', fontWeight: 800 }}>tm</span>
              </div>
              {/* PhonePe */}
              <div className={styles.paymentBadge}>
                <span style={{ color: '#5f259f', fontWeight: 800 }}>PhonePe</span>
              </div>
              {/* RuPay */}
              <div className={styles.paymentBadge}>
                <span style={{ color: '#0a529a', fontWeight: 800, fontStyle: 'italic' }}>RuPay</span>
              </div>
              {/* BHIM */}
              <div className={styles.paymentBadge}>
                <span style={{ color: '#f7941d', fontWeight: 800 }}>BHIM</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. Sub-Footer / Copyright Section */}
      <section className={styles.subFooterSection}>
        <div className={styles.subFooterLogo}>
          {brandLogoType === "image" && brandLogoValue ? (
            <img src={brandLogoValue} alt="Brand Logo" style={{ maxHeight: "120px", maxWidth: "90%", objectFit: "contain" }} />
          ) : (
            <span style={{ 
              fontSize: `min(25vw, calc(140vw / ${Math.max(1, (brandLogoValue || "29sFORMULA").length)}))`
            }}>
              {brandLogoValue || "29sFORMULA"}
            </span>
          )}
        </div>
        <div className={styles.subFooterDivider}></div>
        <div className={styles.subFooterCopyright}>
          <p>© {new Date().getFullYear()}, {brandLogoType === "text" ? brandLogoValue : "29sFORMULA"}, ALL RIGHTS RESERVED</p>
          <p>OWNED BY 29S FORMULA LLP</p>
        </div>
      </section>
      {mounted && createPortal(
        <div 
          className={`${styles.policyModalOverlay} ${activePopup ? styles.open : ""}`}
          onClick={() => setActivePopup(null)}
        >
          <div 
            className={styles.policyModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.policyModalCloseBtn}
              onClick={() => setActivePopup(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className={styles.policyModalTitle}>{getPopupTitle()}</h2>
            <div className={styles.policyModalText}>
              {getPopupContent()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
