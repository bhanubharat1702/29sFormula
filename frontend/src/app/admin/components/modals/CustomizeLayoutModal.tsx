import React, { useState, useEffect } from 'react';
import styles from "../../page.module.css";
import { LayoutCustomizationConfig } from '../../types';
import { fontCategories } from '../../constants/fonts';

import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";

interface CustomizeLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: LayoutCustomizationConfig) => void;
  initialConfig: Partial<LayoutCustomizationConfig>;
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
  const [titleText, setTitleText] = useState(initialConfig.titleText || "");
  const [showTitle, setShowTitle] = useState(initialConfig.showTitle !== undefined ? initialConfig.showTitle : true);
  const [titleFontType, setTitleFontType] = useState(initialConfig.titleFontType || "Outfit");
  const [titleFontSize, setTitleFontSize] = useState(initialConfig.titleFontSize || "2.5rem");
  const [titleFontColor, setTitleFontColor] = useState(initialConfig.titleFontColor || "#ffffff");
  const [titleFontWeight, setTitleFontWeight] = useState(initialConfig.titleFontWeight || "700");
  const [titleFontAlignment, setTitleFontAlignment] = useState(initialConfig.titleFontAlignment || "center");

  const [manifestoText, setManifestoText] = useState(initialConfig.manifestoText || "");
  const [showManifesto, setShowManifesto] = useState(initialConfig.showManifesto !== undefined ? initialConfig.showManifesto : true);
  const [manifestoFontType, setManifestoFontType] = useState(initialConfig.manifestoFontType || "Outfit");
  const [manifestoFontSize, setManifestoFontSize] = useState(initialConfig.manifestoFontSize || "1.1rem");
  const [manifestoFontColor, setManifestoFontColor] = useState(initialConfig.manifestoFontColor || "#ffffff");
  const [manifestoFontWeight, setManifestoFontWeight] = useState(initialConfig.manifestoFontWeight || "500");
  const [manifestoFontAlignment, setManifestoFontAlignment] = useState(initialConfig.manifestoFontAlignment || "center");

  const [buttonText, setButtonText] = useState(initialConfig.buttonText || "Shop Now");
  const [showButton, setShowButton] = useState(initialConfig.showButton !== undefined ? initialConfig.showButton : true);
  const [buttonStyle, setButtonStyle] = useState(initialConfig.buttonStyle || "solid");
  const [buttonSize, setButtonSize] = useState(initialConfig.buttonSize || "md");
  const [buttonColor, setButtonColor] = useState(initialConfig.buttonColor || "");
  const [buttonTextColor, setButtonTextColor] = useState(initialConfig.buttonTextColor || "#ffffff");

  const [layoutTemplate, setLayoutTemplate] = useState(initialConfig.layoutTemplate || "center");
  const [bgType, setBgType] = useState(initialConfig.bgType || "color");
  const [bgColor, setBgColor] = useState(initialConfig.bgColor || "#121212");
  const [bgImage, setBgImage] = useState(initialConfig.bgImage || "");
  const [bgVideo, setBgVideo] = useState(initialConfig.bgVideo || "");

  // Local state for UI
  const [selectedElement, setSelectedElement] = useState<"title" | "manifesto" | "button" | null>("title");
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Mobile-specific layout states (Completely Unlinked from Desktop)
  const [mobileLayoutTemplate, setMobileLayoutTemplate] = useState(initialConfig.mobileLayoutTemplate || initialConfig.layoutTemplate || "center");
  const [mobileTitleText, setMobileTitleText] = useState(initialConfig.mobileTitleText ? initialConfig.mobileTitleText : (initialConfig.titleText || ""));
  const [mobileTitleFontType, setMobileTitleFontType] = useState(initialConfig.mobileTitleFontType || initialConfig.titleFontType || "Outfit");
  const [mobileTitleFontColor, setMobileTitleFontColor] = useState(initialConfig.mobileTitleFontColor || initialConfig.titleFontColor || "#111827");
  const [mobileTitleFontSize, setMobileTitleFontSize] = useState(initialConfig.mobileTitleFontSize || "2.5rem");
  const [mobileTitleFontAlignment, setMobileTitleFontAlignment] = useState(initialConfig.mobileTitleFontAlignment || initialConfig.titleFontAlignment || "center");
  const [mobileTitleFontWeight, setMobileTitleFontWeight] = useState(initialConfig.mobileTitleFontWeight || initialConfig.titleFontWeight || "700");
  const [mobileShowTitle, setMobileShowTitle] = useState(
    initialConfig.showMobileHeroTitle !== undefined
      ? initialConfig.showMobileHeroTitle
      : (initialConfig.showTitle !== undefined ? initialConfig.showTitle : true)
  );

  const [mobileManifestoText, setMobileManifestoText] = useState(initialConfig.mobileManifestoText ? initialConfig.mobileManifestoText : (initialConfig.manifestoText || ""));
  const [mobileManifestoFontType, setMobileManifestoFontType] = useState(initialConfig.mobileManifestoFontType || initialConfig.manifestoFontType || "Outfit");
  const [mobileManifestoFontColor, setMobileManifestoFontColor] = useState(initialConfig.mobileManifestoFontColor || initialConfig.manifestoFontColor || "#ffffff");
  const [mobileManifestoFontSize, setMobileManifestoFontSize] = useState(initialConfig.mobileManifestoFontSize || "0.85rem");
  const [mobileManifestoFontAlignment, setMobileManifestoFontAlignment] = useState(initialConfig.mobileManifestoFontAlignment || initialConfig.manifestoFontAlignment || "center");
  const [mobileManifestoFontWeight, setMobileManifestoFontWeight] = useState(initialConfig.mobileManifestoFontWeight || initialConfig.manifestoFontWeight || "500");
  const [mobileShowManifesto, setMobileShowManifesto] = useState(
    initialConfig.showMobileHeroManifesto !== undefined
      ? initialConfig.showMobileHeroManifesto
      : (initialConfig.showManifesto !== undefined ? initialConfig.showManifesto : true)
  );

  const [mobileButtonText, setMobileButtonText] = useState(initialConfig.mobileButtonText ? initialConfig.mobileButtonText : (initialConfig.buttonText || "Shop Now"));
  const [mobileButtonStyle, setMobileButtonStyle] = useState(initialConfig.mobileButtonStyle || initialConfig.buttonStyle || "solid");
  const [mobileButtonSize, setMobileButtonSize] = useState(initialConfig.mobileButtonSize || "sm");
  const [mobileButtonColor, setMobileButtonColor] = useState(initialConfig.mobileButtonColor !== undefined ? initialConfig.mobileButtonColor : initialConfig.buttonColor);
  const [mobileButtonTextColor, setMobileButtonTextColor] = useState(initialConfig.mobileButtonTextColor || initialConfig.buttonTextColor || "#ffffff");
  const [mobileShowButton, setMobileShowButton] = useState(
    initialConfig.showMobileHeroButton !== undefined
      ? initialConfig.showMobileHeroButton
      : (initialConfig.showButton !== undefined ? initialConfig.showButton : true)
  );

  // Dynamic getters/setters based on active preview device
  const isMobileDevice = previewDevice === 'mobile';

  const currentLayoutTemplate = isMobileDevice ? mobileLayoutTemplate : layoutTemplate;
  const setCurrentLayoutTemplate = isMobileDevice ? setMobileLayoutTemplate : setLayoutTemplate;

  const currentTitleText = isMobileDevice ? mobileTitleText : titleText;
  const setCurrentTitleText = isMobileDevice ? setMobileTitleText : setTitleText;

  const currentTitleFontType = isMobileDevice ? mobileTitleFontType : titleFontType;
  const setCurrentTitleFontType = isMobileDevice ? setMobileTitleFontType : setTitleFontType;

  const currentTitleFontColor = isMobileDevice ? mobileTitleFontColor : titleFontColor;
  const setCurrentTitleFontColor = isMobileDevice ? setMobileTitleFontColor : setTitleFontColor;

  const currentTitleFontSize = isMobileDevice ? mobileTitleFontSize : titleFontSize;
  const setCurrentTitleFontSize = isMobileDevice ? setMobileTitleFontSize : setTitleFontSize;

  const currentTitleFontAlignment = isMobileDevice ? mobileTitleFontAlignment : titleFontAlignment;
  const setCurrentTitleFontAlignment = isMobileDevice ? setMobileTitleFontAlignment : setTitleFontAlignment;

  const currentTitleFontWeight = isMobileDevice ? mobileTitleFontWeight : titleFontWeight;
  const setCurrentTitleFontWeight = isMobileDevice ? setMobileTitleFontWeight : setTitleFontWeight;

  const currentShowTitle = isMobileDevice ? mobileShowTitle : showTitle;
  const setCurrentShowTitle = isMobileDevice ? setMobileShowTitle : setShowTitle;

  const currentManifestoText = isMobileDevice ? mobileManifestoText : manifestoText;
  const setCurrentManifestoText = isMobileDevice ? setMobileManifestoText : setManifestoText;

  const currentManifestoFontType = isMobileDevice ? mobileManifestoFontType : manifestoFontType;
  const setCurrentManifestoFontType = isMobileDevice ? setMobileManifestoFontType : setManifestoFontType;

  const currentManifestoFontColor = isMobileDevice ? mobileManifestoFontColor : manifestoFontColor;
  const setCurrentManifestoFontColor = isMobileDevice ? setMobileManifestoFontColor : setManifestoFontColor;

  const currentManifestoFontSize = isMobileDevice ? mobileManifestoFontSize : manifestoFontSize;
  const setCurrentManifestoFontSize = isMobileDevice ? setMobileManifestoFontSize : setManifestoFontSize;

  const currentManifestoFontAlignment = isMobileDevice ? mobileManifestoFontAlignment : manifestoFontAlignment;
  const setCurrentManifestoFontAlignment = isMobileDevice ? setMobileManifestoFontAlignment : setManifestoFontAlignment;

  const currentManifestoFontWeight = isMobileDevice ? mobileManifestoFontWeight : manifestoFontWeight;
  const setCurrentManifestoFontWeight = isMobileDevice ? setMobileManifestoFontWeight : setManifestoFontWeight;

  const currentShowManifesto = isMobileDevice ? mobileShowManifesto : showManifesto;
  const setCurrentShowManifesto = isMobileDevice ? setMobileShowManifesto : setShowManifesto;

  const currentButtonText = isMobileDevice ? mobileButtonText : buttonText;
  const setCurrentButtonText = isMobileDevice ? setMobileButtonText : setButtonText;

  const currentButtonStyle = isMobileDevice ? mobileButtonStyle : buttonStyle;
  const setCurrentButtonStyle = isMobileDevice ? setMobileButtonStyle : setButtonStyle;

  const currentButtonSize = isMobileDevice ? mobileButtonSize : buttonSize;
  const setCurrentButtonSize = isMobileDevice ? setMobileButtonSize : setButtonSize;

  const currentButtonColor = isMobileDevice ? mobileButtonColor : buttonColor;
  const setCurrentButtonColor = isMobileDevice ? setMobileButtonColor : setButtonColor;

  const currentButtonTextColor = isMobileDevice ? mobileButtonTextColor : buttonTextColor;
  const setCurrentButtonTextColor = isMobileDevice ? setMobileButtonTextColor : setButtonTextColor;

  const currentShowButton = isMobileDevice ? mobileShowButton : showButton;
  const setCurrentShowButton = isMobileDevice ? setMobileShowButton : setShowButton;

  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontDropdownCoords, setFontDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontType, setHoveredFontType] = useState<string | null>(null);

  const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState(false);
  const [fontSizeDropdownCoords, setFontSizeDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontSize, setHoveredFontSize] = useState<string | null>(null);

  const [isFontWeightDropdownOpen, setIsFontWeightDropdownOpen] = useState(false);
  const [fontWeightDropdownCoords, setFontWeightDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
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

  useEffect(() => {
    if (sectionName === "Lifestyle Banner" && selectedElement === "manifesto") {
      setSelectedElement("title");
    }
  }, [sectionName, selectedElement]);

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

      // Mobile layout properties (completely unlinked)
      mobileLayoutTemplate,
      mobileTitleText,
      mobileTitleFontType,
      mobileTitleFontColor,
      mobileTitleFontSize,
      mobileTitleFontAlignment,
      mobileTitleFontWeight,
      showMobileHeroTitle: mobileShowTitle,

      mobileManifestoText,
      mobileManifestoFontType,
      mobileManifestoFontColor,
      mobileManifestoFontSize,
      mobileManifestoFontAlignment,
      mobileManifestoFontWeight,
      showMobileHeroManifesto: mobileShowManifesto,

      mobileButtonText,
      mobileButtonStyle,
      mobileButtonSize,
      mobileButtonColor,
      mobileButtonTextColor,
      showMobileHeroButton: mobileShowButton,
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
              {/* Active Editing Viewport Indicator Banner */}


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
                  const isSelected = currentLayoutTemplate === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCurrentLayoutTemplate(t.id)}
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
                      {selectedElement === "title" 
                        ? (sectionName === "Lifestyle Banner" ? "Lifestyle Overlay Text Copy" : sectionName === "Video Section" ? "Video Overlay Title Copy" : "Hero Title") 
                        : selectedElement === "manifesto" 
                          ? (sectionName === "Video Section" ? "Video Overlay Subtitle Copy" : "Hero Manifesto") 
                          : "CTA Button"}
                    </h5>
                  </div>

                  {/* Visibility Switch */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                      Enable Element Visibility ({previewDevice})
                    </span>
                    <CustomCheckbox
                      checked={
                        selectedElement === "title" ? currentShowTitle :
                          selectedElement === "manifesto" ? currentShowManifesto :
                            currentShowButton
                      }
                      onChange={(e) => {
                        const val = e.target.checked;
                        if (selectedElement === "title") setCurrentShowTitle(val);
                        else if (selectedElement === "manifesto") setCurrentShowManifesto(val);
                        else setCurrentShowButton(val);
                      }}
                      style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                    />
                  </div>

                  {/* Text Field Inputs */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                      Content / Label Text ({previewDevice})
                    </label>
                    {selectedElement === "manifesto" ? (
                      <textarea
                        value={currentManifestoText || ""}
                        onChange={(e) => setCurrentManifestoText(e.target.value)}
                        disabled={!currentShowManifesto}
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
                          opacity: currentShowManifesto ? 1 : 0.5
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={(selectedElement === "title" ? currentTitleText : currentButtonText) || ""}
                        onChange={(e) => {
                          if (selectedElement === "title") setCurrentTitleText(e.target.value);
                          else setCurrentButtonText(e.target.value);
                        }}
                        disabled={selectedElement === "title" ? !currentShowTitle : !currentShowButton}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.88rem",
                          width: "100%",
                          boxSizing: "border-box",
                          color: "#000",
                          opacity: (selectedElement === "title" ? currentShowTitle : currentShowButton) ? 1 : 0.5
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
                            fontFamily: selectedElement === "title" ? `"${currentTitleFontType}", sans-serif` : `"${currentManifestoFontType}", sans-serif`
                          }}
                        >
                          <span>
                            {selectedElement === "title" ? currentTitleFontType : currentManifestoFontType}
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
                                    const isSelected = (selectedElement === "title" ? currentTitleFontType : currentManifestoFontType) === f.name;
                                    return (
                                      <div
                                        key={f.name}
                                        onClick={() => {
                                          if (selectedElement === "title") setCurrentTitleFontType(f.name);
                                          else setCurrentManifestoFontType(f.name);
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
                            {selectedElement === "title" ? currentTitleFontSize : currentManifestoFontSize}
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
                                const isSelected = (selectedElement === "title" ? currentTitleFontSize : currentManifestoFontSize) === size;
                                return (
                                  <div
                                    key={size}
                                    onClick={() => {
                                      if (selectedElement === "title") setCurrentTitleFontSize(size);
                                      else setCurrentManifestoFontSize(size);
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
                        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Color ({previewDevice})</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={(selectedElement === "title" ? currentTitleFontColor : currentManifestoFontColor) || "#ffffff"}
                            onChange={(e) => {
                              if (selectedElement === "title") setCurrentTitleFontColor(e.target.value);
                              else setCurrentManifestoFontColor(e.target.value);
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
                            value={(selectedElement === "title" ? currentTitleFontColor : currentManifestoFontColor) || ""}
                            onChange={(e) => {
                              if (selectedElement === "title") setCurrentTitleFontColor(e.target.value);
                              else setCurrentManifestoFontColor(e.target.value);
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
                              ? { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[currentTitleFontWeight as "300" | "400" | "500" | "600" | "700" | "800" | "900"] || currentTitleFontWeight
                              : { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[currentManifestoFontWeight as "300" | "400" | "500" | "600" | "700" | "800" | "900"] || currentManifestoFontWeight
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
                                const isSelected = (selectedElement === "title" ? currentTitleFontWeight : currentManifestoFontWeight) === w.value;
                                return (
                                  <div
                                    key={w.value}
                                    onClick={() => {
                                      if (selectedElement === "title") setCurrentTitleFontWeight(w.value);
                                      else setCurrentManifestoFontWeight(w.value);
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
                        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Style ({previewDevice})</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {["solid", "outline", "minimal"].map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setCurrentButtonStyle(style)}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: currentButtonStyle === style ? "#111827" : "#ffffff",
                                color: currentButtonStyle === style ? "#ffffff" : "#374151",
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
                        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Size ({previewDevice})</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {["sm", "md", "lg"].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setCurrentButtonSize(size)}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: currentButtonSize === size ? "#111827" : "#ffffff",
                                color: currentButtonSize === size ? "#ffffff" : "#374151",
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
                        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Theme Color ({previewDevice})</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={currentButtonColor || "#000000"}
                            onChange={(e) => setCurrentButtonColor(e.target.value)}
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
                            value={currentButtonColor || ""}
                            onChange={(e) => setCurrentButtonColor(e.target.value)}
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
                        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Text Color ({previewDevice})</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={currentButtonTextColor || "#ffffff"}
                            onChange={(e) => setCurrentButtonTextColor(e.target.value)}
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
                            value={currentButtonTextColor || ""}
                            onChange={(e) => setCurrentButtonTextColor(e.target.value)}
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
                  Live Preview Screen
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Viewport Device Switcher */}
                  <div style={{
                    display: "flex",
                    backgroundColor: "#e2e8f0",
                    padding: "3px",
                    borderRadius: "8px",
                    gap: "4px"
                  }}>
                    <button
                      type="button"
                      title="Desktop Preview"
                      onClick={() => setPreviewDevice('desktop')}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: previewDevice === 'desktop' ? "#2563eb" : "transparent",
                        color: previewDevice === 'desktop' ? "#ffffff" : "#64748b",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>

                    </button>

                    <button
                      type="button"
                      title="iPhone 16 Pro Mobile Preview"
                      onClick={() => setPreviewDevice('mobile')}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: previewDevice === 'mobile' ? "#2563eb" : "transparent",
                        color: previewDevice === 'mobile' ? "#ffffff" : "#64748b",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                      </svg>

                    </button>
                  </div>


                </div>
              </div>

              {/* Scaled Desktop / Mobile Mock Canvas Wrapper */}
              <div style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#e2e8f0",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {/* Viewport Frame */}
                <div
                  onClick={() => setSelectedElement(null)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: previewDevice === 'desktop' ? "1280px" : "393px",
                    height: previewDevice === 'desktop' ? "800px" : "852px",
                    transform: previewDevice === 'desktop' ? "translate(-50%, -50%) scale(0.55)" : "translate(-50%, -50%) scale(0.58)",
                    transformOrigin: "center center",
                    backgroundColor: bgType === "color" ? (bgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
                    backgroundImage: bgType === "image" && bgImage ? `url("${bgImage}")` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:
                      currentLayoutTemplate === "top-left" || currentLayoutTemplate === "right-top" || currentLayoutTemplate === "top-center" ? "flex-start" :
                        currentLayoutTemplate === "bottom-left" || currentLayoutTemplate === "right-bottom" || currentLayoutTemplate === "bottom-center" ? "flex-end" : "center",
                    alignItems:
                      currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                        currentLayoutTemplate.startsWith("right") ? "flex-end" : "flex-start",
                    padding: previewDevice === 'desktop' ? (
                      layoutTemplate === "bottom-left" || layoutTemplate === "right-bottom" || layoutTemplate === "bottom-center" ? "80px 5%" :
                        layoutTemplate === "top-left" || layoutTemplate === "right-top" || layoutTemplate === "top-center" ? "80px 5%" : "0 5%"
                    ) : (
                      mobileLayoutTemplate === "bottom-left" || mobileLayoutTemplate === "right-bottom" || mobileLayoutTemplate === "bottom-center" ? "80px 24px 44px 24px" :
                        mobileLayoutTemplate === "top-left" || mobileLayoutTemplate === "right-top" || mobileLayoutTemplate === "top-center" ? "80px 24px 30px 24px" : "60px 24px"
                    ),
                    textAlign:
                      currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                        currentLayoutTemplate.startsWith("right") ? "right" : "left",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    borderRadius: previewDevice === 'desktop' ? "12px" : "44px",
                    border: previewDevice === 'desktop' ? "1px solid #cbd5e1" : "12px solid #1c1c1e",
                    boxShadow: previewDevice === 'desktop' ? "0 20px 25px -5px rgba(0, 0, 0, 0.2)" : "0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.15)"
                  }}
                >
                  {/* iPhone 16 Pro Notch (Dynamic Island) */}
                  {previewDevice === 'mobile' && (
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "110px",
                      height: "28px",
                      backgroundColor: "#000000",
                      borderRadius: "20px",
                      zIndex: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                      pointerEvents: "none"
                    }}>
                      <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#0c0d14", border: "1px solid #1f2333" }} />
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#0a0c10" }} />
                    </div>
                  )}

                  {/* iPhone 16 Pro Home Indicator Bar */}
                  {previewDevice === 'mobile' && (
                    <div style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "134px",
                      height: "5px",
                      backgroundColor: "#ffffff",
                      borderRadius: "3px",
                      opacity: 0.85,
                      zIndex: 100,
                      pointerEvents: "none"
                    }} />
                  )}

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
                          Active Title ({previewDevice})
                        </div>
                      )}
                      {currentShowTitle ? (
                        <h1 style={{
                          fontFamily: selectedElement === "title" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${currentTitleFontType}", sans-serif`,
                          color: currentTitleFontColor,
                          fontSize: selectedElement === "title" && hoveredFontSize ? hoveredFontSize : currentTitleFontSize,
                          fontWeight: Number(selectedElement === "title" && hoveredFontWeight ? hoveredFontWeight : currentTitleFontWeight),
                          textAlign: currentTitleFontAlignment as any || "inherit",
                          margin: 0,
                          lineHeight: "1.1",
                          wordBreak: "break-word",
                          overflowWrap: "break-word"
                        }}>
                          {currentTitleText || ""}
                        </h1>
                      ) : (
                        <span style={{ fontSize: "0.95rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                          [Title Element Hidden - Click to edit & enable]
                        </span>
                      )}
                    </div>

                    {/* 2. Hero Manifesto Element */}
                    {sectionName !== "Lifestyle Banner" && (
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
                          opacity: currentShowManifesto ? 1 : 0.45,
                          backgroundColor: selectedElement === "manifesto" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "manifesto" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Manifesto ({previewDevice})
                          </div>
                        )}
                        {currentShowManifesto ? (
                          <p style={{
                            fontFamily: selectedElement === "manifesto" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${currentManifestoFontType}", sans-serif`,
                            color: currentManifestoFontColor,
                            fontSize: selectedElement === "manifesto" && hoveredFontSize ? hoveredFontSize : currentManifestoFontSize,
                            fontWeight: Number(selectedElement === "manifesto" && hoveredFontWeight ? hoveredFontWeight : currentManifestoFontWeight),
                            textAlign: currentManifestoFontAlignment as any || "inherit",
                            margin: 0,
                            lineHeight: "1.6",
                            textTransform: "uppercase",
                            letterSpacing: "0.03em",
                            wordBreak: "break-word",
                            overflowWrap: "break-word"
                          }}>
                            {currentManifestoText || ""}
                          </p>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Manifesto Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>
                    )}

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
                        opacity: currentShowButton ? 1 : 0.45,
                        backgroundColor: selectedElement === "button" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                        position: "relative",
                        display: "inline-block",
                        alignSelf:
                          currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                            currentLayoutTemplate.startsWith("right") ? "flex-end" : "flex-start"
                      }}
                    >
                      {selectedElement === "button" && (
                        <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                          Active Button ({previewDevice})
                        </div>
                      )}
                      {currentShowButton ? (() => {
                        const btnColor = currentButtonColor ? currentButtonColor : (primaryColor || "#000");
                        const isSolid = currentButtonStyle === "solid";
                        const isOutline = currentButtonStyle === "outline";

                        const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
                        const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };

                        return (
                          <div style={{
                            display: "inline-block",
                            padding: paddings[currentButtonSize] || paddings.md,
                            fontSize: fontSizes[currentButtonSize] || fontSizes.md,
                            backgroundColor: isSolid ? btnColor : "transparent",
                            color: isSolid ? (currentButtonTextColor || "#ffffff") : (currentButtonTextColor || btnColor),
                            border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                            textDecoration: currentButtonStyle === "minimal" ? "underline" : "none",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            textAlign: "center"
                          }}>
                            {currentButtonText || "Shop Now"}
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
