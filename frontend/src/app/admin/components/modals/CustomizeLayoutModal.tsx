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
  const initialSlides: HeroSlideItem[] = (initialConfig.heroSlides && initialConfig.heroSlides.length > 0)
    ? initialConfig.heroSlides
    : [
      {
        id: "slide_1",
        titleText: initialConfig.titleText || "WELCOME TO OUR STORE",
        titleFontType: initialConfig.titleFontType || "Outfit",
        titleFontColor: initialConfig.titleFontColor || "#ffffff",
        titleFontSize: initialConfig.titleFontSize || "4.5rem",
        titleFontAlignment: initialConfig.titleFontAlignment || "center",
        titleFontWeight: initialConfig.titleFontWeight || "700",
        showTitle: initialConfig.showTitle !== undefined ? initialConfig.showTitle : true,

        manifestoText: initialConfig.manifestoText || "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION.",
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
      },
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
        bgVideo: ""
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
        bgVideo: ""
      }
    ];

  const [slides, setSlides] = useState<HeroSlideItem[]>(initialSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [heroAutoPlay, setHeroAutoPlay] = useState<boolean>(initialConfig.heroAutoPlay ?? true);
  const [heroAutoPlaySpeed, setHeroAutoPlaySpeed] = useState<number>(initialConfig.heroAutoPlaySpeed ?? 5);
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);

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
    layoutTemplate, bgType, bgColor, bgImage, bgVideo,
    mobileLayoutTemplate, mobileTitleText, mobileTitleFontType, mobileTitleFontColor, mobileTitleFontSize, mobileTitleFontAlignment, mobileTitleFontWeight, mobileShowTitle,
    mobileManifestoText, mobileManifestoFontType, mobileManifestoFontColor, mobileManifestoFontSize, mobileManifestoFontAlignment, mobileManifestoFontWeight, mobileShowManifesto,
    mobileButtonText, mobileButtonStyle, mobileButtonSize, mobileButtonColor, mobileButtonTextColor, mobileShowButton
  ]);

  const selectSlide = (index: number) => {
    if (index === activeSlideIndex) return;
    updateCurrentSlideStateInList();
    setActiveSlideIndex(index);
    if (slides[index]) {
      loadSlideToState(slides[index]);
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
      bgVideo: ""
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
    setDraggedSlideIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedSlideIndex === null || draggedSlideIndex === dropIndex) return;
    updateCurrentSlideStateInList();
    const reordered = [...slides];
    const [moved] = reordered.splice(draggedSlideIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setSlides(reordered);
    setActiveSlideIndex(dropIndex);
    loadSlideToState(reordered[dropIndex]);
    setDraggedSlideIndex(null);
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

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentage);
      }
    };
    xhr.onload = () => {
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
    };
    xhr.onerror = () => {
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

  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontDropdownCoords, setFontDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontType, setHoveredFontType] = useState<string | null>(null);

  const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState(false);
  const [fontSizeDropdownCoords, setFontSizeDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontSize, setHoveredFontSize] = useState<string | null>(null);

  const [isFontWeightDropdownOpen, setIsFontWeightDropdownOpen] = useState(false);
  const [fontWeightDropdownCoords, setFontWeightDropdownCoords] = useState<{ top: number, left: number, width: number } | null>(null);
  const [hoveredFontWeight, setHoveredFontWeight] = useState<string | null>(null);

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
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Paste Image URL (https://...)"
                      value={bgImage || ""}
                      onChange={(e) => setBgImage(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", color: "#000", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <label style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        backgroundColor: "#3b82f6",
                        color: "#ffffff",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaFileUpload(e, "image")}
                          style={{ display: "none" }}
                        />
                      </label>
                      {uploadingMedia && <span style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 600 }}>Uploading {uploadProgress}%...</span>}
                    </div>
                  </div>
                )}

                {bgType === "video" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Paste Video URL (.mp4, .webm)"
                      value={bgVideo || ""}
                      onChange={(e) => setBgVideo(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", color: "#000", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <label style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        backgroundColor: "#8b5cf6",
                        color: "#ffffff",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        Upload Video MP4
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleMediaFileUpload(e, "video")}
                          style={{ display: "none" }}
                        />
                      </label>
                      {uploadingMedia && <span style={{ fontSize: "0.75rem", color: "#8b5cf6", fontWeight: 600 }}>Uploading {uploadProgress}%...</span>}
                    </div>
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
                        setTitleContainer(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
                        setManifestoContainer(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
                        setButtonContainer(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
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

                      {/* Button Redirect Page Dropdown */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Button Redirect Target</label>
                        <select
                          value={buttonRedirectUrl}
                          onChange={(e) => setButtonRedirectUrl(e.target.value)}
                          style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem", color: "#000", fontWeight: 600, backgroundColor: "#ffffff" }}
                        >
                          <option value="/shop">All Products Catalog (/shop)</option>
                          <option value="/category/new-arrivals">New Arrivals (/category/new-arrivals)</option>
                          <option value="/category/best-sellers">Best Sellers (/category/best-sellers)</option>
                          <option value="/category/offers">Special Offers & Sale (/category/offers)</option>
                          <option value="/about">About Us (/about)</option>
                          <option value="/contact">Contact Support (/contact)</option>
                          <option value="/faqs">FAQs (/faqs)</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Button Style</label>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {["solid", "outline", "minimal"].map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setCurrentButtonStyle(style)}
                              style={{
                                flex: 1,
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: currentButtonStyle === style ? "#111827" : "#ffffff",
                                color: currentButtonStyle === style ? "#ffffff" : "#374151",
                                fontSize: "0.78rem",
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
                <div style={{ padding: "20px 10px", textAlign: "center", color: "#64748b", border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    Click any title, subtitle or button in the live preview canvas to customize it.
                  </span>
                </div>
              )}

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
                    backgroundColor: bgType === "color" ? (bgColor || "#121212") : "#121212",
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
                    padding: previewDevice === 'desktop' ? "80px 5%" : "60px 24px",
                    textAlign:
                      currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                        currentLayoutTemplate.startsWith("right") ? "right" : "left",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    borderRadius: previewDevice === 'desktop' ? "12px" : "44px",
                    border: previewDevice === 'desktop' ? "1px solid #cbd5e1" : "12px solid #1c1c1e"
                  }}
                >
                  {bgType === "video" && bgVideo && (
                    <video src={bgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                  )}
                  {bgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

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

                  {/* Right Carousel Next Arrow */}
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

                  <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
                    {/* Helper component or inline rendering for selection & interactive handles */}
                    {/* 1. Hero Title Element */}
                    <div
                      ref={titleRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement("title");
                      }}
                      onMouseDown={(e) => {
                        setSelectedElement("title");
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const initialOffsetX = titleContainer.offsetX;
                        const initialOffsetY = titleContainer.offsetY;

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

                          setTitleContainer((prev) => ({
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
                        padding: `${titleContainer.padding ?? 12}px`,
                        borderRadius: "8px",
                        backgroundColor: titleContainer.bgColor || (selectedElement === "title" ? "rgba(59, 130, 246, 0.12)" : "transparent"),
                        width: titleContainer.width ? `${titleContainer.width}px` : "auto",
                        height: titleContainer.height ? `${titleContainer.height}px` : "auto",
                        transform: `translate(${titleContainer.offsetX}px, ${titleContainer.offsetY}px)`,
                        position: "relative",
                        userSelect: "none",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                      }}
                    >
                      {selectedElement === "title" && (
                        <>
                          <div style={{ position: "absolute", top: "-24px", left: "0", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>
                            TITLE BOX (DRAG DOTS TO RESIZE BOX, DRAG BOX TO REPOSITION)
                          </div>
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
                                const initialWidth = titleContainer.width || e.currentTarget.parentElement?.clientWidth || 400;
                                const initialHeight = titleContainer.height || e.currentTarget.parentElement?.clientHeight || 80;

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

                                  setTitleContainer((prev) => ({
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
                        <span style={{ fontSize: "1rem", color: "#94a3b8", fontStyle: "italic" }}>
                          [Title Element Hidden]
                        </span>
                      )}
                    </div>

                    {/* 2. Hero Manifesto Subtitle */}
                    <div
                      ref={manifestoRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement("manifesto");
                      }}
                      onMouseDown={(e) => {
                        setSelectedElement("manifesto");
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const initialOffsetX = manifestoContainer.offsetX;
                        const initialOffsetY = manifestoContainer.offsetY;

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

                          setManifestoContainer((prev) => ({
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
                        padding: `${manifestoContainer.padding ?? 10}px`,
                        borderRadius: "8px",
                        backgroundColor: manifestoContainer.bgColor || (selectedElement === "manifesto" ? "rgba(59, 130, 246, 0.12)" : "transparent"),
                        width: manifestoContainer.width ? `${manifestoContainer.width}px` : "auto",
                        height: manifestoContainer.height ? `${manifestoContainer.height}px` : "auto",
                        transform: `translate(${manifestoContainer.offsetX}px, ${manifestoContainer.offsetY}px)`,
                        position: "relative",
                        userSelect: "none",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                      }}
                    >
                      {selectedElement === "manifesto" && (
                        <>
                          <div style={{ position: "absolute", top: "-24px", left: "0", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>
                            SUBTITLE BOX (DRAG DOTS TO RESIZE BOX, DRAG BOX TO REPOSITION)
                          </div>
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
                                const initialWidth = manifestoContainer.width || e.currentTarget.parentElement?.clientWidth || 350;
                                const initialHeight = manifestoContainer.height || e.currentTarget.parentElement?.clientHeight || 60;

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

                                  setManifestoContainer((prev) => ({
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
                        <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontStyle: "italic" }}>
                          [Subtitle Element Hidden]
                        </span>
                      )}
                    </div>

                    {/* 3. Hero Button */}
                    <div
                      ref={buttonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement("button");
                      }}
                      onMouseDown={(e) => {
                        setSelectedElement("button");
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const initialOffsetX = buttonContainer.offsetX;
                        const initialOffsetY = buttonContainer.offsetY;

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

                          setButtonContainer((prev) => ({
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
                        width: buttonContainer.width ? `${buttonContainer.width}px` : "auto",
                        height: buttonContainer.height ? `${buttonContainer.height}px` : "auto",
                        transform: `translate(${buttonContainer.offsetX}px, ${buttonContainer.offsetY}px)`,
                        alignSelf:
                          currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                            currentLayoutTemplate.startsWith("right") ? "flex-end" : "flex-start"
                      }}
                    >
                      {selectedElement === "button" && (
                        <>
                          <div style={{ position: "absolute", top: "-24px", left: "0", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>
                            BUTTON BOX (DRAG DOTS TO RESIZE BOX, DRAG BOX TO REPOSITION)
                          </div>
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
                                const initialWidth = buttonContainer.width || e.currentTarget.parentElement?.clientWidth || 180;
                                const initialHeight = buttonContainer.height || e.currentTarget.parentElement?.clientHeight || 50;

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

                                  setButtonContainer((prev) => ({
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
                      {currentShowButton ? (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          padding: buttonContainer.width ? "0 12px" : (currentButtonSize === "sm" ? "8px 20px" : currentButtonSize === "lg" ? "18px 48px" : "14px 36px"),
                          fontSize: currentButtonSize === "sm" ? "0.75rem" : currentButtonSize === "lg" ? "1.0rem" : "0.85rem",
                          backgroundColor: currentButtonStyle === "solid" ? (currentButtonColor || primaryColor || "#000") : "transparent",
                          color: currentButtonStyle === "solid" ? (currentButtonTextColor || "#ffffff") : (currentButtonColor || "#ffffff"),
                          border: `2px solid ${currentButtonColor || primaryColor || "#ffffff"}`,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          boxSizing: "border-box"
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

                  {/* Canvas Pagination Dots */}
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

                </div>
              </div>


              {/* -------------------------------------------------------------------------- */}
              {/* -------------------------------------------------------------------------- */}
              {/* HERO CAROUSEL SLIDES MANAGEMENT BAR (as shown in user screenshot) */}
              {/* -------------------------------------------------------------------------- */}
              <div style={{
                marginTop: "16px",
                padding: "16px 20px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      padding: "6px",
                      backgroundColor: "#eff6ff",
                      borderRadius: "6px",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>

                    <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: "#0f172a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      HERO CAROUSEL SLIDES ({slides.length}/5 MAX)
                    </h4>

                    <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>::</span> Drag handle to reorder • Click card to preview & customize
                    </span>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                        border: heroAutoPlay ? "1px solid #3b82f6" : "1px solid #cbd5e1",
                        backgroundColor: heroAutoPlay ? "#eff6ff" : "#ffffff",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: heroAutoPlay ? "#1d4ed8" : "#94a3b8",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <span>⏱</span> Auto-play: {heroAutoPlay ? `${heroAutoPlaySpeed}.0s` : "Off"}
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSlide}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: "2px solid #2563eb",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        lineHeight: 1
                      }}>+</span>
                      Add Slide
                    </button>
                  </div>
                </div>

                {/* Slides Cards Horizontal Row */}
                <div style={{
                  display: "flex",
                  gap: "14px",
                  overflowX: "auto",
                  paddingBottom: "4px"
                }}>
                  {slides.map((slide, index) => {
                    const isActive = index === activeSlideIndex;
                    return (
                      <div
                        key={slide.id || index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => selectSlide(index)}
                        style={{
                          width: "160px",
                          minWidth: "160px",
                          height: "78px",
                          borderRadius: "8px",
                          backgroundColor: isActive ? "#0f172a" : "#334155",
                          border: isActive ? "2px solid #2563eb" : "1px solid #475569",
                          boxShadow: isActive ? "0 0 12px rgba(37, 99, 235, 0.45)" : "none",
                          padding: "6px 8px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          position: "relative",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {/* Shrunk Live Slide Micro-Canvas Preview */}
                        <div style={{
                          position: "relative",
                          width: "100%",
                          height: "64px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          backgroundColor: slide.bgType === "color" ? (slide.bgColor || "#121212") : "#121212",
                          backgroundImage: slide.bgType === "image" && slide.bgImage ? `url("${slide.bgImage}")` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "4px"
                        }}>
                          {/* Mini Canvas Shrunk Viewport */}
                          <div style={{
                            width: "1280px",
                            height: "720px",
                            transform: "scale(0.12)",
                            transformOrigin: "center center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent:
                              (slide.layoutTemplate || "center") === "top-left" || (slide.layoutTemplate || "center") === "right-top" || (slide.layoutTemplate || "center") === "top-center" ? "flex-start" :
                                (slide.layoutTemplate || "center") === "bottom-left" || (slide.layoutTemplate || "center") === "right-bottom" || (slide.layoutTemplate || "center") === "bottom-center" ? "flex-end" : "center",
                            alignItems:
                              (slide.layoutTemplate || "center") === "center" || (slide.layoutTemplate || "center").endsWith("center") ? "center" :
                                (slide.layoutTemplate || "center").startsWith("right") ? "flex-end" : "flex-start",
                            padding: "60px 5%",
                            textAlign:
                              (slide.layoutTemplate || "center") === "center" || (slide.layoutTemplate || "center").endsWith("center") ? "center" :
                                (slide.layoutTemplate || "center").startsWith("right") ? "right" : "left",
                            pointerEvents: "none",
                            userSelect: "none"
                          }}>
                            {slide.showTitle !== false && (
                              <h1 style={{
                                fontFamily: `"${slide.titleFontType || "Outfit"}", sans-serif`,
                                color: slide.titleFontColor || "#ffffff",
                                fontSize: slide.titleFontSize || "4.5rem",
                                fontWeight: Number(slide.titleFontWeight) || 700,
                                textAlign: (slide.titleFontAlignment as any) || "center",
                                margin: 0,
                                lineHeight: "1.1"
                              }}>
                                {slide.titleText || "SLIDE TITLE"}
                              </h1>
                            )}
                            {slide.showManifesto !== false && (
                              <p style={{
                                fontFamily: `"${slide.manifestoFontType || "Outfit"}", sans-serif`,
                                color: slide.manifestoFontColor || "#ffffff",
                                fontSize: slide.manifestoFontSize || "1.1rem",
                                fontWeight: Number(slide.manifestoFontWeight) || 500,
                                textAlign: (slide.manifestoFontAlignment as any) || "center",
                                margin: "14px 0 0 0",
                                textTransform: "uppercase"
                              }}>
                                {slide.manifestoText || ""}
                              </p>
                            )}
                            {slide.showButton !== false && (
                              <div style={{
                                marginTop: "20px",
                                padding: slide.buttonSize === "sm" ? "10px 24px" : slide.buttonSize === "lg" ? "18px 48px" : "14px 36px",
                                fontSize: slide.buttonSize === "sm" ? "0.85rem" : slide.buttonSize === "lg" ? "1.2rem" : "1.0rem",
                                backgroundColor: slide.buttonStyle === "solid" ? (slide.buttonColor || "#ffffff") : "transparent",
                                color: slide.buttonStyle === "solid" ? (slide.buttonTextColor || "#000000") : (slide.buttonColor || "#ffffff"),
                                border: `2px solid ${slide.buttonColor || "#ffffff"}`,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                display: "inline-block"
                              }}>
                                {slide.buttonText || "SHOP NOW"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Top Header Floating Badge inside card */}
                        <div style={{ position: "absolute", top: "8px", left: "8px", right: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ color: "#ffffff", cursor: "grab", fontSize: "0.75rem", fontWeight: 800, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>::</span>
                            <span style={{
                              fontSize: "0.55rem",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: isActive ? "#2563eb" : "rgba(15, 23, 42, 0.85)",
                              color: "#ffffff",
                              letterSpacing: "0.04em",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                            }}>
                              SLIDE {index + 1}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "3px", backgroundColor: "rgba(15, 23, 42, 0.75)", padding: "1px 4px", borderRadius: "4px" }}>
                            {index > 0 && (
                              <button
                                type="button"
                                title="Move Left"
                                onClick={(e) => moveSlide(e, index, 'left')}
                                style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "0 2px", fontSize: "0.65rem" }}
                              >
                                ◀
                              </button>
                            )}
                            {index < slides.length - 1 && (
                              <button
                                type="button"
                                title="Move Right"
                                onClick={(e) => moveSlide(e, index, 'right')}
                                style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "0 2px", fontSize: "0.65rem" }}
                              >
                                ▶
                              </button>
                            )}
                            <button
                              type="button"
                              title="Delete Slide"
                              onClick={(e) => handleRemoveSlide(e, index)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#f87171",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                padding: "0 2px"
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Slide Dashed Card */}
                  <div
                    onClick={handleAddSlide}
                    style={{
                      width: "110px",
                      minWidth: "110px",
                      height: "78px",
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
                    <span style={{ fontSize: "1.0rem", fontWeight: 700, color: "#475569" }}>+</span>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#475569" }}>Add Slide</span>
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
              className={styles.primaryActionBtn}
              style={{ padding: "8px 24px", fontSize: "0.85rem", fontWeight: 700 }}
            >
              Apply Customization
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
