"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { HeroSlideItem } from "@/app/admin/types";

interface LifestyleBannerProps {
  showLifestyle: boolean;
  isMobile: boolean;

  lifestyleText: string;
  mobileLifestyleText?: string;
  lifestyleTextFontType: string;
  mobileLifestyleTextFontType?: string;
  lifestyleTextFontColor: string;
  mobileLifestyleTextFontColor?: string;
  lifestyleTextFontSize: string;
  mobileLifestyleTextFontSize?: string;
  lifestyleTextFontAlignment: string;
  mobileLifestyleTextFontAlignment?: string;
  lifestyleTextFontWeight: string;
  mobileLifestyleTextFontWeight?: string;
  showLifestyleText: boolean;
  showMobileLifestyleText?: boolean;

  lifestyleButtonText: string;
  mobileLifestyleButtonText?: string;
  lifestyleButtonStyle: string;
  mobileLifestyleButtonStyle?: string;
  lifestyleButtonSize: string;
  mobileLifestyleButtonSize?: string;
  lifestyleButtonColor: string;
  mobileLifestyleButtonColor?: string;
  lifestyleButtonTextColor: string;
  mobileLifestyleButtonTextColor?: string;
  showLifestyleButton: boolean;
  showMobileLifestyleButton?: boolean;

  lifestyleBgColor?: string;
  lifestyleImage?: string | null;
  primaryColor?: string;

  // Carousel & Animation Props
  lifestyleSlides?: HeroSlideItem[];
  lifestyleAutoPlay?: boolean;
  lifestyleAutoPlaySpeed?: number;
}

