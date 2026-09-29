import React, { useState } from 'react';
import styles from '../../page.module.css';
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import { TRUST_ICON_LIBRARY, renderTrustIcon } from "@/components/home/TrustIconLibrary";

interface MarketingTabProps {
  activeTab: any;
  customizeSubTab?: any;
  showTicker: any;
  setShowTicker: any;
  saveSettingsSilent: any;
  tickerText: any;
  setTickerText: any;
  tickerDirection?: any;
  setTickerDirection?: any;
  tickerSpeed: any;
  setTickerSpeed: any;
  tickerBgColor: any;
  setTickerBgColor: any;
  tickerTextColor: any;
  setTickerTextColor: any;
  showTrustMarquee?: any;
  setShowTrustMarquee?: any;
  trustMarqueeDirection?: any;
  setTrustMarqueeDirection?: any;
  trustMarqueeSpeed?: any;
  setTrustMarqueeSpeed?: any;
  trustMarqueeItems?: any[];
  setTrustMarqueeItems?: any;
  setSuccessMessage: any;
  hasUnsavedChanges: boolean;
}

export default function MarketingTab({
  activeTab,
  customizeSubTab,
  showTicker,
  setShowTicker,
  saveSettingsSilent,
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
  setSuccessMessage,
  hasUnsavedChanges,
}: MarketingTabProps) {
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
    const updated = trustMarqueeItems.filter((_, i) => i !== index);
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
      {activeTab === "online-store" && customizeSubTab === "marketing" && (
        <div className={styles.viewContainer}>
          <div style={{ marginBottom: "20px" }}>
            <h1 className={styles.pageHeading} style={{ margin: 0 }}>Marketing Campaigns & Promos</h1>
          </div>

          {/* 1. Active Marquee Announcements (Top Header Bar) */}
          <div className={styles.dashboardCard} style={{ marginTop: "20px" }}>
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
                      onClick={() => setShowTicker(!showTicker)}
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
                {/* Marquee Controls - Direction Left, Speed Right */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                  {/* Direction Buttons */}
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

                  {/* Speed Slider (Right-aligned) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#374151", marginRight: "4px" }}>
                      Speed: {tickerSpeed}s
                    </span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>Fast</span>
                    <input
                      type="range"
                      value={tickerSpeed}
                      onChange={(e) => setTickerSpeed(Number(e.target.value))}
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
                      onChange={(e) => setTickerText(e.target.value)}
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
                          onChange={(e) => setTickerBgColor(e.target.value)}
                          style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={tickerBgColor}
                          onChange={(e) => setTickerBgColor(e.target.value)}
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
                          onChange={(e) => setTickerTextColor(e.target.value)}
                          style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={tickerTextColor}
                          onChange={(e) => setTickerTextColor(e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Hero Trust Badges Marquee Section (Below Hero) */}
          <div className={styles.dashboardCard} style={{ marginTop: "12px" }}>
            {/* Header with Enabled Toggle Switch & Dropdown Click */}
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
                {/* Marquee Controls - Direction Left, Speed Right */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                  {/* Direction Buttons (No Prefix Label) */}
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

                  {/* Speed Slider (Right-aligned) */}
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

                {/* Trust Items List */}
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
                          {/* Drag Handle Grip Icon */}
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

                          {/* Icon Clickable Picker Button */}
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

                          {/* Badge Title Input */}
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

            {/* Save Button */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                disabled={!hasUnsavedChanges}
                onClick={async () => {
                  await saveSettingsSilent();
                  setSuccessMessage("Marketing & Marquee settings saved successfully!");
                  setTimeout(() => setSuccessMessage(null), 3000);
                }}
                style={{
                  backgroundColor: hasUnsavedChanges ? "#111827" : "#e5e7eb",
                  color: hasUnsavedChanges ? "white" : "#9ca3af",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: hasUnsavedChanges ? "pointer" : "not-allowed",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              >
                Save Marketing & Trust Settings
              </button>
            </div>
        </div>
      )}

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
