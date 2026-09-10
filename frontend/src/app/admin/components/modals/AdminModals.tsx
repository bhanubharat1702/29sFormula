import React, { useState, useEffect } from "react";
import styles from "../../page.module.css";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function AdminModals(props: any) {
  const {
    allCategories,
    assignLoading,
    availableProducts,
    btnColor,
    category,
    categoryModalError,
    categoryModalLoading,
    cats,
    customAlert,
    data,
    deleteCategoryLoading,
    deleteCategoryTarget,
    deleteCustomerTargetId,
    deleteReviewTarget,
    deleteTargetId,
    description,
    additionalInformation,
    editReviewTarget,
    error,
    setError,
    executeReturnStatusUpdate,
    existingProductIdsToAssign,
    file,
    files,
    handleAddCategorySubmit,
    handleAssignExistingToCategory,
    handleDelete,
    handleDeleteAdminReviewConfirm,
    handleDeleteCategoryConfirm,
    handleDeleteCustomer,
    handleEditReviewSubmit,
    handleMultipleFilesUpload,
    handleRemoveImage,
    handleEditCategorySubmit,
    handleResetToDefaults,
    handleSubmit,
    handleUpdateOrderStatus,
    handleUpdateRefundStatus,
    heroBackup,
    heroBgColor,
    heroBgImage,
    heroBgType,
    heroBgVideo,
    heroButtonColor,
    heroButtonSize,
    heroButtonStyle,
    heroButtonText,
    heroButtonTextColor,
    heroManifesto,
    heroManifestoFontAlignment,
    heroManifestoFontColor,
    heroManifestoFontSize,
    heroManifestoFontType,
    heroManifestoFontWeight,
    heroTemplate,
    heroTitle,
    heroTitleFontAlignment,
    heroTitleFontColor,
    heroTitleFontSize,
    heroTitleFontType,
    heroTitleFontWeight,
    imageFront,
    images,
    isChecked,
    isCover,
    isDeletingCustomer,
    isDeletingProduct,
    isDeletingReview,
    isEditing,
    isEditingReview,
    isOutline,
    isRenamingCategory,
    isSelected,
    isSolid,
    link,
    makingPrice,
    name,
    newCategoryName,
    next,
    openCategoryIndex,
    options,
    orders,
    price,
    primaryColor,
    products,
    quantity,
    renameCategoryNewName,
    renameCategoryTarget,
    resetForm,
    returnStatusAction,
    editCategorySelectedProductIds,
    setEditCategorySelectedProductIds,
    returnStatusModalOpen,
    returnStatusNotes,
    saveSettingsSilent,
    selectedCategoryView,
    selectedCustomer,
    selectedOrder,
    selectedProductIds,
    setCategory,
    setCustomAlert,
    setDeleteCategoryTarget,
    setDeleteCustomerTargetId,
    setDeleteReviewTarget,
    setDeleteTargetId,
    setDescription,
    setAdditionalInformation,
    setEditReviewTarget,
    setExistingProductIdsToAssign,
    setHeroButtonColor,
    setHeroButtonSize,
    setHeroButtonStyle,
    setHeroButtonText,
    setHeroButtonTextColor,
    setHeroManifesto,
    setHeroManifestoFontAlignment,
    setHeroManifestoFontColor,
    setHeroManifestoFontSize,
    setHeroManifestoFontType,
    setHeroManifestoFontWeight,
    setHeroTemplate,
    setHeroTitle,
    setHeroTitleFontAlignment,
    setHeroTitleFontColor,
    setHeroTitleFontSize,
    setHeroTitleFontType,
    setHeroTitleFontWeight,
    setImageFront,
    setIsDeletingProduct,
    setIsEditing,
    setName,
    setNewCategoryName,
    setOpenCategoryIndex,
    setOptions,
    setRenameCategoryNewName,
    setRenameCategoryTarget,
    setReturnStatusModalOpen,
    setReturnStatusNotes,
    setSelectedCustomer,
    setSelectedOrder,
    setSelectedProductIds,
    setShowAddCategoryModal,
    setShowAddExistingToCategoryModal,
    setShowCategoryAddOptionsModal,
    setShowCrudModal,
    setShowHeroButton,
    setShowHeroManifesto,
    setShowHeroTitle,
    setShowResetConfirmModal,
    showAddCategoryModal,
    showAddExistingToCategoryModal,
    showCategoryAddOptionsModal,
    showCrudModal,
    showHeroButton,
    showHeroManifesto,
    showHeroTitle,
    showResetConfirmModal,
    successMessage,
    updated,
    uploading,
    url,
    val,
  } = props;

  const [openMobileAccordion, setOpenMobileAccordion] = React.useState<"items" | "status" | "timeline" | "">("items");
  const [mobileCrudStep, setMobileCrudStep] = useState(1);
  const [visibleError, setVisibleError] = useState<string | null>(null);
  const [fadeOutError, setFadeOutError] = useState(false);

  useEffect(() => {
    if (error && showCrudModal && window.innerWidth <= 768) {
      const highlightElement = (el: HTMLElement | null) => {
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (el.tagName === 'INPUT') {
            (el as HTMLInputElement).focus({ preventScroll: true });
        }
        const originalBoxShadow = el.style.boxShadow;
        el.style.boxShadow = '0 0 0 2px #ef4444';
        setTimeout(() => el.style.boxShadow = originalBoxShadow, 2500);
      };

      if (error.includes('Name') || error.includes('Description') || error.includes('Additional Information')) {
        setMobileCrudStep(1);
        setTimeout(() => {
          const isQuillEmpty = (html: string) => !html || html.replace(/<[^>]*>?/gm, '').trim() === '';
          if (!name) {
            highlightElement(document.getElementById('mobile-name'));
          } else if (isQuillEmpty(description)) {
            highlightElement(document.getElementById('mobile-description'));
          } else if (isQuillEmpty(additionalInformation)) {
            highlightElement(document.getElementById('mobile-additional-info'));
          }
        }, 250);
      } else if (error.includes('variant') || error.includes('sizes') || error.includes('Quantity') || error.includes('Category') || error.includes('Price')) {
        setMobileCrudStep(2);
        setTimeout(() => {
          const variantInputs = document.querySelectorAll('#mobile-step-2 input');
          for (let i = 0; i < variantInputs.length; i++) {
            const input = variantInputs[i] as HTMLInputElement;
            if (!input.value && input.type !== 'checkbox' && input.type !== 'radio') {
              highlightElement(input);
              break;
            }
          }
        }, 250);
      } else if (error.includes('images') || error.includes('cover image')) {
        setMobileCrudStep(3);
      }
    }
    
    // Smooth auto-hide error logic
    if (error && showCrudModal) {
      setVisibleError(error);
      setFadeOutError(false);
      
      const fadeTimer = setTimeout(() => {
        setFadeOutError(true);
      }, 4500);
      
      const removeTimer = setTimeout(() => {
        setVisibleError(null);
        if (setError) setError(null);
      }, 5000);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    } else if (!showCrudModal) {
      setVisibleError(null);
      setFadeOutError(false);
    }
  }, [error, showCrudModal]);

  return (
    <>
      {/* CRUD Product Modal Overlay */}
      {showCrudModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileModalOverride}`} style={{ maxWidth: "800px", maxHeight: "90vh", display: "flex", flexDirection: "column", padding: "24px 24px 20px 24px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "14px", marginBottom: "14px", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#111827" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#111827" }}>
                    {isEditing ? "Edit Product Details" : "Add new product to Catalog"}
                  </h3>
                </div>
                <div className={styles.showOnMobile} style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "32px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: mobileCrudStep === 1 ? "#000" : "#9ca3af" }}>Details</span>
                    <span style={{ fontSize: "0.75rem", color: "#d1d5db" }}>/</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: mobileCrudStep === 2 ? "#000" : "#9ca3af" }}>Variants</span>
                    <span style={{ fontSize: "0.75rem", color: "#d1d5db" }}>/</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: mobileCrudStep === 3 ? "#000" : "#9ca3af" }}>Images</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowCrudModal(false); resetForm(); setMobileCrudStep(1); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px", display: "inline-flex", alignItems: "center", borderRadius: "50%", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#000"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>
              <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px", marginBottom: "14px", minHeight: 0 }}>
                {visibleError && showCrudModal && (
                  <div className={styles.errorBanner} style={{ 
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
                      marginBottom: fadeOutError ? 0 : "14px", 
                      padding: fadeOutError ? 0 : "12px", 
                      borderRadius: "6px", 
                      backgroundColor: "#fef2f2", 
                      color: "#dc2626", 
                      fontSize: "0.85rem", 
                      borderLeft: fadeOutError ? "0px solid #ef4444" : "4px solid #ef4444",
                      opacity: fadeOutError ? 0 : 1,
                      maxHeight: fadeOutError ? 0 : "100px",
                      overflow: "hidden",
                      transition: "all 0.5s ease-out"
                  }}>
                    {visibleError}
                  </div>
                )}

                
                {/* Desktop View (All cards visible) */}
                <div className={styles.hideOnMobile}>
{/* Card 1: Product details */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product details</h4>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel}>PerfumeName *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.textInput}
                      style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel}>Description *</label>
                    <div style={{ backgroundColor: "#ffffff" }}>
                      <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        style={{ height: "150px", marginBottom: "40px" }}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Additional Information *</label>
                    <div style={{ backgroundColor: "#ffffff" }}>
                      <ReactQuill
                        theme="snow"
                        value={additionalInformation}
                        onChange={setAdditionalInformation}
                        style={{ height: "150px", marginBottom: "40px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Product Variants & Sizing Table */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Variants & Sizing</h4>

                  <div style={{ overflow: "visible" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Size*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Quantity*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Price*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Strike Price</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Making Price*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", minWidth: "180px" }}>Category*</th>
                          <th style={{ padding: "8px 6px", width: "40px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {options.map((opt: any, index: number) => (
                          <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="text"
                                value={opt.size}
                                placeholder="e.g. 50ml"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].size = e.target.value;
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.quantity}
                                min="0"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].quantity = e.target.value === "" ? "" : (parseInt(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.price}
                                min="1"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].price = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.strikePrice || ""}
                                min="0"
                                placeholder="Optional"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].strikePrice = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.makingPrice}
                                min="0"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].makingPrice = e.target.value === "" ? "" : (parseInt(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px", position: "relative", zIndex: openCategoryIndex === index ? 99999 : 1 }}>
                              <div
                                className={styles.selectInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", height: "34px", boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                onClick={() => setOpenCategoryIndex(openCategoryIndex === index ? null : index)}
                              >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {opt.category && opt.category.length > 0 ? opt.category.join(", ") : "Select..."}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "12px", height: "12px", flexShrink: 0 }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </div>
                              {openCategoryIndex === index && (
                                <>
                                  <div
                                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenCategoryIndex(null);
                                    }}
                                  />
                                  <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "4px",
                                    right: "4px",
                                    zIndex: 99999,
                                    backgroundColor: "#fff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                    marginTop: "4px"
                                  }}>
                                    {allCategories.map((cat: string) => {
                                      const isSelected = opt.category && opt.category.includes(cat);
                                      return (
                                        <div
                                          key={cat}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updated = [...options];
                                            if (!updated[index].category) updated[index].category = [];
                                            if (isSelected) {
                                              updated[index].category = updated[index].category.filter((c: any) => c !== cat);
                                            } else {
                                              updated[index].category.push(cat);
                                            }
                                            setOptions(updated);
                                          }}
                                          style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            backgroundColor: isSelected ? "#4b5563" : "#fff",
                                            color: isSelected ? "#fff" : "#374151",
                                            fontSize: "0.8rem",
                                            transition: "background-color 0.2s, color 0.2s"
                                          }}
                                          onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#f3f4f6";
                                          }}
                                          onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#fff";
                                          }}
                                        >
                                          {cat}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </td>
                            <td style={{ padding: "8px 4px", textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (options.length > 1) {
                                    setOptions(options.filter((_: any, idx: number) => idx !== index));
                                  }
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: options.length <= 1 ? "#fca5a5" : "#ef4444",
                                  cursor: options.length <= 1 ? "not-allowed" : "pointer",
                                  fontSize: "1rem",
                                  padding: "4px"
                                }}
                                title="Remove Variant"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOptions([...options, { size: "", quantity: "", price: "", strikePrice: "", makingPrice: "", category: [] }]);
                    }}
                    style={{
                      marginTop: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#000000",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  >
                    + Add Variant
                  </button>
                </div>

                {/* Card 3: Perfume Images */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Images</h4>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel} style={{ marginBottom: "6px" }}>Perfume Images (Upload 3 to 6 images) *</label>
                    <label style={{ display: "block" }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleMultipleFilesUpload}
                        disabled={uploading}
                      />
                      <div style={{
                        border: "2px dashed #d1d5db",
                        borderRadius: "8px",
                        padding: "16px 12px",
                        textAlign: "center",
                        backgroundColor: "#fafafa",
                        cursor: uploading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                        onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.backgroundColor = "#f3f4f6"; } }}
                        onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fafafa"; } }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "24px", height: "24px", color: "#9ca3af", margin: "0 auto 4px auto" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
                          {uploading ? "Uploading Images..." : "Choose Image Files to Upload"}
                        </span>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "#6b7280", marginTop: "2px" }}>
                          JPG or PNG files • 3 to 6 images • Minimum 3 required
                        </span>
                      </div>
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.72rem", color: images.length >= 3 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                        {images.length >= 3 ? `✓ Met requirement (${images.length} uploaded)` : `✗ Need ${3 - images.length} more image(s)`}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                        Max limit: 6 images
                      </span>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div style={{ backgroundColor: "#f9fafb", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      <label className={styles.inputLabel} style={{ marginBottom: "6px", display: "block", fontSize: "0.68rem", color: "#4b5563" }}>
                        Tap an image to set as FRONT COVER (★ indicates Cover)
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))", gap: "8px" }}>
                        {images.map((url: string, index: number) => {
                          const isCover = imageFront === url;
                          return (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                borderRadius: "8px",
                                border: isCover ? "2px solid #000000" : "1px solid #e5e7eb",
                                padding: "3px",
                                backgroundColor: "#ffffff",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: isCover ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
                              }}
                              onClick={() => setImageFront(url)}
                              onMouseEnter={(e) => { if (!isCover) e.currentTarget.style.borderColor = "#9ca3af"; }}
                              onMouseLeave={(e) => { if (!isCover) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                            >
                              <img
                                src={url}
                                alt={`Uploaded perfume ${index + 1}`}
                                style={{ width: "100%", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                              />

                              <span style={{
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                color: isCover ? "#000000" : "#9ca3af",
                                textTransform: "uppercase",
                                letterSpacing: "0.02em",
                                marginTop: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px"
                              }}>
                                {isCover ? "★ Cover" : "Set Cover"}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "-5px",
                                  right: "-5px",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
                                }}
                                title="Remove Image"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              
                </div>

                {/* Mobile View (Slider) */}
                <div className={styles.showOnMobile}>
                  
                  {/* Step 1: Details */}
                  <div id="mobile-step-1" style={{ display: mobileCrudStep === 1 ? 'block' : 'none' }}>
                    <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product details</h4>
                      <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                        <label className={styles.inputLabel}>PerfumeName *</label>
                        <input id="mobile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.textInput} style={{ padding: "8px 12px", fontSize: "0.85rem" }} required={mobileCrudStep === 1} />
                      </div>
                      <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                        <label className={styles.inputLabel}>Description *</label>
                        <div id="mobile-description" style={{ backgroundColor: "#ffffff" }}>
                          <ReactQuill theme="snow" value={description} onChange={setDescription} style={{ height: "150px", marginBottom: "40px" }} />
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Additional Information *</label>
                        <div id="mobile-additional-info" style={{ backgroundColor: "#ffffff" }}>
                          <ReactQuill theme="snow" value={additionalInformation} onChange={setAdditionalInformation} style={{ height: "150px", marginBottom: "40px" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Variants (Card Layout) */}
                  <div id="mobile-step-2" style={{ display: mobileCrudStep === 2 ? 'block' : 'none' }}>
                    <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Variants & Sizing</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
                        {options.map((opt: any, index: number) => (
                          <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa', position: 'relative', zIndex: openCategoryIndex === index ? 99999 : 1 }}>
                                <button type="button" onClick={() => { if (options.length > 1) { setOptions(options.filter((_: any, idx: number) => idx !== index)); } }} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: options.length <= 1 ? '#fca5a5' : '#ef4444', cursor: options.length <= 1 ? 'not-allowed' : 'pointer', fontSize: '1rem', zIndex: 2 }} title="Remove Variant">✕</button>
                            <h5 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>Variant {index + 1}</h5>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Size *</label>
                                  <input type="text" value={opt.size} placeholder="e.g. 50ml" onChange={(e) => { const updated = [...options]; updated[index].size = e.target.value; setOptions(updated); }} required={mobileCrudStep === 2} className={styles.textInput} style={{ padding: "8px", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Quantity *</label>
                                  <input type="number" value={opt.quantity} min="0" onChange={(e) => { const updated = [...options]; updated[index].quantity = e.target.value === "" ? "" : (parseInt(e.target.value) || 0); setOptions(updated); }} required={mobileCrudStep === 2} className={styles.textInput} style={{ padding: "8px", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }} />
                                </div>
                              </div>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Price (₹) *</label>
                                  <input type="number" value={opt.price} min="1" onChange={(e) => { const updated = [...options]; updated[index].price = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0); setOptions(updated); }} required={mobileCrudStep === 2} className={styles.textInput} style={{ padding: "8px", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Strike Price</label>
                                  <input type="number" value={opt.strikePrice || ""} min="0" placeholder="Optional" onChange={(e) => { const updated = [...options]; updated[index].strikePrice = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0); setOptions(updated); }} className={styles.textInput} style={{ padding: "8px", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }} />
                                </div>
                              </div>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Making Price *</label>
                                  <input type="number" value={opt.makingPrice} min="0" onChange={(e) => { const updated = [...options]; updated[index].makingPrice = e.target.value === "" ? "" : (parseInt(e.target.value) || 0); setOptions(updated); }} required={mobileCrudStep === 2} className={styles.textInput} style={{ padding: "8px", fontSize: "0.85rem", width: "100%", boxSizing: "border-box" }} />
                                </div>
                                <div style={{ position: 'relative', zIndex: openCategoryIndex === index ? 99999 : 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Category *</label>
                                  <div className={styles.selectInput} style={{ padding: "8px", fontSize: "0.85rem", width: "100%", height: "35px", boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: '#fff' }} onClick={() => setOpenCategoryIndex(openCategoryIndex === index ? null : index)}>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.category && opt.category.length > 0 ? opt.category.join(", ") : "Select..."}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "12px", height: "12px", flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                  </div>
                                  {openCategoryIndex === index && (
                                    <>
                                      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} onClick={(e) => { e.stopPropagation(); setOpenCategoryIndex(null); }} />
                                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 99999, backgroundColor: "#fff", border: "1px solid #d1d5db", borderRadius: "6px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", maxHeight: "200px", overflowY: "auto", marginTop: "4px" }}>
                                        {allCategories.map((cat: string) => {
                                          const isSelected = opt.category && opt.category.includes(cat);
                                          return (
                                            <div key={cat} onClick={(e) => { e.stopPropagation(); const updated = [...options]; if (!updated[index].category) updated[index].category = []; if (isSelected) { updated[index].category = updated[index].category.filter((c: any) => c !== cat); } else { updated[index].category.push(cat); } setOptions(updated); }} style={{ padding: "10px 12px", cursor: "pointer", backgroundColor: isSelected ? "#4b5563" : "#fff", color: isSelected ? "#fff" : "#374151", fontSize: "0.85rem", borderBottom: '1px solid #f3f4f6' }}>
                                              {cat}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button type="button" onClick={() => { setOptions([...options, { size: "", quantity: "", price: "", strikePrice: "", makingPrice: "", category: [] }]); }} style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", justifyContent: 'center', gap: "6px", padding: "10px", fontSize: "0.85rem", fontWeight: 600, color: "#000000", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", width: '100%' }}>
                        + Add Another Variant
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Images */}
                  <div style={{ display: mobileCrudStep === 3 ? 'block' : 'none' }}>
                    <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Images</h4>
                      <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                        <label className={styles.inputLabel} style={{ marginBottom: "6px" }}>Perfume Images (Upload 3 to 6 images) *</label>
                        <label style={{ display: "block" }}>
                          <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleMultipleFilesUpload} disabled={uploading} />
                          <div style={{ border: "2px dashed #d1d5db", borderRadius: "8px", padding: "20px 12px", textAlign: "center", backgroundColor: "#fafafa", cursor: uploading ? "not-allowed" : "pointer" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "28px", height: "28px", color: "#9ca3af", margin: "0 auto 8px auto" }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                            <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111827" }}>{uploading ? "Uploading Images..." : "Tap to Select Images"}</span>
                            <span style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginTop: "4px" }}>JPG or PNG files • 3 to 6 images</span>
                          </div>
                        </label>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                          <span style={{ fontSize: "0.75rem", color: images.length >= 3 ? "#10b981" : "#ef4444", fontWeight: 600 }}>{images.length >= 3 ? `✓ Met requirement (${images.length} uploaded)` : `✗ Need ${3 - images.length} more image(s)`}</span>
                          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Max: 6</span>
                        </div>
                      </div>

                      {images.length > 0 && (
                        <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                          <label className={styles.inputLabel} style={{ marginBottom: "10px", display: "block", fontSize: "0.75rem", color: "#4b5563" }}>Tap an image to set as FRONT COVER</label>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))", gap: "8px" }}>
                            {images.map((url: string, index: number) => {
                              const isCover = imageFront === url;
                              return (
                                <div key={index} style={{ position: "relative", borderRadius: "8px", border: isCover ? "2px solid #000000" : "1px solid #e5e7eb", padding: "3px", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => setImageFront(url)}>
                                  <img src={url} alt={`Uploaded perfume ${index + 1}`} style={{ width: "100%", height: "60px", objectFit: "cover", borderRadius: "5px" }} />
                                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: isCover ? "#000000" : "#9ca3af", textTransform: "uppercase", marginTop: "4px", paddingBottom: "2px" }}>{isCover ? "★ Cover" : "Set Cover"}</span>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }} style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#ef4444", color: "#ffffff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              <div className={`${styles.modalActionRow} ${styles.mobileFooterOverride}`} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "14px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
                {/* Desktop Buttons */}
                <div className={styles.hideOnMobile} style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => { setShowCrudModal(false); resetForm(); setMobileCrudStep(1); }}
                      className={styles.secondaryActionBtn}
                      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.primaryActionBtn}
                      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      {isEditing ? "Save Changes" : "Create Product"}
                    </button>
                </div>

                {/* Mobile Slider Navigation Buttons */}
                <div className={styles.showOnMobile} style={{ display: 'flex', width: '100%', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() => {
                            if (mobileCrudStep === 1) { setShowCrudModal(false); resetForm(); setMobileCrudStep(1); }
                            else { setMobileCrudStep(mobileCrudStep - 1); }
                        }}
                        className={styles.secondaryActionBtn}
                        style={{ padding: "12px 16px", fontSize: "0.95rem", flex: '1', textAlign: 'center' }}
                    >
                        {mobileCrudStep === 1 ? "Cancel" : "Back"}
                    </button>
                    
                    {mobileCrudStep < 3 ? (
                        <button
                            type="button"
                            onClick={() => setMobileCrudStep(mobileCrudStep + 1)}
                            className={styles.primaryActionBtn}
                            style={{ padding: "12px 16px", fontSize: "0.95rem", flex: '2', textAlign: 'center' }}
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={styles.primaryActionBtn}
                            style={{ padding: "12px 16px", fontSize: "0.95rem", flex: '2', textAlign: 'center' }}
                            formNoValidate
                        >
                            {isEditing ? "Save Changes" : "Create Product"}
                        </button>
                    )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Add Category Modal Overlay */}
      {showAddCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add New Category
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddCategoryModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingRight: "10px", marginBottom: "15px" }}>
                {categoryModalError && (
                  <div className={styles.errorBanner} style={{ marginBottom: "15px", padding: "10px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "0.85rem", flexShrink: 0 }}>
                    {categoryModalError}
                  </div>
                )}

                <div className={styles.inputGroup} style={{ marginBottom: "15px", flexShrink: 0 }}>
                  <label className={styles.inputLabel}>Category Name *</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Exclusive Series"
                    className={styles.textInput}
                    required
                  />
                </div>

                <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                  <label className={styles.inputLabel} style={{ marginBottom: "8px", flexShrink: 0 }}>Select Products to Add to this Category</label>
                  <div style={{ overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px", height: "175px", flexShrink: 0 }}>
                    {products.length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>No products available.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {products.map((product: any) => {
                          const isChecked = selectedProductIds.includes(product._id!);
                          return (
                            <div
                              key={product._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #f3f4f6",
                                borderRadius: "6px",
                                backgroundColor: isChecked ? "#fafafa" : "#fff",
                                transition: "background-color 0.2s"
                              }}
                            >
                              <CustomCheckbox
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProductIds([...selectedProductIds, product._id!]);
                                  } else {
                                    setSelectedProductIds(selectedProductIds.filter((id: any) => id !== product._id));
                                  }
                                }}
                                style={{ '--checkbox-color': '#111827', margin: '8px' } as React.CSSProperties}
                                label={
                                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1 }}>
                                    {product.imageFront && (
                                      <img
                                        src={product.imageFront}
                                        alt={product.name}
                                        style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }}
                                      />
                                    )}
                                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{product.name}</span>
                                      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Current Categories: {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}</span>
                                    </div>
                                  </div>
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddCategoryModal(false); }}
                  className={styles.secondaryActionBtn}
                  disabled={categoryModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  disabled={categoryModalLoading || !newCategoryName.trim()}
                >
                  {categoryModalLoading ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Category Product Add Option Selector Modal Overlay */}
      {showCategoryAddOptionsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "480px", display: "flex", flexDirection: "column", padding: "24px" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                Add Product to Category
              </h3>
              <button
                type="button"
                onClick={() => { setShowCategoryAddOptionsModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "12px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5 }}>
                Choose how you want to add a product to the <strong>{selectedCategoryView}</strong> collection:
              </p>

              {/* Option 1: Create New Product */}
              <div
                onClick={() => {
                  setShowCategoryAddOptionsModal(false);
                  setIsEditing(false);
                  resetForm();
                  setCategory(selectedCategoryView ? [selectedCategoryView] : []);
                  setShowCrudModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "#fff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#f3f4f6", borderRadius: "50%", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#000" }}>Create New Product</span>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Create a brand new perfume catalog listing from scratch.</span>
                </div>
              </div>

              {/* Option 2: Add Existing Product */}
              <div
                onClick={() => {
                  setShowCategoryAddOptionsModal(false);
                  setExistingProductIdsToAssign([]);
                  setShowAddExistingToCategoryModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "#fff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#f3f4f6", borderRadius: "50%", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#000" }}>Add Existing Products</span>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Select and link existing products from your catalog here.</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => { setShowCategoryAddOptionsModal(false); }}
                className={styles.secondaryActionBtn}
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Existing Product to Category Modal Overlay */}
      {showAddExistingToCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add Products to {selectedCategoryView}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddExistingToCategoryModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAssignExistingToCategory} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingRight: "10px", marginBottom: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflow: "hidden" }}>
                  <label className={styles.inputLabel} style={{ marginBottom: "2px" }}>
                    Select Products to Associate (Displaying max 3 at a time, scrollable)
                  </label>

                  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {(() => {
                      const availableProducts = products.filter((p: any) => {
                        const cats = Array.isArray(p.category) ? p.category : [p.category].filter((c): c is string => typeof c === 'string');
                        return selectedCategoryView ? !cats.includes(selectedCategoryView) : false;
                      });

                      if (availableProducts.length === 0) {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", border: "1px dashed #d1d5db", borderRadius: "6px", backgroundColor: "#fafafa" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", color: "#9ca3af", marginBottom: "10px" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span style={{ fontSize: "0.85rem", color: "#6b7280", textAlign: "center" }}>All existing products are already assigned to this category.</span>
                          </div>
                        );
                      }

                      return (
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          overflowY: "auto",
                          padding: "4px",
                          height: "175px"
                        }}>
                          {availableProducts.map((product: any) => {
                            const isChecked = existingProductIdsToAssign.includes(product._id!);
                            return (
                              <label
                                key={product._id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "8px",
                                  border: "1px solid #f3f4f6",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  backgroundColor: isChecked ? "#fafafa" : "#fff",
                                  transition: "background-color 0.2s"
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setExistingProductIdsToAssign([...existingProductIdsToAssign, product._id!]);
                                    } else {
                                      setExistingProductIdsToAssign(existingProductIdsToAssign.filter((id: any) => id !== product._id));
                                    }
                                  }}
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                                {product.imageFront && (
                                  <img
                                    src={product.imageFront}
                                    alt={product.name}
                                    style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }}
                                  />
                                )}
                                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{product.name}</span>
                                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Current Categories: {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddExistingToCategoryModal(false); }}
                  className={styles.secondaryActionBtn}
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  disabled={assignLoading || existingProductIdsToAssign.length === 0}
                >
                  {assignLoading ? "Saving..." : "Add to Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Category Confirmation Modal */}
      {deleteCategoryTarget && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" className={styles.mobileAlertIcon} style={{ width: "24px", height: "24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <h3>Delete Category?</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              Are you sure you want to delete the category <strong>&quot;{deleteCategoryTarget}&quot;</strong>? All products currently in this category will have their category cleared, but they will not be deleted and can still be found in <strong>&quot;All Products&quot;</strong>.
            </p>

            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={handleDeleteCategoryConfirm}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                disabled={deleteCategoryLoading}
              >
                {deleteCategoryLoading ? "Deleting..." : "Delete Category"}
              </button>
              <button
                onClick={() => setDeleteCategoryTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={deleteCategoryLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" className={styles.mobileAlertIcon} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <h3>Delete Perfume?</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              Are you sure you want to delete this perfume from your inventory catalog? This action is permanent and cannot be undone.
            </p>

            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={async () => {
                  if (deleteTargetId) {
                    setIsDeletingProduct(true);
                    await handleDelete(deleteTargetId);
                    setDeleteTargetId(null);
                    setIsDeletingProduct(false);
                  }
                }}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingProduct ? 0.7 : 1 }}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingProduct}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Overlay Modal */}
      {customAlert && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000000" className={styles.mobileAlertIcon} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h3>{customAlert.title}</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              {customAlert.message}
            </p>

            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={() => setCustomAlert(null)}
                className={styles.primaryActionBtn}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" className={styles.mobileAlertIcon} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <h3>Reset Customize Settings?</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              Are you sure you want to reset all storefront layout options, text copies, theme color, and banner configurations back to factory system defaults?
            </p>

            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={handleResetToDefaults}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className={styles.secondaryActionBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification for Success Messages */}
      {successMessage && (
        <div className={styles.toastNotification}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10b981" style={{ width: "20px", height: "20px", marginRight: "10px", flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Selected Customer Detail Modal */}
      {selectedCustomer && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCustomer(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, padding: "20px" }} data-lenis-prevent="true">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", background: "#fff", borderRadius: "8px", padding: "30px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "12px", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#111827" }}>Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Name</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", fontWeight: 600 }}>{selectedCustomer.name}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Email Address</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827" }}>{selectedCustomer.email}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827" }}>{selectedCustomer.phone}</p>
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Shipping Address (Latest)</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", lineHeight: "1.4" }}>{selectedCustomer.address}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Total Orders</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#111827", fontWeight: 700 }}>{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Total Spend</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#10b981", fontWeight: 700 }}>₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}.00</p>
                </div>
              </div>

              {/* Order History Table (Desktop View) */}
              <div className={styles.hideOnMobile} style={{ marginTop: "10px" }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "#111827", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #eaeaea", paddingBottom: "5px" }}>Order History</p>
                <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #eaeaea", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9fafb", zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Order ID</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Date</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Amount</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter((o: any) => o.customerEmail === selectedCustomer.email).length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>No orders found for this customer.</td>
                        </tr>
                      ) : (
                        orders
                          .filter((o: any) => o.customerEmail === selectedCustomer.email)
                          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((order: any) => (
                            <tr key={order._id} style={{ borderBottom: "1px solid #eaeaea" }}>
                              <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 500 }}>{order.orderId}</td>
                              <td style={{ padding: "8px 12px", color: "#6b7280" }}>
                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 600 }}>₹{order.totalAmount.toLocaleString("en-IN")}.00</td>
                              <td style={{ padding: "8px 12px" }}>
                                <span style={{
                                  display: "inline-block",
                                  padding: "2px 6px",
                                  borderRadius: "12px",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  backgroundColor: order.status === "Delivered" ? "#eaf7ee" : order.status === "Shipped" ? "#eff6ff" : "#fef3c7",
                                  color: order.status === "Delivered" ? "#15803d" : order.status === "Shipped" ? "#1d4ed8" : "#b45309"
                                }}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order History Accordion (Mobile View) */}
              <div className={styles.showOnMobile} style={{ marginTop: "10px" }}>
                <details style={{ width: "100%", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #eaeaea", padding: "12px" }}>
                  <summary className={styles.mobileAccordionSummary} style={{ fontSize: "0.9rem", color: "#111827", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", outline: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Order History
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div style={{ marginTop: "12px", maxHeight: "250px", overflowY: "auto", borderTop: "1px solid #eaeaea", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {orders.filter((o: any) => o.customerEmail === selectedCustomer.email).length === 0 ? (
                      <div style={{ padding: "10px", textAlign: "center", color: "#9ca3af", fontStyle: "italic", fontSize: "0.8rem" }}>No orders found.</div>
                    ) : (
                      orders
                        .filter((o: any) => o.customerEmail === selectedCustomer.email)
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((order: any) => (
                          <div key={order._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#fff", border: "1px solid #eaeaea", borderRadius: "8px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontSize: "0.85rem", color: "#111827", fontWeight: 600 }}>{order.orderId}</span>
                              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                              <span style={{ fontSize: "0.85rem", color: "#111827", fontWeight: 700 }}>₹{order.totalAmount.toLocaleString("en-IN")}.00</span>
                              <span style={{
                                display: "inline-block",
                                padding: "2px 6px",
                                borderRadius: "12px",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                backgroundColor: order.status === "Delivered" ? "#eaf7ee" : order.status === "Shipped" ? "#eff6ff" : "#fef3c7",
                                color: order.status === "Delivered" ? "#15803d" : order.status === "Shipped" ? "#1d4ed8" : "#b45309"
                              }}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </details>
              </div>
            </div>
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setDeleteCustomerTargetId(selectedCustomer._id)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}>Delete Customer</button>
              <button onClick={() => setSelectedCustomer(null)} className={styles.secondaryActionBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {deleteCustomerTargetId && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" className={styles.mobileAlertIcon} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <h3>Confirm Delete Customer</h3>
            </div>

            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              Are you sure you want to remove this customer from the directory? Historical orders will not be deleted.
            </p>

            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={() => handleDeleteCustomer(deleteCustomerTargetId)}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingCustomer ? 0.7 : 1 }}
                disabled={isDeletingCustomer}
              >
                {isDeletingCustomer ? "Deleting..." : "Delete Customer"}
              </button>
              <button
                onClick={() => setDeleteCustomerTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingCustomer}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, padding: "20px" }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "900px", background: "#fff", borderRadius: "8px", padding: "30px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 400, margin: 0, color: "#000" }}>{selectedOrder.orderId}</span>
                <span style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  backgroundColor: selectedOrder.status === "Delivered" || (selectedOrder.status === "Return Approved" && !(selectedOrder.returnRequest?.returnType === "Refund" && selectedOrder.refundStatus !== "Refunded")) ? "#eaf7ee" : selectedOrder.status === "Return Rejected" ? "#fef2f2" : selectedOrder.status === "Shipped" ? "#eff6ff" : selectedOrder.status === "Cancelled" ? "#fee2e2" : selectedOrder.status === "Return Approved" ? "#fef3c7" : "#fef3c7",
                  color: selectedOrder.status === "Delivered" || (selectedOrder.status === "Return Approved" && !(selectedOrder.returnRequest?.returnType === "Refund" && selectedOrder.refundStatus !== "Refunded")) ? "#15803d" : selectedOrder.status === "Return Rejected" ? "#991b1b" : selectedOrder.status === "Shipped" ? "#1d4ed8" : selectedOrder.status === "Cancelled" ? "#ef4444" : selectedOrder.status === "Return Approved" ? "#b45309" : "#b45309"
                }}>
                  {selectedOrder.status === "Return Approved" ? (selectedOrder.returnRequest?.returnType === "Refund" && selectedOrder.refundStatus !== "Refunded" ? "Payment Pending" : "Approved") : selectedOrder.status === "Return Rejected" ? "Rejected" : selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            <div className={styles.hideOnMobile} style={{ display: "flex", gap: "40px", textAlign: "left", alignItems: "stretch", flex: 1, minHeight: 0, overflow: "hidden" }}>
              
              {/* LEFT COLUMN: Items Purchased & Total */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", minHeight: 0 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0", color: "#888", flexShrink: 0 }}>Items Purchased</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", paddingRight: "5px", minHeight: 0 }}>
                    {selectedOrder.cartItems.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "15px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }} 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111" }}>{item.name}</h4>
                            {(item.isGiftSet || item.name?.toLowerCase().includes('gift set')) && (
                              <span style={{ backgroundColor: "#fef3c7", color: "#b45309", fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: "4px" }}>
                                GIFT SET
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", marginTop: "4px", gap: "6px" }}>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Size: {item.size || 'Standard'}</span>
                            <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>|</span>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Qty: {item.quantity}</span>
                          </div>
                          {(item.isGiftSet || (item.giftSetDetails && item.giftSetDetails.length > 0) || (item.giftSetItems && item.giftSetItems.length > 0) || item.name?.toLowerCase().includes('gift set')) && (
                            <div style={{ marginTop: "6px", backgroundColor: "#f8fafc", padding: "6px 8px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Included Items:</span>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                                {item.giftSetDetails && item.giftSetDetails.length > 0 ? (
                                  item.giftSetDetails.map((sub: any, sIdx: number) => (
                                    <div key={sIdx} style={{ fontSize: "0.75rem", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                                      {sub.imageFront && <img src={sub.imageFront} alt={sub.name} style={{ width: "16px", height: "16px", borderRadius: "2px", objectFit: "cover" }} />}
                                      <span>{sub.name || (typeof sub === 'string' ? sub : 'Fragrance Item')}</span>
                                    </div>
                                  ))
                                ) : item.giftSetItems && item.giftSetItems.length > 0 ? (
                                  item.giftSetItems.map((subName: any, sIdx: number) => (
                                    <div key={sIdx} style={{ fontSize: "0.75rem", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#94a3b8" }}></span>
                                      <span>{typeof subName === 'string' ? subName : (subName.name || 'Fragrance Item')}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Custom Fragrance Set ({item.size || '3 items'})</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0", color: "#888" }}>Total Amount</h3>
                  
                  {(() => {
                    const originalTotal = selectedOrder.cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                    const discount = originalTotal - selectedOrder.totalAmount;
                    
                    return (
                      <>
                        {discount > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Subtotal</span>
                            <span style={{ fontSize: "0.85rem", color: "#111" }}>₹{originalTotal.toLocaleString("en-IN")}.00</span>
                          </div>
                        )}
                        
                        {discount > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.85rem", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ padding: "2px 6px", backgroundColor: "#eaf7ee", borderRadius: "4px", fontWeight: 700, fontSize: "0.7rem", border: "1px solid #bbf7d0" }}>COUPON APPLIED</span>
                              Discount
                            </span>
                            <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 700 }}>-₹{discount.toLocaleString("en-IN")}.00</span>
                          </div>
                        )}
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: discount > 0 ? "4px" : "0" }}>
                          <span style={{ fontSize: "0.85rem", color: "#111", fontWeight: 500 }}>
                            Paid via {selectedOrder.paymentMethod === "Razorpay" ? "Online" : selectedOrder.paymentMethod}
                          </span>
                          <span style={{ fontSize: "1.1rem", fontWeight: 400, color: "#000" }}>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}.00</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* VERTICAL DIVIDER */}
              <div style={{ width: "1px", backgroundColor: "#e5e7eb", margin: "0", flexShrink: 0 }}></div>

              {/* RIGHT COLUMN: Info, Status & Timeline */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", minHeight: 0 }}>
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "1.76rem", color: "#111827", fontWeight: 700 }}>
                        {selectedOrder.customerName ? selectedOrder.customerName.charAt(0).toUpperCase() + selectedOrder.customerName.slice(1).toLowerCase() : "N/A"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      <span style={{ fontSize: "0.88rem", color: "#111827" }}>{selectedOrder.customerEmail}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <span style={{ fontSize: "0.88rem", color: "#111827" }}>{selectedOrder.customerPhone}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "3px", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span style={{ fontSize: "0.88rem", color: "#111827", lineHeight: "1.4" }}>
                        {typeof selectedOrder.shippingAddress === 'string' 
                          ? selectedOrder.shippingAddress 
                          : (selectedOrder.shippingAddress 
                              ? `${selectedOrder.shippingAddress.fullName || ''}, ${selectedOrder.shippingAddress.address || ''}, ${selectedOrder.shippingAddress.city || ''}, ${selectedOrder.shippingAddress.state || ''} ${selectedOrder.shippingAddress.zip || ''}`.replace(/(^[,\s]+)|([,\s]+$)/g, '')
                              : "N/A"
                            )
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Update Status</h3>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {!["Return Approved", "Return Rejected"].includes(selectedOrder.status) ? (
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                        style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.85rem", background: "#fff", cursor: "pointer", color: "#000" }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Return Requested">Return Requested</option>
                        <option value="Returned">Returned</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "#6b7280", fontStyle: "italic" }}>Status locked ({selectedOrder.status})</span>
                    )}
                  </div>
                </div>

                {selectedOrder.paymentMethod !== "COD" && ["Return Requested", "Returned", "Return Approved", "Cancelled"].includes(selectedOrder.status) && (
                  <div>
                    <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Refund Status</h3>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        backgroundColor: selectedOrder.refundStatus === "Refunded" ? "#eaf7ee" : "#fef2f2",
                        color: selectedOrder.refundStatus === "Refunded" ? "#15803d" : "#991b1b"
                      }}>
                        {selectedOrder.refundStatus || "Not Refunded"}
                      </span>
                      <select
                        value={selectedOrder.refundStatus || "Not Refunded"}
                        onChange={(e) => handleUpdateRefundStatus(selectedOrder._id, e.target.value)}
                        style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.85rem", background: "#fff", cursor: "pointer", color: "#000" }}
                      >
                        <option value="Not Refunded">Not Refunded</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ORDER TIMELINE */}
                <div style={{ marginTop: "10px", paddingTop: "20px", borderTop: "1px dashed #e5e7eb", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0", color: "#6b7280", flexShrink: 0 }}>Order Timeline</h3>
                  
                  <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px", minHeight: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", paddingLeft: "10px" }}>
                      <div style={{ position: "absolute", left: "14px", top: "4px", bottom: "4px", width: "2px", backgroundColor: "#e5e7eb", zIndex: 0 }}></div>
                    {(() => {
                      const allEvents: any[] = [];
                      const statusIndex = ["Processing", "Shipped", "Delivered"].indexOf(selectedOrder.status);
                      
                      // 1. Order Placed
                      allEvents.push({
                        event: "Order Placed",
                        date: selectedOrder.createdAt || new Date().toISOString(),
                        color: "#10b981"
                      });
                      
                      const hasEvent = (match: string) => selectedOrder.timeline?.some((e: any) => e.event.toLowerCase().includes(match.toLowerCase()));

                      // 2. Processing (if not explicitly in custom timeline)
                      if (statusIndex >= 0 || selectedOrder.status === "Cancelled" || selectedOrder.returnRequest) {
                        if (!hasEvent("processing")) {
                          allEvents.push({
                            event: "Processing",
                            date: selectedOrder.createdAt, 
                            color: "#10b981"
                          });
                        }
                      }

                      // 3. Shipped
                      if (statusIndex >= 1 || selectedOrder.returnRequest) {
                        if (!hasEvent("shipped")) {
                          allEvents.push({
                            event: "Shipped",
                            date: selectedOrder.updatedAt,
                            color: "#10b981"
                          });
                        }
                      }

                      // 4. Delivered
                      if (statusIndex >= 2 || selectedOrder.returnRequest) {
                        if (!hasEvent("delivered")) {
                          allEvents.push({
                            event: "Delivered",
                            date: selectedOrder.updatedAt,
                            color: "#10b981"
                          });
                        }
                      }

                      // 5. Add all custom events from DB (Cancelled, manual status updates)
                      if (selectedOrder.timeline && selectedOrder.timeline.length > 0) {
                        selectedOrder.timeline.forEach((e: any) => {
                          if (e.event === "Order Placed") return; // Skip dup
                          
                          let color = "#10b981"; 
                          if (e.event.toLowerCase().includes("cancelled") || e.event.toLowerCase().includes("rejected") || e.event.toLowerCase().includes("failed")) {
                            color = "#ef4444"; 
                          } else if (e.event.toLowerCase().includes("return request") || e.event.toLowerCase().includes("pending")) {
                            color = "#f59e0b"; 
                          }
                          
                          allEvents.push({
                            event: e.event,
                            date: e.date || selectedOrder.updatedAt,
                            color
                          });
                        });
                      }

                      // 6. Legacy Return Support (if not in timeline)
                      if (selectedOrder.returnRequest && !hasEvent("return request")) {
                        allEvents.push({
                          event: "Return Requested",
                          date: selectedOrder.returnRequest.createdAt,
                          color: "#f59e0b"
                        });
                        if (selectedOrder.returnRequest.status !== "Pending") {
                           allEvents.push({
                             event: `Return ${selectedOrder.returnRequest.status}`,
                             date: selectedOrder.returnRequest.updatedAt,
                             color: selectedOrder.returnRequest.status === "Approved" ? "#10b981" : "#ef4444"
                           });
                        }
                      }
                      
                      // 7. Refund Status Support
                      if (selectedOrder.refundStatus === "Refunded" && !hasEvent("refund")) {
                        allEvents.push({
                          event: "Refund Processed",
                          date: selectedOrder.updatedAt, // Ideally the time the refund was issued, fallback to updatedAt
                          color: "#10b981"
                        });
                      } else if (selectedOrder.refundStatus === "Pending" && !hasEvent("refund")) {
                         allEvents.push({
                          event: "Refund Pending",
                          date: selectedOrder.updatedAt,
                          color: "#f59e0b"
                        });
                      }

                      // Sort chronologically
                      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                      return allEvents.map((event, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: event.color, marginTop: "4px", flexShrink: 0, boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${event.color}` }}></div>
                          <div>
                            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>{event.event}</p>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                              {new Date(event.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            </p>
                          </div>
                        </div>
                      ));
                    })()}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* MOBILE ACCORDION LAYOUT */}
              <div className={styles.showOnMobile} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {/* User Info Card */}
                <div style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "1.3rem", color: "#111827", fontWeight: 400 }}>
                      {selectedOrder.customerName ? selectedOrder.customerName.charAt(0).toUpperCase() + selectedOrder.customerName.slice(1).toLowerCase() : "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>{selectedOrder.customerEmail}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>{selectedOrder.customerPhone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "3px", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span style={{ fontSize: "0.85rem", color: "#4b5563", lineHeight: "1.4" }}>
                      {typeof selectedOrder.shippingAddress === 'string' 
                        ? selectedOrder.shippingAddress 
                        : (selectedOrder.shippingAddress 
                            ? `${selectedOrder.shippingAddress.fullName || ''}, ${selectedOrder.shippingAddress.address || ''}, ${selectedOrder.shippingAddress.city || ''}, ${selectedOrder.shippingAddress.state || ''} ${selectedOrder.shippingAddress.zip || ''}`.replace(/(^[,\s]+)|([,\s]+$)/g, '')
                            : "N/A"
                          )
                      }
                    </span>
                  </div>
                </div>

                {/* ACCORDIONS */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  
                  {/* Items Accordion */}
                  <div className={styles.mobileAccordionItem}>
                    <div 
                      className={styles.mobileAccordionHeader} 
                      onClick={() => setOpenMobileAccordion(openMobileAccordion === "items" ? "" : "items")}
                    >
                      <h3 style={{ fontSize: "0.9rem", fontWeight: 400, margin: 0, color: "#111" }}>Items Purchased</h3>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: openMobileAccordion === "items" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    {openMobileAccordion === "items" && (
                      <div className={styles.mobileAccordionContent}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "40vh", overflowY: "auto", paddingRight: "5px" }}>
                          {selectedOrder.cartItems.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "15px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
                              {item.image && (
                                <img src={item.image} alt={item.name} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 400, color: "#111" }}>{item.name}</h4>
                                  {(item.isGiftSet || item.name?.toLowerCase().includes('gift set')) && (
                                    <span style={{ backgroundColor: "#fef3c7", color: "#b45309", fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: "4px" }}>
                                      GIFT SET
                                    </span>
                                  )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", marginTop: "4px", gap: "6px" }}>
                                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Size: {item.size || 'Standard'}</span>
                                  <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>|</span>
                                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Qty: {item.quantity}</span>
                                  {(item.isGiftSet || item.giftSetDetails?.length > 0 || item.giftSetItems?.length > 0 || item.name?.toLowerCase().includes('gift set')) && (
                                    <div style={{ marginTop: "6px", backgroundColor: "#f8fafc", padding: "6px 8px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Included Items:</span>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                                        {item.giftSetDetails && item.giftSetDetails.length > 0 ? (
                                          item.giftSetDetails.map((sub: any, sIdx: number) => (
                                            <div key={sIdx} style={{ fontSize: "0.75rem", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                                              {sub.imageFront && <img src={sub.imageFront} alt={sub.name} style={{ width: "16px", height: "16px", borderRadius: "2px", objectFit: "cover" }} />}
                                              <span>{sub.name || sub}</span>
                                            </div>
                                          ))
                                        ) : item.giftSetItems && item.giftSetItems.length > 0 ? (
                                          item.giftSetItems.map((subName: any, sIdx: number) => (
                                            <div key={sIdx} style={{ fontSize: "0.75rem", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#94a3b8" }}></span>
                                              <span>{typeof subName === 'string' ? subName : subName.name}</span>
                                            </div>
                                          ))
                                        ) : (
                                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Custom Fragrance Set ({item.size || '3 items'})</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#111" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", display: "flex", flexDirection: "column", gap: "8px", marginTop: "15px" }}>
                          {(() => {
                            const originalTotal = selectedOrder.cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                            const discount = originalTotal - selectedOrder.totalAmount;
                            return (
                              <>
                                {discount > 0 && (
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Subtotal</span>
                                    <span style={{ fontSize: "0.85rem", color: "#111" }}>₹{originalTotal.toLocaleString("en-IN")}</span>
                                  </div>
                                )}
                                {discount > 0 && (
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.85rem", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                                      Discount
                                    </span>
                                    <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 400 }}>-₹{discount.toLocaleString("en-IN")}</span>
                                  </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: discount > 0 ? "4px" : "0" }}>
                                  <span style={{ fontSize: "0.85rem", color: "#111", fontWeight: 400 }}>
                                    Paid via {selectedOrder.paymentMethod === "Razorpay" ? "Online" : selectedOrder.paymentMethod}
                                  </span>
                                  <span style={{ fontSize: "1.1rem", fontWeight: 400, color: "#000" }}>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Accordion */}
                  <div className={styles.mobileAccordionItem}>
                    <div 
                      className={styles.mobileAccordionHeader} 
                      onClick={() => setOpenMobileAccordion(openMobileAccordion === "status" ? "" : "status")}
                    >
                      <h3 style={{ fontSize: "0.9rem", fontWeight: 400, margin: 0, color: "#111" }}>Update Status</h3>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: openMobileAccordion === "status" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    {openMobileAccordion === "status" && (
                      <div className={styles.mobileAccordionContent}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 400, color: "#4b5563", marginBottom: "6px" }}>Order Status</label>
                            {!["Return Approved", "Return Rejected"].includes(selectedOrder.status) ? (
                              <select
                                value={selectedOrder.status}
                                onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                                style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.9rem", background: "#fff" }}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Return Requested">Return Requested</option>
                                <option value="Returned">Returned</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <div style={{ padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "6px", fontSize: "0.9rem", color: "#6b7280" }}>
                                Status locked ({selectedOrder.status})
                              </div>
                            )}
                          </div>
                          
                          {selectedOrder.paymentMethod !== "COD" && ["Return Requested", "Returned", "Return Approved", "Cancelled"].includes(selectedOrder.status) && (
                            <div>
                              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 400, color: "#4b5563", marginBottom: "6px" }}>Refund Status</label>
                              <select
                                value={selectedOrder.refundStatus || "Not Refunded"}
                                onChange={(e) => handleUpdateRefundStatus(selectedOrder._id, e.target.value)}
                                style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.9rem", background: "#fff" }}
                              >
                                <option value="Not Refunded">Not Refunded</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline Accordion */}
                  <div className={styles.mobileAccordionItem} style={{ borderBottom: "none" }}>
                    <div 
                      className={styles.mobileAccordionHeader} 
                      onClick={() => setOpenMobileAccordion(openMobileAccordion === "timeline" ? "" : "timeline")}
                    >
                      <h3 style={{ fontSize: "0.9rem", fontWeight: 400, margin: 0, color: "#111" }}>Order Timeline</h3>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: openMobileAccordion === "timeline" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    {openMobileAccordion === "timeline" && (
                      <div className={styles.mobileAccordionContent}>
                        <div style={{ maxHeight: "40vh", overflowY: "auto", paddingRight: "5px", paddingLeft: "10px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                            <div style={{ position: "absolute", left: "4px", top: "4px", bottom: "4px", width: "2px", backgroundColor: "#e5e7eb", zIndex: 0 }}></div>
                            {(() => {
                              const allEvents: any[] = [];
                              const statusIndex = ["Processing", "Shipped", "Delivered"].indexOf(selectedOrder.status);
                              
                              allEvents.push({ event: "Order Placed", date: selectedOrder.createdAt || new Date().toISOString(), color: "#10b981" });
                              
                              const hasEvent = (match: string) => selectedOrder.timeline?.some((e: any) => e.event.toLowerCase().includes(match.toLowerCase()));

                              if (statusIndex >= 0 || selectedOrder.status === "Cancelled" || selectedOrder.returnRequest) {
                                if (!hasEvent("processing")) allEvents.push({ event: "Processing", date: selectedOrder.createdAt, color: "#10b981" });
                              }
                              if (statusIndex >= 1 || selectedOrder.returnRequest) {
                                if (!hasEvent("shipped")) allEvents.push({ event: "Shipped", date: selectedOrder.updatedAt, color: "#10b981" });
                              }
                              if (statusIndex >= 2 || selectedOrder.returnRequest) {
                                if (!hasEvent("delivered")) allEvents.push({ event: "Delivered", date: selectedOrder.updatedAt, color: "#10b981" });
                              }

                              if (selectedOrder.timeline && selectedOrder.timeline.length > 0) {
                                selectedOrder.timeline.forEach((e: any) => {
                                  if (e.event === "Order Placed") return;
                                  let color = "#10b981"; 
                                  if (e.event.toLowerCase().includes("cancelled") || e.event.toLowerCase().includes("rejected") || e.event.toLowerCase().includes("failed")) color = "#ef4444"; 
                                  else if (e.event.toLowerCase().includes("return request") || e.event.toLowerCase().includes("pending")) color = "#f59e0b"; 
                                  
                                  allEvents.push({ event: e.event, date: e.date || selectedOrder.updatedAt, color });
                                });
                              }

                              if (selectedOrder.returnRequest && !hasEvent("return request")) {
                                allEvents.push({ event: "Return Requested", date: selectedOrder.returnRequest.createdAt, color: "#f59e0b" });
                                if (selectedOrder.returnRequest.status !== "Pending") {
                                   allEvents.push({ event: `Return ${selectedOrder.returnRequest.status}`, date: selectedOrder.returnRequest.updatedAt, color: selectedOrder.returnRequest.status === "Approved" ? "#10b981" : "#ef4444" });
                                }
                              }
                              
                              if (selectedOrder.refundStatus === "Refunded" && !hasEvent("refund")) {
                                allEvents.push({ event: "Refund Processed", date: selectedOrder.updatedAt, color: "#10b981" });
                              } else if (selectedOrder.refundStatus === "Pending" && !hasEvent("refund")) {
                                 allEvents.push({ event: "Refund Pending", date: selectedOrder.updatedAt, color: "#f59e0b" });
                              }

                              allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                              return allEvents.map((event, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
                                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: event.color, marginTop: "4px", flexShrink: 0, boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${event.color}` }}></div>
                                  <div>
                                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 400, color: "#111827" }}>{event.event}</p>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                                      {new Date(event.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                    </p>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
          </div>
        </div>
      )}



      {/* Edit Category Modal */}
      {renameCategoryTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <h3>Edit Category</h3>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "0 5px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>Category Name</label>
                <input
                  type="text"
                  value={renameCategoryNewName}
                  onChange={(e) => setRenameCategoryNewName(e.target.value)}
                  placeholder="Enter category name..."
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>
                  Products in Category
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px", backgroundColor: "#fafafa" }}>
                  {products.length === 0 ? (
                    <span style={{ fontSize: "0.85rem", color: "#6b7280", textAlign: "center", padding: "20px 0" }}>No products available.</span>
                  ) : (
                    products.map((product: any) => {
                      const isSelected = editCategorySelectedProductIds?.includes(product._id);
                      return (
                        <label
                          key={product._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            transition: "background-color 0.2s"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                        >
                          <CustomCheckbox
                            checked={isSelected}
                            onChange={(e: any) => {
                              if (e.target.checked) {
                                setEditCategorySelectedProductIds([...(editCategorySelectedProductIds || []), product._id]);
                              } else {
                                setEditCategorySelectedProductIds((editCategorySelectedProductIds || []).filter((id: string) => id !== product._id));
                              }
                            }}
                            style={{ '--checkbox-color': '#4f46e5' } as React.CSSProperties}
                          />
                          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#000" }}>{product.name}</span>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}
                            </span>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalActionRow} style={{ marginTop: "20px", flexShrink: 0 }}>
              <button
                onClick={handleEditCategorySubmit}
                disabled={isRenamingCategory || !renameCategoryNewName.trim()}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5", opacity: (isRenamingCategory || !renameCategoryNewName.trim()) ? 0.7 : 1 }}
              >
                {isRenamingCategory ? "Saving..." : "Save Category"}
              </button>
              <button
                onClick={() => { setRenameCategoryTarget(null); setRenameCategoryNewName(""); setEditCategorySelectedProductIds([]); }}
                className={styles.secondaryActionBtn}
                disabled={isRenamingCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteReviewTarget && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.unsavedModal} ${styles.mobileAlertModalOverride}`}>
            <div className={`${styles.modalHeader} ${styles.mobileAlertHeader}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ef4444" className={styles.mobileAlertIcon} style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Confirm Deletion</h3>
            </div>
            <p className={`${styles.modalDescription} ${styles.mobileAlertDescription}`}>
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className={`${styles.modalActionRow} ${styles.mobileAlertActionRow}`}>
              <button
                onClick={handleDeleteAdminReviewConfirm}
                disabled={isDeletingReview}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingReview ? 0.7 : 1 }}
              >
                {isDeletingReview ? "Deleting..." : "Delete Review"}
              </button>
              <button
                onClick={() => setDeleteReviewTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editReviewTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <h3>Edit Review</h3>
            </div>

            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>Author</label>
                <input
                  type="text"
                  value={editReviewTarget.author || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, author: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>Location</label>
                <input
                  type="text"
                  value={editReviewTarget.location || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, location: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editReviewTarget.rating || 5}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, rating: Number(e.target.value) })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>Title</label>
                <input
                  type="text"
                  value={editReviewTarget.title || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 400, marginBottom: "8px", color: "#374151" }}>Comment</label>
                <textarea
                  value={editReviewTarget.comment || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, comment: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem", minHeight: "100px", resize: "vertical" }}
                />
              </div>
            </div>

            <div className={styles.modalActionRow} style={{ marginTop: "20px" }}>
              <button
                onClick={handleEditReviewSubmit}
                disabled={isEditingReview || !editReviewTarget.comment?.trim() || !editReviewTarget.author?.trim()}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6", opacity: (isEditingReview || !editReviewTarget.comment?.trim() || !editReviewTarget.author?.trim()) ? 0.7 : 1 }}
              >
                {isEditingReview ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditReviewTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={isEditingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Status Update Modal */}
      {returnStatusModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 400, color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                {returnStatusAction.newStatus === "Approved" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10b981" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {returnStatusAction.newStatus === "Approved" ? "Approve Return" : "Reject Return"}
              </h3>
              <button
                type="button"
                onClick={() => setReturnStatusModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 0,
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
                {returnStatusAction.newStatus === "Approved" 
                  ? "You are approving this return request. Optionally, provide a note to the customer with instructions on what to do next (e.g. tracking info, timeline)."
                  : "You are rejecting this return request. Please provide a reason to the customer explaining why the claim was denied."
                }
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 400, color: "#475569" }}>
                  {returnStatusAction.newStatus === "Approved" ? "Note to Customer (Optional)" : "Reason for Rejection (Required)"}
                </label>
                <textarea
                  value={returnStatusNotes}
                  onChange={(e) => setReturnStatusNotes(e.target.value)}
                  placeholder={returnStatusAction.newStatus === "Approved" ? "e.g. A replacement has been dispatched and will arrive in 3-5 days." : "e.g. The damage shown is not covered by transit damage policy."}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.88rem",
                    color: "#0f172a",
                    minHeight: "100px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#94a3b8")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              padding: "16px 24px",
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #f1f5f9"
            }}>
              <button
                type="button"
                onClick={() => setReturnStatusModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  backgroundColor: "#ffffff",
                  color: "#475569",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={returnStatusAction.newStatus === "Rejected" && !returnStatusNotes.trim()}
                onClick={() => executeReturnStatusUpdate(returnStatusAction.orderId, returnStatusAction.newStatus, returnStatusNotes)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  backgroundColor: returnStatusAction.newStatus === "Approved" ? "#10b981" : "#ef4444",
                  color: "#ffffff",
                  cursor: (returnStatusAction.newStatus === "Rejected" && !returnStatusNotes.trim()) ? "not-allowed" : "pointer",
                  opacity: (returnStatusAction.newStatus === "Rejected" && !returnStatusNotes.trim()) ? 0.5 : 1
                }}
              >
                Confirm {returnStatusAction.newStatus}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
