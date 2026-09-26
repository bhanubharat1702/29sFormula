"use client";

import React from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";

interface HeroSectionProps {
  isMobile: boolean;
  heroTemplate: string;
  mobileHeroTemplate?: string;
  heroTitle: string;
  mobileHeroTitle?: string;
  heroTitleFontType: string;
  mobileHeroTitleFontType?: string;
  heroTitleFontColor: string;
  mobileHeroTitleFontColor?: string;
  heroTitleFontSize: string;
  mobileHeroTitleFontSize?: string;
  heroTitleFontAlignment: string;
  mobileHeroTitleFontAlignment?: string;
  heroTitleFontWeight: string;
  mobileHeroTitleFontWeight?: string;
  showHeroTitle: boolean;
  showMobileHeroTitle?: boolean;

  heroManifesto: string;
  mobileHeroManifesto?: string;
  heroManifestoFontType: string;
  mobileHeroManifestoFontType?: string;
  heroManifestoFontColor: string;
  mobileHeroManifestoFontColor?: string;
  heroManifestoFontSize: string;
  mobileHeroManifestoFontSize?: string;
  heroManifestoFontAlignment: string;
  mobileHeroManifestoFontAlignment?: string;
  heroManifestoFontWeight: string;
  mobileHeroManifestoFontWeight?: string;
  showHeroManifesto: boolean;
  showMobileHeroManifesto?: boolean;

  heroButtonText: string;
  mobileHeroButtonText?: string;
  heroButtonStyle: string;
  mobileHeroButtonStyle?: string;
  heroButtonSize: string;
  mobileHeroButtonSize?: string;
  heroButtonColor: string;
  mobileHeroButtonColor?: string;
  heroButtonTextColor: string;
  mobileHeroButtonTextColor?: string;
  showHeroButton: boolean;
  showMobileHeroButton?: boolean;

  heroBgType: "color" | "image" | "video";
  heroBgColor: string;
  heroBgImage: string | null;
  heroBgVideo: string | null;
  primaryColor?: string;
}

