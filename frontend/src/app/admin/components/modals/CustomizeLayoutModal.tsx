import React, { useState, useEffect } from 'react';
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

  // Media File Upload (Image or Video)
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mediaKind: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

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
                          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.75 1.7-1.67 0-.42-.16-.81-.43-1.12-.27-.31-.43-.72-.43-1.21 0-.92.75-1.67 1.67-1.67H17c2.76 0 5-2.24 5-5 0-4.42-4.48-8-10-8z"/>
                        </svg>
                      )}
                      {type === "image" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      )}
                      {type === "video" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
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
                      onClick={() => setCurrentLayoutTemplate(t.id)}
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                      {/* Font Family & Size */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Font Family</label>
                          <select
                            value={selectedElement === "title" ? currentTitleFontType : currentManifestoFontType}
                            onChange={(e) => {
                              if (selectedElement === "title") setCurrentTitleFontType(e.target.value);
                              else setCurrentManifestoFontType(e.target.value);
                            }}
                            style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", color: "#000" }}
                          >
                            {fontCategories.flatMap(cat => cat.fonts).map(font => (
                              <option key={font.name} value={font.name}>{font.name}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Font Size</label>
                          <input
                            type="text"
                            value={selectedElement === "title" ? currentTitleFontSize : currentManifestoFontSize}
                            onChange={(e) => {
                              if (selectedElement === "title") setCurrentTitleFontSize(e.target.value);
                              else setCurrentManifestoFontSize(e.target.value);
                            }}
                            placeholder="e.g. 4.5rem or 1.1rem"
                            style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8rem", color: "#000" }}
                          />
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
                                      <line x1="17" y1="10" x2="3" y2="10"/>
                                      <line x1="21" y1="6" x2="3" y2="6"/>
                                      <line x1="21" y1="14" x2="3" y2="14"/>
                                      <line x1="15" y1="18" x2="3" y2="18"/>
                                    </svg>
                                  )}
                                  {align === "center" && (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="10" x2="6" y2="10"/>
                                      <line x1="21" y1="6" x2="3" y2="6"/>
                                      <line x1="21" y1="14" x2="3" y2="14"/>
                                      <line x1="16" y1="18" x2="8" y2="18"/>
                                    </svg>
                                  )}
                                  {align === "right" && (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="21" y1="10" x2="7" y2="10"/>
                                      <line x1="21" y1="6" x2="3" y2="6"/>
                                      <line x1="21" y1="14" x2="3" y2="14"/>
                                      <line x1="21" y1="18" x2="9" y2="18"/>
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

                  {/* Button Styling Options */}
                  {selectedElement === "button" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
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
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxSizing: "border-box",
              position: "relative"
            }}>
              {/* Top Viewport Device Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "#475569", letterSpacing: "0.08em" }}>
                    LIVE PREVIEW CANVAS
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
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    Desktop
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
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                    Mobile
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
                minHeight: "340px"
              }}>
                {/* Scaled Canvas Frame */}
                <div
                  onClick={() => setSelectedElement(null)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: previewDevice === 'desktop' ? "1280px" : "393px",
                    height: previewDevice === 'desktop' ? "720px" : "852px",
                    transform: previewDevice === 'desktop' ? "translate(-50%, -50%) scale(0.48)" : "translate(-50%, -50%) scale(0.44)",
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
                    {/* 1. Hero Title Element */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement("title");
                      }}
                      style={{
                        cursor: "pointer",
                        border: selectedElement === "title" ? "2px dashed #3b82f6" : "1px dashed transparent",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: selectedElement === "title" ? "rgba(59, 130, 246, 0.15)" : "transparent",
                        position: "relative"
                      }}
                    >
                      {selectedElement === "title" && (
                        <div style={{ position: "absolute", top: "-22px", left: "0", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                          ACTIVE TITLE ({previewDevice})
                        </div>
                      )}
                      {currentShowTitle ? (
                        <h1 style={{
                          fontFamily: `"${currentTitleFontType}", sans-serif`,
                          color: currentTitleFontColor,
                          fontSize: currentTitleFontSize,
                          fontWeight: Number(currentTitleFontWeight) || 700,
                          textAlign: (currentTitleFontAlignment as any) || "center",
                          margin: 0,
                          lineHeight: "1.1",
                          wordBreak: "break-word"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement("manifesto");
                      }}
                      style={{
                        cursor: "pointer",
                        border: selectedElement === "manifesto" ? "2px dashed #3b82f6" : "1px dashed transparent",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: selectedElement === "manifesto" ? "rgba(59, 130, 246, 0.15)" : "transparent",
                        position: "relative"
                      }}
                    >
                      {selectedElement === "manifesto" && (
                        <div style={{ position: "absolute", top: "-22px", left: "0", fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                          ACTIVE SUBTITLE ({previewDevice})
                        </div>
                      )}
                      {currentShowManifesto ? (
                        <p style={{
                          fontFamily: `"${currentManifestoFontType}", sans-serif`,
                          color: currentManifestoFontColor,
                          fontSize: currentManifestoFontSize,
                          fontWeight: Number(currentManifestoFontWeight) || 500,
                          textAlign: (currentManifestoFontAlignment as any) || "center",
                          margin: 0,
                          lineHeight: "1.6",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement("button");
                      }}
                      style={{
                        cursor: "pointer",
                        border: selectedElement === "button" ? "2px dashed #3b82f6" : "1px dashed transparent",
                        padding: "8px",
                        borderRadius: "8px",
                        backgroundColor: selectedElement === "button" ? "rgba(59, 130, 246, 0.15)" : "transparent",
                        display: "inline-block",
                        alignSelf:
                          currentLayoutTemplate === "center" || currentLayoutTemplate.endsWith("center") ? "center" :
                            currentLayoutTemplate.startsWith("right") ? "flex-end" : "flex-start"
                      }}
                    >
                      {currentShowButton ? (
                        <div style={{
                          display: "inline-block",
                          padding: "14px 36px",
                          fontSize: "0.85rem",
                          backgroundColor: currentButtonStyle === "solid" ? (currentButtonColor || primaryColor || "#000") : "transparent",
                          color: currentButtonStyle === "solid" ? (currentButtonTextColor || "#ffffff") : (currentButtonColor || "#ffffff"),
                          border: `2px solid ${currentButtonColor || primaryColor || "#ffffff"}`,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em"
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
                      HERO CAROUSEL SLIDES ({slides.length})
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
                          width: "215px",
                          minWidth: "215px",
                          height: "105px",
                          borderRadius: "10px",
                          backgroundColor: isActive ? "#0f172a" : "#334155",
                          border: isActive ? "2px solid #2563eb" : "1px solid #475569",
                          boxShadow: isActive ? "0 0 16px rgba(37, 99, 235, 0.45)" : "none",
                          padding: "10px 12px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          position: "relative",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {/* Top Header inside card */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ color: "#64748b", cursor: "grab", fontSize: "0.85rem", fontWeight: 700 }}>::</span>
                            <span style={{
                              fontSize: "0.62rem",
                              fontWeight: 800,
                              padding: "2px 7px",
                              borderRadius: "4px",
                              backgroundColor: isActive ? "#2563eb" : "#475569",
                              color: "#ffffff",
                              letterSpacing: "0.05em"
                            }}>
                              SLIDE {index + 1}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {index > 0 && (
                              <button
                                type="button"
                                title="Move Left"
                                onClick={(e) => moveSlide(e, index, 'left')}
                                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0 2px", fontSize: "0.75rem" }}
                              >
                                ◀
                              </button>
                            )}
                            {index < slides.length - 1 && (
                              <button
                                type="button"
                                title="Move Right"
                                onClick={(e) => moveSlide(e, index, 'right')}
                                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0 2px", fontSize: "0.75rem" }}
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
                                color: "#64748b",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                padding: "0 2px"
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Title & Subtitle Preview */}
                        <div style={{ padding: "0 2px" }}>
                          <div style={{
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            color: isActive ? "#ffffff" : (index === 1 ? "#f59e0b" : "#ffffff"),
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {slide.titleText || `SLIDE ${index + 1}`}
                          </div>
                          <div style={{
                            fontSize: "0.6rem",
                            color: "#94a3b8",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "2px"
                          }}>
                            {slide.manifestoText || "No description provided"}
                          </div>
                        </div>

                        {/* Bottom Indicator Pill Line */}
                        <div style={{
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: isActive ? "#2563eb" : "#64748b",
                          width: "36px",
                          margin: "0 auto"
                        }} />
                      </div>
                    );
                  })}

                  {/* Add Slide Dashed Card */}
                  <div
                    onClick={handleAddSlide}
                    style={{
                      width: "150px",
                      minWidth: "150px",
                      height: "105px",
                      borderRadius: "10px",
                      border: "2px dashed #cbd5e1",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#475569",
                      gap: "4px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#475569" }}>+</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>+ Add Slide</span>
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
