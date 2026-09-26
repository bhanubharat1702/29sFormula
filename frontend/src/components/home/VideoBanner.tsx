"use client";

import React from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";

interface VideoBannerProps {
  showVideo: boolean;
  isMobile: boolean;
  videoTemplate: string;
  mobileVideoTemplate?: string;
  videoTitle: string;
  mobileVideoTitle?: string;
  videoTitleFontType: string;
  mobileVideoTitleFontType?: string;
  videoTitleFontColor: string;
  mobileVideoTitleFontColor?: string;
  videoTitleFontSize: string;
  mobileVideoTitleFontSize?: string;
  videoTitleFontAlignment: string;
  mobileVideoTitleFontAlignment?: string;
  videoTitleFontWeight: string;
  mobileVideoTitleFontWeight?: string;
  showVideoTitle: boolean;
  showMobileVideoTitle?: boolean;

  videoSubtitle: string;
  mobileVideoSubtitle?: string;
  videoSubtitleFontType: string;
  mobileVideoSubtitleFontType?: string;
  videoSubtitleFontColor: string;
  mobileVideoSubtitleFontColor?: string;
  videoSubtitleFontSize: string;
  mobileVideoSubtitleFontSize?: string;
  videoSubtitleFontAlignment: string;
  mobileVideoSubtitleFontAlignment?: string;
  videoSubtitleFontWeight: string;
  mobileVideoSubtitleFontWeight?: string;
  showVideoSubtitle: boolean;
  showMobileVideoSubtitle?: boolean;

  videoButtonText: string;
  mobileVideoButtonText?: string;
  videoButtonStyle: string;
  mobileVideoButtonStyle?: string;
  videoButtonSize: string;
  mobileVideoButtonSize?: string;
  videoButtonColor: string;
  mobileVideoButtonColor?: string;
  videoButtonTextColor: string;
  mobileVideoButtonTextColor?: string;
  showVideoButton: boolean;
  showMobileVideoButton?: boolean;

  videoBgType: string;
  videoBgColor: string;
  videoFallbackColor: string;
  videoBgImage: string | null;
  videoUrl: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  primaryColor?: string;
}

