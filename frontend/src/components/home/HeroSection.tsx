"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { HeroSlideItem } from "@/app/admin/types";

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

  // Carousel Slides
  heroSlides?: HeroSlideItem[];
  heroAutoPlay?: boolean;
  heroAutoPlaySpeed?: number;
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
  primaryColor,

  heroSlides,
  heroAutoPlay = true,
  heroAutoPlaySpeed = 5
}: HeroSectionProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Construct active slides array (fallback to props if heroSlides is empty)
  const slides: HeroSlideItem[] = (heroSlides && heroSlides.length > 0)
    ? heroSlides
    : [
        {
          id: "default_slide",
          titleText: heroTitle,
          titleFontType: heroTitleFontType,
          titleFontColor: heroTitleFontColor,
          titleFontSize: heroTitleFontSize,
          titleFontAlignment: heroTitleFontAlignment,
          titleFontWeight: heroTitleFontWeight,
          showTitle: showHeroTitle,

          manifestoText: heroManifesto,
          manifestoFontType: heroManifestoFontType,
          manifestoFontColor: heroManifestoFontColor,
          manifestoFontSize: heroManifestoFontSize,
          manifestoFontAlignment: heroManifestoFontAlignment,
          manifestoFontWeight: heroManifestoFontWeight,
          showManifesto: showHeroManifesto,

          buttonText: heroButtonText,
          buttonStyle: heroButtonStyle,
          buttonSize: heroButtonSize,
          buttonColor: heroButtonColor,
          buttonTextColor: heroButtonTextColor,
          showButton: showHeroButton,

          layoutTemplate: heroTemplate,
          bgType: heroBgType,
          bgColor: heroBgColor,
          bgImage: heroBgImage || "",
          bgVideo: heroBgVideo || "",

          mobileLayoutTemplate: mobileHeroTemplate,
          mobileTitleText: mobileHeroTitle,
          mobileTitleFontType: mobileHeroTitleFontType,
          mobileTitleFontColor: mobileHeroTitleFontColor,
          mobileTitleFontSize: mobileHeroTitleFontSize,
          mobileTitleFontAlignment: mobileHeroTitleFontAlignment,
          mobileTitleFontWeight: mobileHeroTitleFontWeight,
          showMobileHeroTitle: showMobileHeroTitle,

          mobileManifestoText: mobileHeroManifesto,
          mobileManifestoFontType: mobileHeroManifestoFontType,
          mobileManifestoFontColor: mobileHeroManifestoFontColor,
          mobileManifestoFontSize: mobileHeroManifestoFontSize,
          mobileManifestoFontAlignment: mobileHeroManifestoFontAlignment,
          mobileManifestoFontWeight: mobileHeroManifestoFontWeight,
          showMobileHeroManifesto: showMobileHeroManifesto,

          mobileButtonText: mobileHeroButtonText,
          mobileButtonStyle: mobileHeroButtonStyle,
          mobileButtonSize: mobileHeroButtonSize,
          mobileButtonColor: mobileHeroButtonColor,
          mobileButtonTextColor: mobileHeroButtonTextColor,
          showMobileHeroButton: showMobileHeroButton
        }
      ];

  // Auto-play Timer Effect
  useEffect(() => {
    if (!heroAutoPlay || slides.length <= 1 || isHovered) return;
    const intervalMs = (heroAutoPlaySpeed || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [heroAutoPlay, heroAutoPlaySpeed, slides.length, isHovered]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  // Derive active properties per viewport
  const activeHeroTemplate = isMobile
    ? (activeSlide.mobileLayoutTemplate || activeSlide.layoutTemplate || heroTemplate || "center")
    : (activeSlide.layoutTemplate || heroTemplate || "center");

  const activeHeroTitle = isMobile
    ? (activeSlide.mobileTitleText !== "" && activeSlide.mobileTitleText !== undefined ? activeSlide.mobileTitleText : activeSlide.titleText)
    : activeSlide.titleText;

  const activeHeroTitleFontType = isMobile
    ? (activeSlide.mobileTitleFontType || activeSlide.titleFontType || heroTitleFontType)
    : (activeSlide.titleFontType || heroTitleFontType);

  const activeHeroTitleFontColor = isMobile
    ? (activeSlide.mobileTitleFontColor || activeSlide.titleFontColor || heroTitleFontColor)
    : (activeSlide.titleFontColor || heroTitleFontColor);

  const activeHeroTitleFontSize = isMobile
    ? (activeSlide.mobileTitleFontSize || "2.5rem")
    : (activeSlide.titleFontSize || heroTitleFontSize);

  const activeHeroTitleFontAlignment = isMobile
    ? (activeSlide.mobileTitleFontAlignment || activeSlide.titleFontAlignment || "center")
    : (activeSlide.titleFontAlignment || "center");

  const activeHeroTitleFontWeight = isMobile
    ? (activeSlide.mobileTitleFontWeight || activeSlide.titleFontWeight || heroTitleFontWeight)
    : (activeSlide.titleFontWeight || heroTitleFontWeight);

  const activeShowHeroTitle = isMobile
    ? (activeSlide.showMobileHeroTitle !== undefined ? activeSlide.showMobileHeroTitle : activeSlide.showTitle)
    : activeSlide.showTitle;

  const activeHeroManifesto = isMobile
    ? (activeSlide.mobileManifestoText !== "" && activeSlide.mobileManifestoText !== undefined ? activeSlide.mobileManifestoText : activeSlide.manifestoText)
    : activeSlide.manifestoText;

  const activeHeroManifestoFontType = isMobile
    ? (activeSlide.mobileManifestoFontType || activeSlide.manifestoFontType || heroManifestoFontType)
    : (activeSlide.manifestoFontType || heroManifestoFontType);

  const activeHeroManifestoFontColor = isMobile
    ? (activeSlide.mobileManifestoFontColor || activeSlide.manifestoFontColor || heroManifestoFontColor)
    : (activeSlide.manifestoFontColor || heroManifestoFontColor);

  const activeHeroManifestoFontSize = isMobile
    ? (activeSlide.mobileManifestoFontSize || "0.85rem")
    : (activeSlide.manifestoFontSize || heroManifestoFontSize);

  const activeHeroManifestoFontAlignment = isMobile
    ? (activeSlide.mobileManifestoFontAlignment || activeSlide.manifestoFontAlignment || "center")
    : (activeSlide.manifestoFontAlignment || "center");

  const activeHeroManifestoFontWeight = isMobile
    ? (activeSlide.mobileManifestoFontWeight || activeSlide.manifestoFontWeight || heroManifestoFontWeight)
    : (activeSlide.manifestoFontWeight || heroManifestoFontWeight);

  const activeShowHeroManifesto = isMobile
    ? (activeSlide.showMobileHeroManifesto !== undefined ? activeSlide.showMobileHeroManifesto : activeSlide.showManifesto)
    : activeSlide.showManifesto;

  const activeHeroButtonText = isMobile
    ? (activeSlide.mobileButtonText || activeSlide.buttonText || heroButtonText)
    : (activeSlide.buttonText || heroButtonText);

  const activeHeroButtonStyle = isMobile
    ? (activeSlide.mobileButtonStyle || activeSlide.buttonStyle || heroButtonStyle)
    : (activeSlide.buttonStyle || heroButtonStyle);

  const activeHeroButtonSize = isMobile
    ? (activeSlide.mobileButtonSize || "sm")
    : (activeSlide.buttonSize || heroButtonSize);

  const activeHeroButtonColor = isMobile
    ? (activeSlide.mobileButtonColor !== "" && activeSlide.mobileButtonColor !== undefined ? activeSlide.mobileButtonColor : activeSlide.buttonColor)
    : activeSlide.buttonColor;

  const activeHeroButtonTextColor = isMobile
    ? (activeSlide.mobileButtonTextColor || activeSlide.buttonTextColor || heroButtonTextColor)
    : (activeSlide.buttonTextColor || heroButtonTextColor);

  const activeShowHeroButton = isMobile
    ? (activeSlide.showMobileHeroButton !== undefined ? activeSlide.showMobileHeroButton : activeSlide.showButton)
    : activeSlide.showButton;

  const slideBgType = activeSlide.bgType || heroBgType || "color";
  const slideBgColor = activeSlide.bgColor || heroBgColor || "#121212";
  const slideBgImage = activeSlide.bgImage || heroBgImage;
  const slideBgVideo = activeSlide.bgVideo || heroBgVideo;

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: slideBgType === "color" ? (slideBgColor || "var(--primary-brand-color, #ffffff)") : "#121212",
        backgroundImage: slideBgType === "image" && slideBgImage ? `url("${slideBgImage}")` : "none",
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
          activeHeroTemplate === "bottom-left" || activeHeroTemplate === "right-bottom" || activeHeroTemplate === "bottom-center" ? "100px 5vw 80px 5vw" :
            activeHeroTemplate === "top-left" || activeHeroTemplate === "right-top" || activeHeroTemplate === "top-center" ? "100px 5vw" : "0 5vw",
        textAlign:
          activeHeroTemplate === "center" || activeHeroTemplate.endsWith("center") ? "center" :
            activeHeroTemplate.startsWith("right") ? "right" : "left",
        minHeight: "82vh",
        transition: "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out"
      }}
    >
      {slideBgType === "video" && slideBgVideo && (
        <video key={slideBgVideo} src={slideBgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
      )}
      {slideBgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

      {/* Left Carousel Prev Arrow */}
      {slides.length > 1 && (
        <button
          type="button"
          aria-label="Previous Hero Slide"
          onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            cursor: "pointer",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            transition: "all 0.2s ease"
          }}
        >
          ‹
        </button>
      )}

      {/* Right Carousel Next Arrow */}
      {slides.length > 1 && (
        <button
          type="button"
          aria-label="Next Hero Slide"
          onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            cursor: "pointer",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            transition: "all 0.2s ease"
          }}
        >
          ›
        </button>
      )}

      {/* Main Slide Content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
        {activeShowHeroTitle && (
          <h1 style={{
            fontFamily: activeHeroTitleFontType ? `"${activeHeroTitleFontType}", sans-serif` : "inherit",
            color: activeHeroTitleFontColor || "#ffffff",
            fontSize: activeHeroTitleFontSize || "4.5rem",
            fontWeight: Number(activeHeroTitleFontWeight) || (activeHeroTitleFontWeight as any) || 700,
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
            color: activeHeroManifestoFontColor || "#ffffff",
            fontSize: activeHeroManifestoFontSize || "1.1rem",
            fontWeight: Number(activeHeroManifestoFontWeight) || (activeHeroManifestoFontWeight as any) || 500,
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
          const btnColor = activeHeroButtonColor ? activeHeroButtonColor : (primaryColor || "#ffffff");
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
              <Link href={activeSlide.buttonRedirectUrl || "/shop"} style={{
                display: "inline-block",
                padding: paddings[activeHeroButtonSize] || paddings.md,
                fontSize: fontSizes[activeHeroButtonSize] || fontSizes.md,
                backgroundColor: isSolid ? btnColor : "transparent",
                color: isSolid ? (activeHeroButtonTextColor || "#000000") : (activeHeroButtonTextColor || btnColor),
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

      {/* Pagination Dots at Bottom */}
      {slides.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlideIndex(idx)}
              style={{
                width: idx === currentSlideIndex ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: idx === currentSlideIndex ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
