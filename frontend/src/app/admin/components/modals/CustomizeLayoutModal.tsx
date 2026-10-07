import React, { useState, useEffect, useRef } from 'react';
import styles from "../../page.module.css";
import { LayoutCustomizationConfig, HeroSlideItem } from '../../types';
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
  primaryColor = "#ffffff"
}: CustomizeLayoutModalProps) {
  const canvasFrameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Default multi-slide hero dataset
  const isHeroSection = sectionName === "Hero Section";
  const defaultSingleSlide: HeroSlideItem = {
    id: "slide_1",
    titleText: initialConfig.titleText !== undefined ? initialConfig.titleText : (isHeroSection ? "WELCOME TO OUR STORE" : ""),
    titleFontType: initialConfig.titleFontType || "Outfit",
    titleFontColor: initialConfig.titleFontColor || "#ffffff",
    titleFontSize: initialConfig.titleFontSize || "4.5rem",
    titleFontAlignment: initialConfig.titleFontAlignment || "center",
    titleFontWeight: initialConfig.titleFontWeight || "700",
    showTitle: initialConfig.showTitle !== undefined ? initialConfig.showTitle : true,

    manifestoText: initialConfig.manifestoText !== undefined ? initialConfig.manifestoText : (isHeroSection ? "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION." : ""),
    manifestoFontType: initialConfig.manifestoFontType || "Outfit",
    manifestoFontColor: initialConfig.manifestoFontColor || "#ffffff",
    manifestoFontSize: initialConfig.manifestoFontSize || "1.1rem",
    manifestoFontAlignment: initialConfig.manifestoFontAlignment || "center",
    manifestoFontWeight: initialConfig.manifestoFontWeight || "500",
    showManifesto: initialConfig.showManifesto !== undefined ? initialConfig.showManifesto : true,

    buttonText: initialConfig.buttonText || "Shop Now",
    buttonStyle: initialConfig.buttonStyle || "solid",
    buttonSize: initialConfig.buttonSize || "md",
    buttonColor: initialConfig.buttonColor || "#ffffff",
    buttonTextColor: initialConfig.buttonTextColor || "#000000",
    showButton: initialConfig.showButton !== undefined ? initialConfig.showButton : true,

    layoutTemplate: initialConfig.layoutTemplate || "center",
    bgType: (initialConfig.bgType as any) || "color",
    bgColor: initialConfig.bgColor || "#121212",
    bgImage: initialConfig.bgImage || "",
    bgVideo: initialConfig.bgVideo || "",

    mobileLayoutTemplate: initialConfig.mobileLayoutTemplate || "center",
    mobileTitleText: initialConfig.mobileTitleText || "",
    mobileTitleFontType: initialConfig.mobileTitleFontType || "Outfit",
    mobileTitleFontColor: initialConfig.mobileTitleFontColor || "#ffffff",
    mobileTitleFontSize: initialConfig.mobileTitleFontSize || "2.5rem",
    mobileTitleFontAlignment: initialConfig.mobileTitleFontAlignment || "center",
    mobileTitleFontWeight: initialConfig.mobileTitleFontWeight || "700",
    showMobileHeroTitle: initialConfig.showMobileHeroTitle !== undefined ? initialConfig.showMobileHeroTitle : true,

    mobileManifestoText: initialConfig.mobileManifestoText || "",
    mobileManifestoFontType: initialConfig.mobileManifestoFontType || "Outfit",
    mobileManifestoFontColor: initialConfig.mobileManifestoFontColor || "#ffffff",
    mobileManifestoFontSize: initialConfig.mobileManifestoFontSize || "0.85rem",
    mobileManifestoFontAlignment: initialConfig.mobileManifestoFontAlignment || "center",
    mobileManifestoFontWeight: initialConfig.mobileManifestoFontWeight || "500",
    showMobileHeroManifesto: initialConfig.showMobileHeroManifesto !== undefined ? initialConfig.showMobileHeroManifesto : true,

    mobileButtonText: initialConfig.mobileButtonText || "Shop Now",
    mobileButtonStyle: initialConfig.mobileButtonStyle || "solid",
    mobileButtonSize: initialConfig.mobileButtonSize || "sm",
    mobileButtonColor: initialConfig.mobileButtonColor || "#ffffff",
    mobileButtonTextColor: initialConfig.mobileButtonTextColor || "#000000",
    showMobileHeroButton: initialConfig.showMobileHeroButton !== undefined ? initialConfig.showMobileHeroButton : true
  };

  const initialSlides: HeroSlideItem[] = (initialConfig.heroSlides && initialConfig.heroSlides.length > 0)
    ? initialConfig.heroSlides
    : (isHeroSection
      ? [
          defaultSingleSlide,
          {
            id: "slide_2",
            titleText: "SUMMER COLLECTION 2025",
            titleFontType: "Outfit",
            titleFontColor: "#f59e0b",
            titleFontSize: "4.5rem",
            titleFontAlignment: "center",
            titleFontWeight: "700",
            showTitle: true,

            manifestoText: "GET UP TO 50% OFF THIS WEEK ONLY. PREMIUM HAND-CRAFTED APPAREL FOR EVERY SEASON.",
            manifestoFontType: "Outfit",
            manifestoFontColor: "#ffffff",
            manifestoFontSize: "1.1rem",
            manifestoFontAlignment: "center",
            manifestoFontWeight: "500",
            showManifesto: true,

            buttonText: "EXPLORE COLLECTION",
            buttonRedirectUrl: "/category/offers",
            buttonStyle: "solid",
            buttonSize: "md",
            buttonColor: "#f59e0b",
            buttonTextColor: "#000000",
            showButton: true,

            layoutTemplate: "center",
            bgType: "color",
            bgColor: "#1e293b",
            bgImage: "",
            bgVideo: "",
            slideAnimation: "none",
            slideAnimationDuration: 0.5,
            elementAnimation: "none",
            elementAnimationDuration: 0.6,
            elementAnimationDelay: 0.1,
            titleAnimation: { type: "none", duration: 0.6, delay: 0.1, order: 1 },
            manifestoAnimation: { type: "none", duration: 0.6, delay: 0.25, order: 2 },
            buttonAnimation: { type: "none", duration: 0.6, delay: 0.4, order: 3 }
          },
          {
            id: "slide_3",
            titleText: "NEW ARRIVALS DROP",
            titleFontType: "Outfit",
            titleFontColor: "#38bdf8",
            titleFontSize: "4.5rem",
            titleFontAlignment: "center",
            titleFontWeight: "700",
            showTitle: true,

            manifestoText: "DISCOVER MODERN LUXURY STYLES CRAFTED WITH UNCOMPROMISING PRECISION AND BEAUTY.",
            manifestoFontType: "Outfit",
            manifestoFontColor: "#ffffff",
            manifestoFontSize: "1.1rem",
            manifestoFontAlignment: "center",
            manifestoFontWeight: "500",
            showManifesto: true,

            buttonText: "DISCOVER NOW",
            buttonRedirectUrl: "/category/new-arrivals",
            buttonStyle: "outline",
            buttonSize: "md",
            buttonColor: "#38bdf8",
            buttonTextColor: "#ffffff",
            showButton: true,

            layoutTemplate: "center",
            bgType: "color",
            bgColor: "#0f172a",
            bgImage: "",
            bgVideo: "",
            slideAnimation: "none",
            slideAnimationDuration: 0.5,
            elementAnimation: "none",
            elementAnimationDuration: 0.6,
            elementAnimationDelay: 0.1,
            titleAnimation: { type: "none", duration: 0.6, delay: 0.1, order: 1 },
            manifestoAnimation: { type: "none", duration: 0.6, delay: 0.25, order: 2 },
            buttonAnimation: { type: "none", duration: 0.6, delay: 0.4, order: 3 }
          }
        ]
      : [defaultSingleSlide]
    );

  const [slides, setSlides] = useState<HeroSlideItem[]>(initialSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [heroAutoPlay, setHeroAutoPlay] = useState<boolean>(initialConfig.heroAutoPlay ?? true);
  const [heroAutoPlaySpeed, setHeroAutoPlaySpeed] = useState<number>(initialConfig.heroAutoPlaySpeed ?? 5);
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);
  const [dropInsertIndex, setDropInsertIndex] = useState<number | null>(null);

  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Active Slide Local form copies
  const activeSlide = slides[activeSlideIndex] || slides[0] || initialSlides[0];

  const [titleText, setTitleText] = useState(activeSlide.titleText || "");
  const [showTitle, setShowTitle] = useState(activeSlide.showTitle !== undefined ? activeSlide.showTitle : true);
  const [titleFontType, setTitleFontType] = useState(activeSlide.titleFontType || "Outfit");
  const [titleFontSize, setTitleFontSize] = useState(activeSlide.titleFontSize || "2.5rem");
  const [titleFontColor, setTitleFontColor] = useState(activeSlide.titleFontColor || "#ffffff");
  const [titleFontWeight, setTitleFontWeight] = useState(activeSlide.titleFontWeight || "700");
  const [titleFontAlignment, setTitleFontAlignment] = useState(activeSlide.titleFontAlignment || "center");

  const [manifestoText, setManifestoText] = useState(activeSlide.manifestoText || "");
  const [showManifesto, setShowManifesto] = useState(activeSlide.showManifesto !== undefined ? activeSlide.showManifesto : true);
  const [manifestoFontType, setManifestoFontType] = useState(activeSlide.manifestoFontType || "Outfit");
  const [manifestoFontSize, setManifestoFontSize] = useState(activeSlide.manifestoFontSize || "1.1rem");
  const [manifestoFontColor, setManifestoFontColor] = useState(activeSlide.manifestoFontColor || "#ffffff");
  const [manifestoFontWeight, setManifestoFontWeight] = useState(activeSlide.manifestoFontWeight || "500");
  const [manifestoFontAlignment, setManifestoFontAlignment] = useState(activeSlide.manifestoFontAlignment || "center");

  const [buttonText, setButtonText] = useState(activeSlide.buttonText || "Shop Now");
  const [buttonRedirectUrl, setButtonRedirectUrl] = useState(activeSlide.buttonRedirectUrl || "/shop");
  const [showButton, setShowButton] = useState(activeSlide.showButton !== undefined ? activeSlide.showButton : true);
  const [buttonStyle, setButtonStyle] = useState(activeSlide.buttonStyle || "solid");
  const [buttonSize, setButtonSize] = useState(activeSlide.buttonSize || "md");
  const [buttonColor, setButtonColor] = useState(activeSlide.buttonColor || "");
  const [buttonTextColor, setButtonTextColor] = useState(activeSlide.buttonTextColor || "#ffffff");

  const [layoutTemplate, setLayoutTemplate] = useState(activeSlide.layoutTemplate || "center");
  const [bgType, setBgType] = useState<"color" | "image" | "video">((activeSlide.bgType as any) || "color");
  const [bgColor, setBgColor] = useState(activeSlide.bgColor || "#121212");
  const [bgImage, setBgImage] = useState(activeSlide.bgImage || "");
  const [bgVideo, setBgVideo] = useState(activeSlide.bgVideo || "");

  // Local state for UI
  const [selectedElement, setSelectedElement] = useState<"title" | "manifesto" | "button" | null>("title");
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Element box container dimensions (width, height, padding, background, offset positions X/Y)
  const [titleContainer, setTitleContainer] = useState<{ width?: number; height?: number; bgColor?: string; padding?: number; offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0, padding: 12 });
  const [manifestoContainer, setManifestoContainer] = useState<{ width?: number; height?: number; bgColor?: string; padding?: number; offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0, padding: 10 });
  const [buttonContainer, setButtonContainer] = useState<{ width?: number; height?: number; paddingX?: number; paddingY?: number; offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  // Mobile element box container dimensions
  const [mobileTitleContainer, setMobileTitleContainer] = useState<{ width?: number; height?: number; bgColor?: string; padding?: number; offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0, padding: 8 });
  const [mobileManifestoContainer, setMobileManifestoContainer] = useState<{ width?: number; height?: number; bgColor?: string; padding?: number; offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0, padding: 6 });
  const [mobileButtonContainer, setMobileButtonContainer] = useState<{ width?: number; height?: number; paddingX?: number; paddingY?: number; offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  // Alignment guide lines state
  const [showVerticalGuide, setShowVerticalGuide] = useState<boolean>(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState<boolean>(false);

  // Mobile-specific layout states
  const [mobileLayoutTemplate, setMobileLayoutTemplate] = useState(activeSlide.mobileLayoutTemplate || activeSlide.layoutTemplate || "center");
  const [mobileTitleText, setMobileTitleText] = useState(activeSlide.mobileTitleText ? activeSlide.mobileTitleText : (activeSlide.titleText || ""));
  const [mobileTitleFontType, setMobileTitleFontType] = useState(activeSlide.mobileTitleFontType || activeSlide.titleFontType || "Outfit");
  const [mobileTitleFontColor, setMobileTitleFontColor] = useState(activeSlide.mobileTitleFontColor || activeSlide.titleFontColor || "#111827");
  const [mobileTitleFontSize, setMobileTitleFontSize] = useState(activeSlide.mobileTitleFontSize || "2.5rem");
  const [mobileTitleFontAlignment, setMobileTitleFontAlignment] = useState(activeSlide.mobileTitleFontAlignment || activeSlide.titleFontAlignment || "center");
  const [mobileTitleFontWeight, setMobileTitleFontWeight] = useState(activeSlide.mobileTitleFontWeight || activeSlide.titleFontWeight || "700");
  const [mobileShowTitle, setMobileShowTitle] = useState(
    activeSlide.showMobileHeroTitle !== undefined ? activeSlide.showMobileHeroTitle : (activeSlide.showTitle !== undefined ? activeSlide.showTitle : true)
  );

  const [mobileManifestoText, setMobileManifestoText] = useState(activeSlide.mobileManifestoText ? activeSlide.mobileManifestoText : (activeSlide.manifestoText || ""));
  const [mobileManifestoFontType, setMobileManifestoFontType] = useState(activeSlide.mobileManifestoFontType || activeSlide.manifestoFontType || "Outfit");
  const [mobileManifestoFontColor, setMobileManifestoFontColor] = useState(activeSlide.mobileManifestoFontColor || activeSlide.manifestoFontColor || "#ffffff");
  const [mobileManifestoFontSize, setMobileManifestoFontSize] = useState(activeSlide.mobileManifestoFontSize || "0.85rem");
  const [mobileManifestoFontAlignment, setMobileManifestoFontAlignment] = useState(activeSlide.mobileManifestoFontAlignment || activeSlide.manifestoFontAlignment || "center");
  const [mobileManifestoFontWeight, setMobileManifestoFontWeight] = useState(activeSlide.mobileManifestoFontWeight || activeSlide.manifestoFontWeight || "500");
  const [mobileShowManifesto, setMobileShowManifesto] = useState(
    activeSlide.showMobileHeroManifesto !== undefined ? activeSlide.showMobileHeroManifesto : (activeSlide.showManifesto !== undefined ? activeSlide.showManifesto : true)
  );

  const [mobileButtonText, setMobileButtonText] = useState(activeSlide.mobileButtonText ? activeSlide.mobileButtonText : (activeSlide.buttonText || "Shop Now"));
  const [mobileButtonStyle, setMobileButtonStyle] = useState(activeSlide.mobileButtonStyle || activeSlide.buttonStyle || "solid");
  const [mobileButtonSize, setMobileButtonSize] = useState(activeSlide.mobileButtonSize || "sm");
  const [mobileButtonColor, setMobileButtonColor] = useState(activeSlide.mobileButtonColor !== undefined ? activeSlide.mobileButtonColor : activeSlide.buttonColor);
  const [mobileButtonTextColor, setMobileButtonTextColor] = useState(activeSlide.mobileButtonTextColor || activeSlide.buttonTextColor || "#ffffff");
  const [mobileShowButton, setMobileShowButton] = useState(
    activeSlide.showMobileHeroButton !== undefined ? activeSlide.showMobileHeroButton : (activeSlide.showButton !== undefined ? activeSlide.showButton : true)
  );

  // Default container baseline auto-dimensions per device view
  const defaultDesktopTitleContainer = { width: 750, height: 90, padding: 12, offsetX: 0, offsetY: 0 };
  const defaultDesktopManifestoContainer = { width: 680, height: 60, padding: 10, offsetX: 0, offsetY: 0 };
  const defaultDesktopButtonContainer = { width: 200, height: 50, offsetX: 0, offsetY: 0 };

  const defaultMobileTitleContainer = { width: 320, height: 75, padding: 8, offsetX: 0, offsetY: 0 };
  const defaultMobileManifestoContainer = { width: 290, height: 55, padding: 6, offsetX: 0, offsetY: 0 };
  const defaultMobileButtonContainer = { width: 160, height: 44, offsetX: 0, offsetY: 0 };

  // PowerPoint-style Animations State (Global & Per-Element)
  const [elementAnimation, setElementAnimation] = useState<string>(activeSlide.elementAnimation !== undefined ? activeSlide.elementAnimation : "fade-in");
  const [elementAnimationDuration, setElementAnimationDuration] = useState<number>(activeSlide.elementAnimationDuration || 0.6);
  const [elementAnimationDelay, setElementAnimationDelay] = useState<number>(activeSlide.elementAnimationDelay || 0.1);
  const [slideAnimation, setSlideAnimation] = useState<string>(activeSlide.slideAnimation !== undefined ? activeSlide.slideAnimation : "fade");
  const [slideAnimationDuration, setSlideAnimationDuration] = useState<number>(activeSlide.slideAnimationDuration || 0.5);

  // Individual Element Animations State
  const [titleAnim, setTitleAnim] = useState<{ type: string; duration: number; delay: number; order?: number }>(
    activeSlide.titleAnimation || { type: "fly-in-up", duration: 0.6, delay: 0.1, order: 1 }
  );
  const [manifestoAnim, setManifestoAnim] = useState<{ type: string; duration: number; delay: number; order?: number }>(
    activeSlide.manifestoAnimation || { type: "float-up", duration: 0.6, delay: 0.25, order: 2 }
  );
  const [buttonAnim, setButtonAnim] = useState<{ type: string; duration: number; delay: number; order?: number }>(
    activeSlide.buttonAnimation || { type: "zoom-in", duration: 0.6, delay: 0.4, order: 3 }
  );

  // Animation Dropdowns UI state
  const [isElemAnimDropdownOpen, setIsElemAnimDropdownOpen] = useState<boolean>(false);
  const [isSlideAnimDropdownOpen, setIsSlideAnimDropdownOpen] = useState<boolean>(false);
  const [hoveredElementAnimation, setHoveredElementAnimation] = useState<string | null>(null);
  const [hoveredSlideAnimation, setHoveredSlideAnimation] = useState<string | null>(null);
  const [activeSlideAnimPreview, setActiveSlideAnimPreview] = useState<{ anim: string; key: number } | null>(null);
  const [elemAnimPreviewKey, setElemAnimPreviewKey] = useState<number>(Date.now());
  const slideHoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when active slide switches
  const loadSlideToState = (slide: HeroSlideItem) => {
    setTitleText(slide.titleText || "");
    setShowTitle(slide.showTitle !== undefined ? slide.showTitle : true);
    setTitleFontType(slide.titleFontType || "Outfit");
    setTitleFontSize(slide.titleFontSize || "2.5rem");
    setTitleFontColor(slide.titleFontColor || "#ffffff");
    setTitleFontWeight(slide.titleFontWeight || "700");
    setTitleFontAlignment(slide.titleFontAlignment || "center");

    setManifestoText(slide.manifestoText || "");
    setShowManifesto(slide.showManifesto !== undefined ? slide.showManifesto : true);
    setManifestoFontType(slide.manifestoFontType || "Outfit");
    setManifestoFontSize(slide.manifestoFontSize || "1.1rem");
    setManifestoFontColor(slide.manifestoFontColor || "#ffffff");
    setManifestoFontWeight(slide.manifestoFontWeight || "500");
    setManifestoFontAlignment(slide.manifestoFontAlignment || "center");

    setButtonText(slide.buttonText || "Shop Now");
    setButtonRedirectUrl(slide.buttonRedirectUrl || "/shop");
    setShowButton(slide.showButton !== undefined ? slide.showButton : true);
    setButtonStyle(slide.buttonStyle || "solid");
    setButtonSize(slide.buttonSize || "md");
    setButtonColor(slide.buttonColor || "");
    setButtonTextColor(slide.buttonTextColor || "#ffffff");

    setLayoutTemplate(slide.layoutTemplate || "center");
    setBgType((slide.bgType as any) || "color");
    setBgColor(slide.bgColor || "#121212");
    setBgImage(slide.bgImage || "");
    setBgVideo(slide.bgVideo || "");

    setTitleContainer(slide.titleContainer ? { ...slide.titleContainer } : { ...defaultDesktopTitleContainer });
    setManifestoContainer(slide.manifestoContainer ? { ...slide.manifestoContainer } : { ...defaultDesktopManifestoContainer });
    setButtonContainer(slide.buttonContainer ? { ...slide.buttonContainer } : { ...defaultDesktopButtonContainer });

    setElementAnimation(slide.elementAnimation !== undefined ? slide.elementAnimation : "fade-in");
    setElementAnimationDuration(slide.elementAnimationDuration || 0.6);
    setElementAnimationDelay(slide.elementAnimationDelay || 0.1);
    setSlideAnimation(slide.slideAnimation !== undefined ? slide.slideAnimation : "fade");
    setSlideAnimationDuration(slide.slideAnimationDuration || 0.5);

    setTitleAnim(slide.titleAnimation || { type: "fly-in-up", duration: 0.6, delay: 0.1, order: 1 });
    setManifestoAnim(slide.manifestoAnimation || { type: "float-up", duration: 0.6, delay: 0.25, order: 2 });
    setButtonAnim(slide.buttonAnimation || { type: "zoom-in", duration: 0.6, delay: 0.4, order: 3 });

    setMobileLayoutTemplate(slide.mobileLayoutTemplate || slide.layoutTemplate || "center");
    setMobileTitleText(slide.mobileTitleText || "");
    setMobileTitleFontType(slide.mobileTitleFontType || slide.titleFontType || "Outfit");
    setMobileTitleFontColor(slide.mobileTitleFontColor || slide.titleFontColor || "#ffffff");
    setMobileTitleFontSize(slide.mobileTitleFontSize || "2.5rem");
    setMobileTitleFontAlignment(slide.mobileTitleFontAlignment || slide.titleFontAlignment || "center");
    setMobileTitleFontWeight(slide.mobileTitleFontWeight || slide.titleFontWeight || "700");
    setMobileShowTitle(slide.showMobileHeroTitle !== undefined ? slide.showMobileHeroTitle : true);

    setMobileManifestoText(slide.mobileManifestoText || "");
    setMobileManifestoFontType(slide.mobileManifestoFontType || slide.manifestoFontType || "Outfit");
    setMobileManifestoFontColor(slide.mobileManifestoFontColor || slide.manifestoFontColor || "#ffffff");
    setMobileManifestoFontSize(slide.mobileManifestoFontSize || "0.85rem");
    setMobileManifestoFontAlignment(slide.mobileManifestoFontAlignment || slide.manifestoFontAlignment || "center");
    setMobileManifestoFontWeight(slide.mobileManifestoFontWeight || slide.manifestoFontWeight || "500");
    setMobileShowManifesto(slide.showMobileHeroManifesto !== undefined ? slide.showMobileHeroManifesto : true);

    setMobileButtonText(slide.mobileButtonText || "Shop Now");
    setMobileButtonStyle(slide.mobileButtonStyle || slide.buttonStyle || "solid");
    setMobileButtonSize(slide.mobileButtonSize || "sm");
    setMobileButtonColor(slide.mobileButtonColor || "");
    setMobileButtonTextColor(slide.mobileButtonTextColor || "#ffffff");
    setMobileShowButton(slide.showMobileHeroButton !== undefined ? slide.showMobileHeroButton : true);

    setMobileTitleContainer(slide.mobileTitleContainer ? { ...slide.mobileTitleContainer } : { ...defaultMobileTitleContainer });
    setMobileManifestoContainer(slide.mobileManifestoContainer ? { ...slide.mobileManifestoContainer } : { ...defaultMobileManifestoContainer });
    setMobileButtonContainer(slide.mobileButtonContainer ? { ...slide.mobileButtonContainer } : { ...defaultMobileButtonContainer });
  };

  const updateCurrentSlideStateInList = (overrides?: Partial<HeroSlideItem>) => {
    setSlides((prev) => {
      const updated = [...prev];
      if (updated[activeSlideIndex]) {
        updated[activeSlideIndex] = {
          ...updated[activeSlideIndex],
          titleText,
          showTitle,
          titleFontType,
          titleFontSize,
          titleFontColor,
          titleFontWeight,
          titleFontAlignment,

          manifestoText,
          showManifesto,
          manifestoFontType,
          manifestoFontSize,
          manifestoFontColor,
          manifestoFontWeight,
          manifestoFontAlignment,

          buttonText,
          buttonRedirectUrl,
          showButton,
          buttonStyle,
          buttonSize,
          buttonColor,
          buttonTextColor,

          layoutTemplate,
          bgType: bgType as any,
          bgColor,
          bgImage,
          bgVideo,

          titleContainer,
          manifestoContainer,
          buttonContainer,

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

          mobileTitleContainer,
          mobileManifestoContainer,
          mobileButtonContainer,

          elementAnimation,
          elementAnimationDuration,
          elementAnimationDelay,
          slideAnimation,
          slideAnimationDuration,

          titleAnimation: titleAnim,
          manifestoAnimation: manifestoAnim,
          buttonAnimation: buttonAnim,
          ...overrides
        };
      }
      return updated;
    });
  };

  // Keep slides list synchronized when local input fields change
  useEffect(() => {
    updateCurrentSlideStateInList();
  }, [
    titleText, showTitle, titleFontType, titleFontSize, titleFontColor, titleFontWeight, titleFontAlignment,
    manifestoText, showManifesto, manifestoFontType, manifestoFontSize, manifestoFontColor, manifestoFontWeight, manifestoFontAlignment,
    buttonText, buttonRedirectUrl, showButton, buttonStyle, buttonSize, buttonColor, buttonTextColor,
    layoutTemplate, bgType, bgColor, bgImage, bgVideo, titleContainer, manifestoContainer, buttonContainer,
    elementAnimation, elementAnimationDuration, elementAnimationDelay, slideAnimation, slideAnimationDuration,
    titleAnim, manifestoAnim, buttonAnim,
    mobileLayoutTemplate, mobileTitleText, mobileTitleFontType, mobileTitleFontColor, mobileTitleFontSize, mobileTitleFontAlignment, mobileTitleFontWeight, mobileShowTitle,
    mobileManifestoText, mobileManifestoFontType, mobileManifestoFontColor, mobileManifestoFontSize, mobileManifestoFontAlignment, mobileManifestoFontWeight, mobileShowManifesto,
    mobileButtonText, mobileButtonStyle, mobileButtonSize, mobileButtonColor, mobileButtonTextColor, mobileShowButton,
    mobileTitleContainer, mobileManifestoContainer, mobileButtonContainer
  ]);

  const selectSlide = (index: number) => {
    if (index === activeSlideIndex) return;
    updateCurrentSlideStateInList();
    setActiveSlideIndex(index);
    if (slides[index]) {
      loadSlideToState(slides[index]);
      const anim = slides[index].slideAnimation !== undefined ? slides[index].slideAnimation : "push";
      if (anim !== "none") {
        setActiveSlideAnimPreview({ anim, key: Date.now() });
      }
    }
  };

  const handleAddSlide = () => {
    if (slides.length >= 5) {
      alert("Maximum limit of 5 hero carousel slides per merchant reached.");
      return;
    }
    updateCurrentSlideStateInList();
    const newSlide: HeroSlideItem = {
      id: `slide_${Date.now()}`,
      titleText: "NEW HERO SLIDE",
      titleFontType: "Outfit",
      titleFontColor: "#ffffff",
      titleFontSize: "4.5rem",
      titleFontAlignment: "center",
      titleFontWeight: "700",
      showTitle: true,

      manifestoText: "ADD YOUR PROMOTIONAL DETAILS OR HIGHLIGHTS HERE.",
      manifestoFontType: "Outfit",
      manifestoFontColor: "#ffffff",
      manifestoFontSize: "1.1rem",
      manifestoFontAlignment: "center",
      manifestoFontWeight: "500",
      showManifesto: true,

      buttonText: "SHOP NOW",
      buttonStyle: "solid",
      buttonSize: "md",
      buttonColor: "#ffffff",
      buttonTextColor: "#000000",
      showButton: true,

      layoutTemplate: "center",
      bgType: "color",
      bgColor: "#0f172a",
      bgImage: "",
      bgVideo: "",

      // Auto-calculated baseline bounds on creation for desktop and mobile
      titleContainer: { width: 750, height: 90, padding: 12, offsetX: 0, offsetY: 0 },
      manifestoContainer: { width: 680, height: 60, padding: 10, offsetX: 0, offsetY: 0 },
      buttonContainer: { width: 200, height: 50, offsetX: 0, offsetY: 0 },

      mobileTitleContainer: { width: 320, height: 75, padding: 8, offsetX: 0, offsetY: 0 },
      mobileManifestoContainer: { width: 290, height: 55, padding: 6, offsetX: 0, offsetY: 0 },
      mobileButtonContainer: { width: 160, height: 44, offsetX: 0, offsetY: 0 },

      // Default animation values for new slides set to none
      slideAnimation: "none",
      slideAnimationDuration: 0.5,
      elementAnimation: "none",
      elementAnimationDuration: 0.6,
      elementAnimationDelay: 0.1,
      titleAnimation: { type: "none", duration: 0.6, delay: 0.1, order: 1 },
      manifestoAnimation: { type: "none", duration: 0.6, delay: 0.25, order: 2 },
      buttonAnimation: { type: "none", duration: 0.6, delay: 0.4, order: 3 }
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    const newIdx = newSlides.length - 1;
    setActiveSlideIndex(newIdx);
    loadSlideToState(newSlide);
  };

  const handleRemoveSlide = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      alert("At least 1 hero slide must remain.");
      return;
    }
    const newSlides = slides.filter((_, idx) => idx !== indexToRemove);
    setSlides(newSlides);
    let nextIdx = activeSlideIndex;
    if (indexToRemove === activeSlideIndex) {
      nextIdx = Math.max(0, indexToRemove - 1);
    } else if (indexToRemove < activeSlideIndex) {
      nextIdx = activeSlideIndex - 1;
    }
    setActiveSlideIndex(nextIdx);
    if (newSlides[nextIdx]) {
      loadSlideToState(newSlides[nextIdx]);
    }
  };

  const moveSlide = (e: React.MouseEvent, fromIdx: number, direction: 'left' | 'right') => {
    e.stopPropagation();
    const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= slides.length) return;
    updateCurrentSlideStateInList();
    const reordered = [...slides];
    const temp = reordered[fromIdx];
    reordered[fromIdx] = reordered[toIdx];
    reordered[toIdx] = temp;
    setSlides(reordered);
    setActiveSlideIndex(toIdx);
    loadSlideToState(reordered[toIdx]);
  };

  // Drag & Drop reorder handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";

    // Clear any text selection in window so native text selection ghosting is eliminated
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }

    // Create a sleek compact drag badge element to replace default browser snapshot of entire card DOM
    const dragBadge = document.createElement("div");
    dragBadge.innerText = `SLIDE ${index + 1}`;
    dragBadge.style.position = "fixed";
    dragBadge.style.top = "-9999px";
    dragBadge.style.left = "-9999px";
    dragBadge.style.padding = "6px 14px";
    dragBadge.style.backgroundColor = "#2563eb";
    dragBadge.style.color = "#ffffff";
    dragBadge.style.borderRadius = "6px";
    dragBadge.style.fontSize = "12px";
    dragBadge.style.fontWeight = "800";
    dragBadge.style.letterSpacing = "0.04em";
    dragBadge.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.4)";
    dragBadge.style.zIndex = "9999";
    document.body.appendChild(dragBadge);

    try {
      e.dataTransfer.setDragImage(dragBadge, 35, 15);
    } catch (err) {
      // Browser fallback
    }

    setTimeout(() => {
      if (document.body.contains(dragBadge)) {
        document.body.removeChild(dragBadge);
      }
    }, 0);

    setDraggedSlideIndex(index);
    setDropInsertIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedSlideIndex(null);
    setDropInsertIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const isAfter = mouseX > rect.width / 2;
    const computedInsertIndex = isAfter ? targetIndex + 1 : targetIndex;

    if (dropInsertIndex !== computedInsertIndex) {
      setDropInsertIndex(computedInsertIndex);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const isAfter = mouseX > rect.width / 2;
    let toPos = isAfter ? targetIndex + 1 : targetIndex;

    const fromIdx = draggedSlideIndex;
    setDraggedSlideIndex(null);
    setDropInsertIndex(null);

    if (fromIdx === null) return;

    if (fromIdx < toPos) {
      toPos = toPos - 1;
    }
    if (fromIdx === toPos) return;

    updateCurrentSlideStateInList();
    const reordered = [...slides];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toPos, 0, moved);
    setSlides(reordered);
    setActiveSlideIndex(toPos);
    loadSlideToState(reordered[toPos]);
  };

  // Media File Upload (Image or Video) with Size Validation
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mediaKind: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxImageSize = 10 * 1024 * 1024; // 10 MB
    const maxVideoSize = 100 * 1024 * 1024; // 100 MB

    if (mediaKind === "image" && file.size > maxImageSize) {
      alert(`Image file size exceeds maximum allowed limit of 10 MB. Selected file size: ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
      e.target.value = "";
      return;
    }

    if (mediaKind === "video" && file.size > maxVideoSize) {
      alert(`Video file size exceeds maximum allowed limit of 100 MB. Selected file size: ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
      e.target.value = "";
      return;
    }

    setUploadingMedia(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    let currentProgress = 0;
    const progressTimer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 7) + 5;
      if (currentProgress > 92) {
        currentProgress = 92;
      }
      setUploadProgress(currentProgress);
    }, 120);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const realPercentage = Math.round((event.loaded / event.total) * 90);
        if (realPercentage > currentProgress) {
          currentProgress = realPercentage;
          setUploadProgress(realPercentage);
        }
      }
    };

    xhr.onload = () => {
      clearInterval(progressTimer);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadingMedia(false);
        setUploadProgress(null);
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (mediaKind === "image") {
              setBgImage(data.url);
              setBgType("image");
            } else {
              setBgVideo(data.url);
              setBgType("video");
            }
          } catch (err) {
            alert("Failed to parse upload server response.");
          }
        } else {
          alert("Media upload failed.");
        }
      }, 300);
    };

    xhr.onerror = () => {
      clearInterval(progressTimer);
      setUploadingMedia(false);
      setUploadProgress(null);
      alert("Network error during file upload.");
    };

    xhr.send(formData);
  };

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

  const currentTitleContainer = isMobileDevice ? mobileTitleContainer : titleContainer;
  const setCurrentTitleContainer = isMobileDevice ? setMobileTitleContainer : setTitleContainer;

  const currentManifestoContainer = isMobileDevice ? mobileManifestoContainer : manifestoContainer;
  const setCurrentManifestoContainer = isMobileDevice ? setMobileManifestoContainer : setManifestoContainer;

  const currentButtonContainer = isMobileDevice ? mobileButtonContainer : buttonContainer;
  const setCurrentButtonContainer = isMobileDevice ? setMobileButtonContainer : setButtonContainer;

  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontDropdownCoords, setFontDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontType, setHoveredFontType] = useState<string | null>(null);

  const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState(false);
  const [fontSizeDropdownCoords, setFontSizeDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontSize, setHoveredFontSize] = useState<string | null>(null);

  const [isFontWeightDropdownOpen, setIsFontWeightDropdownOpen] = useState(false);
  const [fontWeightDropdownCoords, setFontWeightDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontWeight, setHoveredFontWeight] = useState<string | null>(null);

  const [isButtonStyleDropdownOpen, setIsButtonStyleDropdownOpen] = useState(false);
  const [hoveredButtonStyle, setHoveredButtonStyle] = useState<string | null>(null);

  const [isButtonRedirectDropdownOpen, setIsButtonRedirectDropdownOpen] = useState(false);
  const [hoveredButtonRedirectUrl, setHoveredButtonRedirectUrl] = useState<string | null>(null);

  const getButtonStyleStyles = (
    styleName: string,
    colorStr?: string,
    textColorStr?: string,
    sizeStr?: string,
    hasCustomWidth?: boolean
  ): React.CSSProperties => {
    const baseColor = colorStr || "#ffffff";
    const baseTextColor = textColorStr || "#000000";

    let styles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
      padding: hasCustomWidth
        ? "0 12px"
        : sizeStr === "sm"
          ? "8px 20px"
          : sizeStr === "lg"
            ? "18px 48px"
            : "14px 36px",
      fontSize:
        sizeStr === "sm" ? "0.75rem" : sizeStr === "lg" ? "1.0rem" : "0.85rem",
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "solid",
      borderRightStyle: "solid",
      borderBottomStyle: "solid",
      borderLeftStyle: "solid",
      borderTopColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: "transparent",
      borderRadius: "0px",
      boxShadow: "none",
      textDecoration: "none",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      backgroundImage: "none"
    };

    switch (styleName) {
      case "outline":
        styles.backgroundColor = "transparent";
        styles.color = baseColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "4px";
        break;

      case "pill":
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "9999px";
        break;

      case "pill-outline":
        styles.backgroundColor = "transparent";
        styles.color = baseColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "9999px";
        break;

      case "glass":
        styles.backgroundColor = "rgba(255, 255, 255, 0.15)";
        styles.backdropFilter = "blur(12px)";
        styles.WebkitBackdropFilter = "blur(12px)";
        styles.color = baseColor;
        styles.borderTopWidth = "1px";
        styles.borderRightWidth = "1px";
        styles.borderBottomWidth = "1px";
        styles.borderLeftWidth = "1px";
        styles.borderTopColor = "rgba(255, 255, 255, 0.35)";
        styles.borderRightColor = "rgba(255, 255, 255, 0.35)";
        styles.borderBottomColor = "rgba(255, 255, 255, 0.35)";
        styles.borderLeftColor = "rgba(255, 255, 255, 0.35)";
        styles.borderRadius = "8px";
        styles.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.2)";
        break;

      case "glow":
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "8px";
        styles.boxShadow = `0 0 20px ${baseColor}aa`;
        break;

      case "3d":
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderBottomWidth = "5px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderBottomColor = "rgba(0, 0, 0, 0.35)";
        styles.borderRadius = "8px";
        break;

      case "soft":
        styles.backgroundColor = `${baseColor}22`;
        styles.color = baseColor;
        styles.borderTopWidth = "1px";
        styles.borderRightWidth = "1px";
        styles.borderBottomWidth = "1px";
        styles.borderLeftWidth = "1px";
        styles.borderTopColor = `${baseColor}44`;
        styles.borderRightColor = `${baseColor}44`;
        styles.borderBottomColor = `${baseColor}44`;
        styles.borderLeftColor = `${baseColor}44`;
        styles.borderRadius = "8px";
        break;

      case "neon":
        styles.backgroundColor = "transparent";
        styles.color = baseColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "4px";
        styles.boxShadow = `0 0 12px ${baseColor}, inset 0 0 12px ${baseColor}`;
        break;

      case "underline-bar":
        styles.backgroundColor = "transparent";
        styles.color = baseColor;
        styles.borderBottomWidth = "3px";
        styles.borderBottomColor = baseColor;
        styles.borderRadius = "0px";
        break;

      case "double-border":
        styles.backgroundColor = "transparent";
        styles.color = baseColor;
        styles.borderTopWidth = "4px";
        styles.borderRightWidth = "4px";
        styles.borderBottomWidth = "4px";
        styles.borderLeftWidth = "4px";
        styles.borderTopStyle = "double";
        styles.borderRightStyle = "double";
        styles.borderBottomStyle = "double";
        styles.borderLeftStyle = "double";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "6px";
        break;

      case "elevation":
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "1px";
        styles.borderRightWidth = "1px";
        styles.borderBottomWidth = "1px";
        styles.borderLeftWidth = "1px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "8px";
        styles.boxShadow = `0 10px 25px -5px ${baseColor}66`;
        break;

      case "sharp":
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "0px";
        styles.boxShadow = `4px 4px 0px ${baseTextColor}`;
        break;

      case "curved-badge":
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "16px";
        break;

      case "minimal":
        styles.backgroundColor = "transparent";
        styles.color = baseColor;
        styles.textDecoration = "underline";
        styles.textUnderlineOffset = "4px";
        break;

      case "solid":
      default:
        styles.backgroundColor = baseColor;
        styles.color = baseTextColor;
        styles.borderTopWidth = "2px";
        styles.borderRightWidth = "2px";
        styles.borderBottomWidth = "2px";
        styles.borderLeftWidth = "2px";
        styles.borderTopColor = baseColor;
        styles.borderRightColor = baseColor;
        styles.borderBottomColor = baseColor;
        styles.borderLeftColor = baseColor;
        styles.borderRadius = "4px";
        break;
    }

    return styles;
  };

  const handleApply = () => {
    const finalSlides = [...slides];
    if (finalSlides[activeSlideIndex]) {
      finalSlides[activeSlideIndex] = {
        ...finalSlides[activeSlideIndex],
        titleText,
        showTitle,
        titleFontType,
        titleFontSize,
        titleFontColor,
        titleFontWeight,
        titleFontAlignment,

        manifestoText,
        showManifesto,
        manifestoFontType,
        manifestoFontSize,
        manifestoFontColor,
        manifestoFontWeight,
        manifestoFontAlignment,

        buttonText,
        buttonRedirectUrl,
        showButton,
        buttonStyle,
        buttonSize,
        buttonColor,
        buttonTextColor,

        layoutTemplate,
        bgType: bgType as any,
        bgColor,
        bgImage,
        bgVideo,

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

        elementAnimation,
        elementAnimationDuration,
        elementAnimationDelay,
        slideAnimation,
        slideAnimationDuration,

        titleAnimation: titleAnim,
        manifestoAnimation: manifestoAnim,
        buttonAnimation: buttonAnim,
      };
    }

    const firstSlide = finalSlides[0] || {};

    onApply({
      titleText: firstSlide.titleText || titleText,
      titleFontType: firstSlide.titleFontType || titleFontType,
      titleFontColor: firstSlide.titleFontColor || titleFontColor,
      titleFontSize: firstSlide.titleFontSize || titleFontSize,
      titleFontAlignment: firstSlide.titleFontAlignment || titleFontAlignment,
      titleFontWeight: firstSlide.titleFontWeight || titleFontWeight,
      showTitle: firstSlide.showTitle !== undefined ? firstSlide.showTitle : showTitle,

      manifestoText: firstSlide.manifestoText || manifestoText,
      manifestoFontType: firstSlide.manifestoFontType || manifestoFontType,
      manifestoFontColor: firstSlide.manifestoFontColor || manifestoFontColor,
      manifestoFontSize: firstSlide.manifestoFontSize || manifestoFontSize,
      manifestoFontAlignment: firstSlide.manifestoFontAlignment || manifestoFontAlignment,
      manifestoFontWeight: firstSlide.manifestoFontWeight || manifestoFontWeight,
      showManifesto: firstSlide.showManifesto !== undefined ? firstSlide.showManifesto : showManifesto,

      buttonText: firstSlide.buttonText || buttonText,
      buttonStyle: firstSlide.buttonStyle || buttonStyle,
      buttonSize: firstSlide.buttonSize || buttonSize,
      buttonColor: firstSlide.buttonColor || buttonColor,
      buttonTextColor: firstSlide.buttonTextColor || buttonTextColor,
      showButton: firstSlide.showButton !== undefined ? firstSlide.showButton : showButton,

      layoutTemplate: firstSlide.layoutTemplate || layoutTemplate,
      bgType: firstSlide.bgType || bgType,
      bgColor: firstSlide.bgColor || bgColor,
      bgImage: firstSlide.bgImage !== undefined ? firstSlide.bgImage : bgImage,
      bgVideo: firstSlide.bgVideo !== undefined ? firstSlide.bgVideo : bgVideo,

      heroSlides: finalSlides,
      heroAutoPlay,
      heroAutoPlaySpeed,

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

  // Compute whether any changes have been made compared to initial snapshot
  const buildCurrentSlides = (): HeroSlideItem[] => {
    const currentList = [...slides];
    if (currentList[activeSlideIndex]) {
      currentList[activeSlideIndex] = {
        ...currentList[activeSlideIndex],
        titleText,
        showTitle,
        titleFontType,
        titleFontSize,
        titleFontColor,
        titleFontWeight,
        titleFontAlignment,

        manifestoText,
        showManifesto,
        manifestoFontType,
        manifestoFontSize,
        manifestoFontColor,
        manifestoFontWeight,
        manifestoFontAlignment,

        buttonText,
        buttonRedirectUrl,
        showButton,
        buttonStyle,
        buttonSize,
        buttonColor,
        buttonTextColor,

        layoutTemplate,
        bgType: bgType as any,
        bgColor,
        bgImage,
        bgVideo,

        titleContainer,
        manifestoContainer,
        buttonContainer,

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

        mobileTitleContainer,
        mobileManifestoContainer,
        mobileButtonContainer,

        elementAnimation,
        elementAnimationDuration,
        elementAnimationDelay,
        slideAnimation,
        slideAnimationDuration,

        titleAnimation: titleAnim,
        manifestoAnimation: manifestoAnim,
        buttonAnimation: buttonAnim,
      };
    }
    return currentList;
  };

  const currentSnapshot = JSON.stringify({
    slides: buildCurrentSlides(),
    heroAutoPlay,
    heroAutoPlaySpeed
  });

  // Snapshot captured when modal opens to accurately check for user changes
  const initialSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      initialSnapshotRef.current = null;
    }
  }, [isOpen]);

  if (isOpen && initialSnapshotRef.current === null) {
    initialSnapshotRef.current = currentSnapshot;
  }

  const hasModalChanges = isOpen && initialSnapshotRef.current !== null && currentSnapshot !== initialSnapshotRef.current;

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px) saturate(180%)",
          WebkitBackdropFilter: "blur(8px) saturate(180%)",
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
            maxWidth: "1380px",
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
            padding: "16px 28px",
            borderBottom: "1px solid #f3f4f6",
            backgroundColor: "#fafafa"
          }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                {`Customize ${sectionName}`}
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                Add multiple hero carousel slides, configure image or video media backgrounds, and position content effortlessly.
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

            {/* Left sidebar: Media, Templates, and Active component settings */}
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
              {/* 1. Slide Background Media Selector (Image vs Video vs Color) */}
              <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: 0 }}>
                    1. Background Media (Slide {activeSlideIndex + 1})
                  </h4>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", backgroundColor: bgType === "video" ? "#8b5cf6" : bgType === "image" ? "#3b82f6" : "#64748b", color: "#fff", textTransform: "uppercase" }}>
                    {bgType}
                  </span>
                </div>

                {/* Media Type Switcher */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                  {(["color", "image", "video"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBgType(type)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: bgType === type ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                        backgroundColor: bgType === type ? "#eff6ff" : "#ffffff",
                        color: bgType === type ? "#1d4ed8" : "#475569",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      {type === "color" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.75 1.7-1.67 0-.42-.16-.81-.43-1.12-.27-.31-.43-.72-.43-1.21 0-.92.75-1.67 1.67-1.67H17c2.76 0 5-2.24 5-5 0-4.42-4.48-8-10-8z" />
                        </svg>
                      )}
                      {type === "image" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                      {type === "video" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                      )}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>

                {/* Conditional Media Inputs */}
                {bgType === "color" && (
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={bgColor || "#121212"}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{ width: "38px", height: "38px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: 0, cursor: "pointer", backgroundColor: "transparent" }}
                    />
                    <input
                      type="text"
                      value={bgColor || "#121212"}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", color: "#000", fontFamily: "monospace" }}
                    />
                  </div>
                )}

                {bgType === "image" && (
                  <div>
                    {bgImage ? (
                      <div style={{ display: "flex", gap: "12px", alignItems: "center", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        {/* Left action buttons */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: uploadingMedia ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            opacity: uploadingMedia ? 0.7 : 1
                          }}>
                            {uploadingMedia ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                </svg>
                                <span>Uploading {uploadProgress ?? 0}%...</span>
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Replace Image</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingMedia}
                              onChange={(e) => handleMediaFileUpload(e, "image")}
                              style={{ display: "none" }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setBgImage("")}
                            disabled={uploadingMedia}
                            style={{
                              padding: "7px 12px",
                              borderRadius: "6px",
                              border: "1px solid #fca5a5",
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px"
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Remove Image</span>
                          </button>
                        </div>

                        {/* Right side media preview thumbnail */}
                        <div style={{
                          width: "105px",
                          height: "68px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          overflow: "hidden",
                          position: "relative",
                          backgroundColor: "#0f172a",
                          flexShrink: 0
                        }}>
                          <img src={bgImage} alt="Uploaded Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label style={{
                          padding: "10px 18px",
                          borderRadius: "8px",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: uploadingMedia ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 2px 5px rgba(37, 99, 235, 0.25)",
                          opacity: uploadingMedia ? 0.7 : 1
                        }}>
                          {uploadingMedia ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                              </svg>
                              <span>Uploading {uploadProgress ?? 0}%...</span>
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              <span>Upload Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingMedia}
                            onChange={(e) => handleMediaFileUpload(e, "image")}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {bgType === "video" && (
                  <div>
                    {bgVideo ? (
                      <div style={{ display: "flex", gap: "12px", alignItems: "center", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        {/* Left action buttons */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            backgroundColor: "#8b5cf6",
                            color: "#ffffff",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: uploadingMedia ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            opacity: uploadingMedia ? 0.7 : 1
                          }}>
                            {uploadingMedia ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                </svg>
                                <span>Uploading {uploadProgress ?? 0}%...</span>
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Replace Video MP4</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="video/*"
                              disabled={uploadingMedia}
                              onChange={(e) => handleMediaFileUpload(e, "video")}
                              style={{ display: "none" }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setBgVideo("")}
                            disabled={uploadingMedia}
                            style={{
                              padding: "7px 12px",
                              borderRadius: "6px",
                              border: "1px solid #fca5a5",
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px"
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Remove Video</span>
                          </button>
                        </div>

                        {/* Right side media video preview thumbnail */}
                        <div style={{
                          width: "105px",
                          height: "68px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          overflow: "hidden",
                          position: "relative",
                          backgroundColor: "#0f172a",
                          flexShrink: 0
                        }}>
                          <video src={bgVideo} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label style={{
                          padding: "10px 18px",
                          borderRadius: "8px",
                          backgroundColor: "#8b5cf6",
                          color: "#ffffff",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: uploadingMedia ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 2px 5px rgba(139, 92, 246, 0.25)",
                          opacity: uploadingMedia ? 0.7 : 1
                        }}>
                          {uploadingMedia ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                              </svg>
                              <span>Uploading {uploadProgress ?? 0}%...</span>
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              <span>Upload Video MP4</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="video/*"
                            disabled={uploadingMedia}
                            onChange={(e) => handleMediaFileUpload(e, "video")}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Visual Layout Templates Selector */}
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                2. Page Content Structure
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "24px" }}>
                {[
                  { id: "top-left", label: "Top Left" },
                  { id: "top-center", label: "Top Center" },
                  { id: "right-top", label: "Top Right" },
                  { id: "left", label: "Left" },
                  { id: "center", label: "Center" },
                  { id: "right", label: "Right" },
                  { id: "bottom-left", label: "Bottom Left" },
                  { id: "bottom-center", label: "Bottom Center" },
                  { id: "right-bottom", label: "Bottom Right" }
                ].map((t) => {
                  const isSelected = currentLayoutTemplate === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setCurrentLayoutTemplate(t.id);
                        setCurrentTitleContainer(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
                        setCurrentManifestoContainer(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
                        setCurrentButtonContainer(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
                      }}
                      style={{
                        background: "none",
                        border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                        borderRadius: "6px",
                        padding: "6px 4px",
                        cursor: "pointer",
                        outline: "none",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: isSelected ? "#3b82f6" : "#475569",
                        backgroundColor: isSelected ? "#eff6ff" : "#f8fafc",
                        textAlign: "center"
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* 3. Component Customizer */}
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                3. Component Editor
              </h4>

              {selectedElement ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                  <div style={{ backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #eff6ff" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "#2563eb" }}>
                      Selected Element
                    </span>
                    <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "2px 0 0 0", color: "#0f172a", textTransform: "capitalize" }}>
                      {selectedElement === "title" ? "Slide Heading Title" : selectedElement === "manifesto" ? "Slide Subtitle / Manifesto" : "CTA Button"}
                    </h5>
                  </div>

                  {/* Visibility Switch */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155" }}>
                      Enable Element ({previewDevice})
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
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>
                      Content Text ({previewDevice})
                    </label>
                    {selectedElement === "manifesto" ? (
                      <textarea
                        value={currentManifestoText || ""}
                        onChange={(e) => setCurrentManifestoText(e.target.value)}
                        disabled={!currentShowManifesto}
                        rows={3}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          width: "100%",
                          resize: "vertical",
                          boxSizing: "border-box",
                          color: "#000"
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
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          width: "100%",
                          boxSizing: "border-box",
                          color: "#000"
                        }}
                      />
                    )}
                  </div>

                  {/* Typography & Color Customization for Title & Subtitle */}
                  {(selectedElement === "title" || selectedElement === "manifesto") && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                      {/* Custom Font Family Dropdown Menu with Live Hover */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Font Family</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsFontDropdownOpen(!isFontDropdownOpen);
                            setIsFontSizeDropdownOpen(false);
                            setIsFontWeightDropdownOpen(false);
                          }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.82rem",
                            color: "#0f172a",
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "left",
                            fontWeight: 600,
                            fontFamily: `"${selectedElement === "title" ? currentTitleFontType : currentManifestoFontType}", sans-serif`
                          }}
                        >
                          <span>{selectedElement === "title" ? currentTitleFontType : currentManifestoFontType}</span>
                          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                        </button>

                        {isFontDropdownOpen && (
                          <div
                            onMouseLeave={() => setHoveredFontType(null)}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 100,
                              marginTop: "4px",
                              maxHeight: "220px",
                              overflowY: "auto",
                              backgroundColor: "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                              padding: "4px"
                            }}
                          >
                            {fontCategories.flatMap(cat => cat.fonts).map(font => {
                              const activeVal = selectedElement === "title" ? currentTitleFontType : currentManifestoFontType;
                              const isSelected = activeVal === font.name;

                              const handleHoverFont = (fontName: string) => {
                                setHoveredFontType(fontName);
                                // Dynamically load Google Font if not already loaded into DOM
                                const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
                                if (!document.getElementById(fontId)) {
                                  const link = document.createElement('link');
                                  link.id = fontId;
                                  link.rel = 'stylesheet';
                                  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`;
                                  document.head.appendChild(link);
                                }
                              };

                              return (
                                <div
                                  key={font.name}
                                  onMouseEnter={() => handleHoverFont(font.name)}
                                  onClick={() => {
                                    handleHoverFont(font.name);
                                    if (selectedElement === "title") setCurrentTitleFontType(font.name);
                                    else setCurrentManifestoFontType(font.name);
                                    setHoveredFontType(null);
                                    setIsFontDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                    fontFamily: `"${font.name}", sans-serif`,
                                    cursor: "pointer",
                                    backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                    color: isSelected ? "#2563eb" : "#1e293b",
                                    fontWeight: isSelected ? 700 : 500,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }}
                                >
                                  <span>{font.label || font.name}</span>
                                  {isSelected && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Custom Font Size & Font Boldness Dropdowns */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {/* Custom Font Size Dropdown */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Font Size</label>
                          <button
                            type="button"
                            onClick={() => {
                              setIsFontSizeDropdownOpen(!isFontSizeDropdownOpen);
                              setIsFontDropdownOpen(false);
                              setIsFontWeightDropdownOpen(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.82rem",
                              color: "#0f172a",
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              textAlign: "left",
                              fontWeight: 600
                            }}
                          >
                            <span>{selectedElement === "title" ? currentTitleFontSize : currentManifestoFontSize}</span>
                            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                          </button>

                          {isFontSizeDropdownOpen && (
                            <div
                              onMouseLeave={() => setHoveredFontSize(null)}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 100,
                                marginTop: "4px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                                padding: "4px"
                              }}
                            >
                              {[
                                "0.75rem", "0.85rem", "1.0rem", "1.1rem", "1.25rem", "1.5rem", "1.75rem",
                                "2.0rem", "2.25rem", "2.5rem", "3.0rem", "3.5rem", "4.0rem", "4.5rem",
                                "5.0rem", "5.5rem", "6.0rem", "7.0rem", "8.0rem"
                              ].map(size => {
                                const activeSize = selectedElement === "title" ? currentTitleFontSize : currentManifestoFontSize;
                                const isSelected = activeSize === size;
                                return (
                                  <div
                                    key={size}
                                    onMouseEnter={() => setHoveredFontSize(size)}
                                    onClick={() => {
                                      if (selectedElement === "title") setCurrentTitleFontSize(size);
                                      else setCurrentManifestoFontSize(size);
                                      setHoveredFontSize(null);
                                      setIsFontSizeDropdownOpen(false);
                                    }}
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "4px",
                                      fontSize: "0.8rem",
                                      cursor: "pointer",
                                      backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                      color: isSelected ? "#2563eb" : "#1e293b",
                                      fontWeight: isSelected ? 700 : 500
                                    }}
                                  >
                                    {size}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Custom Font Boldness Dropdown */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Font Boldness</label>
                          <button
                            type="button"
                            onClick={() => {
                              setIsFontWeightDropdownOpen(!isFontWeightDropdownOpen);
                              setIsFontDropdownOpen(false);
                              setIsFontSizeDropdownOpen(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.82rem",
                              color: "#0f172a",
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              textAlign: "left",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {
                                [
                                  { value: "300", label: "Light (300)" },
                                  { value: "400", label: "Normal (400)" },
                                  { value: "500", label: "Medium (500)" },
                                  { value: "600", label: "Semi Bold (600)" },
                                  { value: "700", label: "Bold (700)" },
                                  { value: "800", label: "Extra Bold (800)" },
                                  { value: "900", label: "Black (900)" }
                                ].find(w => w.value === (selectedElement === "title" ? currentTitleFontWeight : currentManifestoFontWeight))?.label || "Normal (400)"
                              }
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                          </button>

                          {isFontWeightDropdownOpen && (
                            <div
                              onMouseLeave={() => setHoveredFontWeight(null)}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 100,
                                marginTop: "4px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                                padding: "4px"
                              }}
                            >
                              {[
                                { value: "300", label: "Light (300)" },
                                { value: "400", label: "Normal (400)" },
                                { value: "500", label: "Medium (500)" },
                                { value: "600", label: "Semi Bold (600)" },
                                { value: "700", label: "Bold (700)" },
                                { value: "800", label: "Extra Bold (800)" },
                                { value: "900", label: "Black (900)" }
                              ].map(w => {
                                const activeWeight = selectedElement === "title" ? currentTitleFontWeight : currentManifestoFontWeight;
                                const isSelected = activeWeight === w.value;
                                return (
                                  <div
                                    key={w.value}
                                    onMouseEnter={() => setHoveredFontWeight(w.value)}
                                    onClick={() => {
                                      if (selectedElement === "title") setCurrentTitleFontWeight(w.value);
                                      else setCurrentManifestoFontWeight(w.value);
                                      setHoveredFontWeight(null);
                                      setIsFontWeightDropdownOpen(false);
                                    }}
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "4px",
                                      fontSize: "0.8rem",
                                      cursor: "pointer",
                                      backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                      color: isSelected ? "#2563eb" : "#1e293b",
                                      fontWeight: Number(w.value) || 500
                                    }}
                                  >
                                    {w.label}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>



                      {/* Text Color & Alignment */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Text Color</label>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={(selectedElement === "title" ? currentTitleFontColor : currentManifestoFontColor) || "#ffffff"}
                              onChange={(e) => {
                                if (selectedElement === "title") setCurrentTitleFontColor(e.target.value);
                                else setCurrentManifestoFontColor(e.target.value);
                              }}
                              style={{ border: "1px solid #cbd5e1", borderRadius: "6px", width: "32px", height: "32px", padding: 0, cursor: "pointer", backgroundColor: "transparent" }}
                            />
                            <input
                              type="text"
                              value={(selectedElement === "title" ? currentTitleFontColor : currentManifestoFontColor) || "#ffffff"}
                              onChange={(e) => {
                                if (selectedElement === "title") setCurrentTitleFontColor(e.target.value);
                                else setCurrentManifestoFontColor(e.target.value);
                              }}
                              style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem", color: "#000", fontFamily: "monospace" }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Text Alignment</label>
                          <div style={{ display: "flex", gap: "4px" }}>
                            {(["left", "center", "right"] as const).map((align) => {
                              const activeAlign = selectedElement === "title" ? currentTitleFontAlignment : currentManifestoFontAlignment;
                              const isSelected = activeAlign === align;
                              return (
                                <button
                                  key={align}
                                  type="button"
                                  title={`Align ${align}`}
                                  onClick={() => {
                                    if (selectedElement === "title") setCurrentTitleFontAlignment(align);
                                    else setCurrentManifestoFontAlignment(align);
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "6px 0",
                                    borderRadius: "6px",
                                    border: isSelected ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                                    backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                                    color: isSelected ? "#1d4ed8" : "#475569",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  {align === "left" && (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="17" y1="10" x2="3" y2="10" />
                                      <line x1="21" y1="6" x2="3" y2="6" />
                                      <line x1="21" y1="14" x2="3" y2="14" />
                                      <line x1="15" y1="18" x2="3" y2="18" />
                                    </svg>
                                  )}
                                  {align === "center" && (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="10" x2="6" y2="10" />
                                      <line x1="21" y1="6" x2="3" y2="6" />
                                      <line x1="21" y1="14" x2="3" y2="14" />
                                      <line x1="16" y1="18" x2="8" y2="18" />
                                    </svg>
                                  )}
                                  {align === "right" && (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="21" y1="10" x2="7" y2="10" />
                                      <line x1="21" y1="6" x2="3" y2="6" />
                                      <line x1="21" y1="14" x2="3" y2="14" />
                                      <line x1="21" y1="18" x2="9" y2="18" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Button Styling & Sizing Options */}
                  {selectedElement === "button" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                      {/* Button Size Selection */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Button Size</label>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {[
                            { id: "sm", label: "Small" },
                            { id: "md", label: "Medium" },
                            { id: "lg", label: "Large" }
                          ].map((sz) => {
                            const isSelected = currentButtonSize === sz.id;
                            return (
                              <button
                                key={sz.id}
                                type="button"
                                onClick={() => setCurrentButtonSize(sz.id)}
                                style={{
                                  flex: 1,
                                  padding: "6px 0",
                                  borderRadius: "6px",
                                  border: isSelected ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                                  backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                                  color: isSelected ? "#1d4ed8" : "#475569",
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  cursor: "pointer"
                                }}
                              >
                                {sz.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Button Redirect Page System Custom Dropdown */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Button Redirect Target</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsButtonRedirectDropdownOpen(!isButtonRedirectDropdownOpen);
                            setIsButtonStyleDropdownOpen(false);
                            setIsFontDropdownOpen(false);
                            setIsFontSizeDropdownOpen(false);
                            setIsFontWeightDropdownOpen(false);
                          }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.82rem",
                            color: "#0f172a",
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "left",
                            fontWeight: 600
                          }}
                        >
                          <span>
                            {
                              [
                                { value: "/shop", label: "All Products Catalog (/shop)" },
                                { value: "/category/new-arrivals", label: "New Arrivals (/category/new-arrivals)" },
                                { value: "/category/best-sellers", label: "Best Sellers (/category/best-sellers)" },
                                { value: "/category/offers", label: "Special Offers & Sale (/category/offers)" },
                                { value: "/about", label: "About Us (/about)" },
                                { value: "/contact", label: "Contact Support (/contact)" },
                                { value: "/faqs", label: "FAQs (/faqs)" }
                              ].find(opt => opt.value === (hoveredButtonRedirectUrl || buttonRedirectUrl))?.label || buttonRedirectUrl || "All Products Catalog (/shop)"
                            }
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                        </button>

                        {isButtonRedirectDropdownOpen && (
                          <div
                            onMouseLeave={() => setHoveredButtonRedirectUrl(null)}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 100,
                              marginTop: "4px",
                              maxHeight: "220px",
                              overflowY: "auto",
                              backgroundColor: "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                              padding: "4px"
                            }}
                          >
                            {[
                              { value: "/shop", label: "All Products Catalog (/shop)" },
                              { value: "/category/new-arrivals", label: "New Arrivals (/category/new-arrivals)" },
                              { value: "/category/best-sellers", label: "Best Sellers (/category/best-sellers)" },
                              { value: "/category/offers", label: "Special Offers & Sale (/category/offers)" },
                              { value: "/about", label: "About Us (/about)" },
                              { value: "/contact", label: "Contact Support (/contact)" },
                              { value: "/faqs", label: "FAQs (/faqs)" }
                            ].map((target) => {
                              const isSelected = buttonRedirectUrl === target.value;
                              const isHovered = hoveredButtonRedirectUrl === target.value;
                              return (
                                <div
                                  key={target.value}
                                  onMouseEnter={() => setHoveredButtonRedirectUrl(target.value)}
                                  onClick={() => {
                                    setButtonRedirectUrl(target.value);
                                    setHoveredButtonRedirectUrl(null);
                                    setIsButtonRedirectDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                    cursor: "pointer",
                                    backgroundColor: isHovered ? "#f1f5f9" : isSelected ? "#eff6ff" : "transparent",
                                    color: isSelected ? "#2563eb" : "#1e293b",
                                    fontWeight: isSelected ? 700 : 500,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }}
                                >
                                  <span>{target.label}</span>
                                  {isSelected && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Button Style System Custom Dropdown with Live Hover Preview */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Button Style</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsButtonStyleDropdownOpen(!isButtonStyleDropdownOpen);
                            setIsButtonRedirectDropdownOpen(false);
                            setIsFontDropdownOpen(false);
                            setIsFontSizeDropdownOpen(false);
                            setIsFontWeightDropdownOpen(false);
                          }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.82rem",
                            color: "#0f172a",
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "left",
                            fontWeight: 600
                          }}
                        >
                          <span>
                            {
                              [
                                { value: "solid", label: "Solid Filled (Classic)" },
                                { value: "outline", label: "Outline Border" },
                                { value: "pill", label: "Solid Pill (Rounded)" },
                                { value: "pill-outline", label: "Pill Outline (Rounded)" },
                                { value: "glass", label: "Frosted Glassmorphism" },
                                { value: "glow", label: "Ambient Shadow Glow" },
                                { value: "3d", label: "Tactile 3D Pressable" },
                                { value: "soft", label: "Soft Tinted Light" },
                                { value: "neon", label: "Cyberpunk Neon Glow" },
                                { value: "underline-bar", label: "Bottom Underline Bar" },
                                { value: "double-border", label: "Double Line Border" },
                                { value: "elevation", label: "Subtle Elevated Card" },
                                { value: "sharp", label: "Retro Sharp Offset" },
                                { value: "curved-badge", label: "Soft Curved Badge" },
                                { value: "minimal", label: "Minimal Text Link" }
                              ].find(st => st.value === (hoveredButtonStyle || currentButtonStyle))?.label || "Solid Filled (Classic)"
                            }
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                        </button>

                        {isButtonStyleDropdownOpen && (
                          <div
                            onMouseLeave={() => setHoveredButtonStyle(null)}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 100,
                              marginTop: "4px",
                              maxHeight: "220px",
                              overflowY: "auto",
                              backgroundColor: "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                              padding: "4px"
                            }}
                          >
                            {[
                              { value: "solid", label: "Solid Filled (Classic)" },
                              { value: "outline", label: "Outline Border" },
                              { value: "pill", label: "Solid Pill (Rounded)" },
                              { value: "pill-outline", label: "Pill Outline (Rounded)" },
                              { value: "glass", label: "Frosted Glassmorphism" },
                              { value: "glow", label: "Ambient Shadow Glow" },
                              { value: "3d", label: "Tactile 3D Pressable" },
                              { value: "soft", label: "Soft Tinted Light" },
                              { value: "neon", label: "Cyberpunk Neon Glow" },
                              { value: "underline-bar", label: "Bottom Underline Bar" },
                              { value: "double-border", label: "Double Line Border" },
                              { value: "elevation", label: "Subtle Elevated Card" },
                              { value: "sharp", label: "Retro Sharp Offset" },
                              { value: "curved-badge", label: "Soft Curved Badge" },
                              { value: "minimal", label: "Minimal Text Link" }
                            ].map((style) => {
                              const isSelected = currentButtonStyle === style.value;
                              const isHovered = hoveredButtonStyle === style.value;
                              return (
                                <div
                                  key={style.value}
                                  onMouseEnter={() => setHoveredButtonStyle(style.value)}
                                  onClick={() => {
                                    setCurrentButtonStyle(style.value);
                                    setHoveredButtonStyle(null);
                                    setIsButtonStyleDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                    cursor: "pointer",
                                    backgroundColor: isHovered ? "#f1f5f9" : isSelected ? "#eff6ff" : "transparent",
                                    color: isSelected ? "#2563eb" : "#1e293b",
                                    fontWeight: isSelected ? 700 : 500,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }}
                                >
                                  <span>{style.label}</span>
                                  {isSelected && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Button Colors</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={currentButtonColor || "#ffffff"}
                            onChange={(e) => setCurrentButtonColor(e.target.value)}
                            style={{ border: "1px solid #cbd5e1", borderRadius: "6px", width: "32px", height: "32px", padding: 0, cursor: "pointer" }}
                          />
                          <input
                            type="text"
                            value={currentButtonColor || ""}
                            placeholder="Bg Hex #ffffff"
                            onChange={(e) => setCurrentButtonColor(e.target.value)}
                            style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", color: "#000" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ padding: "16px 10px", textAlign: "center", color: "#64748b", border: "1px dashed #cbd5e1", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    Click any title, subtitle or button in the live preview canvas to customize it.
                  </span>
                </div>
              )}

              {/* 4. Element Animation */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: 0 }}>
                    4. Element Animation
                  </h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                  {/* Individual Element Selection Indicator & Sequence Order Selector */}
                  {selectedElement ? (
                    <div style={{ backgroundColor: "#eff6ff", padding: "10px 12px", borderRadius: "6px", border: "1px solid #bfdbfe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ backgroundColor: "#2563eb", color: "#fff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>
                          {selectedElement === "title" ? (titleAnim.order || 1) : selectedElement === "manifesto" ? (manifestoAnim.order || 2) : (buttonAnim.order || 3)}
                        </span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e40af", textTransform: "capitalize" }}>
                          {selectedElement === "title" ? "Heading Title" : selectedElement === "manifesto" ? "Subtitle / Manifesto" : "CTA Button"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569" }}>Sequence:</label>
                        <select
                          value={selectedElement === "title" ? (titleAnim.order || 1) : selectedElement === "manifesto" ? (manifestoAnim.order || 2) : (buttonAnim.order || 3)}
                          onChange={(e) => {
                            const ord = parseInt(e.target.value, 10);
                            if (selectedElement === "title") setTitleAnim(prev => ({ ...prev, order: ord }));
                            else if (selectedElement === "manifesto") setManifestoAnim(prev => ({ ...prev, order: ord }));
                            else if (selectedElement === "button") setButtonAnim(prev => ({ ...prev, order: ord }));
                            setElemAnimPreviewKey(Date.now());
                          }}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "4px",
                            border: "1px solid #93c5fd",
                            backgroundColor: "#ffffff",
                            color: "#1e40af",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          <option value={1}>1st (Start)</option>
                          <option value={2}>2nd (After 1st)</option>
                          <option value={3}>3rd (After 2nd)</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "6px", border: "1px dashed #cbd5e1", fontSize: "0.75rem", color: "#64748b" }}>
                      Select an element in canvas to edit its sequence animation effect.
                    </div>
                  )}

                  {/* Motion Effect Custom Dropdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Entrance / Motion Effect</label>
                    <button
                      type="button"
                      onClick={() => setIsElemAnimDropdownOpen(!isElemAnimDropdownOpen)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                        fontWeight: 600,
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer"
                      }}
                    >
                      <span>
                        {[
                          { value: "none", label: "None (Static No Animation)" },
                          { value: "fade-in", label: "Fade In (Classic Clean)" },
                          { value: "fly-in-up", label: "Fly In from Bottom (Upward Lift)" },
                          { value: "fly-in-left", label: "Fly In from Left (Slide Entrance)" },
                          { value: "fly-in-right", label: "Fly In from Right" },
                          { value: "float-up", label: "Float Up (Smooth Soft Slide)" },
                          { value: "zoom-in", label: "Zoom In (Pop Out Reveal)" },
                          { value: "zoom-out", label: "Zoom Out Drop (Deep Entrance)" },
                          { value: "bounce-in", label: "Bounce In (Playful Elastic Drop)" },
                          { value: "spin-in", label: "Swivel / Spin In (3D Rotation)" },
                          { value: "wipe", label: "Wipe Reveal (Linear Gradient Wipe)" },
                          { value: "split", label: "Split Expand (Horizontal Stretch)" },
                          { value: "flip-x", label: "Flip In 3D (X-Axis Flip)" },
                          { value: "blur-reveal", label: "Glass Blur Defocus Reveal" },
                          { value: "pulse-beat", label: "Pulse Heartbeat (Gentle Pump)" },
                          { value: "shimmer-gold", label: "Gold & Platinum Light Shimmer" },
                          { value: "float-loop", label: "Levitate Float Loop (Continuous Smooth)" },
                          { value: "subtle-shake", label: "Subtle Warning Shake" }
                        ].find(e => e.value === (hoveredElementAnimation || (selectedElement === "title" ? titleAnim.type : selectedElement === "manifesto" ? manifestoAnim.type : selectedElement === "button" ? buttonAnim.type : elementAnimation)))?.label || "None (Static No Animation)"}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                    </button>

                    {isElemAnimDropdownOpen && (
                      <div
                        onMouseLeave={() => setHoveredElementAnimation(null)}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          marginTop: "4px",
                          maxHeight: "220px",
                          overflowY: "auto",
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                          padding: "4px"
                        }}
                      >
                        {[
                          { value: "none", label: "None (Static No Animation)" },
                          { value: "fade-in", label: "Fade In (Classic Clean)" },
                          { value: "fly-in-up", label: "Fly In from Bottom (Upward Lift)" },
                          { value: "fly-in-left", label: "Fly In from Left (Slide Entrance)" },
                          { value: "fly-in-right", label: "Fly In from Right" },
                          { value: "float-up", label: "Float Up (Smooth Soft Slide)" },
                          { value: "zoom-in", label: "Zoom In (Pop Out Reveal)" },
                          { value: "zoom-out", label: "Zoom Out Drop (Deep Entrance)" },
                          { value: "bounce-in", label: "Bounce In (Playful Elastic Drop)" },
                          { value: "spin-in", label: "Swivel / Spin In (3D Rotation)" },
                          { value: "wipe", label: "Wipe Reveal (Linear Gradient Wipe)" },
                          { value: "split", label: "Split Expand (Horizontal Stretch)" },
                          { value: "flip-x", label: "Flip In 3D (X-Axis Flip)" },
                          { value: "blur-reveal", label: "Glass Blur Defocus Reveal" },
                          { value: "pulse-beat", label: "Pulse Heartbeat (Gentle Pump)" },
                          { value: "shimmer-gold", label: "Gold & Platinum Light Shimmer" },
                          { value: "float-loop", label: "Levitate Float Loop (Continuous Smooth)" },
                          { value: "subtle-shake", label: "Subtle Warning Shake" }
                        ].map((item) => {
                          const currentVal = selectedElement === "title" ? titleAnim.type : selectedElement === "manifesto" ? manifestoAnim.type : selectedElement === "button" ? buttonAnim.type : elementAnimation;
                          const isSelected = currentVal === item.value;
                          const isHovered = hoveredElementAnimation === item.value;
                          return (
                            <div
                              key={item.value}
                              onMouseEnter={() => setHoveredElementAnimation(item.value)}
                              onClick={() => {
                                const newType = item.value;
                                if (newType === "none") {
                                  // Gather remaining active elements other than the one being turned off
                                  const remaining: { elem: string; order: number }[] = [];
                                  if (selectedElement !== "title" && titleAnim.type && titleAnim.type !== "none" && titleAnim.order) {
                                    remaining.push({ elem: "title", order: titleAnim.order });
                                  }
                                  if (selectedElement !== "manifesto" && manifestoAnim.type && manifestoAnim.type !== "none" && manifestoAnim.order) {
                                    remaining.push({ elem: "manifesto", order: manifestoAnim.order });
                                  }
                                  if (selectedElement !== "button" && buttonAnim.type && buttonAnim.type !== "none" && buttonAnim.order) {
                                    remaining.push({ elem: "button", order: buttonAnim.order });
                                  }

                                  // Sort remaining elements by their previous order
                                  remaining.sort((a, b) => a.order - b.order);

                                  // Re-compact so that order numbers become 1, 2, ...
                                  const updatedOrders: Record<string, number> = {};
                                  remaining.forEach((item, idx) => {
                                    updatedOrders[item.elem] = idx + 1;
                                  });

                                  // Apply cleared order to selected element and re-compacted orders to others
                                  if (selectedElement === "title") {
                                    setTitleAnim(prev => ({ ...prev, type: "none", order: undefined }));
                                  } else if (updatedOrders["title"]) {
                                    setTitleAnim(prev => ({ ...prev, order: updatedOrders["title"] }));
                                  }

                                  if (selectedElement === "manifesto") {
                                    setManifestoAnim(prev => ({ ...prev, type: "none", order: undefined }));
                                  } else if (updatedOrders["manifesto"]) {
                                    setManifestoAnim(prev => ({ ...prev, order: updatedOrders["manifesto"] }));
                                  }

                                  if (selectedElement === "button") {
                                    setButtonAnim(prev => ({ ...prev, type: "none", order: undefined }));
                                  } else if (updatedOrders["button"]) {
                                    setButtonAnim(prev => ({ ...prev, order: updatedOrders["button"] }));
                                  }
                                } else {
                                  // Assign next available sequence order if not already ordered or if it was previously none
                                  const currentActiveOrders: { elem: string; order: number }[] = [];
                                  if (selectedElement !== "title" && titleAnim.type && titleAnim.type !== "none" && titleAnim.order) {
                                    currentActiveOrders.push({ elem: "title", order: titleAnim.order });
                                  }
                                  if (selectedElement !== "manifesto" && manifestoAnim.type && manifestoAnim.type !== "none" && manifestoAnim.order) {
                                    currentActiveOrders.push({ elem: "manifesto", order: manifestoAnim.order });
                                  }
                                  if (selectedElement !== "button" && buttonAnim.type && buttonAnim.type !== "none" && buttonAnim.order) {
                                    currentActiveOrders.push({ elem: "button", order: buttonAnim.order });
                                  }

                                  const existingOrder = selectedElement === "title" ? titleAnim.order : selectedElement === "manifesto" ? manifestoAnim.order : buttonAnim.order;
                                  const prevType = selectedElement === "title" ? titleAnim.type : selectedElement === "manifesto" ? manifestoAnim.type : buttonAnim.type;
                                  
                                  let assignedOrder = existingOrder;
                                  if (!assignedOrder || prevType === "none") {
                                    const maxOrder = currentActiveOrders.reduce((max, cur) => Math.max(max, cur.order), 0);
                                    assignedOrder = maxOrder + 1;
                                  }

                                  if (selectedElement === "title") setTitleAnim(prev => ({ ...prev, type: newType, order: assignedOrder }));
                                  else if (selectedElement === "manifesto") setManifestoAnim(prev => ({ ...prev, type: newType, order: assignedOrder }));
                                  else if (selectedElement === "button") setButtonAnim(prev => ({ ...prev, type: newType, order: assignedOrder }));
                                }

                                setElementAnimation(item.value);
                                setHoveredElementAnimation(null);
                                setIsElemAnimDropdownOpen(false);
                                setElemAnimPreviewKey(Date.now());
                              }}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "4px",
                                fontSize: "0.82rem",
                                cursor: "pointer",
                                backgroundColor: isHovered ? "#f1f5f9" : isSelected ? "#eff6ff" : "transparent",
                                color: isSelected ? "#2563eb" : "#1e293b",
                                fontWeight: isSelected ? 700 : 500,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}
                            >
                              <span>{item.label}</span>
                              {isSelected && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {(() => {
                    const currentActiveAnim = selectedElement === "title" ? titleAnim.type : selectedElement === "manifesto" ? manifestoAnim.type : selectedElement === "button" ? buttonAnim.type : elementAnimation;
                    const isElementAnimActive = currentActiveAnim && currentActiveAnim !== "none";

                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", opacity: isElementAnimActive ? 1 : 0.45, pointerEvents: isElementAnimActive ? "auto" : "none", transition: "opacity 0.2s ease" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: isElementAnimActive ? "#475569" : "#94a3b8" }}>
                            Duration ({selectedElement === "title" ? titleAnim.duration : selectedElement === "manifesto" ? manifestoAnim.duration : selectedElement === "button" ? buttonAnim.duration : elementAnimationDuration}s)
                          </label>
                          <input
                            type="range"
                            min="0.2"
                            max="2.5"
                            step="0.1"
                            disabled={!isElementAnimActive}
                            value={selectedElement === "title" ? titleAnim.duration : selectedElement === "manifesto" ? manifestoAnim.duration : selectedElement === "button" ? buttonAnim.duration : elementAnimationDuration}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (selectedElement === "title") setTitleAnim(prev => ({ ...prev, duration: val }));
                              else if (selectedElement === "manifesto") setManifestoAnim(prev => ({ ...prev, duration: val }));
                              else if (selectedElement === "button") setButtonAnim(prev => ({ ...prev, duration: val }));
                              setElementAnimationDuration(val);
                            }}
                            onMouseUp={() => setElemAnimPreviewKey(Date.now())}
                            onTouchEnd={() => setElemAnimPreviewKey(Date.now())}
                            style={{ cursor: isElementAnimActive ? "pointer" : "not-allowed", accentColor: "#d97706" }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: isElementAnimActive ? "#475569" : "#94a3b8" }}>
                            Delay ({selectedElement === "title" ? titleAnim.delay : selectedElement === "manifesto" ? manifestoAnim.delay : selectedElement === "button" ? buttonAnim.delay : elementAnimationDelay}s)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1.5"
                            step="0.05"
                            disabled={!isElementAnimActive}
                            value={selectedElement === "title" ? titleAnim.delay : selectedElement === "manifesto" ? manifestoAnim.delay : selectedElement === "button" ? buttonAnim.delay : elementAnimationDelay}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (selectedElement === "title") setTitleAnim(prev => ({ ...prev, delay: val }));
                              else if (selectedElement === "manifesto") setManifestoAnim(prev => ({ ...prev, delay: val }));
                              else if (selectedElement === "button") setButtonAnim(prev => ({ ...prev, delay: val }));
                              setElementAnimationDelay(val);
                            }}
                            onMouseUp={() => setElemAnimPreviewKey(Date.now())}
                            onTouchEnd={() => setElemAnimPreviewKey(Date.now())}
                            style={{ cursor: isElementAnimActive ? "pointer" : "not-allowed", accentColor: "#d97706" }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* 5. Slide Animation (PowerPoint Transitions) */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: 0 }}>
                    5. Slide Animation
                  </h4>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: "4px" }}>
                    Slide Transition
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Transition Preset</label>
                    <button
                      type="button"
                      onClick={() => setIsSlideAnimDropdownOpen(!isSlideAnimDropdownOpen)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                        fontWeight: 600,
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer"
                      }}
                    >
                      <span>
                        {(() => {
                          const curAnim = hoveredSlideAnimation || slideAnimation;
                          return [
                            { value: "none", label: "None" },
                            { value: "morph", label: "Morph" },
                            { value: "fade", label: "Fade" },
                            { value: "push", label: "Push" }
                          ].find(s => s.value === curAnim)?.label || (curAnim?.startsWith("push") ? "Push" : "None");
                        })()}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#64748b" }}>▼</span>
                    </button>

                    {isSlideAnimDropdownOpen && (
                      <div
                        onMouseLeave={() => {
                          if (slideHoverTimerRef.current) {
                            clearTimeout(slideHoverTimerRef.current);
                            slideHoverTimerRef.current = null;
                          }
                          setHoveredSlideAnimation(null);
                        }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          marginTop: "4px",
                          maxHeight: "200px",
                          overflowY: "auto",
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                          padding: "4px"
                        }}
                      >
                        {[
                          { value: "none", label: "None" },
                          { value: "morph", label: "Morph" },
                          { value: "fade", label: "Fade" },
                          { value: "push", label: "Push" }
                        ].map((item) => {
                          const isSelected = slideAnimation === item.value || (item.value === "push" && slideAnimation?.startsWith("push"));
                          const isHovered = hoveredSlideAnimation === item.value;
                          return (
                            <div
                              key={item.value}
                              onMouseEnter={() => {
                                setHoveredSlideAnimation(item.value);
                                if (slideHoverTimerRef.current) {
                                  clearTimeout(slideHoverTimerRef.current);
                                }
                                slideHoverTimerRef.current = setTimeout(() => {
                                  setActiveSlideAnimPreview({ anim: item.value, key: Date.now() });
                                }, 500);
                              }}
                              onMouseLeave={() => {
                                if (slideHoverTimerRef.current) {
                                  clearTimeout(slideHoverTimerRef.current);
                                  slideHoverTimerRef.current = null;
                                }
                              }}
                              onClick={() => {
                                if (slideHoverTimerRef.current) {
                                  clearTimeout(slideHoverTimerRef.current);
                                  slideHoverTimerRef.current = null;
                                }
                                setSlideAnimation(item.value);
                                setActiveSlideAnimPreview({ anim: item.value, key: Date.now() });
                                setHoveredSlideAnimation(null);
                                setIsSlideAnimDropdownOpen(false);
                              }}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "4px",
                                fontSize: "0.82rem",
                                cursor: "pointer",
                                backgroundColor: isHovered ? "#f1f5f9" : isSelected ? "#eff6ff" : "transparent",
                                color: isSelected ? "#d97706" : "#1e293b",
                                fontWeight: isSelected ? 700 : 500,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}
                            >
                              <span>{item.label}</span>
                              {isSelected && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {(() => {
                    const isSlideAnimActive = slideAnimation && slideAnimation !== "none";

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", opacity: isSlideAnimActive ? 1 : 0.45, pointerEvents: isSlideAnimActive ? "auto" : "none", transition: "opacity 0.2s ease" }}>
                        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: isSlideAnimActive ? "#475569" : "#94a3b8" }}>
                          Transition Speed ({slideAnimationDuration}s)
                        </label>
                        <input
                          type="range"
                          min="0.2"
                          max="2.0"
                          step="0.1"
                          disabled={!isSlideAnimActive}
                          value={slideAnimationDuration}
                          onChange={(e) => setSlideAnimationDuration(parseFloat(e.target.value))}
                          onMouseUp={() => setActiveSlideAnimPreview({ anim: slideAnimation || "push", key: Date.now() })}
                          onTouchEnd={() => setActiveSlideAnimPreview({ anim: slideAnimation || "push", key: Date.now() })}
                          style={{ cursor: isSlideAnimActive ? "pointer" : "not-allowed", accentColor: "#d97706" }}
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>

            </div>


            {/* Right panel: Live Interactive Preview & Carousel Slides Bar */}
            <div style={{
              flex: 1,
              backgroundColor: "#f8fafc",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxSizing: "border-box",
              position: "relative"
            }}>
              {/* Top Viewport Device Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "#475569", letterSpacing: "0.08em" }}>
                    LIVE PREVIEW
                  </span>
                  <span style={{ fontSize: "0.7rem", backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, color: "#475569" }}>
                    1440 x 680 (Scalable)
                  </span>
                </div>

                {/* Device Selector Buttons */}
                <div style={{ display: "flex", backgroundColor: "#e2e8f0", padding: "3px", borderRadius: "8px", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 14px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: previewDevice === 'desktop' ? "#2563eb" : "transparent",
                      color: previewDevice === 'desktop' ? "#ffffff" : "#64748b",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
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
                    onClick={() => setPreviewDevice('mobile')}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 14px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: previewDevice === 'mobile' ? "#2563eb" : "transparent",
                      color: previewDevice === 'mobile' ? "#ffffff" : "#64748b",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>

                  </button>
                </div>
              </div>

              {/* Live Preview Canvas Container */}
              <div style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0f172a",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "420px"
              }}>
                {/* Scaled Canvas Frame */}
                <div
                  ref={canvasFrameRef}
                  onClick={() => setSelectedElement(null)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: previewDevice === 'desktop' ? "1280px" : "393px",
                    height: previewDevice === 'desktop' ? "720px" : "852px",
                    transform: previewDevice === 'desktop' ? "translate(-50%, -50%) scale(0.60)" : "translate(-50%, -50%) scale(0.50)",
                    transformOrigin: "center center",
                    backgroundColor: "#0b0f19",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    borderRadius: previewDevice === 'desktop' ? "12px" : "44px",
                    border: previewDevice === 'desktop' ? "1px solid #cbd5e1" : "12px solid #1c1c1e"
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
                    @keyframes heroSlidePopIn {
                      0% { opacity: 0; transform: scale(0.75); }
                      100% { opacity: 1; transform: scale(1); }
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
                    @keyframes elemWipe {
                      0% { opacity: 0; clip-path: inset(0 100% 0 0); }
                      100% { opacity: 1; clip-path: inset(0 0 0 0); }
                    }
                    @keyframes elemSplit {
                      0% { opacity: 0; transform: scaleX(0); }
                      100% { opacity: 1; transform: scaleX(1); }
                    }
                    @keyframes elemSubtleShake {
                      0%, 100% { transform: translateX(0); }
                      20%, 60% { transform: translateX(-4px); }
                      40%, 80% { transform: translateX(4px); }
                    }
                  `}</style>

                  {/* Previous/Last Slide Layer during Hover / Switching Transition Preview */}
                  {activeSlideAnimPreview && slides.length > 0 && (() => {
                    const prevSlideIdx = (activeSlideIndex - 1 + slides.length) % slides.length;
                    const prevSlide = slides[prevSlideIdx];
                    if (!prevSlide) return null;
                    const isPush = (activeSlideAnimPreview?.anim || slideAnimation)?.startsWith("push");
                    const prevTemplate = previewDevice === 'desktop'
                      ? (prevSlide.layoutTemplate || "center")
                      : (prevSlide.mobileLayoutTemplate || prevSlide.layoutTemplate || "center");

                    return (
                      <div
                        key={`prev_slide_layer_${activeSlideAnimPreview.key}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 1,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent:
                            prevTemplate === "top-left" || prevTemplate === "right-top" || prevTemplate === "top-center" ? "flex-start" :
                            prevTemplate === "bottom-left" || prevTemplate === "right-bottom" || prevTemplate === "bottom-center" ? "flex-end" : "center",
                          alignItems:
                            prevTemplate === "center" || prevTemplate.endsWith("center") ? "center" :
                            prevTemplate.startsWith("right") ? "flex-end" : "flex-start",
                          padding: previewDevice === 'desktop' ? "80px 5%" : "60px 24px",
                          textAlign:
                            prevTemplate === "center" || prevTemplate.endsWith("center") ? "center" :
                            prevTemplate.startsWith("right") ? "right" : "left",
                          backgroundColor: prevSlide.bgType === "color" ? (prevSlide.bgColor || "#121212") : "#121212",
                          backgroundImage: prevSlide.bgType === "image" && prevSlide.bgImage ? `url("${prevSlide.bgImage}")` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          animation: isPush
                            ? `${(activeSlideAnimPreview?.anim || slideAnimation) === "none" ? "none" : "heroSlidePushOutLeft"} ${slideAnimationDuration || 0.5}s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                            : `heroSlideFadeOut ${slideAnimationDuration || 0.5}s ease forwards`
                        }}
                      >
                        {prevSlide.bgType === "video" && prevSlide.bgVideo && (
                          <video src={prevSlide.bgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                        )}
                        {prevSlide.bgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

                        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%", opacity: 0.85 }}>
                          {prevSlide.showTitle && (
                            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: prevSlide.titleFontColor || "#ffffff" }}>
                              {prevSlide.titleText || ""}
                            </div>
                          )}
                          {prevSlide.showManifesto && (
                            <div style={{ fontSize: "1rem", color: prevSlide.manifestoFontColor || "#ffffff" }}>
                              {prevSlide.manifestoText || ""}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Active Slide Layer with Background + Content Encapsulation */}
                  <div
                    key={`active_slide_layer_${activeSlideIndex}_${activeSlideAnimPreview ? activeSlideAnimPreview.key : 'static'}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      overflow: "hidden",
                      backgroundColor: bgType === "color" ? (bgColor || "#121212") : "#121212",
                      backgroundImage: bgType === "image" && bgImage ? `url("${bgImage}")` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent:
                        currentLayoutTemplate === "top-left" || currentLayoutTemplate === "right-top" || currentLayoutTemplate === "top-center" ? "flex-start" :
                          currentLayoutTemplate === "bottom-left" || currentLayoutTemplate === "right-bottom" || currentLayoutTemplate === "bottom-center" ? "flex-end" : "center",
                      alignItems:
                        currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                          currentLayoutTemplate.startsWith("right") ? "flex-end" : "flex-start",
                      padding: previewDevice === 'desktop' ? "80px 5%" : "60px 24px",
                      textAlign:
                        currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                          currentLayoutTemplate.startsWith("right") ? "right" : "left",
                      animation: activeSlideAnimPreview ? (
                        (activeSlideAnimPreview.anim === "none") ? "none" :
                        (activeSlideAnimPreview.anim === "morph") ? `heroSlideMorphIn ${slideAnimationDuration || 0.5}s cubic-bezier(0.16, 1, 0.3, 1) forwards` :
                        (activeSlideAnimPreview.anim?.startsWith("push")) ? `heroSlidePush ${slideAnimationDuration || 0.5}s cubic-bezier(0.16, 1, 0.3, 1) forwards` :
                        `heroSlideFadeIn ${slideAnimationDuration || 0.5}s ease forwards`
                      ) : "none"
                    }}
                  >
                    {bgType === "video" && bgVideo && (
                      <video src={bgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                    )}
                    {bgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

                    {/* Main Slide Interactive Elements Container */}
                    {(() => {
                      const effectiveTitleAnimType = (selectedElement === "title" && hoveredElementAnimation) ? hoveredElementAnimation : (titleAnim.type || "fade-in");
                      const effectiveManifestoAnimType = (selectedElement === "manifesto" && hoveredElementAnimation) ? hoveredElementAnimation : (manifestoAnim.type || "fade-in");
                      const effectiveButtonAnimType = (selectedElement === "button" && hoveredElementAnimation) ? hoveredElementAnimation : (buttonAnim.type || "fade-in");

                      const isTitleLoop = effectiveTitleAnimType.endsWith("-loop") || effectiveTitleAnimType === "pulse-beat" || effectiveTitleAnimType === "shimmer-gold";
                      const isManifestoLoop = effectiveManifestoAnimType.endsWith("-loop") || effectiveManifestoAnimType === "pulse-beat" || effectiveManifestoAnimType === "shimmer-gold";
                      const isButtonLoop = effectiveButtonAnimType.endsWith("-loop") || effectiveButtonAnimType === "pulse-beat" || effectiveButtonAnimType === "shimmer-gold";

                      const items = [
                        { id: 'title', order: titleAnim.order || 1, duration: titleAnim.duration ?? 0.6, delay: titleAnim.delay ?? 0, type: effectiveTitleAnimType, isLoop: isTitleLoop },
                        { id: 'manifesto', order: manifestoAnim.order || 2, duration: manifestoAnim.duration ?? 0.6, delay: manifestoAnim.delay ?? 0.25, type: effectiveManifestoAnimType, isLoop: isManifestoLoop },
                        { id: 'button', order: buttonAnim.order || 3, duration: buttonAnim.duration ?? 0.6, delay: buttonAnim.delay ?? 0.4, type: effectiveButtonAnimType, isLoop: isButtonLoop }
                      ].sort((a, b) => a.order - b.order);

                      let accumulatedTime = 0;
                      const effectiveDelays: Record<string, number> = {};

                      items.forEach(item => {
                        if (item.type === 'none') {
                          effectiveDelays[item.id] = 0;
                          return;
                        }
                        if (item.isLoop) {
                          effectiveDelays[item.id] = item.delay;
                          return;
                        }
                        const itemStart = accumulatedTime + item.delay;
                        effectiveDelays[item.id] = itemStart;
                        accumulatedTime = itemStart + item.duration;
                      });

                      const getAnimKeyframe = (animType: string) => {
                        switch (animType) {
                          case 'fly-in-up': return 'elemFlyInUp';
                          case 'fly-in-left': return 'elemFlyInLeft';
                          case 'fly-in-right': return 'elemFlyInRight';
                          case 'float-up': return 'elemFloatUp';
                          case 'zoom-in': return 'elemZoomIn';
                          case 'zoom-out': return 'elemZoomOut';
                          case 'bounce-in': return 'elemBounceIn';
                          case 'spin-in': return 'elemSpinIn';
                          case 'wipe': return 'elemWipe';
                          case 'split': return 'elemSplit';
                          case 'flip-x': return 'elemFlipX';
                          case 'blur-reveal': return 'elemBlurReveal';
                          case 'pulse-beat': return 'elemPulseBeat 2s infinite ease-in-out';
                          case 'shimmer-gold': return 'elemShimmerGold 2.5s infinite ease-in-out';
                          case 'float-loop': return 'elemFloatLoop 3s infinite ease-in-out';
                          case 'subtle-shake': return 'elemSubtleShake 1.5s infinite ease-in-out';
                          case 'none': return 'none';
                          default: return 'elemFadeIn';
                        }
                      };

                      const getAnimationCss = (animType: string, duration: number, delay: number, isLoop: boolean) => {
                        if (animType === 'none') return 'none';
                        const kf = getAnimKeyframe(animType);
                        if (isLoop) {
                          return `${kf} ${delay}s`;
                        }
                        return `${kf} ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`;
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
                          {/* Helper component or inline rendering for selection & interactive handles */}
                          {/* 1. Hero Title Element */}
                          <div
                            key={`preview_elem_title_${elemAnimPreviewKey}`}
                            ref={titleRef}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement("title");
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedElement("title");
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const initialOffsetX = currentTitleContainer.offsetX;
                              const initialOffsetY = currentTitleContainer.offsetY;

                              // Capture base un-transformed element center relative to canvas center
                              const scale = previewDevice === 'desktop' ? 0.60 : 0.50;
                              let baseCenterX = 0;
                              let baseCenterY = 0;
                              if (titleRef.current && canvasFrameRef.current) {
                                const elemRect = titleRef.current.getBoundingClientRect();
                                const canvasRect = canvasFrameRef.current.getBoundingClientRect();
                                const currentElemCenterX = elemRect.left + elemRect.width / 2;
                                const canvasCenterX = canvasRect.left + canvasRect.width / 2;
                                baseCenterX = (currentElemCenterX - canvasCenterX) / scale - initialOffsetX;

                                const currentElemCenterY = elemRect.top + elemRect.height / 2;
                                const canvasCenterY = canvasRect.top + canvasRect.height / 2;
                                baseCenterY = (currentElemCenterY - canvasCenterY) / scale - initialOffsetY;
                              }

                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                const dx = (moveEvent.clientX - startX) / scale;
                                const dy = (moveEvent.clientY - startY) / scale;
                                let nextX = initialOffsetX + dx;
                                let nextY = initialOffsetY + dy;

                                const projectedCenterX = baseCenterX + nextX;
                                const projectedCenterY = baseCenterY + nextY;

                                const snapThreshold = 20; // scale-independent canvas px threshold

                                if (Math.abs(projectedCenterX) < snapThreshold) {
                                  nextX = -baseCenterX;
                                  setShowVerticalGuide(true);
                                } else {
                                  setShowVerticalGuide(false);
                                }

                                if (Math.abs(projectedCenterY) < snapThreshold) {
                                  nextY = -baseCenterY;
                                  setShowHorizontalGuide(true);
                                } else {
                                  setShowHorizontalGuide(false);
                                }

                                setCurrentTitleContainer((prev) => ({
                                  ...prev,
                                  offsetX: nextX,
                                  offsetY: nextY
                                }));
                              };

                              const handleMouseUp = () => {
                                setShowVerticalGuide(false);
                                setShowHorizontalGuide(false);
                                window.removeEventListener("mousemove", handleMouseMove);
                                window.removeEventListener("mouseup", handleMouseUp);
                              };

                              window.addEventListener("mousemove", handleMouseMove);
                              window.addEventListener("mouseup", handleMouseUp);
                            }}
                            style={{
                              cursor: selectedElement === "title" ? "move" : "pointer",
                              border: selectedElement === "title" ? "2px dashed #3b82f6" : "1px dashed transparent",
                              padding: `${currentTitleContainer.padding ?? 12}px`,
                              borderRadius: "8px",
                              backgroundColor: currentTitleContainer.bgColor || (selectedElement === "title" ? "rgba(59, 130, 246, 0.12)" : "transparent"),
                              width: currentTitleContainer.width ? `${currentTitleContainer.width}px` : "auto",
                              height: currentTitleContainer.height ? `${currentTitleContainer.height}px` : "auto",
                              transform: `translate(${currentTitleContainer.offsetX}px, ${currentTitleContainer.offsetY}px)`,
                              position: "relative",
                              userSelect: "none",
                              boxSizing: "border-box",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center"
                            }}
                          >
                            {/* Sequence Order Number Badge (PowerPoint Style #1) */}
                            {titleAnim.type && titleAnim.type !== "none" && (
                              <div style={{ position: "absolute", top: "-12px", left: "-12px", backgroundColor: "#2563eb", color: "#ffffff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, border: "2px solid #ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", zIndex: 12 }}>
                                {titleAnim.order || 1}
                              </div>
                            )}
                            {selectedElement === "title" && (
                              <>
                                {/* 4 Corner Resize Dots */}
                                {[
                                  { pos: { top: "-6px", left: "-6px" }, cursor: "nwse-resize", type: "tl" },
                                  { pos: { top: "-6px", right: "-6px" }, cursor: "nesw-resize", type: "tr" },
                                  { pos: { bottom: "-6px", left: "-6px" }, cursor: "nesw-resize", type: "bl" },
                                  { pos: { bottom: "-6px", right: "-6px" }, cursor: "nwse-resize", type: "br" }
                                ].map((handle, idx) => (
                                  <div
                                    key={idx}
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      const startX = e.clientX;
                                      const startY = e.clientY;
                                      const initialWidth = currentTitleContainer.width || e.currentTarget.parentElement?.clientWidth || 400;
                                      const initialHeight = currentTitleContainer.height || e.currentTarget.parentElement?.clientHeight || 80;

                                      const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const scale = previewDevice === 'desktop' ? 0.60 : 0.50;
                                        const dx = (moveEvent.clientX - startX) / scale;
                                        const dy = (moveEvent.clientY - startY) / scale;

                                        let newWidth = initialWidth;
                                        let newHeight = initialHeight;

                                        if (handle.type.includes("r")) newWidth = initialWidth + dx;
                                        if (handle.type.includes("l")) newWidth = initialWidth - dx;
                                        if (handle.type.includes("b")) newHeight = initialHeight + dy;
                                        if (handle.type.includes("t")) newHeight = initialHeight - dy;

                                        setCurrentTitleContainer((prev) => ({
                                          ...prev,
                                          width: Math.max(120, newWidth),
                                          height: Math.max(40, newHeight)
                                        }));
                                      };

                                      const handleMouseUp = () => {
                                        window.removeEventListener("mousemove", handleMouseMove);
                                        window.removeEventListener("mouseup", handleMouseUp);
                                      };

                                      window.addEventListener("mousemove", handleMouseMove);
                                      window.addEventListener("mouseup", handleMouseUp);
                                    }}
                                    style={{
                                      position: "absolute",
                                      width: "12px",
                                      height: "12px",
                                      backgroundColor: "#2563eb",
                                      border: "2px solid #ffffff",
                                      borderRadius: "50%",
                                      cursor: handle.cursor,
                                      zIndex: 10,
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                      ...handle.pos
                                    }}
                                  />
                                ))}
                              </>
                            )}
                            <div style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              animation: getAnimationCss(
                                effectiveTitleAnimType,
                                titleAnim.duration ?? 0.6,
                                effectiveDelays['title'] ?? 0,
                                isTitleLoop
                              )
                            }}>
                              {currentShowTitle ? (
                                <h1 style={{
                                  fontFamily: `"${(selectedElement === "title" && hoveredFontType) ? hoveredFontType : currentTitleFontType}", sans-serif`,
                                  color: currentTitleFontColor,
                                  fontSize: (selectedElement === "title" && hoveredFontSize) ? hoveredFontSize : currentTitleFontSize,
                                  fontWeight: Number((selectedElement === "title" && hoveredFontWeight) ? hoveredFontWeight : currentTitleFontWeight) || 700,
                                  textAlign: (currentTitleFontAlignment as any) || "center",
                                  margin: 0,
                                  lineHeight: "1.1",
                                  wordBreak: "break-word",
                                  transition: "font-family 0.15s ease, font-size 0.15s ease, font-weight 0.15s ease"
                                }}>
                                  {currentTitleText || "WELCOME TO OUR STORE"}
                                </h1>
                              ) : (
                                <span style={{ fontSize: "1rem", color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>
                                  [Title Element Hidden]
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 2. Hero Manifesto Subtitle */}
                          <div
                            key={`preview_elem_manifesto_${elemAnimPreviewKey}`}
                            ref={manifestoRef}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement("manifesto");
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedElement("manifesto");
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const initialOffsetX = currentManifestoContainer.offsetX;
                              const initialOffsetY = currentManifestoContainer.offsetY;

                              const scale = previewDevice === 'desktop' ? 0.60 : 0.50;
                              let baseCenterX = 0;
                              let baseCenterY = 0;
                              if (manifestoRef.current && canvasFrameRef.current) {
                                const elemRect = manifestoRef.current.getBoundingClientRect();
                                const canvasRect = canvasFrameRef.current.getBoundingClientRect();
                                const currentElemCenterX = elemRect.left + elemRect.width / 2;
                                const canvasCenterX = canvasRect.left + canvasRect.width / 2;
                                baseCenterX = (currentElemCenterX - canvasCenterX) / scale - initialOffsetX;

                                const currentElemCenterY = elemRect.top + elemRect.height / 2;
                                const canvasCenterY = canvasRect.top + canvasRect.height / 2;
                                baseCenterY = (currentElemCenterY - canvasCenterY) / scale - initialOffsetY;
                              }

                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                const dx = (moveEvent.clientX - startX) / scale;
                                const dy = (moveEvent.clientY - startY) / scale;
                                let nextX = initialOffsetX + dx;
                                let nextY = initialOffsetY + dy;

                                const projectedCenterX = baseCenterX + nextX;
                                const projectedCenterY = baseCenterY + nextY;

                                const snapThreshold = 20;

                                if (Math.abs(projectedCenterX) < snapThreshold) {
                                  nextX = -baseCenterX;
                                  setShowVerticalGuide(true);
                                } else {
                                  setShowVerticalGuide(false);
                                }

                                if (Math.abs(projectedCenterY) < snapThreshold) {
                                  nextY = -baseCenterY;
                                  setShowHorizontalGuide(true);
                                } else {
                                  setShowHorizontalGuide(false);
                                }

                                setCurrentManifestoContainer((prev) => ({
                                  ...prev,
                                  offsetX: nextX,
                                  offsetY: nextY
                                }));
                              };

                              const handleMouseUp = () => {
                                setShowVerticalGuide(false);
                                setShowHorizontalGuide(false);
                                window.removeEventListener("mousemove", handleMouseMove);
                                window.removeEventListener("mouseup", handleMouseUp);
                              };

                              window.addEventListener("mousemove", handleMouseMove);
                              window.addEventListener("mouseup", handleMouseUp);
                            }}
                            style={{
                              cursor: selectedElement === "manifesto" ? "move" : "pointer",
                              border: selectedElement === "manifesto" ? "2px dashed #3b82f6" : "1px dashed transparent",
                              padding: `${currentManifestoContainer.padding ?? 10}px`,
                              borderRadius: "8px",
                              backgroundColor: currentManifestoContainer.bgColor || (selectedElement === "manifesto" ? "rgba(59, 130, 246, 0.12)" : "transparent"),
                              width: currentManifestoContainer.width ? `${currentManifestoContainer.width}px` : "auto",
                              height: currentManifestoContainer.height ? `${currentManifestoContainer.height}px` : "auto",
                              transform: `translate(${currentManifestoContainer.offsetX}px, ${currentManifestoContainer.offsetY}px)`,
                              position: "relative",
                              userSelect: "none",
                              boxSizing: "border-box",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center"
                            }}
                          >
                            {/* Sequence Order Number Badge (PowerPoint Style #2) */}
                            {manifestoAnim.type && manifestoAnim.type !== "none" && (
                              <div style={{ position: "absolute", top: "-12px", left: "-12px", backgroundColor: "#2563eb", color: "#ffffff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, border: "2px solid #ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", zIndex: 12 }}>
                                {manifestoAnim.order || 2}
                              </div>
                            )}
                            {selectedElement === "manifesto" && (
                              <>
                                {/* 4 Corner Resize Dots */}
                                {[
                                  { pos: { top: "-6px", left: "-6px" }, cursor: "nwse-resize", type: "tl" },
                                  { pos: { top: "-6px", right: "-6px" }, cursor: "nesw-resize", type: "tr" },
                                  { pos: { bottom: "-6px", left: "-6px" }, cursor: "nesw-resize", type: "bl" },
                                  { pos: { bottom: "-6px", right: "-6px" }, cursor: "nwse-resize", type: "br" }
                                ].map((handle, idx) => (
                                  <div
                                    key={idx}
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      const startX = e.clientX;
                                      const startY = e.clientY;
                                      const initialWidth = currentManifestoContainer.width || e.currentTarget.parentElement?.clientWidth || 350;
                                      const initialHeight = currentManifestoContainer.height || e.currentTarget.parentElement?.clientHeight || 60;

                                      const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const scale = previewDevice === 'desktop' ? 0.60 : 0.50;
                                        const dx = (moveEvent.clientX - startX) / scale;
                                        const dy = (moveEvent.clientY - startY) / scale;

                                        let newWidth = initialWidth;
                                        let newHeight = initialHeight;

                                        if (handle.type.includes("r")) newWidth = initialWidth + dx;
                                        if (handle.type.includes("l")) newWidth = initialWidth - dx;
                                        if (handle.type.includes("b")) newHeight = initialHeight + dy;
                                        if (handle.type.includes("t")) newHeight = initialHeight - dy;

                                        setCurrentManifestoContainer((prev) => ({
                                          ...prev,
                                          width: Math.max(100, newWidth),
                                          height: Math.max(30, newHeight)
                                        }));
                                      };

                                      const handleMouseUp = () => {
                                        window.removeEventListener("mousemove", handleMouseMove);
                                        window.removeEventListener("mouseup", handleMouseUp);
                                      };

                                      window.addEventListener("mousemove", handleMouseMove);
                                      window.addEventListener("mouseup", handleMouseUp);
                                    }}
                                    style={{
                                      position: "absolute",
                                      width: "12px",
                                      height: "12px",
                                      backgroundColor: "#2563eb",
                                      border: "2px solid #ffffff",
                                      borderRadius: "50%",
                                      cursor: handle.cursor,
                                      zIndex: 10,
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                      ...handle.pos
                                    }}
                                  />
                                ))}
                              </>
                            )}
                            <div style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              animation: getAnimationCss(
                                effectiveManifestoAnimType,
                                manifestoAnim.duration ?? 0.6,
                                effectiveDelays['manifesto'] ?? 0.25,
                                isManifestoLoop
                              )
                            }}>
                              {currentShowManifesto ? (
                                <p style={{
                                  fontFamily: `"${(selectedElement === "manifesto" && hoveredFontType) ? hoveredFontType : currentManifestoFontType}", sans-serif`,
                                  color: currentManifestoFontColor,
                                  fontSize: (selectedElement === "manifesto" && hoveredFontSize) ? hoveredFontSize : currentManifestoFontSize,
                                  fontWeight: Number((selectedElement === "manifesto" && hoveredFontWeight) ? hoveredFontWeight : currentManifestoFontWeight) || 500,
                                  textAlign: (currentManifestoFontAlignment as any) || "center",
                                  margin: 0,
                                  lineHeight: "1.6",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.03em",
                                  transition: "font-family 0.15s ease, font-size 0.15s ease, font-weight 0.15s ease"
                                }}>
                                  {currentManifestoText || ""}
                                </p>
                              ) : (
                                <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>
                                  [Subtitle Element Hidden]
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 3. Hero Button */}
                          <div
                            key={`preview_elem_button_${elemAnimPreviewKey}`}
                            ref={buttonRef}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement("button");
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedElement("button");
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const initialOffsetX = currentButtonContainer.offsetX;
                              const initialOffsetY = currentButtonContainer.offsetY;

                              const scale = previewDevice === 'desktop' ? 0.60 : 0.50;
                              let baseCenterX = 0;
                              let baseCenterY = 0;
                              if (buttonRef.current && canvasFrameRef.current) {
                                const elemRect = buttonRef.current.getBoundingClientRect();
                                const canvasRect = canvasFrameRef.current.getBoundingClientRect();
                                const currentElemCenterX = elemRect.left + elemRect.width / 2;
                                const canvasCenterX = canvasRect.left + canvasRect.width / 2;
                                baseCenterX = (currentElemCenterX - canvasCenterX) / scale - initialOffsetX;

                                const currentElemCenterY = elemRect.top + elemRect.height / 2;
                                const canvasCenterY = canvasRect.top + canvasRect.height / 2;
                                baseCenterY = (currentElemCenterY - canvasCenterY) / scale - initialOffsetY;
                              }

                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                const dx = (moveEvent.clientX - startX) / scale;
                                const dy = (moveEvent.clientY - startY) / scale;
                                let nextX = initialOffsetX + dx;
                                let nextY = initialOffsetY + dy;

                                const projectedCenterX = baseCenterX + nextX;
                                const projectedCenterY = baseCenterY + nextY;

                                const snapThreshold = 20;

                                if (Math.abs(projectedCenterX) < snapThreshold) {
                                  nextX = -baseCenterX;
                                  setShowVerticalGuide(true);
                                } else {
                                  setShowVerticalGuide(false);
                                }

                                if (Math.abs(projectedCenterY) < snapThreshold) {
                                  nextY = -baseCenterY;
                                  setShowHorizontalGuide(true);
                                } else {
                                  setShowHorizontalGuide(false);
                                }

                                setCurrentButtonContainer((prev) => ({
                                  ...prev,
                                  offsetX: nextX,
                                  offsetY: nextY
                                }));
                              };

                              const handleMouseUp = () => {
                                setShowVerticalGuide(false);
                                setShowHorizontalGuide(false);
                                window.removeEventListener("mousemove", handleMouseMove);
                                window.removeEventListener("mouseup", handleMouseUp);
                              };

                              window.addEventListener("mousemove", handleMouseMove);
                              window.addEventListener("mouseup", handleMouseUp);
                            }}
                            style={{
                              cursor: selectedElement === "button" ? "move" : "pointer",
                              border: selectedElement === "button" ? "2px dashed #3b82f6" : "1px dashed transparent",
                              padding: "4px",
                              borderRadius: "8px",
                              backgroundColor: selectedElement === "button" ? "rgba(59, 130, 246, 0.12)" : "transparent",
                              display: "inline-block",
                              position: "relative",
                              userSelect: "none",
                              width: currentButtonContainer.width ? `${currentButtonContainer.width}px` : "auto",
                              height: currentButtonContainer.height ? `${currentButtonContainer.height}px` : "auto",
                              transform: `translate(${currentButtonContainer.offsetX}px, ${currentButtonContainer.offsetY}px)`,
                              alignSelf:
                                currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                                  currentLayoutTemplate.startsWith("right") ? "flex-end" : "flex-start"
                            }}
                          >
                            {/* Sequence Order Number Badge (PowerPoint Style #3) */}
                            {buttonAnim.type && buttonAnim.type !== "none" && (
                              <div style={{ position: "absolute", top: "-12px", left: "-12px", backgroundColor: "#2563eb", color: "#ffffff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, border: "2px solid #ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", zIndex: 12 }}>
                                {buttonAnim.order || 3}
                              </div>
                            )}
                            {selectedElement === "button" && (
                              <>
                                {/* 4 Corner Resize Dots */}
                                {[
                                  { pos: { top: "-6px", left: "-6px" }, cursor: "nwse-resize", type: "tl" },
                                  { pos: { top: "-6px", right: "-6px" }, cursor: "nesw-resize", type: "tr" },
                                  { pos: { bottom: "-6px", left: "-6px" }, cursor: "nesw-resize", type: "bl" },
                                  { pos: { bottom: "-6px", right: "-6px" }, cursor: "nwse-resize", type: "br" }
                                ].map((handle, idx) => (
                                  <div
                                    key={idx}
                                    onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const initialWidth = currentButtonContainer.width || e.currentTarget.parentElement?.clientWidth || 180;
                                const initialHeight = currentButtonContainer.height || e.currentTarget.parentElement?.clientHeight || 50;

                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                  const scale = previewDevice === 'desktop' ? 0.60 : 0.50;
                                  const dx = (moveEvent.clientX - startX) / scale;
                                  const dy = (moveEvent.clientY - startY) / scale;

                                  let newWidth = initialWidth;
                                  let newHeight = initialHeight;

                                  if (handle.type.includes("r")) newWidth = initialWidth + dx;
                                  if (handle.type.includes("l")) newWidth = initialWidth - dx;
                                  if (handle.type.includes("b")) newHeight = initialHeight + dy;
                                  if (handle.type.includes("t")) newHeight = initialHeight - dy;

                                  setCurrentButtonContainer((prev) => ({
                                    ...prev,
                                    width: Math.max(80, newWidth),
                                    height: Math.max(30, newHeight)
                                  }));
                                };

                                const handleMouseUp = () => {
                                  window.removeEventListener("mousemove", handleMouseMove);
                                  window.removeEventListener("mouseup", handleMouseUp);
                                };

                                window.addEventListener("mousemove", handleMouseMove);
                                window.addEventListener("mouseup", handleMouseUp);
                              }}
                              style={{
                                position: "absolute",
                                width: "12px",
                                height: "12px",
                                backgroundColor: "#2563eb",
                                border: "2px solid #ffffff",
                                borderRadius: "50%",
                                cursor: handle.cursor,
                                zIndex: 10,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                ...handle.pos
                              }}
                            />
                          ))}
                        </>
                      )}
                      {/* 4 Corner Resize Dots end */}
                      <div style={{
                        width: "100%",
                        height: "100%",
                        animation: getAnimationCss(
                          effectiveButtonAnimType,
                          buttonAnim.duration ?? 0.6,
                          effectiveDelays['button'] ?? 0.4,
                          isButtonLoop
                        )
                      }}>
                        {currentShowButton ? (
                          <div style={{
                            width: "100%",
                            height: "100%",
                            ...getButtonStyleStyles(
                              (selectedElement === "button" && hoveredButtonStyle) ? hoveredButtonStyle : (currentButtonStyle || "solid"),
                              currentButtonColor || primaryColor || "#ffffff",
                              currentButtonTextColor || "#000000",
                              currentButtonSize,
                              Boolean(currentButtonContainer.width)
                            )
                          }}>
                            {currentButtonText || "SHOP NOW"}
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontStyle: "italic" }}>
                            [Button Element Hidden]
                          </span>
                        )}
                      </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Dynamic Vertical Alignment Guide Line (Canvas Geometric X-Axis Center) */}
                  {showVerticalGuide && (
                    <div style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      bottom: 0,
                      width: "2px",
                      backgroundColor: "#3b82f6",
                      opacity: 0.85,
                      boxShadow: "0 0 10px #3b82f6",
                      zIndex: 25,
                      pointerEvents: "none"
                    }}>
                      <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                        X CENTER
                      </div>
                    </div>
                  )}

                  {/* Dynamic Horizontal Alignment Guide Line (Canvas Geometric Y-Axis Center) */}
                  {showHorizontalGuide && (
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#3b82f6",
                      opacity: 0.85,
                      boxShadow: "0 0 10px #3b82f6",
                      zIndex: 25,
                      pointerEvents: "none"
                    }}>
                      <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                        Y CENTER
                      </div>
                    </div>
                  )}

                  {/* Left Carousel Prev Arrow */}
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevIdx = (activeSlideIndex - 1 + slides.length) % slides.length;
                        selectSlide(prevIdx);
                      }}
                      style={{
                        position: "absolute",
                        left: "24px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        width: "54px",
                        height: "54px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)"
                      }}
                    >
                      ‹
                    </button>
                  )}

                  {/* Right Carousel Next Arrow */}
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIdx = (activeSlideIndex + 1) % slides.length;
                        selectSlide(nextIdx);
                      }}
                      style={{
                        position: "absolute",
                        right: "24px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        width: "54px",
                        height: "54px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)"
                      }}
                    >
                      ›
                    </button>
                  )}

                  {/* Canvas Pagination Dots */}
                  {slides.length > 1 && (
                    <div style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 20,
                      display: "flex",
                      gap: "8px",
                      alignItems: "center"
                    }}>
                      {slides.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectSlide(idx);
                          }}
                          style={{
                            width: idx === activeSlideIndex ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "4px",
                            backgroundColor: idx === activeSlideIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        />
                      ))}
                    </div>
                  )}

                </div>
              </div>


              {/* -------------------------------------------------------------------------- */}
              {/* -------------------------------------------------------------------------- */}
              {/* HERO CAROUSEL SLIDES MANAGEMENT BAR (Redesigned layout) */}
              {/* -------------------------------------------------------------------------- */}
              <div style={{
                marginTop: "16px",
                padding: "16px 20px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                {/* Header row as shown in user screenshot 2 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      CAROUSEL SLIDES
                    </h4>

                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: "#f1f5f9",
                      color: "#64748b",
                      border: "1px solid #e2e8f0"
                    }}>
                      {slides.length}/5
                    </span>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!heroAutoPlay) {
                          setHeroAutoPlay(true);
                          setHeroAutoPlaySpeed(3);
                        } else {
                          const speeds = [3, 5, 8, 10];
                          const currIdx = speeds.indexOf(heroAutoPlaySpeed);
                          if (currIdx === speeds.length - 1) {
                            setHeroAutoPlay(false);
                          } else if (currIdx === -1) {
                            setHeroAutoPlaySpeed(3);
                          } else {
                            setHeroAutoPlaySpeed(speeds[currIdx + 1]);
                          }
                        }
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#334155",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                      }}
                    >
                      <span style={{ fontSize: "0.85rem" }}>⏱</span>
                      <span>Auto-play: {heroAutoPlay ? `${heroAutoPlaySpeed}.0s` : "Off"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSlide}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "20px",
                        border: "none",
                        backgroundColor: "#2563eb",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        cursor: slides.length >= 5 ? "not-allowed" : "pointer",
                        opacity: slides.length >= 5 ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)"
                      }}
                    >
                      <span style={{ fontSize: "0.95rem", lineHeight: 1, fontWeight: 800 }}>+</span>
                      <span>Add Slide</span>
                    </button>
                  </div>
                </div>

                {/* Slides Cards Horizontal Row */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "14px",
                  overflowX: "auto",
                  paddingBottom: "10px",
                  paddingTop: "12px",
                  paddingLeft: "4px",
                  paddingRight: "10px"
                }}>
                  {slides.map((slide, index) => {
                    const isActive = index === activeSlideIndex;
                    const isDragged = index === draggedSlideIndex;
                    const showLeftLine = dropInsertIndex === index && draggedSlideIndex !== null;

                    // Compute live real-time display properties for PowerPoint thumbnail sync
                    const displaySlide = isActive ? {
                      ...slide,
                      titleText: currentTitleText,
                      showTitle: currentShowTitle,
                      titleFontType: currentTitleFontType,
                      titleFontSize: currentTitleFontSize,
                      titleFontColor: currentTitleFontColor,
                      titleFontWeight: currentTitleFontWeight,
                      titleFontAlignment: currentTitleFontAlignment,

                      manifestoText: currentManifestoText,
                      showManifesto: currentShowManifesto,
                      manifestoFontType: currentManifestoFontType,
                      manifestoFontSize: currentManifestoFontSize,
                      manifestoFontColor: currentManifestoFontColor,
                      manifestoFontWeight: currentManifestoFontWeight,
                      manifestoFontAlignment: currentManifestoFontAlignment,

                      buttonText: currentButtonText,
                      buttonStyle: (selectedElement === "button" && hoveredButtonStyle) ? hoveredButtonStyle : currentButtonStyle,
                      buttonSize: currentButtonSize,
                      buttonColor: currentButtonColor,
                      buttonTextColor: currentButtonTextColor,
                      showButton: currentShowButton,

                      layoutTemplate: currentLayoutTemplate,
                      bgType,
                      bgColor,
                      bgImage,
                      bgVideo,

                      titleContainer: currentTitleContainer,
                      manifestoContainer: currentManifestoContainer,
                      buttonContainer: currentButtonContainer
                    } : slide;

                    return (
                      <React.Fragment key={slide.id || index}>
                        {/* Clean Solid Insertion Line (Left of card) */}
                        {showLeftLine && (
                          <div style={{
                            width: "3px",
                            minWidth: "3px",
                            height: "76px",
                            backgroundColor: "#ef4444",
                            borderRadius: "2px",
                            margin: "0 -2px",
                            zIndex: 60,
                            pointerEvents: "none"
                          }} />
                        )}

                        {/* Slide Card Container Unit */}
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "5px"
                        }}>
                          {/* Slide Number Label - Completely OUTSIDE the preview box */}
                          <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: isActive ? "#ea580c" : "#64748b",
                            letterSpacing: "0.02em",
                            paddingLeft: "2px"
                          }}>
                            Slide {index + 1}
                          </span>

                          {/* Shrunk Live Slide Micro-Canvas Preview Box */}
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => selectSlide(index)}
                            style={{
                              width: "132px",
                              minWidth: "132px",
                              height: "74px",
                              borderRadius: "8px",
                              backgroundColor: displaySlide.bgType === "color" ? (displaySlide.bgColor || "#121212") : "#121212",
                              backgroundImage: displaySlide.bgType === "image" && displaySlide.bgImage ? `url("${displaySlide.bgImage}")` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: isDragged
                                ? "2px dashed #94a3b8"
                                : isActive
                                  ? "2.5px solid #ea580c"
                                  : "1.5px solid #cbd5e1",
                              boxShadow: isActive
                                ? "0 0 0 1px #ea580c, 0 4px 14px rgba(234, 88, 12, 0.35)"
                                : "0 1px 3px rgba(0,0,0,0.12)",
                              opacity: isDragged ? 0.35 : 1,
                              cursor: "pointer",
                              userSelect: "none",
                              WebkitUserSelect: "none",
                              position: "relative",
                              overflow: "visible",
                              transition: "all 0.15s ease"
                            }}
                          >
                            {/* X Delete Button - Half in / Half out on top right corner border line */}
                            <button
                              type="button"
                              title="Delete Slide"
                              onClick={(e) => handleRemoveSlide(e, index)}
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                width: "19px",
                                height: "19px",
                                borderRadius: "50%",
                                backgroundColor: "#ef4444",
                                color: "#ffffff",
                                border: "2px solid #ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.65rem",
                                fontWeight: 900,
                                cursor: "pointer",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
                                zIndex: 50,
                                lineHeight: 1
                              }}
                            >
                              ✕
                            </button>

                            {/* Inner Shrunk Live Preview Content Viewport */}
                            <div style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "6px",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative"
                            }}>
                              {displaySlide.bgType === "video" && displaySlide.bgVideo && (
                                <video src={displaySlide.bgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                              )}
                              {displaySlide.bgType !== "color" && (
                                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />
                              )}

                              <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "1280px",
                                height: "720px",
                                transform: "scale(0.103125)",
                                transformOrigin: "top left",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent:
                                  (displaySlide.layoutTemplate || "center") === "top-left" || (displaySlide.layoutTemplate || "center") === "right-top" || (displaySlide.layoutTemplate || "center") === "top-center" ? "flex-start" :
                                    (displaySlide.layoutTemplate || "center") === "bottom-left" || (displaySlide.layoutTemplate || "center") === "right-bottom" || (displaySlide.layoutTemplate || "center") === "bottom-center" ? "flex-end" : "center",
                                alignItems:
                                  (displaySlide.layoutTemplate || "center") === "center" || (displaySlide.layoutTemplate || "center").endsWith("center") ? "center" :
                                    (displaySlide.layoutTemplate || "center").startsWith("right") ? "flex-end" : "flex-start",
                                padding: "80px 5%",
                                textAlign:
                                  (displaySlide.layoutTemplate || "center") === "center" || (displaySlide.layoutTemplate || "center").endsWith("center") ? "center" :
                                    (displaySlide.layoutTemplate || "center").startsWith("right") ? "right" : "left",
                                pointerEvents: "none",
                                userSelect: "none",
                                zIndex: 2
                              }}>
                                {displaySlide.showTitle !== false && (
                                  <div style={{
                                    padding: `${displaySlide.titleContainer?.padding ?? 12}px`,
                                    borderRadius: "8px",
                                    backgroundColor: displaySlide.titleContainer?.bgColor || "transparent",
                                    width: displaySlide.titleContainer?.width ? `${displaySlide.titleContainer.width}px` : "auto",
                                    height: displaySlide.titleContainer?.height ? `${displaySlide.titleContainer.height}px` : "auto",
                                    transform: displaySlide.titleContainer ? `translate(${displaySlide.titleContainer.offsetX || 0}px, ${displaySlide.titleContainer.offsetY || 0}px)` : "none",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                  }}>
                                    <h1 style={{
                                      fontFamily: `"${displaySlide.titleFontType || "Outfit"}", sans-serif`,
                                      color: displaySlide.titleFontColor || "#ffffff",
                                      fontSize: displaySlide.titleFontSize || "4.5rem",
                                      fontWeight: Number(displaySlide.titleFontWeight) || 700,
                                      textAlign: (displaySlide.titleFontAlignment as any) || "center",
                                      margin: 0,
                                      lineHeight: "1.1"
                                    }}>
                                      {displaySlide.titleText || "SLIDE TITLE"}
                                    </h1>
                                  </div>
                                )}
                                {displaySlide.showManifesto !== false && (
                                  <div style={{
                                    padding: `${displaySlide.manifestoContainer?.padding ?? 10}px`,
                                    borderRadius: "8px",
                                    backgroundColor: displaySlide.manifestoContainer?.bgColor || "transparent",
                                    width: displaySlide.manifestoContainer?.width ? `${displaySlide.manifestoContainer.width}px` : "auto",
                                    height: displaySlide.manifestoContainer?.height ? `${displaySlide.manifestoContainer.height}px` : "auto",
                                    transform: displaySlide.manifestoContainer ? `translate(${displaySlide.manifestoContainer.offsetX || 0}px, ${displaySlide.manifestoContainer.offsetY || 0}px)` : "none",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                  }}>
                                    <p style={{
                                      fontFamily: `"${displaySlide.manifestoFontType || "Outfit"}", sans-serif`,
                                      color: displaySlide.manifestoFontColor || "#ffffff",
                                      fontSize: displaySlide.manifestoFontSize || "1.1rem",
                                      fontWeight: Number(displaySlide.manifestoFontWeight) || 500,
                                      textAlign: (displaySlide.manifestoFontAlignment as any) || "center",
                                      margin: "14px 0 0 0",
                                      textTransform: "uppercase"
                                    }}>
                                      {displaySlide.manifestoText || ""}
                                    </p>
                                  </div>
                                )}
                                {displaySlide.showButton !== false && (
                                  <div style={{
                                    width: displaySlide.buttonContainer?.width ? `${displaySlide.buttonContainer.width}px` : "auto",
                                    height: displaySlide.buttonContainer?.height ? `${displaySlide.buttonContainer.height}px` : "auto",
                                    transform: displaySlide.buttonContainer ? `translate(${displaySlide.buttonContainer.offsetX || 0}px, ${displaySlide.buttonContainer.offsetY || 0}px)` : "none",
                                    alignSelf:
                                      (displaySlide.layoutTemplate || "center") === "center" || (displaySlide.layoutTemplate || "center").endsWith("center") ? "center" :
                                        (displaySlide.layoutTemplate || "center").startsWith("right") ? "flex-end" : "flex-start"
                                  }}>
                                    <div style={{
                                      width: "100%",
                                      height: "100%",
                                      marginTop: "20px",
                                      ...getButtonStyleStyles(
                                        displaySlide.buttonStyle || "solid",
                                        displaySlide.buttonColor || "#ffffff",
                                        displaySlide.buttonTextColor || "#000000",
                                        displaySlide.buttonSize,
                                        Boolean(displaySlide.buttonContainer?.width)
                                      )
                                    }}>
                                      {displaySlide.buttonText || "SHOP NOW"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* Clean Solid Insertion Line (Right of last card) */}
                  {dropInsertIndex === slides.length && draggedSlideIndex !== null && (
                    <div style={{
                      width: "3px",
                      minWidth: "3px",
                      height: "76px",
                      backgroundColor: "#ef4444",
                      borderRadius: "2px",
                      margin: "0 -2px",
                      zIndex: 60,
                      pointerEvents: "none"
                    }} />
                  )}

                  {/* Add Slide Dashed Card */}
                  <div
                    onClick={handleAddSlide}
                    style={{
                      width: "90px",
                      minWidth: "90px",
                      height: "74px",
                      marginTop: "22px",
                      borderRadius: "8px",
                      border: "2px dashed #cbd5e1",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#475569",
                      gap: "2px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "1.0rem", fontWeight: 700, color: "#2563eb" }}>+</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569" }}>Add Slide</span>
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
            padding: "14px 28px",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#fafafa"
          }}>
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryActionBtn}
              style={{ padding: "8px 20px", fontSize: "0.85rem", fontWeight: 600 }}
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!hasModalChanges}
              className={styles.primaryActionBtn}
              style={{
                padding: "8px 24px",
                fontSize: "0.85rem",
                fontWeight: 700,
                opacity: !hasModalChanges ? 0.5 : 1,
                cursor: !hasModalChanges ? "not-allowed" : "pointer",
                backgroundColor: !hasModalChanges ? "#9ca3af" : undefined
              }}
            >
              Apply Customization
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