export default function VideoBanner({
  showVideo,
  isMobile,
  videoTemplate,
  mobileVideoTemplate,
  videoTitle,
  mobileVideoTitle,
  videoTitleFontType,
  mobileVideoTitleFontType,
  videoTitleFontColor,
  mobileVideoTitleFontColor,
  videoTitleFontSize,
  mobileVideoTitleFontSize,
  videoTitleFontAlignment,
  mobileVideoTitleFontAlignment,
  videoTitleFontWeight,
  mobileVideoTitleFontWeight,
  showVideoTitle,
  showMobileVideoTitle,

  videoSubtitle,
  mobileVideoSubtitle,
  videoSubtitleFontType,
  mobileVideoSubtitleFontType,
  videoSubtitleFontColor,
  mobileVideoSubtitleFontColor,
  videoSubtitleFontSize,
  mobileVideoSubtitleFontSize,
  videoSubtitleFontAlignment,
  mobileVideoSubtitleFontAlignment,
  videoSubtitleFontWeight,
  mobileVideoSubtitleFontWeight,
  showVideoSubtitle,
  showMobileVideoSubtitle,

  videoButtonText,
  mobileVideoButtonText,
  videoButtonStyle,
  mobileVideoButtonStyle,
  videoButtonSize,
  mobileVideoButtonSize,
  videoButtonColor,
  mobileVideoButtonColor,
  videoButtonTextColor,
  mobileVideoButtonTextColor,
  showVideoButton,
  showMobileVideoButton,

  videoBgType,
  videoBgColor,
  videoFallbackColor,
  videoBgImage,
  videoUrl,
  videoRef,
  primaryColor
}: VideoBannerProps) {
  if (!showVideo) return null;

  const activeVideoTemplate = isMobile ? (mobileVideoTemplate || videoTemplate || "center") : videoTemplate;
  const activeVideoTitle = isMobile ? (mobileVideoTitle !== "" && mobileVideoTitle !== undefined ? mobileVideoTitle : videoTitle) : videoTitle;
  const activeVideoTitleFontType = isMobile ? (mobileVideoTitleFontType || videoTitleFontType) : videoTitleFontType;
  const activeVideoTitleFontColor = isMobile ? (mobileVideoTitleFontColor || videoTitleFontColor) : videoTitleFontColor;
  const activeVideoTitleFontSize = isMobile ? (mobileVideoTitleFontSize || "2.5rem") : videoTitleFontSize;
  const activeVideoTitleFontAlignment = isMobile ? (mobileVideoTitleFontAlignment || videoTitleFontAlignment || "center") : videoTitleFontAlignment;
  const activeVideoTitleFontWeight = isMobile ? (mobileVideoTitleFontWeight || videoTitleFontWeight) : videoTitleFontWeight;
  const activeShowVideoTitle = isMobile ? (showMobileVideoTitle !== undefined ? showMobileVideoTitle : showVideoTitle) : showVideoTitle;

  const activeVideoSubtitle = isMobile ? (mobileVideoSubtitle !== "" && mobileVideoSubtitle !== undefined ? mobileVideoSubtitle : videoSubtitle) : videoSubtitle;
  const activeVideoSubtitleFontType = isMobile ? (mobileVideoSubtitleFontType || videoSubtitleFontType) : videoSubtitleFontType;
  const activeVideoSubtitleFontColor = isMobile ? (mobileVideoSubtitleFontColor || videoSubtitleFontColor) : videoSubtitleFontColor;
  const activeVideoSubtitleFontSize = isMobile ? (mobileVideoSubtitleFontSize || "0.85rem") : videoSubtitleFontSize;
  const activeVideoSubtitleFontAlignment = isMobile ? (mobileVideoSubtitleFontAlignment || videoSubtitleFontAlignment || "center") : videoSubtitleFontAlignment;
  const activeVideoSubtitleFontWeight = isMobile ? (mobileVideoSubtitleFontWeight || videoSubtitleFontWeight) : videoSubtitleFontWeight;
  const activeShowVideoSubtitle = isMobile ? (showMobileVideoSubtitle !== undefined ? showMobileVideoSubtitle : showVideoSubtitle) : showVideoSubtitle;

  const activeVideoButtonText = isMobile ? (mobileVideoButtonText !== "" && mobileVideoButtonText !== undefined ? mobileVideoButtonText : videoButtonText) : videoButtonText;
  const activeVideoButtonStyle = isMobile ? (mobileVideoButtonStyle || videoButtonStyle) : videoButtonStyle;
  const activeVideoButtonSize = isMobile ? (mobileVideoButtonSize || videoButtonSize) : videoButtonSize;
  const activeVideoButtonColor = isMobile ? (mobileVideoButtonColor !== "" && mobileVideoButtonColor !== undefined ? mobileVideoButtonColor : videoButtonColor) : videoButtonColor;
  const activeVideoButtonTextColor = isMobile ? (mobileVideoButtonTextColor || videoButtonTextColor) : videoButtonTextColor;
  const activeShowVideoButton = isMobile ? (showMobileVideoButton !== undefined ? showMobileVideoButton : showVideoButton) : showVideoButton;

  return (
    <section
      className={styles.videoSection}
      style={{
        backgroundColor: videoBgType === "color" ? videoBgColor : videoFallbackColor,
        backgroundImage: videoBgType === "image" && videoBgImage ? `url(${videoBgImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: activeVideoTemplate === "bottom" ? "flex-end" : activeVideoTemplate === "top" ? "flex-start" : "center",
        justifyContent: "center",
        position: "relative",
        minHeight: "100vh"
      }}
    >
      {videoBgType === "video" && videoUrl && (
        <video
          ref={videoRef}
          key={videoUrl}
          className={styles.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      )}

      {(videoBgType === "video" || videoBgType === "image") && <div className={styles.videoOverlay} style={{ backgroundColor: "rgba(0,0,0,0.4)", position: "absolute", inset: 0 }} />}

      <div className={styles.videoContent} style={{ position: "relative", zIndex: 10, textAlign: activeVideoTitleFontAlignment as any, padding: "20px" }}>
        {activeShowVideoTitle && (
          <h2 style={{
            fontFamily: activeVideoTitleFontType ? `"${activeVideoTitleFontType}", sans-serif` : "inherit",
            color: activeVideoTitleFontColor,
            fontSize: activeVideoTitleFontSize,
            fontWeight: activeVideoTitleFontWeight as any,
            margin: "0 0 10px 0"
          }}>
            {activeVideoTitle}
          </h2>
        )}
        {activeShowVideoSubtitle && (
          <p style={{
            fontFamily: activeVideoSubtitleFontType ? `"${activeVideoSubtitleFontType}", sans-serif` : "inherit",
            color: activeVideoSubtitleFontColor,
            fontSize: activeVideoSubtitleFontSize,
            fontWeight: activeVideoSubtitleFontWeight as any,
            textAlign: activeVideoSubtitleFontAlignment as any,
            margin: "0 0 20px 0"
          }}>
            {activeVideoSubtitle}
          </p>
        )}
        {activeShowVideoButton && (() => {
          const btnColor = activeVideoButtonColor ? activeVideoButtonColor : (primaryColor || "#ffffff");
          const isSolid = activeVideoButtonStyle === "solid";
          const isOutline = activeVideoButtonStyle === "outline";

          const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
          const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };

          return (
            <Link href="/shop" style={{ textDecoration: "none", display: "inline-block" }}>
              <button style={{
                display: "inline-block",
                padding: paddings[activeVideoButtonSize] || paddings.md,
                fontSize: fontSizes[activeVideoButtonSize] || fontSizes.md,
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                backgroundColor: isSolid ? btnColor : "transparent",
                color: isSolid ? (activeVideoButtonTextColor || "#121212") : (activeVideoButtonTextColor || btnColor),
                border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                textDecoration: activeVideoButtonStyle === "minimal" ? "underline" : "none",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}>
                {activeVideoButtonText || "Shop Now"}
              </button>
            </Link>
          );
        })()}
      </div>
    </section>
  );
}