export default function LifestyleBanner({
  showLifestyle,
  isMobile,

  lifestyleText,
  mobileLifestyleText,
  lifestyleTextFontType,
  mobileLifestyleTextFontType,
  lifestyleTextFontColor,
  mobileLifestyleTextFontColor,
  lifestyleTextFontSize,
  mobileLifestyleTextFontSize,
  lifestyleTextFontAlignment,
  mobileLifestyleTextFontAlignment,
  lifestyleTextFontWeight,
  mobileLifestyleTextFontWeight,
  showLifestyleText,
  showMobileLifestyleText,

  lifestyleButtonText,
  mobileLifestyleButtonText,
  lifestyleButtonStyle,
  mobileLifestyleButtonStyle,
  lifestyleButtonSize,
  mobileLifestyleButtonSize,
  lifestyleButtonColor,
  mobileLifestyleButtonColor,
  lifestyleButtonTextColor,
  mobileLifestyleButtonTextColor,
  showLifestyleButton,
  showMobileLifestyleButton,

  lifestyleBgColor = "#000000",
  lifestyleImage,
  primaryColor,

  lifestyleSlides,
  lifestyleAutoPlay = true,
  lifestyleAutoPlaySpeed = 5
}: LifestyleBannerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Default fallback slide
  const slides: HeroSlideItem[] = (lifestyleSlides && lifestyleSlides.length > 0)
    ? lifestyleSlides
    : [
        {
          id: "default_lifestyle_slide",
          titleText: lifestyleText,
          titleFontType: lifestyleTextFontType,
          titleFontColor: lifestyleTextFontColor,
          titleFontSize: lifestyleTextFontSize,
          titleFontAlignment: lifestyleTextFontAlignment,
          titleFontWeight: lifestyleTextFontWeight,
          showTitle: showLifestyleText,

          manifestoText: "",
          manifestoFontType: "Outfit",
          manifestoFontColor: "#ffffff",
          manifestoFontSize: "1rem",
          manifestoFontAlignment: "center",
          manifestoFontWeight: "500",
          showManifesto: false,

          buttonText: lifestyleButtonText,
          buttonStyle: lifestyleButtonStyle,
          buttonSize: lifestyleButtonSize,
          buttonColor: lifestyleButtonColor,
          buttonTextColor: lifestyleButtonTextColor,
          showButton: showLifestyleButton,

          layoutTemplate: "center",
          bgType: "image",
          bgColor: lifestyleBgColor || "#000000",
          bgImage: lifestyleImage || "",
          bgVideo: "",

          mobileLayoutTemplate: "center",
          mobileTitleText: mobileLifestyleText,
          mobileTitleFontType: mobileLifestyleTextFontType,
          mobileTitleFontColor: mobileLifestyleTextFontColor,
          mobileTitleFontSize: mobileLifestyleTextFontSize,
          mobileTitleFontAlignment: mobileLifestyleTextFontAlignment,
          mobileTitleFontWeight: mobileLifestyleTextFontWeight,
          showMobileHeroTitle: showMobileLifestyleText,

          mobileManifestoText: "",
          mobileManifestoFontType: "Outfit",
          mobileManifestoFontColor: "#ffffff",
          mobileManifestoFontSize: "0.85rem",
          mobileManifestoFontAlignment: "center",
          mobileManifestoFontWeight: "500",
          showMobileHeroManifesto: false,

          mobileButtonText: mobileLifestyleButtonText,
          mobileButtonStyle: mobileLifestyleButtonStyle,
          mobileButtonSize: mobileLifestyleButtonSize,
          mobileButtonColor: mobileLifestyleButtonColor,
          mobileButtonTextColor: mobileLifestyleButtonTextColor,
          showMobileHeroButton: showMobileLifestyleButton
        }
      ];

  const goToSlide = (newIndex: number) => {
    if (newIndex === currentSlideIndex || slides.length <= 1) return;
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlideIndex(newIndex);
  };

  // Auto-play Timer Effect
  useEffect(() => {
    if (!lifestyleAutoPlay || slides.length <= 1 || isHovered) return;
    const intervalMs = (lifestyleAutoPlaySpeed || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        setPrevSlideIndex(prev);
        return (prev + 1) % slides.length;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [lifestyleAutoPlay, lifestyleAutoPlaySpeed, slides.length, isHovered]);

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

  const activeShowLifestyleText = isMobile ? (showMobileLifestyleText !== undefined ? showMobileLifestyleText : showLifestyleText) : showLifestyleText;
  const activeShowLifestyleButton = isMobile ? (showMobileLifestyleButton !== undefined ? showMobileLifestyleButton : showLifestyleButton) : showLifestyleButton;

  if (!showLifestyle && !activeShowLifestyleText && !activeShowLifestyleButton && (!lifestyleSlides || lifestyleSlides.length === 0)) {
    return null;
  }

  const renderLifestyleSlide = (
    slide: HeroSlideItem,
    isPrevious: boolean,
    keyStr: string
  ) => {
    const sBgType = slide.bgType || "image";
    const sBgColor = slide.bgColor || lifestyleBgColor || "#000000";
    const sBgImage = slide.bgImage !== undefined && slide.bgImage !== "" ? slide.bgImage : lifestyleImage;
    const sBgVideo = slide.bgVideo || "";

    const sTemplate = isMobile
      ? (slide.mobileLayoutTemplate || slide.layoutTemplate || "center")
      : (slide.layoutTemplate || "center");

    const sTitle = isMobile
      ? (slide.mobileTitleText !== "" && slide.mobileTitleText !== undefined ? slide.mobileTitleText : (slide.titleText || lifestyleText))
      : (slide.titleText || lifestyleText);

    const sTitleFontType = isMobile
      ? (slide.mobileTitleFontType || slide.titleFontType || lifestyleTextFontType)
      : (slide.titleFontType || lifestyleTextFontType);

    const sTitleFontColor = isMobile
      ? (slide.mobileTitleFontColor || slide.titleFontColor || lifestyleTextFontColor)
      : (slide.titleFontColor || lifestyleTextFontColor);

    const sTitleFontSize = isMobile
      ? (slide.mobileTitleFontSize || "1.8rem")
      : (slide.titleFontSize || lifestyleTextFontSize || "2.5rem");

    const sTitleFontAlignment = isMobile
      ? (slide.mobileTitleFontAlignment || slide.titleFontAlignment || lifestyleTextFontAlignment || "center")
      : (slide.titleFontAlignment || lifestyleTextFontAlignment || "center");

    const sTitleFontWeight = isMobile
      ? (slide.mobileTitleFontWeight || slide.titleFontWeight || lifestyleTextFontWeight)
      : (slide.titleFontWeight || lifestyleTextFontWeight);

    const sShowTitle = isMobile
      ? (slide.showMobileHeroTitle !== undefined ? slide.showMobileHeroTitle : (slide.showTitle !== undefined ? slide.showTitle : showLifestyleText))
      : (slide.showTitle !== undefined ? slide.showTitle : showLifestyleText);

    const sManifesto = isMobile
      ? (slide.mobileManifestoText !== "" && slide.mobileManifestoText !== undefined ? slide.mobileManifestoText : slide.manifestoText)
      : slide.manifestoText;

    const sManifestoFontType = isMobile
      ? (slide.mobileManifestoFontType || slide.manifestoFontType || "Outfit")
      : (slide.manifestoFontType || "Outfit");

    const sManifestoFontColor = isMobile
      ? (slide.mobileManifestoFontColor || slide.manifestoFontColor || "#ffffff")
      : (slide.manifestoFontColor || "#ffffff");

    const sManifestoFontSize = isMobile
      ? (slide.mobileManifestoFontSize || "0.85rem")
      : (slide.manifestoFontSize || "1rem");

    const sManifestoFontAlignment = isMobile
      ? (slide.mobileManifestoFontAlignment || slide.manifestoFontAlignment || "center")
      : (slide.manifestoFontAlignment || "center");

    const sManifestoFontWeight = isMobile
      ? (slide.mobileManifestoFontWeight || slide.manifestoFontWeight || "500")
      : (slide.manifestoFontWeight || "500");

    const sShowManifesto = isMobile
      ? (slide.showMobileHeroManifesto !== undefined ? slide.showMobileHeroManifesto : (slide.showManifesto !== undefined ? slide.showManifesto : false))
      : (slide.showManifesto !== undefined ? slide.showManifesto : false);

    const sButtonText = isMobile
      ? (slide.mobileButtonText || slide.buttonText || lifestyleButtonText)
      : (slide.buttonText || lifestyleButtonText);

    const sButtonStyle = isMobile
      ? (slide.mobileButtonStyle || slide.buttonStyle || lifestyleButtonStyle)
      : (slide.buttonStyle || lifestyleButtonStyle);

    const sButtonSize = isMobile
      ? (slide.mobileButtonSize || "sm")
      : (slide.buttonSize || lifestyleButtonSize);

    const sButtonColor = isMobile
      ? (slide.mobileButtonColor !== "" && slide.mobileButtonColor !== undefined ? slide.mobileButtonColor : lifestyleButtonColor)
      : lifestyleButtonColor;

    const sButtonTextColor = isMobile
      ? (slide.mobileButtonTextColor || slide.buttonTextColor || lifestyleButtonTextColor)
      : (slide.buttonTextColor || lifestyleButtonTextColor);

    const sShowButton = isMobile
      ? (slide.showMobileHeroButton !== undefined ? slide.showMobileHeroButton : (slide.showButton !== undefined ? slide.showButton : showLifestyleButton))
      : (slide.showButton !== undefined ? slide.showButton : showLifestyleButton);

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
            sTemplate === "bottom-left" || sTemplate === "right-bottom" || sTemplate === "bottom-center" ? "80px 5vw 60px 5vw" :
              sTemplate === "top-left" || sTemplate === "right-top" || sTemplate === "top-center" ? "80px 5vw" : "40px 5vw",
          textAlign:
            sTemplate === "center" || sTemplate.endsWith("center") ? "center" :
              sTemplate.startsWith("right") ? "right" : "left",
          backgroundColor: sBgType === "color" ? sBgColor : (lifestyleBgColor || "#000000"),
          backgroundImage: sBgType === "image" && sBgImage ? `url("${sBgImage}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: containerAnimation
        }}
      >
        {sBgType === "video" && sBgVideo && (
          <video
            key={sBgVideo}
            src={sBgVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
          />
        )}
        <div className={styles.lifestyleOverlay} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

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

          const titleCont = isMobile ? (slide.mobileTitleContainer || slide.titleContainer) : slide.titleContainer;
          const manifestoCont = isMobile ? (slide.mobileManifestoContainer || slide.manifestoContainer) : slide.manifestoContainer;
          const buttonCont = isMobile ? (slide.mobileButtonContainer || slide.buttonContainer) : slide.buttonContainer;

          return (
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "900px",
                width: "100%"
              }}
            >
              {sShowTitle && (() => {
                const animName = getAnimName(titleAnim.type);
                const isLoop = titleAnim.type?.endsWith("-loop") || titleAnim.type === "pulse-beat" || titleAnim.type === "shimmer-gold" || titleAnim.type === "subtle-shake";

                return (
                  <div
                    style={{
                      transform: titleCont ? `translate(${titleCont.offsetX || 0}px, ${titleCont.offsetY || 0}px)` : undefined,
                      width: titleCont?.width ? `${titleCont.width}px` : "auto",
                      height: titleCont?.height ? `${titleCont.height}px` : "auto",
                      backgroundColor: titleCont?.bgColor || "transparent",
                      padding: titleCont?.padding ? `${titleCont.padding}px` : undefined,
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                  >
                    <div style={{
                      display: "inline-block",
                      animation: (animName !== "none" && !isPrevious)
                        ? (isLoop
                            ? animName
                            : `${animName} ${titleAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelays.title || 0}s both`)
                        : "none"
                    }}>
                      <p
                        className={styles.lifestyleText}
                        style={{
                          fontFamily: sTitleFontType ? `"${sTitleFontType}", sans-serif` : "inherit",
                          color: sTitleFontColor || "#ffffff",
                          fontSize: sTitleFontSize || "2.5rem",
                          fontWeight: Number(sTitleFontWeight) || 700,
                          textAlign: (sTitleFontAlignment as any) || "center",
                          margin: 0
                        }}
                      >
                        {sTitle}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {sShowManifesto && (() => {
                const animName = getAnimName(manifestoAnim.type);
                const isLoop = manifestoAnim.type?.endsWith("-loop") || manifestoAnim.type === "pulse-beat" || manifestoAnim.type === "shimmer-gold" || manifestoAnim.type === "subtle-shake";

                return (
                  <div
                    style={{
                      transform: manifestoCont ? `translate(${manifestoCont.offsetX || 0}px, ${manifestoCont.offsetY || 0}px)` : undefined,
                      width: manifestoCont?.width ? `${manifestoCont.width}px` : "auto",
                      height: manifestoCont?.height ? `${manifestoCont.height}px` : "auto",
                      backgroundColor: manifestoCont?.bgColor || "transparent",
                      padding: manifestoCont?.padding ? `${manifestoCont.padding}px` : undefined,
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                  >
                    <div style={{
                      display: "inline-block",
                      animation: (animName !== "none" && !isPrevious)
                        ? (isLoop
                            ? animName
                            : `${animName} ${manifestoAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelays.manifesto || 0}s both`)
                        : "none"
                    }}>
                      <p
                        style={{
                          fontFamily: sManifestoFontType ? `"${sManifestoFontType}", sans-serif` : "inherit",
                          color: sManifestoFontColor || "#ffffff",
                          fontSize: sManifestoFontSize || "1rem",
                          fontWeight: Number(sManifestoFontWeight) || 500,
                          textAlign: (sManifestoFontAlignment as any) || "center",
                          margin: 0
                        }}
                      >
                        {sManifesto}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {sShowButton && (() => {
                const btnPadding = sButtonSize === "sm" ? "8px 18px" : sButtonSize === "lg" ? "16px 36px" : "12px 28px";
                const btnFontSize = sButtonSize === "sm" ? "0.82rem" : sButtonSize === "lg" ? "1.05rem" : "0.92rem";
                const effectiveButtonBg = sButtonStyle === "outline" ? "transparent" : (sButtonColor || primaryColor || "#ffffff");
                const effectiveButtonBorder = sButtonStyle === "outline" ? `2px solid ${sButtonColor || "#ffffff"}` : "none";

                const animName = getAnimName(buttonAnim.type);
                const isLoop = buttonAnim.type?.endsWith("-loop") || buttonAnim.type === "pulse-beat" || buttonAnim.type === "shimmer-gold" || buttonAnim.type === "subtle-shake";

                return (
                  <div
                    style={{
                      transform: buttonCont ? `translate(${buttonCont.offsetX || 0}px, ${buttonCont.offsetY || 0}px)` : undefined,
                      width: buttonCont?.width ? `${buttonCont.width}px` : "auto",
                      height: buttonCont?.height ? `${buttonCont.height}px` : "auto",
                      padding: (buttonCont?.paddingX || buttonCont?.paddingY) ? `${buttonCont?.paddingY || 0}px ${buttonCont?.paddingX || 0}px` : undefined,
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: sTemplate === "center" || sTemplate.endsWith("center") ? "center" : sTemplate.startsWith("right") ? "flex-end" : "flex-start"
                    }}
                  >
                    <div style={{
                      display: "inline-block",
                      animation: (animName !== "none" && !isPrevious)
                        ? (isLoop
                            ? animName
                            : `${animName} ${buttonAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelays.button || 0}s both`)
                        : "none"
                    }}>
                      <Link
                        href={slide.buttonRedirectUrl || "/shop"}
                        style={{
                          display: "inline-block",
                          padding: btnPadding,
                          fontSize: btnFontSize,
                          fontFamily: `"${sTitleFontType}", sans-serif`,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          borderRadius: "4px",
                          backgroundColor: effectiveButtonBg,
                          color: sButtonTextColor || "#ffffff",
                          border: effectiveButtonBorder,
                          textDecoration: sButtonStyle === "minimal" ? "underline" : "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {sButtonText || "Explore Now"}
                      </Link>
                    </div>
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
      className={styles.lifestyleBanner}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        minHeight: "65vh",
        overflow: "hidden",
        padding: "0"
      }}
    >
      <style>{`
        @keyframes heroSlideFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes heroSlideFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes heroSlidePush {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        @keyframes heroSlidePushOutLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes heroSlideMorphIn {
          0% { opacity: 0; transform: scale(1.08); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        @keyframes elemFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes elemFlyInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes elemFlyInLeft {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes elemFlyInRight {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes elemFloatUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes elemZoomIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes elemZoomOut {
          0% { opacity: 0; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes elemBounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 0.9; transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
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
          100% { filter: brightness(1) drop-shadow(0 0 0px rgba(245, 158, 11, 0.8)); }
        }
        @keyframes elemFloatLoop {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Render Previous Slide if Transitioning */}
      {prevSlideIndex !== null && slides[prevSlideIndex] && renderLifestyleSlide(slides[prevSlideIndex], true, `prev_lifestyle_slide_${prevSlideIndex}`)}

      {/* Render Active Slide */}
      {activeSlide && renderLifestyleSlide(activeSlide, false, `active_lifestyle_slide_${currentSlideIndex}`)}

      {/* Left Carousel Prev Arrow */}
      {slides.length > 1 && (
        <button
          type="button"
          aria-label="Previous Lifestyle Slide"
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
          aria-label="Next Lifestyle Slide"
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
              aria-label={`Go to lifestyle slide ${idx + 1}`}
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
