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
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);
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

  const goToSlide = (newIndex: number) => {
    if (newIndex === currentSlideIndex || slides.length <= 1) return;
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlideIndex(newIndex);
  };

  // Auto-play Timer Effect
  useEffect(() => {
    if (!heroAutoPlay || slides.length <= 1 || isHovered) return;
    const intervalMs = (heroAutoPlaySpeed || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        setPrevSlideIndex(prev);
        return (prev + 1) % slides.length;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [heroAutoPlay, heroAutoPlaySpeed, slides.length, isHovered]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  // Cleanup prevSlideIndex when transition finishes
  useEffect(() => {
    if (prevSlideIndex !== null) {
      const activeDuration = ((activeSlide.slideAnimationDuration || 0.5) * 1000) + 50;
      const timer = setTimeout(() => {
        setPrevSlideIndex(null);
      }, activeDuration);
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex, prevSlideIndex, activeSlide.slideAnimationDuration]);

  const renderHeroSlide = (
    slide: HeroSlideItem,
    isPrevious: boolean,
    keyStr: string
  ) => {
    const sBgType = slide.bgType || heroBgType || "color";
    const sBgColor = slide.bgColor || heroBgColor || "#121212";
    const sBgImage = slide.bgImage || heroBgImage;
    const sBgVideo = slide.bgVideo || heroBgVideo;

    const sTemplate = isMobile
      ? (slide.mobileLayoutTemplate || slide.layoutTemplate || heroTemplate || "center")
      : (slide.layoutTemplate || heroTemplate || "center");

    const sTitle = isMobile
      ? (slide.mobileTitleText !== "" && slide.mobileTitleText !== undefined ? slide.mobileTitleText : slide.titleText)
      : slide.titleText;

    const sTitleFontType = isMobile
      ? (slide.mobileTitleFontType || slide.titleFontType || heroTitleFontType)
      : (slide.titleFontType || heroTitleFontType);

    const sTitleFontColor = isMobile
      ? (slide.mobileTitleFontColor || slide.titleFontColor || heroTitleFontColor)
      : (slide.titleFontColor || heroTitleFontColor);

    const sTitleFontSize = isMobile
      ? (slide.mobileTitleFontSize || "2.5rem")
      : (slide.titleFontSize || heroTitleFontSize);

    const sTitleFontAlignment = isMobile
      ? (slide.mobileTitleFontAlignment || slide.titleFontAlignment || "center")
      : (slide.titleFontAlignment || "center");

    const sTitleFontWeight = isMobile
      ? (slide.mobileTitleFontWeight || slide.titleFontWeight || heroTitleFontWeight)
      : (slide.titleFontWeight || heroTitleFontWeight);

    const sShowTitle = isMobile
      ? (slide.showMobileHeroTitle !== undefined ? slide.showMobileHeroTitle : slide.showTitle)
      : slide.showTitle;

    const sManifesto = isMobile
      ? (slide.mobileManifestoText !== "" && slide.mobileManifestoText !== undefined ? slide.mobileManifestoText : slide.manifestoText)
      : slide.manifestoText;

    const sManifestoFontType = isMobile
      ? (slide.mobileManifestoFontType || slide.manifestoFontType || heroManifestoFontType)
      : (slide.manifestoFontType || heroManifestoFontType);

    const sManifestoFontColor = isMobile
      ? (slide.mobileManifestoFontColor || slide.manifestoFontColor || heroManifestoFontColor)
      : (slide.manifestoFontColor || heroManifestoFontColor);

    const sManifestoFontSize = isMobile
      ? (slide.mobileManifestoFontSize || "0.85rem")
      : (slide.manifestoFontSize || heroManifestoFontSize);

    const sManifestoFontAlignment = isMobile
      ? (slide.mobileManifestoFontAlignment || slide.manifestoFontAlignment || "center")
      : (slide.manifestoFontAlignment || "center");

    const sManifestoFontWeight = isMobile
      ? (slide.mobileManifestoFontWeight || slide.manifestoFontWeight || heroManifestoFontWeight)
      : (slide.manifestoFontWeight || heroManifestoFontWeight);

    const sShowManifesto = isMobile
      ? (slide.showMobileHeroManifesto !== undefined ? slide.showMobileHeroManifesto : slide.showManifesto)
      : slide.showManifesto;

    const sButtonText = isMobile
      ? (slide.mobileButtonText || slide.buttonText || heroButtonText)
      : (slide.buttonText || heroButtonText);

    const sButtonStyle = isMobile
      ? (slide.mobileButtonStyle || slide.buttonStyle || heroButtonStyle)
      : (slide.buttonStyle || heroButtonStyle);

    const sButtonSize = isMobile
      ? (slide.mobileButtonSize || "sm")
      : (slide.buttonSize || heroButtonSize);

    const sButtonColor = isMobile
      ? (slide.mobileButtonColor !== "" && slide.mobileButtonColor !== undefined ? slide.mobileButtonColor : slide.buttonColor)
      : slide.buttonColor;

    const sButtonTextColor = isMobile
      ? (slide.mobileButtonTextColor || slide.buttonTextColor || heroButtonTextColor)
      : (slide.buttonTextColor || heroButtonTextColor);

    const sShowButton = isMobile
      ? (slide.showMobileHeroButton !== undefined ? slide.showMobileHeroButton : slide.showButton)
      : slide.showButton;

    const animType = activeSlide.slideAnimation !== undefined ? activeSlide.slideAnimation : "fade";
    const duration = activeSlide.slideAnimationDuration || 0.5;
    const isPush = animType?.startsWith("push");

    const containerAnimation = isPrevious
      ? (isPush
          ? `heroSlidePushOutLeft ${duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`
          : `heroSlideFadeOut ${duration}s ease forwards`)
      : (prevSlideIndex === null
          ? "none"
          : (animType === "none"
              ? "none"
              : animType === "morph"
                ? `heroSlideMorphIn ${duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                : isPush
                  ? `heroSlidePush ${duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                  : `heroSlideFadeIn ${duration}s ease forwards`));

    return (
      <div
        key={keyStr}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: isPrevious ? 1 : 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            sTemplate === "top-left" || sTemplate === "right-top" || sTemplate === "top-center" ? "flex-start" :
              sTemplate === "bottom-left" || sTemplate === "right-bottom" || sTemplate === "bottom-center" ? "flex-end" : "center",
          alignItems:
            sTemplate === "center" || sTemplate.endsWith("center") ? "center" :
              sTemplate.startsWith("right") ? "flex-end" : "flex-start",
          padding:
            sTemplate === "bottom-left" || sTemplate === "right-bottom" || sTemplate === "bottom-center" ? "100px 5vw 80px 5vw" :
              sTemplate === "top-left" || sTemplate === "right-top" || sTemplate === "top-center" ? "100px 5vw" : "0 5vw",
          textAlign:
            sTemplate === "center" || sTemplate.endsWith("center") ? "center" :
              sTemplate.startsWith("right") ? "right" : "left",
          backgroundColor: sBgType === "color" ? (sBgColor || "var(--primary-brand-color, #ffffff)") : "#121212",
          backgroundImage: sBgType === "image" && sBgImage ? `url("${sBgImage}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: containerAnimation
        }}
      >
        {sBgType === "video" && sBgVideo && (
          <video key={sBgVideo} src={sBgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
        )}
        {sBgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

        {/* Slide Content */}
        {(() => {
          const titleAnim = slide.titleAnimation || { type: "none", duration: 0.6, delay: 0, order: 1 };
          const manifestoAnim = slide.manifestoAnimation || { type: "none", duration: 0.6, delay: 0, order: 2 };
          const buttonAnim = slide.buttonAnimation || { type: "none", duration: 0.6, delay: 0, order: 3 };

          const animItems = [
            { id: "title", type: sShowTitle ? (titleAnim.type || "none") : "none", duration: titleAnim.duration || 0.6, delay: titleAnim.delay || 0, order: titleAnim.order || 1 },
            { id: "manifesto", type: sShowManifesto ? (manifestoAnim.type || "none") : "none", duration: manifestoAnim.duration || 0.6, delay: manifestoAnim.delay || 0, order: manifestoAnim.order || 2 },
            { id: "button", type: sShowButton ? (buttonAnim.type || "none") : "none", duration: buttonAnim.duration || 0.6, delay: buttonAnim.delay || 0, order: buttonAnim.order || 3 }
          ].sort((a, b) => a.order - b.order);

          const effectiveDelays: Record<string, number> = {};
          let seqTime = 0;
          for (const item of animItems) {
            const isEntrance = item.type && item.type !== "none" && !item.type.endsWith("-loop") && item.type !== "pulse-beat" && item.type !== "shimmer-gold" && item.type !== "subtle-shake";
            if (!isEntrance) {
              effectiveDelays[item.id] = item.delay;
            } else {
              const startTime = seqTime + item.delay;
              effectiveDelays[item.id] = parseFloat(startTime.toFixed(2));
              seqTime = startTime + item.duration;
            }
          }

          const getAnimName = (type: string | undefined) => {
            switch (type) {
              case "fly-in-up": return "elemFlyInUp";
              case "fly-in-left": return "elemFlyInLeft";
              case "fly-in-right": return "elemFlyInRight";
              case "float-up": return "elemFloatUp";
              case "zoom-in": return "elemZoomIn";
              case "zoom-out": return "elemZoomOut";
              case "bounce-in": return "elemBounceIn";
              case "spin-in": return "elemSpinIn";
              case "flip-x": return "elemFlipX";
              case "blur-reveal": return "elemBlurReveal";
              case "wipe": return "elemWipe";
              case "split": return "elemSplit";
              case "fade-in": return "elemFadeIn";
              case "pulse-beat": return "elemPulseBeat 2s infinite ease-in-out";
              case "shimmer-gold": return "elemShimmerGold 2.5s infinite ease-in-out";
              case "float-loop": return "elemFloatLoop 3s infinite ease-in-out";
              case "subtle-shake": return "elemSubtleShake 1.5s infinite ease-in-out";
              case "none": return "none";
              default: return type ? "elemFadeIn" : "none";
            }
          };

          return (
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "800px",
                width: "100%"
              }}
            >
              {sShowTitle && (() => {
                const animName = getAnimName(titleAnim.type);
                const isLoop = titleAnim.type?.endsWith("-loop") || titleAnim.type === "pulse-beat" || titleAnim.type === "shimmer-gold" || titleAnim.type === "subtle-shake";

                return (
                  <h1 style={{
                    fontFamily: sTitleFontType ? `"${sTitleFontType}", sans-serif` : "inherit",
                    color: sTitleFontColor || "#ffffff",
                    fontSize: sTitleFontSize || "4.5rem",
                    fontWeight: Number(sTitleFontWeight) || (sTitleFontWeight as any) || 700,
                    textAlign: (sTitleFontAlignment as any) || "inherit",
                    margin: 0,
                    lineHeight: "1.1",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    animation: isPrevious ? "none" : (animName === "none" ? "none" : `${animName} ${titleAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelays["title"] ?? 0}s ${isLoop ? "" : "both"}`)
                  }}>
                    {sTitle || ""}
                  </h1>
                );
              })()}

              {sShowManifesto && (() => {
                const animName = getAnimName(manifestoAnim.type);
                const isLoop = manifestoAnim.type?.endsWith("-loop") || manifestoAnim.type === "pulse-beat" || manifestoAnim.type === "shimmer-gold" || manifestoAnim.type === "subtle-shake";

                return (
                  <p style={{
                    fontFamily: sManifestoFontType ? `"${sManifestoFontType}", sans-serif` : "inherit",
                    color: sManifestoFontColor || "#ffffff",
                    fontSize: sManifestoFontSize || "1.1rem",
                    fontWeight: Number(sManifestoFontWeight) || (sManifestoFontWeight as any) || 500,
                    textAlign: (sManifestoFontAlignment as any) || "inherit",
                    margin: 0,
                    lineHeight: "1.6",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    animation: isPrevious ? "none" : (animName === "none" ? "none" : `${animName} ${manifestoAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelays["manifesto"] ?? 0}s ${isLoop ? "" : "both"}`)
                  }}>
                    {sManifesto || ""}
                  </p>
                );
              })()}

              {sShowButton && (() => {
                const btnColor = sButtonColor ? sButtonColor : (primaryColor || "#ffffff");
                const isSolid = sButtonStyle === "solid";
                const isOutline = sButtonStyle === "outline";

                const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
                const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };

                const animName = getAnimName(buttonAnim.type);
                const isLoop = buttonAnim.type?.endsWith("-loop") || buttonAnim.type === "pulse-beat" || buttonAnim.type === "shimmer-gold" || buttonAnim.type === "subtle-shake";

                return (
                  <div style={{
                    marginTop: "10px",
                    alignSelf:
                      sTemplate === "center" || sTemplate.endsWith("center") ? "center" :
                        sTemplate.startsWith("right") ? "flex-end" : "flex-start",
                    animation: isPrevious ? "none" : (animName === "none" ? "none" : `${animName} ${buttonAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelays["button"] ?? 0}s ${isLoop ? "" : "both"}`)
                  }}>
                    <Link href={slide.buttonRedirectUrl || "/shop"} style={{
                      display: "inline-block",
                      padding: paddings[sButtonSize] || paddings.md,
                      fontSize: fontSizes[sButtonSize] || fontSizes.md,
                      backgroundColor: isSolid ? btnColor : "transparent",
                      color: isSolid ? (sButtonTextColor || "#000000") : (sButtonTextColor || btnColor),
                      border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                      textDecoration: sButtonStyle === "minimal" ? "underline" : "none",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      textAlign: "center"
                    }}>
                      {sButtonText || "Shop Now"}
                    </Link>
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "82vh",
        backgroundColor: "#121212"
      }}
    >
      <style>{`
        /* PowerPoint Slide Transitions (Morph, Fade, Push) */
        @keyframes heroSlideMorphIn {
          0% { opacity: 0.15; transform: scale(0.96) translateY(14px); filter: blur(8px); }
          60% { opacity: 0.95; transform: scale(1.008) translateY(-2px); filter: blur(0px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); filter: blur(0px); }
        }
        @keyframes heroSlideFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes heroSlideFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes heroSlidePush {
          0% { transform: translate3d(100%, 0, 0); opacity: 1; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes heroSlidePushOutLeft {
          0% { transform: translate3d(0, 0, 0); opacity: 1; }
          100% { transform: translate3d(-100%, 0, 0); opacity: 1; }
        }

        /* PowerPoint Element Entrance Animations */
        @keyframes elemFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes elemFlyInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes elemFlyInLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes elemFlyInRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes elemFloatUp {
          0% { opacity: 0; transform: translateY(24px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes elemZoomIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes elemZoomOut {
          0% { opacity: 0; transform: scale(1.4); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes elemBounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes elemSpinIn {
          0% { opacity: 0; transform: rotate(-180deg) scale(0.3); }
          100% { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes elemFlipX {
          0% { opacity: 0; transform: perspective(400px) rotateX(90deg); }
          100% { opacity: 1; transform: perspective(400px) rotateX(0deg); }
        }
        @keyframes elemBlurReveal {
          0% { opacity: 0; filter: blur(16px); transform: scale(0.95); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @keyframes elemWipe {
          0% { opacity: 0; clip-path: inset(0 100% 0 0); }
          100% { opacity: 1; clip-path: inset(0 0 0 0); }
        }
        @keyframes elemSplit {
          0% { opacity: 0; transform: scaleX(0.4); }
          100% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes elemSubtleShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        @keyframes elemPulseBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes elemShimmerGold {
          0% { filter: brightness(1) drop-shadow(0 0 0px rgba(245, 158, 11, 0)); }
          50% { filter: brightness(1.25) drop-shadow(0 0 12px rgba(245, 158, 11, 0.8)); }
          100% { filter: brightness(1) drop-shadow(0 0 0px rgba(245, 158, 11, 0)); }
        }
        @keyframes elemFloatLoop {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Render Previous Slide if Transitioning */}
      {prevSlideIndex !== null && slides[prevSlideIndex] && renderHeroSlide(slides[prevSlideIndex], true, `prev_slide_${prevSlideIndex}`)}

      {/* Render Active Slide */}
      {activeSlide && renderHeroSlide(activeSlide, false, `active_slide_${currentSlideIndex}`)}

      {/* Left Carousel Prev Arrow */}
      {slides.length > 1 && (
        <button
          type="button"
          aria-label="Previous Hero Slide"
          onClick={() => goToSlide((currentSlideIndex - 1 + slides.length) % slides.length)}
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
          onClick={() => goToSlide((currentSlideIndex + 1) % slides.length)}
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
              onClick={() => goToSlide(idx)}
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

