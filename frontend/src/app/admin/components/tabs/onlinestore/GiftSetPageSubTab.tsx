import React, { useState } from "react";
import styles from "../../../page.module.css";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";

const FONT_FAMILIES = [
  "Outfit",
  "Inter",
  "Roboto",
  "Playfair Display",
  "Cinzel",
  "Montserrat",
  "Cormorant Garamond",
  "Syne",
  "Cabinet Grotesk",
  "Plus Jakarta Sans",
  "Sora",
  "DM Sans",
  "Lora",
  "Poppins",
  "Bebas Neue",
  "Oswald",
  "Spectral",
  "Space Grotesk",
  "Cinzel Decorative",
  "Bodoni Moda",
  "Italiana",
  "Marcellus",
  "Tenor Sans"
];

export default function GiftSetPageSubTab({
  activeTab,
  error,
  handleSaveSettings,
  setActiveCustomizerSection,
  activeCustomizerSection,
  showGiftSetPage,
  setShowGiftSetPage,
  giftSetHeaderBadge,
  setGiftSetHeaderBadge,
  giftSetHeaderTitle,
  setGiftSetHeaderTitle,
  giftSetHeaderSubtitle,
  setGiftSetHeaderSubtitle,
  giftSetHeaderTitleFontType,
  setGiftSetHeaderTitleFontType,
  giftSetHeaderTitleFontSize,
  setGiftSetHeaderTitleFontSize,
  giftSetHeaderTitleFontColor,
  setGiftSetHeaderTitleFontColor,
  giftSetHeaderTitleFontWeight,
  setGiftSetHeaderTitleFontWeight,
  giftSetHeaderTitleFontAlignment,
  setGiftSetHeaderTitleFontAlignment,
  giftSetHeaderSubtitleFontType,
  setGiftSetHeaderSubtitleFontType,
  giftSetHeaderSubtitleFontSize,
  setGiftSetHeaderSubtitleFontSize,
  giftSetHeaderSubtitleFontColor,
  setGiftSetHeaderSubtitleFontColor,
  giftSetHeaderSubtitleFontWeight,
  setGiftSetHeaderSubtitleFontWeight,
  giftSetSizes,
  setGiftSetSizes,
  giftSetDefaultSize,
  setGiftSetDefaultSize,
  giftSetMaxFragrances,
  setGiftSetMaxFragrances,
  giftSetButtonText,
  setGiftSetButtonText,
  giftSetButtonColor,
  setGiftSetButtonColor,
  giftSetButtonTextColor,
  setGiftSetButtonTextColor,
  giftSetButtonStyle,
  setGiftSetButtonStyle,
  giftSetCardBorderColor,
  setGiftSetCardBorderColor,
  giftSetCardSelectedColor,
  setGiftSetCardSelectedColor,
  giftSetAccentColor,
  setGiftSetAccentColor,
  giftSetHeaderBgType,
  setGiftSetHeaderBgType,
  giftSetHeaderBgColor,
  setGiftSetHeaderBgColor,
  giftSetHeaderBgImage,
  setGiftSetHeaderBgImage,
  giftSetHeaderBgVideo,
  setGiftSetHeaderBgVideo,
  uploadingGiftSetHeaderImage,
  handleGiftSetHeaderImageUpload,
  uploadingGiftSetHeaderVideo,
  handleGiftSetHeaderVideoUpload,
  giftSetHeaderVideoProgress,
  loadingSettings,
  hasUnsavedChanges,
  setShowResetConfirmModal
}: any) {
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newSizeDesc, setNewSizeDesc] = useState("");

  // Pencil Edit Modal State ("badge" | "title" | "subtitle" | null)
  const [editingHeaderModal, setEditingHeaderModal] = useState<"badge" | "title" | "subtitle" | null>(null);

  const handleAddSize = () => {
    if (!newSizeName.trim()) return;
    const updated = [
      ...(giftSetSizes || []),
      {
        size: newSizeName.trim(),
        label: newSizeLabel.trim() || "Gift Set",
        description: newSizeDesc.trim() || "Custom fragrance set"
      }
    ];
    setGiftSetSizes(updated);
    setNewSizeName("");
    setNewSizeLabel("");
    setNewSizeDesc("");
  };

  const handleRemoveSize = (index: number) => {
    const updated = (giftSetSizes || []).filter((_: any, i: number) => i !== index);
    setGiftSetSizes(updated);
  };

  const handleUpdateSize = (index: number, field: string, value: string) => {
    const updated = (giftSetSizes || []).map((item: any, i: number) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setGiftSetSizes(updated);
  };

  const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
  );

  return (
    <>
      {activeTab === "online-store" && (
        <div className={styles.viewContainer}>
          {/* Section Heading & Page Visibility Badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#111827" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-9.75-13.5h19.5" />
                </svg>
              </div>
              <div>
                <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>
                  Gift Set Page Customization
                </h1>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "0.78rem",
                fontWeight: 600,
                backgroundColor: showGiftSetPage ? "#dcfce7" : "#fee2e2",
                color: showGiftSetPage ? "#15803d" : "#b91c1c",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: showGiftSetPage ? "#22c55e" : "#ef4444" }} />
                {showGiftSetPage ? "Page Visible on Storefront" : "Page Hidden from Storefront"}
              </span>
            </div>
          </div>

          <div className={styles.customizerContainer}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleSaveSettings} className={styles.customizerForm}>

              {/* CARD 1: Page Visibility Master Switch */}
              <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                <div
                  className={styles.accordionHeader}
                  onClick={() => setActiveCustomizerSection(activeCustomizerSection === "visibility" ? null : "visibility")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 className={styles.cardHeaderTitleNoBorder}>Storefront Page Visibility</h2>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`${styles.chevronIcon} ${activeCustomizerSection === "visibility" ? styles.chevronRotated : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {activeCustomizerSection === "visibility" && (
                  <div className={styles.accordionContent}>
                    <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "15px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", display: "block" }}>
                            Enable Gift Set Page
                          </label>
                          <span style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "2px", display: "block" }}>
                            When toggled ON, customers can visit <code style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>/gift-set</code> and build custom product gift boxes.
                          </span>
                        </div>
                        <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px", cursor: "pointer", flexShrink: 0 }}>
                          <input
                            type="checkbox"
                            checked={showGiftSetPage}
                            onChange={(e) => setShowGiftSetPage(e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: showGiftSetPage ? "#111827" : "#cbd5e1",
                            borderRadius: "34px",
                            transition: "0.3s"
                          }}>
                            <span style={{
                              position: "absolute",
                              content: '""',
                              height: "20px",
                              width: "20px",
                              left: showGiftSetPage ? "24px" : "3px",
                              bottom: "3px",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              transition: "0.3s"
                            }} />
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 2: Header Section & Typography */}
              <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                <div
                  className={styles.accordionHeader}
                  onClick={() => setActiveCustomizerSection(activeCustomizerSection === "header" ? null : "header")}
                >
                  <h2 className={styles.cardHeaderTitleNoBorder}>Header Banner, Background & Typography</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`${styles.chevronIcon} ${activeCustomizerSection === "header" ? styles.chevronRotated : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {activeCustomizerSection === "header" && (
                  <div className={styles.accordionContent}>
                    {/* Header Background Option (Color, Image, Video via Cloudinary) */}
                    <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                      <label className={styles.inputLabel} style={{ fontWeight: 700, color: "#111827", marginBottom: "8px", display: "block" }}>
                        Header Banner Background (Color / Image / Video)
                      </label>
                      <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                        {["color", "image", "video"].map((type) => (
                          <label key={type} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", textTransform: "capitalize", fontSize: "0.9rem", fontWeight: 600 }}>
                            <input
                              type="radio"
                              name="giftSetHeaderBgType"
                              value={type}
                              checked={giftSetHeaderBgType === type}
                              onChange={(e) => setGiftSetHeaderBgType(e.target.value)}
                            />
                            {type === "image" ? "Image" : type === "video" ? "Video" : "Solid Color"}
                          </label>
                        ))}
                      </div>

                      {giftSetHeaderBgType === "color" && (
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel} style={{ fontSize: "0.82rem" }}>Header Background Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={giftSetHeaderBgColor}
                              onChange={(e) => setGiftSetHeaderBgColor(e.target.value)}
                              style={{ width: "40px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                            />
                            <input
                              type="text"
                              value={giftSetHeaderBgColor}
                              onChange={(e) => setGiftSetHeaderBgColor(e.target.value)}
                              className={styles.textInput}
                              style={{ flex: 1 }}
                            />
                          </div>
                        </div>
                      )}

                      {giftSetHeaderBgType === "image" && (
                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.82rem" }}>Background Image</label>
                          {uploadingGiftSetHeaderImage ? (
                            <p style={{ fontSize: "0.82rem", color: "#111827", margin: "6px 0 0 0" }}>Uploading image...</p>
                          ) : giftSetHeaderBgImage ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                              <img src={giftSetHeaderBgImage} alt="Header Bg" style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                              <button
                                type="button"
                                onClick={() => setGiftSetHeaderBgImage("")}
                                style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleGiftSetHeaderImageUpload}
                              className={styles.textInput}
                              style={{ height: "auto", padding: "8px", marginTop: "6px" }}
                            />
                          )}
                        </div>
                      )}

                      {giftSetHeaderBgType === "video" && (
                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.82rem" }}>Background Video</label>
                          {uploadingGiftSetHeaderVideo ? (
                            <div style={{ marginTop: "6px", marginBottom: "8px" }}>
                              <p style={{ fontSize: "0.82rem", color: "#111827", margin: "0 0 4px 0" }}>
                                Uploading video ... {giftSetHeaderVideoProgress !== null ? `${giftSetHeaderVideoProgress}%` : ""}
                              </p>
                              <div style={{ width: "100%", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                                <div style={{ width: `${giftSetHeaderVideoProgress || 0}%`, height: "100%", backgroundColor: "#111827", transition: "width 0.3s" }} />
                              </div>
                            </div>
                          ) : giftSetHeaderBgVideo ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                              <video src={giftSetHeaderBgVideo} autoPlay loop muted style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                              <button
                                type="button"
                                onClick={() => setGiftSetHeaderBgVideo("")}
                                style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleGiftSetHeaderVideoUpload}
                              className={styles.textInput}
                              style={{ height: "auto", padding: "8px", marginTop: "6px" }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Badge Text Field with Pencil Icon */}
                    <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label className={styles.inputLabel} style={{ margin: 0 }}>HEADER TOP BADGE</label>
                        <button
                          type="button"
                          onClick={() => setEditingHeaderModal("badge")}
                          style={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            color: "#111827",
                            padding: "4px 8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem",
                            fontWeight: 600
                          }}
                          title="Edit Top Badge typography"
                        >
                          <PencilIcon />
                          <span>Edit Badge</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={giftSetHeaderBadge}
                        onChange={(e) => setGiftSetHeaderBadge(e.target.value)}
                        placeholder="CURATE · GIFT · DELIGHT"
                        className={styles.textInput}
                      />
                    </div>

                    {/* Title Text Field with Pencil Icon */}
                    <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label className={styles.inputLabel} style={{ margin: 0 }}>PAGE TITLE</label>
                        <button
                          type="button"
                          onClick={() => setEditingHeaderModal("title")}
                          style={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            color: "#111827",
                            padding: "4px 8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem",
                            fontWeight: 600
                          }}
                          title="Edit Title typography & styling"
                        >
                          <PencilIcon />
                          <span>Edit Title</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={giftSetHeaderTitle}
                        onChange={(e) => setGiftSetHeaderTitle(e.target.value)}
                        placeholder="Build Your Gift Set"
                        className={styles.textInput}
                      />
                    </div>

                    {/* Title Typography Inline Quick-Controls */}
                    <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>Title Typography Quick Controls</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Family</label>
                          <select
                            value={giftSetHeaderTitleFontType}
                            onChange={(e) => setGiftSetHeaderTitleFontType(e.target.value)}
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem" }}
                          >
                            {FONT_FAMILIES.map((font) => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Size</label>
                          <input
                            type="text"
                            value={giftSetHeaderTitleFontSize}
                            onChange={(e) => setGiftSetHeaderTitleFontSize(e.target.value)}
                            placeholder="3.5rem"
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem" }}
                          />
                        </div>

                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Color</label>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={giftSetHeaderTitleFontColor}
                              onChange={(e) => setGiftSetHeaderTitleFontColor(e.target.value)}
                              style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            />
                            <input
                              type="text"
                              value={giftSetHeaderTitleFontColor}
                              onChange={(e) => setGiftSetHeaderTitleFontColor(e.target.value)}
                              className={styles.textInput}
                              style={{ height: "36px", fontSize: "0.85rem", flex: 1 }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Weight</label>
                          <select
                            value={giftSetHeaderTitleFontWeight}
                            onChange={(e) => setGiftSetHeaderTitleFontWeight(e.target.value)}
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem" }}
                          >
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">Semi-Bold (600)</option>
                            <option value="700">Bold (700)</option>
                            <option value="800">Extra Bold (800)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Subtitle Text Field with Pencil Icon */}
                    <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label className={styles.inputLabel} style={{ margin: 0 }}>PAGE SUBTITLE</label>
                        <button
                          type="button"
                          onClick={() => setEditingHeaderModal("subtitle")}
                          style={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            color: "#111827",
                            padding: "4px 8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem",
                            fontWeight: 600
                          }}
                          title="Edit Subtitle typography"
                        >
                          <PencilIcon />
                          <span>Edit Subtitle</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={giftSetHeaderSubtitle}
                        onChange={(e) => setGiftSetHeaderSubtitle(e.target.value)}
                        placeholder="Pick any 3 items to build your bundle"
                        className={styles.textInput}
                      />
                    </div>

                    {/* Subtitle Typography Quick Controls */}
                    <div style={{ backgroundColor: "#f9fafb", padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>Subtitle Typography Quick Controls</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Family</label>
                          <select
                            value={giftSetHeaderSubtitleFontType}
                            onChange={(e) => setGiftSetHeaderSubtitleFontType(e.target.value)}
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem" }}
                          >
                            {FONT_FAMILIES.map((font) => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Size</label>
                          <input
                            type="text"
                            value={giftSetHeaderSubtitleFontSize}
                            onChange={(e) => setGiftSetHeaderSubtitleFontSize(e.target.value)}
                            placeholder="1.1rem"
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem" }}
                          />
                        </div>

                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Color</label>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={giftSetHeaderSubtitleFontColor}
                              onChange={(e) => setGiftSetHeaderSubtitleFontColor(e.target.value)}
                              style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            />
                            <input
                              type="text"
                              value={giftSetHeaderSubtitleFontColor}
                              onChange={(e) => setGiftSetHeaderSubtitleFontColor(e.target.value)}
                              className={styles.textInput}
                              style={{ height: "36px", fontSize: "0.85rem", flex: 1 }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Weight</label>
                          <select
                            value={giftSetHeaderSubtitleFontWeight}
                            onChange={(e) => setGiftSetHeaderSubtitleFontWeight(e.target.value)}
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem" }}
                          >
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">Semi-Bold (600)</option>
                            <option value="700">Bold (700)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 3: Size Options & Selection Rules */}
              <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                <div
                  className={styles.accordionHeader}
                  onClick={() => setActiveCustomizerSection(activeCustomizerSection === "sizes" ? null : "sizes")}
                >
                  <h2 className={styles.cardHeaderTitleNoBorder}>Size Options & Selection Rules</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`${styles.chevronIcon} ${activeCustomizerSection === "sizes" ? styles.chevronRotated : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {activeCustomizerSection === "sizes" && (
                  <div className={styles.accordionContent}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                      <div>
                        <label className={styles.inputLabel}>Default Selected Size</label>
                        <select
                          value={giftSetDefaultSize}
                          onChange={(e) => setGiftSetDefaultSize(e.target.value)}
                          className={styles.textInput}
                        >
                          {(giftSetSizes || []).map((item: any) => (
                            <option key={item.size} value={item.size}>{item.size} — {item.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={styles.inputLabel}>Max Products / Items Per Set</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={giftSetMaxFragrances}
                          onChange={(e) => setGiftSetMaxFragrances(Number(e.target.value))}
                          className={styles.textInput}
                        />
                      </div>
                    </div>

                    {/* Active Size Cards */}
                    <div style={{ marginBottom: "20px" }}>
                      <label className={styles.inputLabel} style={{ fontWeight: 700, marginBottom: "10px", display: "block" }}>
                        Configured Box / Set Sizes ({giftSetSizes?.length || 0})
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(giftSetSizes || []).map((item: any, idx: number) => (
                          <div key={idx} style={{ padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff", display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ width: "120px" }}>
                              <input
                                type="text"
                                value={item.size}
                                onChange={(e) => handleUpdateSize(idx, "size", e.target.value)}
                                placeholder="Size (e.g. Pack of 3)"
                                className={styles.textInput}
                                style={{ height: "34px", fontSize: "0.82rem", fontWeight: 700 }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleUpdateSize(idx, "label", e.target.value)}
                                placeholder="Title (e.g. Starter Box)"
                                className={styles.textInput}
                                style={{ height: "34px", fontSize: "0.82rem", marginBottom: "4px" }}
                              />
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleUpdateSize(idx, "description", e.target.value)}
                                placeholder="Subtitle / Description"
                                className={styles.textInput}
                                style={{ height: "30px", fontSize: "0.78rem", color: "#64748b" }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSize(idx)}
                              style={{ border: "none", backgroundColor: "#fee2e2", color: "#ef4444", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
                              title="Delete size option"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add New Size Form */}
                    <div style={{ padding: "12px", border: "1px dashed #cbd5e1", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "8px" }}>
                        + Add New Size Option
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr auto", gap: "8px", alignItems: "center" }}>
                        <input
                          type="text"
                          value={newSizeName}
                          onChange={(e) => setNewSizeName(e.target.value)}
                          placeholder="e.g. Pack of 3"
                          className={styles.textInput}
                          style={{ height: "34px", fontSize: "0.82rem" }}
                        />
                        <input
                          type="text"
                          value={newSizeLabel}
                          onChange={(e) => setNewSizeLabel(e.target.value)}
                          placeholder="Label (e.g. Starter Box)"
                          className={styles.textInput}
                          style={{ height: "34px", fontSize: "0.82rem" }}
                        />
                        <input
                          type="text"
                          value={newSizeDesc}
                          onChange={(e) => setNewSizeDesc(e.target.value)}
                          placeholder="Description"
                          className={styles.textInput}
                          style={{ height: "34px", fontSize: "0.82rem" }}
                        />
                        <button
                          type="button"
                          onClick={handleAddSize}
                          style={{ backgroundColor: "#111827", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          Add Size
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 4: Call to Action (CTA) Button */}
              <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                <div
                  className={styles.accordionHeader}
                  onClick={() => setActiveCustomizerSection(activeCustomizerSection === "button" ? null : "button")}
                >
                  <h2 className={styles.cardHeaderTitleNoBorder}>CTA Add to Cart Button</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`${styles.chevronIcon} ${activeCustomizerSection === "button" ? styles.chevronRotated : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {activeCustomizerSection === "button" && (
                  <div className={styles.accordionContent}>
                    <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                      <label className={styles.inputLabel}>Button Label Text</label>
                      <input
                        type="text"
                        value={giftSetButtonText}
                        onChange={(e) => setGiftSetButtonText(e.target.value)}
                        placeholder="Add Gift Box to Cart"
                        className={styles.textInput}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                      <div>
                        <label className={styles.inputLabel}>Button Fill Color</label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={giftSetButtonColor}
                            onChange={(e) => setGiftSetButtonColor(e.target.value)}
                            style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          />
                          <input
                            type="text"
                            value={giftSetButtonColor}
                            onChange={(e) => setGiftSetButtonColor(e.target.value)}
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem", flex: 1 }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={styles.inputLabel}>Button Text Color</label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={giftSetButtonTextColor}
                            onChange={(e) => setGiftSetButtonTextColor(e.target.value)}
                            style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          />
                          <input
                            type="text"
                            value={giftSetButtonTextColor}
                            onChange={(e) => setGiftSetButtonTextColor(e.target.value)}
                            className={styles.textInput}
                            style={{ height: "36px", fontSize: "0.85rem", flex: 1 }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={styles.inputLabel}>Button Style</label>
                        <select
                          value={giftSetButtonStyle}
                          onChange={(e) => setGiftSetButtonStyle(e.target.value)}
                          className={styles.textInput}
                          style={{ height: "36px", fontSize: "0.85rem" }}
                        >
                          <option value="solid">Solid Fill</option>
                          <option value="outline">Outline Border</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save and Reset Row */}
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
                  {loadingSettings ? "Saving Settings..." : "Save Gift Set Customizations"}
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
            </form>
          </div>
        </div>
      )}

      {/* Field Pencil Edit Modal */}
      {editingHeaderModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "520px",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#111827" }}><PencilIcon /></span>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                  Edit {editingHeaderModal === "badge" ? "Header Top Badge" : editingHeaderModal === "title" ? "Page Title" : "Page Subtitle"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingHeaderModal(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {/* Field Text Input */}
            <div className={styles.inputGroup} style={{ marginBottom: "16px" }}>
              <label className={styles.inputLabel}>Text Content</label>
              {editingHeaderModal === "badge" && (
                <input
                  type="text"
                  value={giftSetHeaderBadge}
                  onChange={(e) => setGiftSetHeaderBadge(e.target.value)}
                  className={styles.textInput}
                />
              )}
              {editingHeaderModal === "title" && (
                <input
                  type="text"
                  value={giftSetHeaderTitle}
                  onChange={(e) => setGiftSetHeaderTitle(e.target.value)}
                  className={styles.textInput}
                />
              )}
              {editingHeaderModal === "subtitle" && (
                <input
                  type="text"
                  value={giftSetHeaderSubtitle}
                  onChange={(e) => setGiftSetHeaderSubtitle(e.target.value)}
                  className={styles.textInput}
                />
              )}
            </div>

            {/* Field Specific Typography Options */}
            {editingHeaderModal === "title" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Family</label>
                  <select
                    value={giftSetHeaderTitleFontType}
                    onChange={(e) => setGiftSetHeaderTitleFontType(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Size</label>
                  <input
                    type="text"
                    value={giftSetHeaderTitleFontSize}
                    onChange={(e) => setGiftSetHeaderTitleFontSize(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Color</label>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={giftSetHeaderTitleFontColor}
                      onChange={(e) => setGiftSetHeaderTitleFontColor(e.target.value)}
                      style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={giftSetHeaderTitleFontColor}
                      onChange={(e) => setGiftSetHeaderTitleFontColor(e.target.value)}
                      className={styles.textInput}
                      style={{ height: "36px", fontSize: "0.85rem", flex: 1 }}
                    />
                  </div>
                </div>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Weight</label>
                  <select
                    value={giftSetHeaderTitleFontWeight}
                    onChange={(e) => setGiftSetHeaderTitleFontWeight(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                  </select>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Alignment</label>
                  <select
                    value={giftSetHeaderTitleFontAlignment}
                    onChange={(e) => setGiftSetHeaderTitleFontAlignment(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {editingHeaderModal === "subtitle" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Family</label>
                  <select
                    value={giftSetHeaderSubtitleFontType}
                    onChange={(e) => setGiftSetHeaderSubtitleFontType(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Size</label>
                  <input
                    type="text"
                    value={giftSetHeaderSubtitleFontSize}
                    onChange={(e) => setGiftSetHeaderSubtitleFontSize(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Color</label>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={giftSetHeaderSubtitleFontColor}
                      onChange={(e) => setGiftSetHeaderSubtitleFontColor(e.target.value)}
                      style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={giftSetHeaderSubtitleFontColor}
                      onChange={(e) => setGiftSetHeaderSubtitleFontColor(e.target.value)}
                      className={styles.textInput}
                      style={{ height: "36px", fontSize: "0.85rem", flex: 1 }}
                    />
                  </div>
                </div>
                <div>
                  <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Font Weight</label>
                  <select
                    value={giftSetHeaderSubtitleFontWeight}
                    onChange={(e) => setGiftSetHeaderSubtitleFontWeight(e.target.value)}
                    className={styles.textInput}
                    style={{ height: "36px", fontSize: "0.85rem" }}
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>
            )}

            {editingHeaderModal === "badge" && (
              <div style={{ marginBottom: "16px" }}>
                <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Badge Style Note</label>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                  Badge color adapts to your configured accent color. Top badge text is displayed in uppercase tracked styling.
                </p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setEditingHeaderModal(null)}
                style={{
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Done Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
