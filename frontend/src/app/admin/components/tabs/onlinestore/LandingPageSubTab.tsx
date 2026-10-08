import React, { useState } from "react";
import styles from "../../../page.module.css";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import { TRUST_ICON_LIBRARY, renderTrustIcon } from "@/components/home/TrustIconLibrary";

export default function LandingPageSubTab({
  showTicker,
  setShowTicker,
  tickerText,
  setTickerText,
  tickerDirection = "left",
  setTickerDirection,
  tickerSpeed,
  setTickerSpeed,
  tickerBgColor,
  setTickerBgColor,
  tickerTextColor,
  setTickerTextColor,
  showTrustMarquee = true,
  setShowTrustMarquee,
  trustMarqueeDirection = "left",
  setTrustMarqueeDirection,
  trustMarqueeSpeed = 35,
  setTrustMarqueeSpeed,
  trustMarqueeItems = [],
  setTrustMarqueeItems,
  heroButtonColor,
  heroButtonSize,
  heroButtonStyle,
  heroButtonText,
  heroButtonTextColor,
  heroTemplate,
  showHeroTitle,
  showHeroManifesto,
  showHeroButton,
  activeTab,
  error,
  handleSaveSettings,
  setActiveCustomizerSection,
  activeCustomizerSection,
  setIsHeroCustomizerModalOpen,
  setIsVideoCustomizerModalOpen,
  setIsLifestyleCustomizerModalOpen,
  setHeroBackup,
  setDrafts,
  heroTitleFontType,
  selectedElement,
  hoveredFontSize,
  heroTitleFontSize,
  heroTitleFontColor,
  heroTitleFontAlignment,
  heroTitleFontWeight,
  heroManifestoFontType,
  heroManifestoFontSize,
  heroManifestoFontColor,
  heroManifestoFontAlignment,
  heroManifestoFontWeight,
  setSelectedElement,
  setShowHeroTitleFontOptions,
  heroTitle,
  setHeroTitle,
  heroManifesto,
  setHeroManifesto,
  heroBgType,
  setHeroBgType,
  heroBgColor,
  setHeroBgColor,
  heroBgImage,
  setHeroBgImage,
  heroBgVideo,
  setHeroBgVideo,
  uploadingHeroBgVideo,
  heroBgVideoProgress,
  handleHeroBgVideoUpload,
  uploadingHeroBgImage,
  heroBgImageProgress,
  handleHeroBgImageUpload,
  setHeroTitleFontType,
  setHeroTitleFontColor,
  setHeroTitleFontSize,
  setHeroTitleFontAlignment,
  setHeroTitleFontWeight,
  showVideo,
  setShowVideo,
  videoTitle,
  setVideoTitle,
  videoSubtitle,
  setVideoSubtitle,
  videoUrl,
  setVideoUrl,
  videoBgType,
  setVideoBgType,
  videoBgColor,
  setVideoBgColor,
  videoBgImage,
  setVideoBgImage,
  uploadingVideo,
  videoFallbackColor,
  handleVideoUpload,
  videoProgress,
  setVideoFallbackColor,
  showLifestyle,
  setShowLifestyle,
  lifestyleText,
  setLifestyleText,
  lifestyleImage,
  setLifestyleImage,
  uploadingLifestyle,
  handleLifestyleImageUpload,
  primaryColor,
  setPrimaryColor,
  brandLogoType,
  setBrandLogoType,
  brandLogoValue,
  setBrandLogoValue,
  uploadingLogo,
  handleBrandLogoUpload,
  setGoogleClientId,
  supportText,
  setSupportText,
  careersText,
  setCareersText,
  tradeEnquiryText,
  setTradeEnquiryText,
  aboutUsText,
  setAboutUsText,
  instagramLink,
  setInstagramLink,
  facebookLink,
  setFacebookLink,
  contactLink,
  setContactLink,
  contactUsText,
  setContactUsText,
  returnPolicyText,
  setReturnPolicyText,
  shippingPolicyText,
  setShippingPolicyText,
  faqs,
  setFaqs,
  showProductReviews,
  setShowProductReviews,
  showProductExploreMore,
  setShowProductExploreMore,
  showProductFaq,
  setShowProductFaq,
  usageGuideText,
  setUsageGuideText,
  exploreMoreTitle,
  setExploreMoreTitle,
  deliverySubtext,
  setDeliverySubtext,
  fetchAdminReviews,
  adminReviews,
  reviewSearchQuery,
  setEditReviewTarget,
  setDeleteReviewTarget,
  loadingSettings,
  hasUnsavedChanges,
  setShowResetConfirmModal
}: any) {
  const customizeSubTab = "landing" as string;
  const [editingIconTargetIndex, setEditingIconTargetIndex] = useState<number | null>(null);
  const [iconSearchQuery, setIconSearchQuery] = useState<string>("");
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState<boolean>(false);
  const [isHeroMarqueeOpen, setIsHeroMarqueeOpen] = useState<boolean>(false);

  const toggleAnnouncement = () => {
    setIsAnnouncementOpen((prev) => {
      const next = !prev;
      if (next) setIsHeroMarqueeOpen(false);
      return next;
    });
  };

  const toggleHeroMarquee = () => {
    setIsHeroMarqueeOpen((prev) => {
      const next = !prev;
      if (next) setIsAnnouncementOpen(false);
      return next;
    });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `trust-${Date.now()}`,
      title: "NEW TRUST BADGE",
      subtitle: "Click icon to change",
      icon: "sparkle"
    };
    if (setTrustMarqueeItems) {
      setTrustMarqueeItems([...trustMarqueeItems, newItem]);
    }
  };

  const handleUpdateItem = (index: number, field: string, value: string) => {
    if (!setTrustMarqueeItems) return;
    const updated = [...trustMarqueeItems];
    updated[index] = { ...updated[index], [field]: value };
    setTrustMarqueeItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    if (!setTrustMarqueeItems) return;
    const updated = trustMarqueeItems.filter((_: any, i: number) => i !== index);
    setTrustMarqueeItems(updated);
  };

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleReorderItems = (fromIdx: number, toIdx: number) => {
    if (!setTrustMarqueeItems || fromIdx === toIdx) return;
    const updated = [...trustMarqueeItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setTrustMarqueeItems(updated);
  };

  return (
    <>
      {activeTab === "online-store" && (
        <div className={styles.viewContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>
              Landing Page
            </h1>
          </div>

          <div className={customizeSubTab === "reviews" ? "" : styles.customizerContainer}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleSaveSettings} className={styles.customizerForm}>
              {/* SUB TAB 1: LANDING PAGE CUSTOMIZER */}
              {customizeSubTab === "landing" && (
                <>
                  {/* Card 1: Top Announcement Marquee Bar */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                    <div 
                      className={styles.accordionHeader}
                      onClick={toggleAnnouncement}
                    >
                      <h2 className={styles.cardHeaderTitleNoBorder}>Top Announcement Marquee Bar</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {isAnnouncementOpen && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{ display: "flex", alignItems: "center", gap: "10px" }}
                          >
                            <span style={{ fontWeight: 500, fontSize: "0.85rem", color: "#4b5563" }}>Enabled</span>
                            <button
                              type="button"
                              onClick={() => setShowTicker && setShowTicker(!showTicker)}
                              style={{
                                width: "44px",
                                height: "24px",
                                borderRadius: "12px",
                                backgroundColor: showTicker ? "#181b24" : "#e5e7eb",
                                border: "none",
                                padding: "2px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                transition: "background-color 0.2s ease"
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ffffff",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                  transform: showTicker ? "translateX(20px)" : "translateX(0px)",
                                  transition: "transform 0.2s ease"
                                }}
                              />
                            </button>
                          </div>
                        )}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className={`${styles.chevronIcon} ${isAnnouncementOpen ? styles.chevronRotated : ""}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {isAnnouncementOpen && (
                      <div className={styles.accordionContent}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => setTickerDirection && setTickerDirection("left")}
                              style={{
                                padding: "7px 14px",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: 500,
                                border: tickerDirection === "left" ? "1px solid #181b24" : "1px solid #e5e7eb",
                                backgroundColor: tickerDirection === "left" ? "#181b24" : "#ffffff",
                                color: tickerDirection === "left" ? "#ffffff" : "#374151",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              ← Right to Left
                            </button>
                            <button
                              type="button"
                              onClick={() => setTickerDirection && setTickerDirection("right")}
                              style={{
                                padding: "7px 14px",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: 500,
                                border: tickerDirection === "right" ? "1px solid #181b24" : "1px solid #e5e7eb",
                                backgroundColor: tickerDirection === "right" ? "#181b24" : "#ffffff",
                                color: tickerDirection === "right" ? "#ffffff" : "#374151",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              Left to Right →
                            </button>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#374151", marginRight: "4px" }}>
                              Speed: {tickerSpeed}s
                            </span>
                            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>Fast</span>
                            <input
                              type="range"
                              value={tickerSpeed}
                              onChange={(e) => setTickerSpeed && setTickerSpeed(Number(e.target.value))}
                              style={{ width: "130px", cursor: "pointer", margin: 0, accentColor: "#181b24" }}
                              min="5"
                              max="150"
                            />
                            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>Slow</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                          <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Ticker Content Text</label>
                            <input
                              type="text"
                              value={tickerText}
                              onChange={(e) => setTickerText && setTickerText(e.target.value)}
                              className={styles.textInput}
                            />
                          </div>

                          <div style={{ display: "flex", gap: "20px" }}>
                            <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                              <label className={styles.inputLabel}>Background Color</label>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                  type="color"
                                  value={tickerBgColor}
                                  onChange={(e) => setTickerBgColor && setTickerBgColor(e.target.value)}
                                  style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                />
                                <input
                                  type="text"
                                  value={tickerBgColor}
                                  onChange={(e) => setTickerBgColor && setTickerBgColor(e.target.value)}
                                  className={styles.textInput}
                                />
                              </div>
                            </div>
                            <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                              <label className={styles.inputLabel}>Text Color</label>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                  type="color"
                                  value={tickerTextColor}
                                  onChange={(e) => setTickerTextColor && setTickerTextColor(e.target.value)}
                                  style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                />
                                <input
                                  type="text"
                                  value={tickerTextColor}
                                  onChange={(e) => setTickerTextColor && setTickerTextColor(e.target.value)}
                                  className={styles.textInput}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 2: Hero branding */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
                    <h2 className={styles.cardHeaderTitleNoBorder} style={{ margin: 0 }}>Hero Section Copy</h2>
                    <button
                      type="button"
                      onClick={() => setIsHeroCustomizerModalOpen(true)}
                      style={{
                        backgroundColor: "#3b82f6",
                        border: "none",
                        cursor: "pointer",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: "6px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                      <span>Customize</span>
                    </button>
                  </div>

                  {/* Card 3: Marquee (Below Hero Section) */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                    <div 
                      className={styles.accordionHeader}
                      onClick={toggleHeroMarquee}
                    >
                      <h2 className={styles.cardHeaderTitleNoBorder}>Marquee (Below Hero Section)</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {isHeroMarqueeOpen && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{ display: "flex", alignItems: "center", gap: "10px" }}
                          >
                            <span style={{ fontWeight: 500, fontSize: "0.85rem", color: "#4b5563" }}>Enabled</span>
                            <button
                              type="button"
                              onClick={() => setShowTrustMarquee && setShowTrustMarquee(!showTrustMarquee)}
                              style={{
                                width: "44px",
                                height: "24px",
                                borderRadius: "12px",
                                backgroundColor: showTrustMarquee ? "#181b24" : "#e5e7eb",
                                border: "none",
                                padding: "2px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                transition: "background-color 0.2s ease"
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ffffff",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                  transform: showTrustMarquee ? "translateX(20px)" : "translateX(0px)",
                                  transition: "transform 0.2s ease"
                                }}
                              />
                            </button>
                          </div>
                        )}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className={`${styles.chevronIcon} ${isHeroMarqueeOpen ? styles.chevronRotated : ""}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {isHeroMarqueeOpen && (
                      <div className={styles.accordionContent}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => setTrustMarqueeDirection && setTrustMarqueeDirection("left")}
                              style={{
                                padding: "7px 14px",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: 500,
                                border: trustMarqueeDirection === "left" ? "1px solid #181b24" : "1px solid #e5e7eb",
                                backgroundColor: trustMarqueeDirection === "left" ? "#181b24" : "#ffffff",
                                color: trustMarqueeDirection === "left" ? "#ffffff" : "#374151",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              ← Right to Left
                            </button>
                            <button
                              type="button"
                              onClick={() => setTrustMarqueeDirection && setTrustMarqueeDirection("right")}
                              style={{
                                padding: "7px 14px",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: 500,
                                border: trustMarqueeDirection === "right" ? "1px solid #181b24" : "1px solid #e5e7eb",
                                backgroundColor: trustMarqueeDirection === "right" ? "#181b24" : "#ffffff",
                                color: trustMarqueeDirection === "right" ? "#ffffff" : "#374151",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              Left to Right →
                            </button>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#374151", marginRight: "4px" }}>
                              Speed: {trustMarqueeSpeed}s
                            </span>
                            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>Fast</span>
                            <input
                              type="range"
                              value={trustMarqueeSpeed}
                              onChange={(e) => setTrustMarqueeSpeed && setTrustMarqueeSpeed(Number(e.target.value))}
                              style={{ width: "130px", cursor: "pointer", margin: 0, accentColor: "#181b24" }}
                              min="10"
                              max="100"
                            />
                            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>Slow</span>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <h4 style={{ fontSize: "0.88rem", fontWeight: 700, margin: 0, color: "#111827" }}>
                              Trust Badge Items ({trustMarqueeItems.length})
                            </h4>
                            <button
                              type="button"
                              onClick={handleAddItem}
                              style={{
                                backgroundColor: "#111827",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              + Add Badge
                            </button>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {trustMarqueeItems.map((item: any, idx: number) => {
                              const isDragging = draggedIdx === idx;
                              const isOver = dragOverIdx === idx;
                              return (
                                <div
                                  key={item.id || idx}
                                  draggable
                                  onDragStart={(e) => {
                                    setDraggedIdx(idx);
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                    if (dragOverIdx !== idx) setDragOverIdx(idx);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedIdx !== null && draggedIdx !== idx) {
                                      handleReorderItems(draggedIdx, idx);
                                    }
                                    setDraggedIdx(null);
                                    setDragOverIdx(null);
                                  }}
                                  onDragEnd={() => {
                                    setDraggedIdx(null);
                                    setDragOverIdx(null);
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "8px 12px",
                                    backgroundColor: isDragging ? "#eff6ff" : isOver ? "#f0fdf4" : "#f9fafb",
                                    borderRadius: "6px",
                                    border: isOver ? "2px dashed #10b981" : isDragging ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                                    opacity: isDragging ? 0.6 : 1,
                                    transition: "all 0.15s ease",
                                    boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.08)" : "none"
                                  }}
                                >
                                  <div
                                    title="Click and drag to reorder"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "grab",
                                      padding: "2px",
                                      color: "#9ca3af",
                                      userSelect: "none",
                                      flexShrink: 0
                                    }}
                                  >
                                    <svg width="12" height="16" viewBox="0 0 14 20" fill="currentColor">
                                      <circle cx="4" cy="4" r="2" />
                                      <circle cx="10" cy="4" r="2" />
                                      <circle cx="4" cy="10" r="2" />
                                      <circle cx="10" cy="10" r="2" />
                                      <circle cx="4" cy="16" r="2" />
                                      <circle cx="10" cy="16" r="2" />
                                    </svg>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setEditingIconTargetIndex(idx)}
                                    title="Click to select a different icon from library"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "38px",
                                      height: "38px",
                                      backgroundColor: "#ffffff",
                                      border: "1.5px dashed #d1d5db",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      flexShrink: 0,
                                      transition: "all 0.15s ease"
                                    }}
                                  >
                                    <div style={{ color: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      {renderTrustIcon(item.icon)}
                                    </div>
                                  </button>

                                  <div style={{ flex: 1 }}>
                                    <input
                                      type="text"
                                      placeholder="Badge Title (e.g. EXPRESS SHIPPING)"
                                      value={item.title || ""}
                                      onChange={(e) => handleUpdateItem(idx, "title", e.target.value)}
                                      className={styles.textInput}
                                      style={{ fontWeight: 700, fontSize: "0.82rem", padding: "6px 10px", width: "100%" }}
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteItem(idx)}
                                    title="Delete badge item"
                                    style={{
                                      backgroundColor: "#fee2e2",
                                      color: "#dc2626",
                                      border: "none",
                                      borderRadius: "5px",
                                      padding: "6px 10px",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      flexShrink: 0
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Card 3: Video Section */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
                    <h2 className={styles.cardHeaderTitleNoBorder} style={{ margin: 0 }}>Video Section Banner</h2>
                    <button
                      type="button"
                      onClick={() => setIsVideoCustomizerModalOpen(true)}
                      style={{
                        backgroundColor: "#3b82f6",
                        border: "none",
                        cursor: "pointer",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: "6px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                      <span>Customize</span>
                    </button>
                  </div>

                  {/* Card 4: Lifestyle Section */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
                    <h2 className={styles.cardHeaderTitleNoBorder} style={{ margin: 0 }}>Lifestyle Banner</h2>
                    <button
                      type="button"
                      onClick={() => setIsLifestyleCustomizerModalOpen && setIsLifestyleCustomizerModalOpen(true)}
                      style={{
                        backgroundColor: "#3b82f6",
                        border: "none",
                        cursor: "pointer",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: "6px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                      <span>Customize</span>
                    </button>
                  </div>

                </>
              )}


              {/* Storefront Policies & Popups */}
              <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                <div
                  className={styles.accordionHeader}
                  onClick={() => setActiveCustomizerSection(activeCustomizerSection === "policies" ? null : "policies")}
                >
                  <h2 className={styles.cardHeaderTitleNoBorder}>Storefront Policies & Popups</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`${styles.chevronIcon} ${activeCustomizerSection === "policies" ? styles.chevronRotated : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                {activeCustomizerSection === "policies" && (
                  <div className={styles.accordionContent}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Support Text</label>
                        <textarea className={styles.textareaInput} value={supportText} onChange={(e: any) => setSupportText(e.target.value)} rows={3} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Careers Text</label>
                        <textarea className={styles.textareaInput} value={careersText} onChange={(e: any) => setCareersText(e.target.value)} rows={3} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Trade Enquiry Text</label>
                        <textarea className={styles.textareaInput} value={tradeEnquiryText} onChange={(e: any) => setTradeEnquiryText(e.target.value)} rows={3} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>About Us Text</label>
                        <textarea className={styles.textareaInput} value={aboutUsText} onChange={(e: any) => setAboutUsText(e.target.value)} rows={3} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Instagram Link</label>
                        <textarea className={styles.textareaInput} value={instagramLink} onChange={(e: any) => setInstagramLink(e.target.value)} rows={1} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Facebook Link</label>
                        <textarea className={styles.textareaInput} value={facebookLink} onChange={(e: any) => setFacebookLink(e.target.value)} rows={1} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Contact Page Link</label>
                        <textarea className={styles.textareaInput} value={contactLink} onChange={(e: any) => setContactLink(e.target.value)} rows={1} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Contact Us Text</label>
                        <textarea
                          className={styles.textareaInput}
                          value={contactUsText}
                          onChange={(e: any) => setContactUsText(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Return Policy Text</label>
                        <textarea
                          className={styles.textareaInput}
                          value={returnPolicyText}
                          onChange={(e: any) => setReturnPolicyText(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Shipping Policy Text</label>
                        <textarea
                          className={styles.textareaInput}
                          value={shippingPolicyText}
                          onChange={(e: any) => setShippingPolicyText(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SUB TAB 2: PRODUCT PREVIEW PAGE CUSTOMIZER */}
              {customizeSubTab === "product" && (
                <>
                  {/* Card 6: Product Preview Page Settings */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                    <div
                      className={styles.accordionHeader}
                      onClick={() => setActiveCustomizerSection(activeCustomizerSection === "faq" ? null : "faq")}
                    >
                      <h2 className={styles.cardHeaderTitleNoBorder}>Frequently Asked Questions (FAQ)</h2>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`${styles.chevronIcon} ${activeCustomizerSection === "faq" ? styles.chevronRotated : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>

                    {activeCustomizerSection === "faq" && (
                      <div className={styles.accordionContent}>
                        {/* List of current FAQs */}
                        {faqs.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
                            {faqs.map((faq: any, index: number) => (
                              <div
                                key={index}
                                style={{
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  padding: "15px",
                                  backgroundColor: "#f9fafb",
                                  position: "relative"
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4b5563" }}>FAQ #{index + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFaqs(faqs.filter((_: any, i: number) => i !== index))}
                                    style={{
                                      backgroundColor: "#fee2e2",
                                      color: "#dc2626",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "4px 10px",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      transition: "background 0.2s ease"
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                                <div className={styles.inputGroup} style={{ marginBottom: "10px" }}>
                                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Question</label>
                                  <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e: any) => {
                                      const updated = [...faqs];
                                      updated[index] = { ...updated[index], question: e.target.value };
                                      setFaqs(updated);
                                    }}
                                    className={styles.textInput}
                                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                                    placeholder="Enter question..."
                                    required
                                  />
                                </div>
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Answer</label>
                                  <textarea
                                    value={faq.answer}
                                    onChange={(e: any) => {
                                      const updated = [...faqs];
                                      updated[index] = { ...updated[index], answer: e.target.value };
                                      setFaqs(updated);
                                    }}
                                    className={styles.textareaInput}
                                    rows={2}
                                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                                    placeholder="Enter answer..."
                                    required
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: "0.85rem", color: "#6b7280", fontStyle: "italic", marginBottom: "20px" }}>No FAQs configured yet. Click Add below to create one.</p>
                        )}

                        {/* Add New FAQ Trigger and Reset Button */}
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "10px 18px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "opacity 0.2s ease"
                            }}
                          >
                            + Add FAQ
                          </button>
                          {faqs.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setFaqs([])}
                              style={{
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: "6px",
                                padding: "10px 18px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease"
                              }}
                            >
                              Clear All FAQs
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 7: Product Preview Page Settings */}
                  <div className={styles.dashboardCard} style={{ marginBottom: "25px" }}>
                    <div
                      className={styles.accordionHeader}
                      onClick={() => setActiveCustomizerSection(activeCustomizerSection === "productPage" ? null : "productPage")}
                    >
                      <h2 className={styles.cardHeaderTitleNoBorder}>Product Preview Page Controls</h2>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`${styles.chevronIcon} ${activeCustomizerSection === "productPage" ? styles.chevronRotated : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>

                    {activeCustomizerSection === "productPage" && (
                      <div className={styles.accordionContent}>
                        <div className={styles.toggleRow} style={{ marginBottom: "15px" }}>
                          <span className={styles.toggleLabel}>Show Customer Reviews Section</span>
                          <CustomCheckbox
                            checked={showProductReviews}
                            onChange={(e: any) => setShowProductReviews(e.target.checked)}
                            style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                          />
                        </div>

                        <div className={styles.toggleRow} style={{ marginBottom: "15px" }}>
                          <span className={styles.toggleLabel}>Show Recommended &ldquo;Explore More&rdquo; Section</span>
                          <CustomCheckbox
                            checked={showProductExploreMore}
                            onChange={(e: any) => setShowProductExploreMore(e.target.checked)}
                            style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                          />
                        </div>

                        <div className={styles.toggleRow} style={{ marginBottom: "20px" }}>
                          <span className={styles.toggleLabel}>Show Frequently Asked Questions (FAQ) Section</span>
                          <CustomCheckbox
                            checked={showProductFaq}
                            onChange={(e: any) => setShowProductFaq(e.target.checked)}
                            style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                          />
                        </div>

                        <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                          <label className={styles.inputLabel}>Usage Guide Subtext</label>
                          <input
                            type="text"
                            value={usageGuideText}
                            onChange={(e: any) => setUsageGuideText(e.target.value)}
                            placeholder="Handcrafted with precision. Refer to our USAGE GUIDE..."
                            className={styles.textInput}
                          />
                        </div>

                        <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                          <label className={styles.inputLabel}>Recommended Section Headline Title</label>
                          <input
                            type="text"
                            value={exploreMoreTitle}
                            onChange={(e: any) => setExploreMoreTitle(e.target.value)}
                            placeholder="Don't Stop. Explore More."
                            className={styles.textInput}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Price Taxes & Shipping Subtext</label>
                          <input
                            type="text"
                            value={deliverySubtext}
                            onChange={(e: any) => setDeliverySubtext(e.target.value)}
                            placeholder="TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT."
                            className={styles.textInput}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* SUB TAB 3: CUSTOMER REVIEWS MODERATION */}
              {customizeSubTab === "reviews" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Moderate Reviews</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={fetchAdminReviews}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px",
                          background: "transparent",
                          color: "#4b5563",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        title="Refresh Reviews"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className={styles.dashboardCard} style={{ padding: "10px" }}>
                    {adminReviews.length > 0 ? (
                      <div style={{ overflowX: "auto" }}>
                        <table className={styles.inventoryTable}>
                          <thead>
                            <tr>
                              <th>AuthorName</th>
                              <th>ReviewRating</th>
                              <th style={{ width: "30%" }}>ReviewComment</th>
                              <th>ReviewPhotos</th>
                              <th>ReviewDate</th>
                              <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminReviews
                              .filter((r: any) =>
                                r.author?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
                                r.comment?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
                                r.title?.toLowerCase().includes(reviewSearchQuery.toLowerCase())
                              )
                              .map((review: any) => (
                                <tr key={review._id}>
                                  <td>
                                    <span className={styles.tableName}>{review.author}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "#6b7280", fontWeight: 400, marginTop: "2px" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                      </svg>
                                      {review.location || "IN"}
                                    </div>
                                  </td>
                                  <td>
                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                  </td>
                                  <td>
                                    {review.title && <div style={{ fontWeight: 700 }}>{review.title}</div>}
                                    <div style={{ color: "#4b5563" }}>{review.comment}</div>
                                  </td>
                                  <td>
                                    {review.images && review.images.length > 0 ? (
                                      <div style={{ display: "flex", gap: "4px" }}>
                                        {review.images.map((img: string, i: number) => (
                                          <img key={i} src={img} alt="Attached" className={styles.tableThumb} style={{ width: "30px", height: "30px" }} />
                                        ))}
                                      </div>
                                    ) : (
                                      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>No photos</span>
                                    )}
                                  </td>
                                  <td>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    <div className={styles.actionGroup}>
                                      <button
                                        onClick={() => setEditReviewTarget({ ...review })}
                                        className={styles.editActionBtn}
                                        title="Edit Review"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => setDeleteReviewTarget(review._id)}
                                        className={styles.deleteActionBtn}
                                        title="Delete Review"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "30px 10px", color: "#6b7280", fontSize: "0.85rem" }}>
                        No customer reviews found in database.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save and Reset Row */}
              {(customizeSubTab === "landing" || customizeSubTab === "product" || customizeSubTab === "reviews") && (
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "15px", width: "100%" }}>
                  <button
                    type="submit"
                    disabled={loadingSettings || !hasUnsavedChanges}
                    className={styles.saveSettingsBtn}
                    style={{
                      flex: 1,
                      opacity: (loadingSettings || !hasUnsavedChanges) ? 0.6 : 1,
                      cursor: (loadingSettings || !hasUnsavedChanges) ? "not-allowed" : "pointer"
                    }}
                  >
                    {loadingSettings ? "Saving Adjustments..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmModal(true)}
                    className={styles.resetSettingsBtn}
                    style={{ flex: 1 }}
                  >
                    Reset to Defaults
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Redesigned Customers Tab */}

      {/* ICON CHOOSER MODAL */}
      {editingIconTargetIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => {
            setEditingIconTargetIndex(null);
            setIconSearchQuery("");
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "750px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Select Icon from Library ({Object.keys(TRUST_ICON_LIBRARY).length} Available)</h3>
                <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "2px 0 0 0" }}>Choose a vector icon for badge #{editingIconTargetIndex + 1}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingIconTargetIndex(null);
                  setIconSearchQuery("");
                }}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#6b7280" }}
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="🔍 Search icons (e.g. shipping, package, shield, star, vegan, card)..."
                value={iconSearchQuery}
                onChange={(e) => setIconSearchQuery(e.target.value)}
                className={styles.textInput}
                style={{ width: "100%", fontSize: "0.88rem", padding: "10px 14px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: "10px" }}>
              {Object.entries(TRUST_ICON_LIBRARY)
                .filter(([key, data]) => {
                  if (!iconSearchQuery) return true;
                  const q = iconSearchQuery.toLowerCase();
                  return key.toLowerCase().includes(q) || data.label.toLowerCase().includes(q);
                })
                .map(([key, data]) => {
                  const isSelected = trustMarqueeItems[editingIconTargetIndex]?.icon === key;
                  return (
                    <div
                      key={key}
                      title={data.label}
                      onClick={() => {
                        handleUpdateItem(editingIconTargetIndex, "icon", key);
                        setEditingIconTargetIndex(null);
                        setIconSearchQuery("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "14px 8px",
                        borderRadius: "10px",
                        border: isSelected ? "2px solid #111827" : "1px solid #e5e7eb",
                        backgroundColor: isSelected ? "#f3f4f6" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
                      }}
                    >
                      <div style={{ color: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {data.icon}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

