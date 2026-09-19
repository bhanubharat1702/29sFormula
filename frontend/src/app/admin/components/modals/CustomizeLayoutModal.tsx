import React, { useState, useEffect } from 'react';
import styles from "../../page.module.css";
import { LayoutCustomizationConfig } from '../../types';
import { fontCategories } from '../../constants/fonts';

import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";

interface CustomizeLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: LayoutCustomizationConfig) => void;
  initialConfig: LayoutCustomizationConfig;
  sectionName?: string;
  primaryColor?: string;
}

export default function CustomizeLayoutModal({
  isOpen,
  onClose,
  onApply,
  initialConfig,
  sectionName = "Hero Section",
  primaryColor = "#57bc74"
}: CustomizeLayoutModalProps) {
  
  // Local copies of the config
  const [titleText, setTitleText] = useState(initialConfig.titleText);
  const [showTitle, setShowTitle] = useState(initialConfig.showTitle);
  const [titleFontType, setTitleFontType] = useState(initialConfig.titleFontType);
  const [titleFontSize, setTitleFontSize] = useState(initialConfig.titleFontSize);
  const [titleFontColor, setTitleFontColor] = useState(initialConfig.titleFontColor);
  const [titleFontWeight, setTitleFontWeight] = useState(initialConfig.titleFontWeight);
  const [titleFontAlignment, setTitleFontAlignment] = useState(initialConfig.titleFontAlignment);
  
  const [manifestoText, setManifestoText] = useState(initialConfig.manifestoText);
  const [showManifesto, setShowManifesto] = useState(initialConfig.showManifesto);
  const [manifestoFontType, setManifestoFontType] = useState(initialConfig.manifestoFontType);
  const [manifestoFontSize, setManifestoFontSize] = useState(initialConfig.manifestoFontSize);
  const [manifestoFontColor, setManifestoFontColor] = useState(initialConfig.manifestoFontColor);
  const [manifestoFontWeight, setManifestoFontWeight] = useState(initialConfig.manifestoFontWeight);
  const [manifestoFontAlignment, setManifestoFontAlignment] = useState(initialConfig.manifestoFontAlignment);
  
  const [buttonText, setButtonText] = useState(initialConfig.buttonText);
  const [showButton, setShowButton] = useState(initialConfig.showButton);
  const [buttonStyle, setButtonStyle] = useState(initialConfig.buttonStyle);
  const [buttonSize, setButtonSize] = useState(initialConfig.buttonSize);
  const [buttonColor, setButtonColor] = useState(initialConfig.buttonColor);
  const [buttonTextColor, setButtonTextColor] = useState(initialConfig.buttonTextColor);
  
  const [layoutTemplate, setLayoutTemplate] = useState(initialConfig.layoutTemplate);
  const [bgType, setBgType] = useState(initialConfig.bgType);
  const [bgColor, setBgColor] = useState(initialConfig.bgColor);
  const [bgImage, setBgImage] = useState(initialConfig.bgImage);
  const [bgVideo, setBgVideo] = useState(initialConfig.bgVideo);

  // Local state for UI
  const [selectedElement, setSelectedElement] = useState<"title" | "manifesto" | "button" | null>("title");
  
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontDropdownCoords, setFontDropdownCoords] = useState<{top: number, left: number, width: number} | null>(null);
  const [hoveredFontType, setHoveredFontType] = useState<string | null>(null);
  
  const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState(false);
  const [fontSizeDropdownCoords, setFontSizeDropdownCoords] = useState<{top: number, left: number, width: number} | null>(null);
  const [hoveredFontSize, setHoveredFontSize] = useState<string | null>(null);
  
  const [isFontWeightDropdownOpen, setIsFontWeightDropdownOpen] = useState(false);
  const [fontWeightDropdownCoords, setFontWeightDropdownCoords] = useState<{top: number, left: number, width: number} | null>(null);
  const [hoveredFontWeight, setHoveredFontWeight] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<any>({
    title: { fontType: titleFontType, fontSize: titleFontSize, fontColor: titleFontColor, fontAlignment: titleFontAlignment, fontWeight: titleFontWeight, fontVerticalAlignment: "bottom", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 },
    manifesto: { fontType: manifestoFontType, fontSize: manifestoFontSize, fontColor: manifestoFontColor, fontAlignment: manifestoFontAlignment, fontWeight: manifestoFontWeight, fontVerticalAlignment: "top", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 },
    button: { fontType: "Outfit", fontSize: "0.85rem", fontColor: "#ffffff", fontAlignment: "center", fontWeight: "700", fontVerticalAlignment: "middle", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 }
  });

  const updateDraft = (key: string, value: any) => {
    if (!selectedElement) return;
    setDrafts((prev: any) => ({ ...prev, [selectedElement]: { ...prev[selectedElement], [key]: value } }));
  };

  const [isDraggingTitle, setIsDraggingTitle] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStartCoords, setResizeStartCoords] = useState({ x: 0, y: 0, startWidth: 100, startHeight: 0, startX: 0, startY: 0 });
  const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dynamically load Google Font for Realtime Preview
  useEffect(() => {
    const fontToLoad = hoveredFontType || (selectedElement && drafts[selectedElement] ? drafts[selectedElement].fontType : null);
    if (!fontToLoad) return;
    const systemFonts = ["SF Pro", "New York", "SF Mono", "Segoe UI", "Helvetica Neue", "Georgia", "Garamond"];
    if (systemFonts.includes(fontToLoad)) return;
    const fontId = "dynamic-font-admin-" + fontToLoad.replace(/\s+/g, "-").toLowerCase();
    if (document.getElementById(fontId)) return;

    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontToLoad.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }, [drafts, selectedElement, hoveredFontType]);

  // Drag and drop event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingTitle) {
        updateDraft('positionX', e.clientX - dragStartCoords.x);
        updateDraft('positionY', e.clientY - dragStartCoords.y);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartCoords.x;
        const deltaY = e.clientY - resizeStartCoords.y;

        let newWidth = resizeStartCoords.startWidth;
        let newPosX = resizeStartCoords.startX;
        let newPosY = resizeStartCoords.startY;
        let newHeight = resizeStartCoords.startHeight;

        const containerElem = document.getElementById("preview-container");
        const containerWidth = containerElem ? containerElem.getBoundingClientRect().width : 1150;

        if (isResizing.includes("e")) {
          newWidth = resizeStartCoords.startWidth + (deltaX / containerWidth * 100);
          if (newWidth > 400) newWidth = 400; 
          if (newWidth < 5) newWidth = 5;
          const actualDeltaX = (newWidth - resizeStartCoords.startWidth) / 100 * containerWidth;
          newPosX = resizeStartCoords.startX + (actualDeltaX / 2);
        } else if (isResizing.includes("w")) {
          newWidth = resizeStartCoords.startWidth - (deltaX / containerWidth * 100);
          if (newWidth > 400) newWidth = 400; 
          if (newWidth < 5) newWidth = 5;
          const actualDeltaX = -(newWidth - resizeStartCoords.startWidth) / 100 * containerWidth;
          newPosX = resizeStartCoords.startX + (actualDeltaX / 2);
        }

        const verticalAlign = selectedElement ? drafts[selectedElement].fontVerticalAlignment : "top";

        if (isResizing.includes("s")) {
          newHeight = resizeStartCoords.startHeight + deltaY;
          if (newHeight < 0) newHeight = 0;
          const actualDeltaY = newHeight - resizeStartCoords.startHeight;
          if (verticalAlign === "middle") newPosY = resizeStartCoords.startY + (actualDeltaY / 2);
          else if (verticalAlign === "bottom") newPosY = resizeStartCoords.startY + actualDeltaY;
        } else if (isResizing.includes("n")) {
          newHeight = resizeStartCoords.startHeight - deltaY;
          if (newHeight < 0) newHeight = 0;
          const actualDeltaY = -(newHeight - resizeStartCoords.startHeight);
          if (verticalAlign === "middle") newPosY = resizeStartCoords.startY + (actualDeltaY / 2);
          else if (verticalAlign === "top") newPosY = resizeStartCoords.startY - actualDeltaY;
        }

        setDrafts((prev: any) => {
          if (!selectedElement) return prev;
          const updates: any = { maxWidth: newWidth, positionX: newPosX };
          if (isResizing.includes("n") || isResizing.includes("s")) {
            updates.minHeight = newHeight;
            updates.positionY = newPosY;
          }
          return {
            ...prev,
            [selectedElement]: {
              ...prev[selectedElement],
              ...updates
            }
          };
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTitle(false);
      setIsResizing(null);
    };

    if (isDraggingTitle || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingTitle, dragStartCoords, isResizing, resizeStartCoords, selectedElement]);

  const handleApply = () => {
    onApply({
      titleText,
      titleFontType,
      titleFontColor,
      titleFontSize,
      titleFontAlignment,
      titleFontWeight,
      showTitle,
      
      manifestoText,
      manifestoFontType,
      manifestoFontColor,
      manifestoFontSize,
      manifestoFontAlignment,
      manifestoFontWeight,
      showManifesto,
      
      buttonText,
      buttonStyle,
      buttonSize,
      buttonColor,
      buttonTextColor,
      showButton,
      
      layoutTemplate,
      bgType,
      bgColor,
      bgImage,
      bgVideo,
    });
  };

  if (!isOpen) return null;

  return (
    <>

        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15000,
            padding: "20px"
          }}
          onClick={onClose}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "95vw",
              maxWidth: "1280px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "95vh",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              borderBottom: "1px solid #f3f4f6",
              backgroundColor: "#fafafa"
            }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                  {`Customize ${sectionName}`}
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                  Select a layout template structure, and click on any text box or button in the live preview to edit its content or toggle its visibility.
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: 1,
                  padding: "8px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Split layout for settings and preview */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: "65vh" }}>
              
              {/* Left sidebar: Templates and Active component settings */}
              <div style={{
                width: "420px",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                backgroundColor: "#ffffff",
                padding: "24px",
                boxSizing: "border-box"
              }}>
                {/* 1. Visual Layout Templates Selector */}
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                  1. Page Structure Layout Template
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "30px" }}>
                  {[
                    {
                      id: "center",
                      label: "Classic Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="15" x2="75" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="23" x2="65" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "top-center",
                      label: "Top Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="10" x2="75" y2="10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="17" x2="65" y2="17" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="24" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "bottom-center",
                      label: "Bottom Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="22" x2="75" y2="22" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="29" x2="65" y2="29" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="36" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "left",
                      label: "Left Centered",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="15" x2="55" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="23" x2="60" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "bottom-left",
                      label: "Bottom Left",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="23" x2="50" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="31" x2="60" y2="31" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="38" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "top-left",
                      label: "Top Left",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="12" x2="50" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="20" x2="60" y2="20" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="28" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right",
                      label: "Right Centered",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="15" x2="88" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="23" x2="88" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right-top",
                      label: "Right Top",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="12" x2="88" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="20" x2="88" y2="20" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="28" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right-bottom",
                      label: "Right Bottom",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="23" x2="88" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="31" x2="88" y2="31" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="38" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    }
                  ].map((t) => {
                    const isSelected = layoutTemplate === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setLayoutTemplate(t.id)}
                        style={{
                          flex: 1,
                          background: "none",
                          border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          alignItems: "center",
                          outline: "none",
                          transition: "all 0.2s"
                        }}
                      >
                        {t.icon}
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? "#3b82f6" : "#475569" }}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Component Customizer */}
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                  2. Component Editor
                </h4>

                {selectedElement ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                    <div style={{ backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #eff6ff" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#2563eb" }}>
                        Selected Element
                      </span>
                      <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "2px 0 0 0", color: "#0f172a", textTransform: "capitalize" }}>
                        {selectedElement === "title" ? "Hero Title" : selectedElement === "manifesto" ? "Hero Manifesto" : "CTA Button"}
                      </h5>
                    </div>

                    {/* Visibility Switch */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                        Enable Element Visibility
                      </span>
                      <CustomCheckbox
                        checked={
                          selectedElement === "title" ? showTitle :
                          selectedElement === "manifesto" ? showManifesto :
                          showButton
                        }
                        onChange={(e) => {
                          const val = e.target.checked;
                          if (selectedElement === "title") setShowTitle(val);
                          else if (selectedElement === "manifesto") setShowManifesto(val);
                          else setShowButton(val);
                        }}
                        style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                      />
                    </div>

                    {/* Text Field Inputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                        Content / Label Text
                      </label>
                      {selectedElement === "manifesto" ? (
                        <textarea
                          value={manifestoText}
                          onChange={(e) => setManifestoText(e.target.value)}
                          disabled={!showManifesto}
                          rows={4}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.88rem",
                            width: "100%",
                            resize: "vertical",
                            boxSizing: "border-box",
                            color: "#000",
                            opacity: showManifesto ? 1 : 0.5
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={selectedElement === "title" ? titleText : buttonText}
                          onChange={(e) => {
                            if (selectedElement === "title") setTitleText(e.target.value);
                            else setButtonText(e.target.value);
                          }}
                          disabled={selectedElement === "title" ? !showTitle : !showButton}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.88rem",
                            width: "100%",
                            boxSizing: "border-box",
                            color: "#000",
                            opacity: (selectedElement === "title" ? showTitle : showButton) ? 1 : 0.5
                          }}
                        />
                      )}
                    </div>

                    {/* Font & Style options - Only for text elements */}
                    {selectedElement !== "button" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                        
                        {/* Font Type Selection (Custom Dropdown with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Family</label>
                          
                          {/* Trigger element */}
                          <div
                            onClick={(e) => {
                              if (!isFontDropdownOpen) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setFontDropdownCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                              }
                              setIsFontDropdownOpen(!isFontDropdownOpen);
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600,
                              fontFamily: selectedElement === "title" ? `"${titleFontType}", sans-serif` : `"${manifestoFontType}", sans-serif`
                            }}
                          >
                            <span>
                              {selectedElement === "title" ? titleFontType : manifestoFontType}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover overlay */}
                          {isFontDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontDropdownOpen(false); setHoveredFontType(null); }} />
                              <div style={{
                                position: "fixed",
                                top: fontDropdownCoords?.top || 0,
                                left: fontDropdownCoords?.left || 0,
                                width: fontDropdownCoords?.width || 280,
                                minWidth: "280px",
                                maxHeight: "320px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {fontCategories.map((cat, catIdx) => (
                                  <div key={catIdx}>
                                    <div style={{
                                      padding: "6px 12px",
                                      fontSize: "0.68rem",
                                      fontWeight: 800,
                                      color: "#94a3b8",
                                      backgroundColor: "#f8fafc",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                      borderBottom: "1px solid #f1f5f9"
                                    }}>
                                      {cat.category}
                                    </div>
                                    {cat.fonts.map((f) => {
                                      const isSelected = (selectedElement === "title" ? titleFontType : manifestoFontType) === f.name;
                                      return (
                                        <div
                                          key={f.name}
                                          onClick={() => {
                                            if (selectedElement === "title") setTitleFontType(f.name);
                                            else setManifestoFontType(f.name);
                                            setIsFontDropdownOpen(false);
                                            setHoveredFontType(null);
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                                            setHoveredFontType(f.name);
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                                            setHoveredFontType(null);
                                          }}
                                          style={{
                                            padding: "8px 12px",
                                            fontSize: "0.85rem",
                                            cursor: "pointer",
                                            fontFamily: `"${f.name}", sans-serif`,
                                            backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                            color: isSelected ? "#2563eb" : "#334155",
                                            fontWeight: isSelected ? 700 : 500,
                                            borderBottom: "1px solid #f8fafc",
                                            transition: "background-color 0.15s"
                                          }}
                                        >
                                          {f.label}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Font Size Selection (Custom Popover with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Size</label>
                          
                          {/* Trigger */}
                          <div
                            onClick={(e) => {
                              if (!isFontSizeDropdownOpen) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setFontSizeDropdownCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                              }
                              setIsFontSizeDropdownOpen(!isFontSizeDropdownOpen);
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {selectedElement === "title" ? titleFontSize : manifestoFontSize}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontSizeDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover list */}
                          {isFontSizeDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontSizeDropdownOpen(false); setHoveredFontSize(null); }} />
                              <div style={{
                                position: "fixed",
                                top: fontSizeDropdownCoords?.top || 0,
                                left: fontSizeDropdownCoords?.left || 0,
                                width: fontSizeDropdownCoords?.width || 200,
                                minWidth: "200px",
                                maxHeight: "280px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 99999,
                                boxSizing: "border-box"
                              }}>
                                {(selectedElement === "title"
                                  ? ["1.5rem", "2.0rem", "2.5rem", "3.0rem", "3.5rem", "4.0rem", "4.5rem", "5.0rem", "5.5rem", "6.0rem", "6.5rem", "7.0rem", "7.5rem", "8.0rem", "9.0rem", "10.0rem"]
                                  : ["0.6rem", "0.7rem", "0.8rem", "0.9rem", "1.0rem", "1.1rem", "1.2rem", "1.3rem", "1.4rem", "1.5rem", "1.6rem", "1.8rem", "2.0rem"]
                                ).map((size) => {
                                  const isSelected = (selectedElement === "title" ? titleFontSize : manifestoFontSize) === size;
                                  return (
                                    <div
                                      key={size}
                                      onClick={() => {
                                        if (selectedElement === "title") setTitleFontSize(size);
                                        else setManifestoFontSize(size);
                                        setIsFontSizeDropdownOpen(false);
                                        setHoveredFontSize(null);
                                      }}
                                      onMouseEnter={() => setHoveredFontSize(size)}
                                      onMouseLeave={() => setHoveredFontSize(null)}
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                        color: isSelected ? "#2563eb" : "#334155",
                                        fontWeight: isSelected ? 700 : 500,
                                        borderBottom: "1px solid #f8fafc",
                                        transition: "background-color 0.15s"
                                      }}
                                    >
                                      {size}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Font Color Picker */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={selectedElement === "title" ? titleFontColor : manifestoFontColor}
                              onChange={(e) => {
                                if (selectedElement === "title") setTitleFontColor(e.target.value);
                                else setManifestoFontColor(e.target.value);
                              }}
                              style={{
                                border: "1px solid #cbd5e1",
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
                              value={selectedElement === "title" ? titleFontColor : manifestoFontColor}
                              onChange={(e) => {
                                if (selectedElement === "title") setTitleFontColor(e.target.value);
                                else setManifestoFontColor(e.target.value);
                              }}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                        {/* Font Weight (Custom Popover with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative", zIndex: isFontWeightDropdownOpen ? 99999 : 1 }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Weight</label>
                          
                          {/* Trigger */}
                          <div
                            onClick={(e) => {
                              if (!isFontWeightDropdownOpen) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                // if there is no space below, open upwards (this handles the very bottom edge just in case)
                                const spaceBelow = window.innerHeight - rect.bottom;
                                if (spaceBelow < 280) {
                                  setFontWeightDropdownCoords({ top: rect.top - 284, left: rect.left, width: rect.width });
                                } else {
                                  setFontWeightDropdownCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
                                }
                              }
                              setIsFontWeightDropdownOpen(!isFontWeightDropdownOpen);
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {selectedElement === "title" 
                                ? { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[titleFontWeight as "300" | "400" | "500" | "600" | "700" | "800" | "900"] || titleFontWeight
                                : { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[manifestoFontWeight as "300" | "400" | "500" | "600" | "700" | "800" | "900"] || manifestoFontWeight
                              }
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontWeightDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover list */}
                          {isFontWeightDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => { setIsFontWeightDropdownOpen(false); setHoveredFontWeight(null); }} />
                              <div style={{
                                position: "fixed",
                                top: fontWeightDropdownCoords?.top || 0,
                                left: fontWeightDropdownCoords?.left || 0,
                                width: fontWeightDropdownCoords?.width || 200,
                                minWidth: "200px",
                                maxHeight: "280px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 99999,
                                boxSizing: "border-box"
                              }}>
                                {[
                                  { value: "300", label: "Light (300)" },
                                  { value: "400", label: "Regular (400)" },
                                  { value: "500", label: "Medium (500)" },
                                  { value: "600", label: "Semi Bold (600)" },
                                  { value: "700", label: "Bold (700)" },
                                  { value: "800", label: "Extra Bold (800)" },
                                  { value: "900", label: "Black (900)" }
                                ].map((w) => {
                                  const isSelected = (selectedElement === "title" ? titleFontWeight : manifestoFontWeight) === w.value;
                                  return (
                                    <div
                                      key={w.value}
                                      onClick={() => {
                                        if (selectedElement === "title") setTitleFontWeight(w.value);
                                        else setManifestoFontWeight(w.value);
                                        setIsFontWeightDropdownOpen(false);
                                        setHoveredFontWeight(null);
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                        setHoveredFontWeight(w.value);
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                                        setHoveredFontWeight(null);
                                      }}
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                        color: isSelected ? "#2563eb" : "#334155",
                                        fontWeight: isSelected ? 700 : 500,
                                        borderBottom: "1px solid #f8fafc",
                                        transition: "background-color 0.15s"
                                      }}
                                    >
                                      {w.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    )}

                    {/* Button Styling Options - Only for button element */}
                    {selectedElement === "button" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                        
                        {/* Button Style selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Style</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["solid", "outline", "minimal"].map((style) => (
                              <button
                                key={style}
                                type="button"
                                onClick={() => setButtonStyle(style)}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  backgroundColor: buttonStyle === style ? "#111827" : "#ffffff",
                                  color: buttonStyle === style ? "#ffffff" : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  textTransform: "capitalize"
                                }}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Size selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Size</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["sm", "md", "lg"].map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setButtonSize(size)}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  backgroundColor: buttonSize === size ? "#111827" : "#ffffff",
                                  color: buttonSize === size ? "#ffffff" : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  textTransform: "uppercase"
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Color selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Theme Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={buttonColor || "#000000"}
                              onChange={(e) => setButtonColor(e.target.value)}
                              style={{
                                border: "1px solid #cbd5e1",
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
                              placeholder="e.g. #ff0000 (falls back to brand primary color if empty)"
                              value={buttonColor}
                              onChange={(e) => setButtonColor(e.target.value)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                boxSizing: "border-box",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                        {/* Button Text Color selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Text Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={buttonTextColor || "#ffffff"}
                              onChange={(e) => setButtonTextColor(e.target.value)}
                              style={{
                                border: "1px solid #cbd5e1",
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
                              value={buttonTextColor}
                              onChange={(e) => setButtonTextColor(e.target.value)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                boxSizing: "border-box",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: "30px 10px", textAlign: "center", color: "#64748b", border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#94a3b8" style={{ width: "32px", height: "32px", margin: "0 auto 8px auto" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.528-.407-1.094-.82-1.676-1.228m1.676 1.228a17.382 17.382 0 0 0-3.352-2.528m3.352 2.528c.582.448 1.148.89 1.676 1.345M12 3v18M3 12h18" />
                    </svg>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Select a component on the live preview to begin customizing it.
                    </span>
                  </div>
                )}

              </div>


              {/* Right panel: Live Interactive Preview */}
              <div style={{
                flex: 1,
                backgroundColor: "#f1f5f9",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", zIndex: 10 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.1em" }}>
                    Live Preview Screen (Visual Layout & Toggles)
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#2563eb", backgroundColor: "#dbeafe", padding: "4px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      Interactive Elements Enable Click to Select
                    </span>
                  </div>
                </div>

                {/* Scaled Desktop Mock Canvas Wrapper */}
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  position: "relative", 
                  overflow: "hidden", 
                  backgroundColor: "#e2e8f0", 
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1"
                }}>
                  {/* Styled Desktop Viewport Scaled Down */}
                  <div
                    onClick={() => setSelectedElement(null)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "1280px",
                      height: "800px",
                      transform: "translate(-50%, -50%) scale(0.55)",
                      transformOrigin: "center center",
                      backgroundColor: bgType === "color" ? (bgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
                      backgroundImage: bgType === "image" && bgImage ? `url("${bgImage}")` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: 
                        layoutTemplate === "top-left" || layoutTemplate === "right-top" || layoutTemplate === "top-center" ? "flex-start" : 
                        layoutTemplate === "bottom-left" || layoutTemplate === "right-bottom" || layoutTemplate === "bottom-center" ? "flex-end" : "center",
                      alignItems: 
                        layoutTemplate === "center" || layoutTemplate.endsWith("center") ? "center" : 
                        layoutTemplate.startsWith("right") ? "flex-end" : "flex-start",
                      padding: 
                        layoutTemplate === "bottom-left" || layoutTemplate === "right-bottom" || layoutTemplate === "bottom-center" ? "80px 5%" : 
                        layoutTemplate === "top-left" || layoutTemplate === "right-top" || layoutTemplate === "top-center" ? "80px 5%" : "0 5%",
                      textAlign: 
                        layoutTemplate === "center" || layoutTemplate.endsWith("center") ? "center" : 
                        layoutTemplate.startsWith("right") ? "right" : "left",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                  >
                    {bgType === "video" && bgVideo && (
                      <video src={bgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                    )}
                    {bgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
                      
                      {/* 1. Hero Title Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("title");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "title" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showTitle ? 1 : 0.45,
                          backgroundColor: selectedElement === "title" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "title" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Title
                          </div>
                        )}
                        {showTitle ? (
                          <h1 style={{
                            fontFamily: selectedElement === "title" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${titleFontType}", sans-serif`,
                            color: titleFontColor,
                            fontSize: selectedElement === "title" && hoveredFontSize ? hoveredFontSize : titleFontSize,
                            fontWeight: Number(selectedElement === "title" && hoveredFontWeight ? hoveredFontWeight : titleFontWeight),
                            margin: 0,
                            lineHeight: "1.1"
                          }}>
                            {titleText || ""}
                          </h1>
                        ) : (
                          <span style={{ fontSize: "0.95rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Title Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                      {/* 2. Hero Manifesto Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("manifesto");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "manifesto" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showManifesto ? 1 : 0.45,
                          backgroundColor: selectedElement === "manifesto" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "manifesto" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Manifesto
                          </div>
                        )}
                        {showManifesto ? (
                          <p style={{
                            fontFamily: selectedElement === "manifesto" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${manifestoFontType}", sans-serif`,
                            color: manifestoFontColor,
                            fontSize: selectedElement === "manifesto" && hoveredFontSize ? hoveredFontSize : manifestoFontSize,
                            fontWeight: Number(selectedElement === "manifesto" && hoveredFontWeight ? hoveredFontWeight : manifestoFontWeight),
                            margin: 0,
                            lineHeight: "1.6",
                            textTransform: "uppercase",
                            letterSpacing: "0.03em"
                          }}>
                            {manifestoText || ""}
                          </p>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Manifesto Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                      {/* 3. Hero Button Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("button");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "button" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showButton ? 1 : 0.45,
                          backgroundColor: selectedElement === "button" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative",
                          display: "inline-block",
                          alignSelf: 
                            layoutTemplate === "center" || layoutTemplate.endsWith("center") ? "center" : 
                            layoutTemplate.startsWith("right") ? "flex-end" : "flex-start"
                        }}
                      >
                        {selectedElement === "button" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Button
                          </div>
                        )}
                        {showButton ? (() => {
                          const btnColor = buttonColor ? buttonColor : (primaryColor || "#000");
                          const isSolid = buttonStyle === "solid";
                          const isOutline = buttonStyle === "outline";
                          
                          const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
                          const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };
                          
                          return (
                            <div style={{
                              display: "inline-block",
                              padding: paddings[buttonSize] || paddings.md,
                              fontSize: fontSizes[buttonSize] || fontSizes.md,
                              backgroundColor: isSolid ? btnColor : "transparent",
                              color: isSolid ? (buttonTextColor || "#ffffff") : (buttonTextColor || btnColor),
                              border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                              textDecoration: buttonStyle === "minimal" ? "underline" : "none",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              textAlign: "center"
                            }}>
                              {buttonText || "Shop Now"}
                            </div>
                          );
                        })()
                        : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [CTA Button Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              padding: "16px 30px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fafafa"
            }}>
              <button
                type="button"
                onClick={onClose}
                className={styles.secondaryActionBtn}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 600 }}
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={handleApply}
                className={styles.primaryActionBtn}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 600 }}
              >
                Apply Customization
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
