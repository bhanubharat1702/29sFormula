import React, { useState } from "react";
import styles from "../../../page.module.css";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
export default function LandingPageSubTab({
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


                      {/* Card 2: Hero branding */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "hero" ? null : "hero")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Hero Section Copy</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "hero" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "hero" && (
                          <div className={styles.accordionContent}>
                            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
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
                                  padding: "8px 12px",
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
                                <span>Advanced Customizer</span>
                              </button>
                            </div>
                            <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label className={styles.inputLabel}>Brand Header Title</label>
                                
                              </div>
                              <div style={{ display: "flex", gap: "8px", position: "relative" }}>
                                <input
                                  type="text"
                                  value={heroTitle}
                                  onChange={(e: any) => setHeroTitle(e.target.value)}
                                  placeholder="29sFORMULA"
                                  className={styles.textInput}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Brand Manifesto (Hero Subtext)</label>
                              <textarea
                                value={heroManifesto}
                                onChange={(e: any) => setHeroManifesto(e.target.value)}
                                placeholder="SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE..."
                                className={styles.textareaInput}
                                rows={3}
                              />
                            </div>

                            {/* Hero Background Customization */}
                            <div style={{
                              marginTop: "20px",
                              paddingTop: "20px",
                              borderTop: "1px solid #e5e7eb",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px"
                            }}>


                              <label className={styles.inputLabel} style={{ fontWeight: 700 }}>Hero Background Customization</label>

                              {/* Background Type Selection */}
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {["color", "image", "video"].map((type) => {
                                  const label = type === "color" ? "Solid Color" : type === "image" ? "Image Background" : "Video Background";
                                  const isActive = heroBgType === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setHeroBgType(type)}
                                      style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        backgroundColor: isActive ? "#111827" : "#ffffff",
                                        color: isActive ? "#ffffff" : "#374151",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "background 0.2s, color 0.2s"
                                      }}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Conditional Inputs */}
                              {heroBgType === "color" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Color</label>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="color"
                                      value={heroBgColor}
                                      onChange={(e: any) => setHeroBgColor(e.target.value)}
                                      style={{
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        width: "40px",
                                        height: "40px",
                                        padding: 0,
                                        cursor: "pointer",
                                        backgroundColor: "transparent"
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={heroBgColor}
                                      onChange={(e: any) => setHeroBgColor(e.target.value)}
                                      placeholder="#57bc74"
                                      className={styles.textInput}
                                      style={{ flex: 1, fontFamily: "monospace" }}
                                    />
                                  </div>
                                </div>
                              )}

                              {heroBgType === "image" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Image</label>
                                  {heroBgImage ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                      <img src={heroBgImage} alt="Hero Bg" style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                                      <button
                                        type="button"
                                        onClick={() => setHeroBgImage("")}
                                        style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <label style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "10px 14px",
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      marginTop: "6px"
                                    }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>Upload Image</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={async (e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
                                                method: "POST",
                                                body: formData
                                              });
                                              if (res.ok) {
                                                const uploadResult = await res.json();
                                                setHeroBgImage(uploadResult.url);
                                              } else {
                                                alert("Image upload failed");
                                              }
                                            } catch (err) {
                                              console.error("Upload error:", err);
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              )}

                              {heroBgType === "video" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Video</label>
                                  {uploadingHeroBgVideo && (
                                    <div style={{ marginTop: "6px", marginBottom: "8px" }}>
                                      <p style={{ fontSize: "0.82rem", color: "#111827", margin: "0 0 4px 0" }}>
                                        Uploading video ... {heroBgVideoProgress !== null ? `${heroBgVideoProgress}%` : ""}
                                      </p>
                                      <div style={{ width: "100%", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ width: `${heroBgVideoProgress || 0}%`, height: "100%", backgroundColor: "#111827", transition: "width 0.3s" }} />
                                      </div>
                                    </div>
                                  )}

                                  {heroBgVideo ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                      <video src={heroBgVideo} autoPlay loop muted style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                                      <button
                                        type="button"
                                        onClick={() => setHeroBgVideo("")}
                                        style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <label style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "10px 14px",
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      marginTop: "6px"
                                    }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>Upload Video</span>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: "none" }}
                                        onChange={handleHeroBgVideoUpload}
                                        disabled={uploadingHeroBgVideo}
                                      />
                                    </label>
                                  )}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setHeroTitle("29sFORMULA");
                                setHeroTitleFontType("Outfit");
                                setHeroTitleFontColor("#111827");
                                setHeroTitleFontSize("4.5rem");
                                setHeroTitleFontAlignment("center");
                                setHeroTitleFontWeight("700");
                                setHeroManifesto("SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE. EVERY 29S FORMULA BOTTLE IS CRAFTED BY HANDS THAT CARE, NOT MACHINES THAT RUSH.");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Hero Copy to Defaults
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card 3: Video Section */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "video" ? null : "video")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Video Section Banner</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "video" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "video" && (
                          <div className={styles.accordionContent}>
                            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
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
                                  padding: "8px 12px",
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
                                <span>Advanced Customizer</span>
                              </button>
                            </div>
                            <div className={styles.toggleRow} style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className={styles.toggleLabel} style={{ fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>Display Video Section on Storefront</span>
                              <CustomCheckbox
                                checked={showVideo}
                                onChange={(e: any) => setShowVideo(e.target.checked)}
                                style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                              />
                            </div>
                            <div className={styles.inputRow} style={{ marginBottom: "15px" }}>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Headline Title</label>
                                <input
                                  type="text"
                                  value={videoTitle}
                                  onChange={(e: any) => setVideoTitle(e.target.value)}
                                  placeholder="NEW ARRIVALS"
                                  className={styles.textInput}
                                  disabled={!showVideo}
                                />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Subtitle Description</label>
                                <input
                                  type="text"
                                  value={videoSubtitle}
                                  onChange={(e: any) => setVideoSubtitle(e.target.value)}
                                  placeholder="Drop's live. Smells divine..."
                                  className={styles.textInput}
                                  disabled={!showVideo}
                                />
                              </div>
                            </div>


                            {/* Video Background Customization */}
                            <div style={{
                              marginTop: "20px",
                              paddingTop: "20px",
                              borderTop: "1px solid #e5e7eb",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px"
                            }}>

                              <label className={styles.inputLabel} style={{ fontWeight: 700 }}>Video Background Customization</label>

                              {/* Background Type Selection */}
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {["color", "image", "video"].map((type) => {
                                  const label = type === "color" ? "Solid Color" : type === "image" ? "Image Background" : "Video Background";
                                  const isActive = videoBgType === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setVideoBgType(type)}
                                      style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        backgroundColor: isActive ? "#111827" : "#ffffff",
                                        color: isActive ? "#ffffff" : "#374151",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "background 0.2s, color 0.2s"
                                      }}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Conditional Inputs */}
                              {videoBgType === "color" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Color</label>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="color"
                                      value={videoBgColor}
                                      onChange={(e: any) => setVideoBgColor(e.target.value)}
                                      style={{
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        width: "40px",
                                        height: "40px",
                                        padding: 0,
                                        cursor: "pointer",
                                        backgroundColor: "transparent"
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={videoBgColor}
                                      onChange={(e: any) => setVideoBgColor(e.target.value)}
                                      placeholder="#121212"
                                      className={styles.textInput}
                                      style={{ flex: 1, fontFamily: "monospace" }}
                                    />
                                  </div>
                                </div>
                              )}

                              {videoBgType === "image" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Image</label>
                                  {videoBgImage ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                      <img src={videoBgImage} alt="Video Bg" style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                                      <button
                                        type="button"
                                        onClick={() => setVideoBgImage("")}
                                        style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <label style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "10px 14px",
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      marginTop: "6px"
                                    }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>Upload Image</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={async (e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
                                                method: "POST",
                                                body: formData
                                              });
                                              if (res.ok) {
                                                const uploadResult = await res.json();
                                                setVideoBgImage(uploadResult.url);
                                              } else {
                                                alert("Image upload failed");
                                              }
                                            } catch (err) {
                                              console.error("Upload error:", err);
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              )}

                              {videoBgType === "video" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Video</label>
                                  {uploadingVideo && (
                                    <div style={{ marginTop: "6px", marginBottom: "8px" }}>
                                      <p style={{ fontSize: "0.82rem", color: "#111827", margin: "0 0 4px 0" }}>
                                        Uploading video ... {videoProgress !== null ? `${videoProgress}%` : ""}
                                      </p>
                                      <div style={{ width: "100%", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ width: `${videoProgress || 0}%`, height: "100%", backgroundColor: "#111827", transition: "width 0.3s" }} />
                                      </div>
                                    </div>
                                  )}

                                  {videoUrl ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                      <video src={videoUrl} autoPlay loop muted style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                                      <button
                                        type="button"
                                        onClick={() => setVideoUrl("")}
                                        style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <label style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "10px 14px",
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      marginTop: "6px"
                                    }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>Upload Video</span>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: "none" }}
                                        onChange={handleVideoUpload}
                                        disabled={uploadingVideo}
                                      />
                                    </label>
                                  )}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowVideo(true);
                                setVideoTitle("NEW ARRIVALS");
                                setVideoSubtitle("Drop's live. Smells divine. Feels better.");
                                setVideoUrl("");
                                setVideoFallbackColor("#57bc74");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Video Section to Defaults
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card 4: Lifestyle Section */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "lifestyle" ? null : "lifestyle")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Lifestyle Banner</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "lifestyle" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "lifestyle" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.toggleRow} style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className={styles.toggleLabel} style={{ fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>Display Lifestyle Banner on Storefront</span>
                              <CustomCheckbox
                                checked={showLifestyle}
                                onChange={(e: any) => setShowLifestyle(e.target.checked)}
                                style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                              />
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Lifestyle Overlay Text Copy</label>
                              <input
                                type="text"
                                value={lifestyleText}
                                onChange={(e: any) => setLifestyleText(e.target.value)}
                                placeholder="Intense notes, Raw elements. This is 29sFORMULA."
                                className={styles.textInput}
                                disabled={!showLifestyle}
                              />
                            </div>
                            <div className={styles.inputGroup} style={{ marginTop: "15px" }}>
                              <label className={styles.inputLabel}>Lifestyle Banner Background Image</label>
                              {uploadingLifestyle && <p style={{ fontSize: "0.82rem", color: "#111827", margin: "0 0 8px 0" }}>Uploading image...</p>}
                              {lifestyleImage ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                  <img src={lifestyleImage} alt="Lifestyle Preview" style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                                  <button
                                    type="button"
                                    onClick={() => setLifestyleImage("")}
                                    style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                                    disabled={!showLifestyle}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <label
                                  className={styles.fileUploadBtn}
                                  style={{
                                    margin: "6px 0 0 0",
                                    padding: "10px 16px",
                                    cursor: (!showLifestyle || uploadingLifestyle) ? "not-allowed" : "pointer",
                                    opacity: (!showLifestyle || uploadingLifestyle) ? 0.7 : 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px"
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                  </svg>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLifestyleImageUpload}
                                    style={{ display: "none" }}
                                    disabled={!showLifestyle || uploadingLifestyle}
                                  />
                                  <span>{uploadingLifestyle ? "Uploading..." : "Upload Image"}</span>
                                </label>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowLifestyle(true);
                                setLifestyleText("Intense notes, Raw elements. This is 29sFORMULA.");
                                setLifestyleImage("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Lifestyle Banner to Defaults
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card 5: Storefront Theme Settings */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "25px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "theme" ? null : "theme")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Storefront Theme Styling</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "theme" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "theme" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Primary Brand Theme Color</label>
                              <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "8px" }}>
                                <input
                                  type="color"
                                  value={primaryColor}
                                  onChange={(e: any) => setPrimaryColor(e.target.value)}
                                  style={{ width: "60px", height: "40px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", padding: "0", background: "transparent" }}
                                />
                                <input
                                  type="text"
                                  value={primaryColor}
                                  onChange={(e: any) => setPrimaryColor(e.target.value)}
                                  placeholder="#57bc74"
                                  className={styles.textInput}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>

                            <div className={styles.inputGroup} style={{ marginTop: "25px", borderTop: "1px solid #e5e7eb", paddingTop: "25px" }}>
                              <label className={styles.inputLabel}>Brand Logo Format</label>
                              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.95rem" }}>
                                  <input 
                                    type="radio" 
                                    name="brandLogoType"
                                    value="text" 
                                    checked={brandLogoType === "text"}
                                    onChange={(e: any) => setBrandLogoType(e.target.value)}
                                    style={{ width: "16px", height: "16px", accentColor: "#4f46e5" }}
                                  />
                                  Text Logo
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.95rem" }}>
                                  <input 
                                    type="radio" 
                                    name="brandLogoType"
                                    value="image" 
                                    checked={brandLogoType === "image"}
                                    onChange={(e: any) => setBrandLogoType(e.target.value)}
                                    style={{ width: "16px", height: "16px", accentColor: "#4f46e5" }}
                                  />
                                  Image Logo
                                </label>
                              </div>
                            </div>

                            <div className={styles.inputGroup} style={{ marginTop: "20px" }}>
                              <label className={styles.inputLabel}>
                                {brandLogoType === "text" ? "Brand Logo Text" : "Brand Logo Image"}
                              </label>
                              
                              {brandLogoType === "text" ? (
                                <input
                                  type="text"
                                  value={brandLogoValue}
                                  onChange={(e: any) => setBrandLogoValue(e.target.value)}
                                  placeholder="29sFORMULA"
                                  className={styles.textInput}
                                  style={{ marginTop: "8px" }}
                                />
                              ) : (
                                <div style={{ marginTop: "8px" }}>
                                  {uploadingLogo && <p style={{ fontSize: "0.82rem", color: "#111827", margin: "0 0 8px 0" }}>Uploading logo...</p>}
                                  {brandLogoValue && (brandLogoValue.startsWith("http") || brandLogoValue.startsWith("data:")) ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                      <img 
                                        src={brandLogoValue} 
                                        alt="Brand Logo Preview" 
                                        style={{ maxHeight: "50px", maxWidth: "160px", objectFit: "contain", borderRadius: "6px", border: "1px solid #e2e8f0", padding: "4px", backgroundColor: "#ffffff" }} 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setBrandLogoValue("")}
                                        style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#374151", fontWeight: 600, transition: "all 0.2s ease" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>{uploadingLogo ? "Uploading..." : "Upload Logo Image"}</span>
                                      <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/webp, image/svg+xml" 
                                        style={{ display: "none" }}
                                        onChange={handleBrandLogoUpload}
                                        disabled={uploadingLogo}
                                      />
                                    </label>
                                  )}
                                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "8px" }}>
                                    Recommended: Transparent PNG or SVG, max height 60px.
                                  </p>
                                </div>
                              )}
                            </div>                            <button
                              type="button"
                              onClick={() => {
                                setPrimaryColor("#57bc74");
                                setGoogleClientId("753896502014-yourmockclientid.apps.googleusercontent.com");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Section to Defaults
                            </button>
                          </div>
                        )}
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
                              <label className={styles.inputLabel}>Usage & Layering Guide Subtext</label>
                              <input
                                type="text"
                                value={usageGuideText}
                                onChange={(e: any) => setUsageGuideText(e.target.value)}
                                placeholder="Fits your mood. Handcrafted with scientific precision..."
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

          {/* Redesigned Customers Directory Tab */}
    </>
  );
}