export default function HeroSection({
  isMobile,
  heroTemplate,
  mobileHeroTemplate,
  heroTitle,
  mobileHeroTitle,
  heroTitleFontType,
  mobileHeroTitleFontType,
  heroTitleFontColor,
  mobileHeroTitleFontColor,
  heroTitleFontSize,
  mobileHeroTitleFontSize,
  heroTitleFontAlignment,
  mobileHeroTitleFontAlignment,
  heroTitleFontWeight,
  mobileHeroTitleFontWeight,
  showHeroTitle,
  showMobileHeroTitle,

  heroManifesto,
  mobileHeroManifesto,
  heroManifestoFontType,
  mobileHeroManifestoFontType,
  heroManifestoFontColor,
  mobileHeroManifestoFontColor,
  heroManifestoFontSize,
  mobileHeroManifestoFontSize,
  heroManifestoFontAlignment,
  mobileHeroManifestoFontAlignment,
  heroManifestoFontWeight,
  mobileHeroManifestoFontWeight,
  showHeroManifesto,
  showMobileHeroManifesto,

  heroButtonText,
  mobileHeroButtonText,
  heroButtonStyle,
  mobileHeroButtonStyle,
  heroButtonSize,
  mobileHeroButtonSize,
  heroButtonColor,
  mobileHeroButtonColor,
  heroButtonTextColor,
  mobileHeroButtonTextColor,
  showHeroButton,
  showMobileHeroButton,

  heroBgType,
  heroBgColor,
  heroBgImage,
  heroBgVideo,
  primaryColor
}: HeroSectionProps) {
  const activeHeroTemplate = isMobile ? (mobileHeroTemplate || heroTemplate || "center") : heroTemplate;

  const activeHeroTitle = isMobile ? (mobileHeroTitle !== "" && mobileHeroTitle !== undefined ? mobileHeroTitle : heroTitle) : heroTitle;
  const activeHeroTitleFontType = isMobile ? (mobileHeroTitleFontType || heroTitleFontType) : heroTitleFontType;
  const activeHeroTitleFontColor = isMobile ? (mobileHeroTitleFontColor || heroTitleFontColor) : heroTitleFontColor;
  const activeHeroTitleFontSize = isMobile ? (mobileHeroTitleFontSize || "2.5rem") : heroTitleFontSize;
  const activeHeroTitleFontAlignment = isMobile ? (mobileHeroTitleFontAlignment || heroTitleFontAlignment || "center") : heroTitleFontAlignment;
  const activeHeroTitleFontWeight = isMobile ? (mobileHeroTitleFontWeight || heroTitleFontWeight) : heroTitleFontWeight;
  const activeShowHeroTitle = isMobile ? (showMobileHeroTitle !== undefined ? showMobileHeroTitle : showHeroTitle) : showHeroTitle;

  const activeHeroManifesto = isMobile ? (mobileHeroManifesto !== "" && mobileHeroManifesto !== undefined ? mobileHeroManifesto : heroManifesto) : heroManifesto;
  const activeHeroManifestoFontType = isMobile ? (mobileHeroManifestoFontType || heroManifestoFontType) : heroManifestoFontType;
  const activeHeroManifestoFontColor = isMobile ? (mobileHeroManifestoFontColor || heroManifestoFontColor) : heroManifestoFontColor;
  const activeHeroManifestoFontSize = isMobile ? (mobileHeroManifestoFontSize || "0.85rem") : heroManifestoFontSize;
  const activeHeroManifestoFontAlignment = isMobile ? (mobileHeroManifestoFontAlignment || heroManifestoFontAlignment || "center") : heroManifestoFontAlignment;
  const activeHeroManifestoFontWeight = isMobile ? (mobileHeroManifestoFontWeight || heroManifestoFontWeight) : heroManifestoFontWeight;
  const activeShowHeroManifesto = isMobile ? (showMobileHeroManifesto !== undefined ? showMobileHeroManifesto : showHeroManifesto) : showHeroManifesto;

  const activeHeroButtonText = isMobile ? (mobileHeroButtonText || heroButtonText) : heroButtonText;
  const activeHeroButtonStyle = isMobile ? (mobileHeroButtonStyle || heroButtonStyle) : heroButtonStyle;
  const activeHeroButtonSize = isMobile ? (mobileHeroButtonSize || "sm") : heroButtonSize;
  const activeHeroButtonColor = isMobile ? (mobileHeroButtonColor !== "" && mobileHeroButtonColor !== undefined ? mobileHeroButtonColor : heroButtonColor) : heroButtonColor;
  const activeHeroButtonTextColor = isMobile ? (mobileHeroButtonTextColor || heroButtonTextColor) : heroButtonTextColor;
  const activeShowHeroButton = isMobile ? (showMobileHeroButton !== undefined ? showMobileHeroButton : showHeroButton) : showHeroButton;

  return (
    <section
      className={styles.hero}
      style={{
        backgroundColor: heroBgType === "color" ? (heroBgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
        backgroundImage: heroBgType === "image" && heroBgImage ? `url("${heroBgImage}")` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent:
          activeHeroTemplate === "top-left" || activeHeroTemplate === "right-top" || activeHeroTemplate === "top-center" ? "flex-start" :
            activeHeroTemplate === "bottom-left" || activeHeroTemplate === "right-bottom" || activeHeroTemplate === "bottom-center" ? "flex-end" : "center",
        alignItems:
          activeHeroTemplate === "center" || activeHeroTemplate.endsWith("center") ? "center" :
            activeHeroTemplate.startsWith("right") ? "flex-end" : "flex-start",
        padding:
          activeHeroTemplate === "bottom-left" || activeHeroTemplate === "right-bottom" || activeHeroTemplate === "bottom-center" ? "100px 5vw" :
            activeHeroTemplate === "top-left" || activeHeroTemplate === "right-top" || activeHeroTemplate === "top-center" ? "100px 5vw" : "0 5vw",
        textAlign:
          activeHeroTemplate === "center" || activeHeroTemplate.endsWith("center") ? "center" :
            activeHeroTemplate.startsWith("right") ? "right" : "left",
        minHeight: "80vh"
      }}
    >
      {heroBgType === "video" && heroBgVideo && (
        <video src={heroBgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
      )}
      {heroBgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
        {activeShowHeroTitle && (
          <h1 style={{
            fontFamily: activeHeroTitleFontType ? `"${activeHeroTitleFontType}", sans-serif` : "inherit",
            color: activeHeroTitleFontColor,
            fontSize: activeHeroTitleFontSize,
            fontWeight: Number(activeHeroTitleFontWeight) || (activeHeroTitleFontWeight as any),
            textAlign: (activeHeroTitleFontAlignment as any) || "inherit",
            margin: 0,
            lineHeight: "1.1",
            wordBreak: "break-word",
            overflowWrap: "break-word"
          }}>
            {activeHeroTitle || ""}
          </h1>
        )}
        {activeShowHeroManifesto && (
          <p style={{
            fontFamily: activeHeroManifestoFontType ? `"${activeHeroManifestoFontType}", sans-serif` : "inherit",
            color: activeHeroManifestoFontColor,
            fontSize: activeHeroManifestoFontSize,
            fontWeight: Number(activeHeroManifestoFontWeight) || (activeHeroManifestoFontWeight as any),
            textAlign: (activeHeroManifestoFontAlignment as any) || "inherit",
            margin: 0,
            lineHeight: "1.6",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            wordBreak: "break-word",
            overflowWrap: "break-word"
          }}>
            {activeHeroManifesto || ""}
          </p>
        )}
        {activeShowHeroButton && (() => {
          const btnColor = activeHeroButtonColor ? activeHeroButtonColor : (primaryColor || "#000");
          const isSolid = activeHeroButtonStyle === "solid";
          const isOutline = activeHeroButtonStyle === "outline";

          const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
          const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };

          return (
            <div style={{
              marginTop: "10px",
              alignSelf:
                activeHeroTemplate === "center" || activeHeroTemplate.endsWith("center") ? "center" :
                  activeHeroTemplate.startsWith("right") ? "flex-end" : "flex-start"
            }}>
              <Link href="/shop" style={{
                display: "inline-block",
                padding: paddings[activeHeroButtonSize] || paddings.md,
                fontSize: fontSizes[activeHeroButtonSize] || fontSizes.md,
                backgroundColor: isSolid ? btnColor : "transparent",
                color: isSolid ? (activeHeroButtonTextColor || "#ffffff") : (activeHeroButtonTextColor || btnColor),
                border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                textDecoration: activeHeroButtonStyle === "minimal" ? "underline" : "none",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                textAlign: "center"
              }}>
                {activeHeroButtonText || "Shop Now"}
              </Link>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
