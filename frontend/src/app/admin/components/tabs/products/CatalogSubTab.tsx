import React from 'react';
import styles from '../../../page.module.css';
import { Product } from '../../../types';

interface CatalogSubTabProps {
  activeTab: any;
    setIsEditing: any;
  resetForm: any;
  setShowCrudModal: any;
  error: any;
  showCrudModal: any;
  loading: any;
  filteredProducts: any;
  expandedProducts: any;
  toggleExpand: any;
  setActiveCategoryPopoverProductId: any;
  activeCategoryPopoverProductId: any;
  handleEdit: any;
  setDeleteTargetId: any;
  selectedCategoryView: any;
  setSelectedCategoryView: any;
  setShowCategoryAddOptionsModal: any;
  products: any;
  setNewCategoryName: any;
  setSelectedProductIds: any;
  setCategoryModalError: any;
  setShowAddCategoryModal: any;
  allCategories: any;
  setRenameCategoryTarget: any;
  setRenameCategoryNewName: any;
  setDeleteCategoryTarget: any;
}

export default function CatalogSubTab({
  activeTab,
  setIsEditing,
  resetForm,
  setShowCrudModal,
  error,
  showCrudModal,
  loading,
  filteredProducts,
  expandedProducts,
  toggleExpand,
  setActiveCategoryPopoverProductId,
  activeCategoryPopoverProductId,
  handleEdit,
  setDeleteTargetId,
  selectedCategoryView,
  setSelectedCategoryView,
  setShowCategoryAddOptionsModal,
  products,
  setNewCategoryName,
  setSelectedProductIds,
  setCategoryModalError,
  setShowAddCategoryModal,
  allCategories,
  setRenameCategoryTarget,
  setRenameCategoryNewName,
  setDeleteCategoryTarget
}: CatalogSubTabProps) {
  const activeSubTab = "all" as string;

  return (
    <>
          {activeTab === "products" && activeSubTab === "all" && (
            <div className={styles.viewContainer} style={{ gap: "16px", marginTop: "-12px" }}>
              <div className={styles.hideOnMobile} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.hideOnMobile} style={{ width: "22px", height: "22px", color: "#000" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>Products</h1>
                </div>
                <button
                  className={`${styles.addPerfumeBtn} ${styles.hideOnMobile}`}
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                    setShowCrudModal(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add new product
                </button>
              </div>

              {error && !showCrudModal && <div className={styles.errorBanner} style={{ marginBottom: "20px" }}>{error}</div>}

              {/* Centered Table Panel */}
              <div className={styles.tablePanelFull}>
                {/* Desktop Layout (Hidden on Mobile to prevent empty padded card) */}
                <div className={`${styles.dashboardCard} ${styles.hideOnMobile}`}>
                  
                  <div className={styles.hideOnMobile}>
                    <h2 className={styles.cardHeaderTitle}>All Products</h2>

                  {loading ? (
                    <div className={styles.loadingState}>
                      <div className={styles.spinner} />
                      <p>Loading database inventory...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No perfumes cataloged. Create your first product by clicking &quot;Add new product&quot; above!</p>
                    </div>
                  ) : (
                    <div className={styles.tableResponsive}>
                      <table className={styles.inventoryTable}>
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Cover</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product: any) => {
                            const hasVariants = (product.options && product.options.length > 0) || (product.variants && product.variants.length > 0);
                            const variantsList = product.options && product.options.length > 0 ? product.options : (product.variants || []);
                            const isExpanded = expandedProducts.has(product._id!);

                            return (
                              <React.Fragment key={product._id}>
                                <tr>
                                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    {hasVariants && (
                                      <button
                                        onClick={() => toggleExpand(product._id!)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title={isExpanded ? "Hide Variants" : "Show Variants"}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={2.5}
                                          stroke="currentColor"
                                          style={{ width: "16px", height: "16px", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                      </button>
                                    )}
                                  </td>
                                  <td>
                                    <img
                                      src={product.imageFront}
                                      alt={product.name}
                                      className={styles.tableThumb}
                                    />
                                  </td>
                                  <td>
                                    <span className={styles.tableName}>{product.name}</span>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: "0.82rem", color: "#374151" }}>
                                      {(() => {
                                        const cats = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);
                                        if (cats.length === 0) return <span style={{ color: "#9ca3af" }}>Uncategorized</span>;
                                        const firstCat = cats[0];
                                        const remainingCount = cats.length - 1;
                                        return (
                                          <>
                                            <span>{firstCat}</span>
                                            {remainingCount > 0 && (
                                              <div style={{ position: "relative", display: "inline-block" }}>
                                                <span
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveCategoryPopoverProductId(
                                                      activeCategoryPopoverProductId === product._id ? null : (product._id || null)
                                                    );
                                                  }}
                                                  style={{
                                                    color: "#4f46e5",
                                                    fontWeight: 700,
                                                    marginLeft: "4px",
                                                    cursor: "pointer",
                                                    textDecoration: "underline"
                                                  }}
                                                  title="Click to view remaining categories"
                                                >
                                                  +{remainingCount}
                                                </span>
                                                {activeCategoryPopoverProductId === product._id && (
                                                  <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                      position: "absolute",
                                                      top: "20px",
                                                      left: "0",
                                                      backgroundColor: "#ffffff",
                                                      border: "1px solid #e5e7eb",
                                                      borderRadius: "8px",
                                                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                                      padding: "10px",
                                                      zIndex: 100,
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      gap: "6px",
                                                      minWidth: "150px"
                                                    }}
                                                  >
                                                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", paddingBottom: "4px", borderBottom: "1px solid #f3f4f6", marginBottom: "2px" }}>Other Categories</span>
                                                    {cats.slice(1).map((cat: any) => (
                                                      <span key={cat} style={{ fontSize: "0.8rem", color: "#111827" }}>
                                                        {cat}
                                                      </span>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </td>
                                  <td>
                                    <span className={styles.tablePrice}>
                                      {(() => {
                                        if (hasVariants && variantsList.length > 0) {
                                          const prices = variantsList.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p));
                                          if (prices.length > 0) {
                                            const min = Math.min(...prices);
                                            const max = Math.max(...prices);
                                            return min === max
                                              ? `₹${min.toLocaleString("en-IN")}`
                                              : `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
                                          }
                                        }
                                        return `₹${Number(product.price).toLocaleString("en-IN")}`;
                                      })()}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      color: (product.quantity !== undefined ? Number(product.quantity) : 0) <= 3 ? "#dc2626" : (product.quantity !== undefined ? Number(product.quantity) : 0) <= 10 ? "#d97706" : "#374151"
                                    }}>
                                      {product.quantity !== undefined ? product.quantity : 0}
                                    </span>
                                  </td>
                                  <td>
                                    <div className={styles.actionGroup}>
                                      <button
                                        onClick={() => handleEdit(product)}
                                        className={styles.editActionBtn}
                                        style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                        title="Edit Product"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => setDeleteTargetId(product._id!)}
                                        className={styles.deleteActionBtn}
                                        style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                        title="Delete Product"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && hasVariants && variantsList.map((v: any, i: number) => (
                                  <tr key={`variant-${product._id}-${i}`} style={{ backgroundColor: "#f9fafb", borderBottom: i === variantsList.length - 1 ? "1px solid #e5e7eb" : "1px solid #f3f4f6" }}>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={2}>
                                      <span style={{ fontSize: "0.85rem", color: "#4b5563", fontWeight: 500 }}>Variant: {v.size}</span>
                                    </td>
                                    <td>
                                      <span className={styles.tablePrice} style={{ fontSize: "0.85rem" }}>₹{Number(v.price).toLocaleString("en-IN")}</span>
                                    </td>
                                    <td>
                                      <span style={{
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        color: Number(v.quantity) <= 3 ? "#dc2626" : Number(v.quantity) <= 10 ? "#d97706" : "#374151"
                                      }}>
                                        {v.quantity}
                                      </span>
                                    </td>
                                    <td>
                                      <div className={styles.actionGroup}>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                          className={styles.editActionBtn}
                                          style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                          title="Edit Variant"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setDeleteTargetId(product._id!); }}
                                          className={styles.deleteActionBtn}
                                          style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                          title="Delete Variant"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  </div> {/* End of hideOnMobile */}
                </div> {/* End of desktop dashboardCard */}
                  
                  {/* Mobile Layout */}
                  <div className={styles.showOnMobile} style={{ width: '100%', flexDirection: 'column', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>All Products</h2>
                            <span style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 400 }}>
                                {filteredProducts.length} products · {filteredProducts.reduce((acc: number, p: any) => acc + (p.quantity || 0), 0)} units in stock
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                resetForm();
                                setShowCrudModal(true);
                            }}
                            style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 14px', fontSize: '0.85rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add product
                        </button>
                    </div>

                    <div style={{ padding: '0 20px' }}>
                        {loading ? (
                            <div className={styles.loadingState} style={{ padding: '40px 0' }}>
                                <div className={styles.spinner} />
                                <p>Loading database inventory...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className={styles.emptyState} style={{ padding: '40px 0' }}>
                                <p>No products cataloged.</p>
                            </div>
                        ) : (
                            filteredProducts.map((product: any) => {
                                const hasVariants = (product.options && product.options.length > 0) || (product.variants && product.variants.length > 0);
                                const variantsList = product.options && product.options.length > 0 ? product.options : (product.variants || []);
                                const isExpanded = expandedProducts.has(product._id!);
                                
                                let minPrice = Number(product.price);
                                let maxPrice = Number(product.price);
                                if (hasVariants && variantsList.length > 0) {
                                    const prices = variantsList.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p));
                                    if (prices.length > 0) {
                                        minPrice = Math.min(...prices);
                                        maxPrice = Math.max(...prices);
                                    }
                                }

                                const cats = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);
                                const catLabel = cats.length > 0 ? cats[0] : "Uncategorized";
                                const totalQty = product.quantity !== undefined ? product.quantity : (hasVariants ? variantsList.reduce((acc: number, v: any) => acc + (Number(v.quantity) || 0), 0) : 0);
                                const qtyColor = totalQty <= 3 ? "#fce8e8" : totalQty <= 10 ? "#fef3c7" : "#e6f4ea";
                                const qtyTextColor = totalQty <= 3 ? "#991b1b" : totalQty <= 10 ? "#92400e" : "#166534";

                                return (
                                    <div key={product._id} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: (hasVariants && isExpanded) ? 'none' : '1px solid #f3f4f6' }}>
                                            <div style={{ width: '70px', height: '70px', borderRadius: '0px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                {product.imageFront ? (
                                                    <img src={product.imageFront} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '24px', height: '24px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                                                )}
                                            </div>
                                            <div style={{ marginLeft: '16px', flex: 1 }}>
                                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#000', margin: '0 0 4px 0' }}>{product.name}</h3>
                                                <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>{catLabel}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#000' }}>
                                                        {minPrice === maxPrice ? `₹${minPrice.toLocaleString("en-IN")}` : `₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice.toLocaleString("en-IN")}`}
                                                    </span>
                                                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 400, backgroundColor: qtyColor, color: qtyTextColor }}>
                                                        {totalQty}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '70px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => handleEdit(product)} style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'transparent', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteTargetId(product._id!)} style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'transparent', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                                {hasVariants && (
                                                    <span onClick={() => toggleExpand(product._id!)} style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, cursor: 'pointer' }}>
                                                        {variantsList.length} sizes
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6"/></svg>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {hasVariants && isExpanded && (
                                            <div style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {variantsList.map((v: any, i: number) => {
                                                    const vQty = Number(v.quantity) || 0;
                                                    const vQtyColor = vQty <= 3 ? "#fce8e8" : vQty <= 10 ? "#fcf0c2" : "#fff8e7"; // adjusting slightly for screenshot
                                                    const vQtyTextColor = vQty <= 3 ? "#dc2626" : vQty <= 10 ? "#d97706" : "#4b5563"; // using similar colors
                                                    
                                                    // In screenshot: 9 left has yellow/orange pill, 2 left has pink/red pill
                                                    const pillBg = vQty <= 3 ? "#fff1f2" : vQty <= 10 ? "#fffbeb" : "#f3f4f6";
                                                    const pillText = vQty <= 3 ? "#e11d48" : vQty <= 10 ? "#d97706" : "#4b5563";

                                                    return (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i === variantsList.length - 1 ? '0' : '16px', borderBottom: i === variantsList.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{ padding: '6px 12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#4b5563', minWidth: '60px', textAlign: 'center' }}>{v.size}</span>
                                                                <span style={{ fontSize: '1rem', fontWeight: 400, color: '#000' }}>₹{Number(v.price).toLocaleString("en-IN")}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 400, backgroundColor: pillBg, color: pillText }}>
                                                                    {vQty} left
                                                                </span>
                                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(product); }} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                  </div>
              </div>
            </div>
          )}

          {activeTab === "products" && activeSubTab === "categories" && (
            selectedCategoryView ? (
              <div key={`cat-detail-${selectedCategoryView}`} className={styles.viewContainerSlideRight} style={{ gap: "16px", marginTop: "-12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                      onClick={() => setSelectedCategoryView(null)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      title="Back to Categories"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid #e5e7eb", paddingLeft: "15px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                      </svg>
                      <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>{selectedCategoryView} Collection</h1>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCategoryAddOptionsModal(true);
                    }}
                    className={styles.addPerfumeBtn}
                    style={{ padding: "8px 16px", fontSize: "0.7rem" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new product
                  </button>
                </div>

                {/* Category catalog inventory */}
                <div className={styles.tablePanelFull}>
                  <div className={styles.dashboardCard}>
                    <h2 className={styles.cardHeaderTitle}>Category Catalog Inventory</h2>
                    {products.filter((p: any) => Array.isArray(p.category) ? p.category.includes(selectedCategoryView) : p.category === selectedCategoryView).length === 0 ? (
                      <div className={styles.emptyState} style={{ padding: "40px 20px" }}>
                        <p>No products cataloged in this category yet. Click &quot;Add new product&quot; above to create one!</p>
                      </div>
                    ) : (
                      <div className={styles.tableResponsive}>
                        <table className={styles.inventoryTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }}></th>
                              <th>Cover</th>
                              <th>Product</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Making Price</th>
                              <th>Stock</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products
                              .filter((p: any) => Array.isArray(p.category) ? p.category.includes(selectedCategoryView) : p.category === selectedCategoryView)
                              .sort((a: any, b: any) => a.name.localeCompare(b.name))
                              .map((product: any) => {
                                const hasVariants = (product.options && product.options.length > 0) || (product.variants && product.variants.length > 0);
                                const variantsList = product.options && product.options.length > 0 ? product.options : (product.variants || []);
                                const isExpanded = expandedProducts.has(product._id!);

                                return (
                                  <React.Fragment key={product._id}>
                                    <tr>
                                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        {hasVariants && (
                                          <button
                                            onClick={() => toggleExpand(product._id!)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title={isExpanded ? "Hide Variants" : "Show Variants"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={2.5}
                                              stroke="currentColor"
                                              style={{ width: "16px", height: "16px", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                                            >
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>
                                          </button>
                                        )}
                                      </td>
                                      <td>
                                        <img
                                          src={product.imageFront}
                                          alt={product.name}
                                          className={styles.tableThumb}
                                        />
                                      </td>
                                      <td>
                                        <span className={styles.tableName}>{product.name}</span>
                                      </td>
                                      <td>
                                        <div style={{ fontSize: "0.82rem", color: "#374151" }}>
                                          {(() => {
                                            const cats = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);
                                            if (cats.length === 0) return <span style={{ color: "#9ca3af" }}>Uncategorized</span>;
                                            const firstCat = cats[0];
                                            const remainingCount = cats.length - 1;
                                            return (
                                              <>
                                                <span>{firstCat}</span>
                                                {remainingCount > 0 && (
                                                  <div style={{ position: "relative", display: "inline-block" }}>
                                                    <span
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveCategoryPopoverProductId(
                                                          activeCategoryPopoverProductId === product._id ? null : (product._id || null)
                                                        );
                                                      }}
                                                      style={{
                                                        color: "#4f46e5",
                                                        fontWeight: 700,
                                                        marginLeft: "4px",
                                                        cursor: "pointer",
                                                        textDecoration: "underline"
                                                      }}
                                                      title="Click to view remaining categories"
                                                    >
                                                      +{remainingCount}
                                                    </span>
                                                    {activeCategoryPopoverProductId === product._id && (
                                                      <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                          position: "absolute",
                                                          top: "20px",
                                                          left: "0",
                                                          backgroundColor: "#ffffff",
                                                          border: "1px solid #e5e7eb",
                                                          borderRadius: "8px",
                                                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                                          padding: "10px",
                                                          zIndex: 100,
                                                          display: "flex",
                                                          flexDirection: "column",
                                                          gap: "6px",
                                                          minWidth: "150px"
                                                        }}
                                                      >
                                                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", paddingBottom: "4px", borderBottom: "1px solid #f3f4f6", marginBottom: "2px" }}>Other Categories</span>
                                                        {cats.slice(1).map((cat: any) => (
                                                          <span key={cat} style={{ fontSize: "0.8rem", color: "#111827" }}>
                                                            {cat}
                                                          </span>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </>
                                            );
                                          })()}
                                        </div>
                                      </td>
                                      <td>
                                        <span className={styles.tablePrice}>
                                          {(() => {
                                            if (hasVariants && variantsList.length > 0) {
                                              const prices = variantsList.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p));
                                              if (prices.length > 0) {
                                                const min = Math.min(...prices);
                                                const max = Math.max(...prices);
                                                return min === max
                                                  ? `₹${min.toLocaleString("en-IN")}`
                                                  : `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
                                              }
                                            }
                                            return `₹${Number(product.price).toLocaleString("en-IN")}`;
                                          })()}
                                        </span>
                                      </td>
                                      <td>
                                        <span className={styles.tablePrice}>
                                          {(() => {
                                            if (hasVariants && variantsList.length > 0) {
                                              const makingPrices = variantsList.map((v: any) => Number(v.makingPrice)).filter((p: number) => !isNaN(p));
                                              if (makingPrices.length > 0) {
                                                const min = Math.min(...makingPrices);
                                                const max = Math.max(...makingPrices);
                                                return min === max
                                                  ? `₹${min.toLocaleString("en-IN")}`
                                                  : `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
                                              }
                                            }
                                            return `₹${Number(product.makingPrice || 0).toLocaleString("en-IN")}`;
                                          })()}
                                        </span>
                                      </td>
                                      <td>
                                        <span style={{
                                          fontSize: "0.85rem",
                                          fontWeight: 600,
                                          color: (product.quantity !== undefined ? Number(product.quantity) : 0) <= 3 ? "#dc2626" : (product.quantity !== undefined ? Number(product.quantity) : 0) <= 10 ? "#d97706" : "#374151"
                                        }}>
                                          {product.quantity !== undefined ? product.quantity : 0}
                                        </span>
                                      </td>
                                      <td>
                                        <div className={styles.actionGroup}>
                                          <button
                                            onClick={() => handleEdit(product)}
                                            className={styles.editActionBtn}
                                            style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                            title="Edit Product"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => setDeleteTargetId(product._id!)}
                                            className={styles.deleteActionBtn}
                                            style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                            title="Delete Product"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                    {isExpanded && hasVariants && variantsList.map((v: any, i: number) => (
                                      <tr key={`variant-${product._id}-${i}`} style={{ backgroundColor: "#f9fafb", borderBottom: i === variantsList.length - 1 ? "1px solid #e5e7eb" : "1px solid #f3f4f6" }}>
                                        <td></td>
                                        <td></td>
                                        <td colSpan={2}>
                                          <span style={{ fontSize: "0.85rem", color: "#4b5563", fontWeight: 500 }}>Variant: {v.size}</span>
                                        </td>
                                        <td>
                                          <span className={styles.tablePrice} style={{ fontSize: "0.85rem" }}>₹{Number(v.price).toLocaleString("en-IN")}</span>
                                        </td>
                                        <td>
                                          <span className={styles.tablePrice} style={{ fontSize: "0.85rem", color: "#6b7280" }}>₹{Number(v.makingPrice || 0).toLocaleString("en-IN")}</span>
                                        </td>
                                        <td>
                                          <span style={{
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            color: Number(v.quantity) <= 3 ? "#dc2626" : Number(v.quantity) <= 10 ? "#d97706" : "#374151"
                                          }}>
                                            {v.quantity}
                                          </span>
                                        </td>
                                        <td>
                                          <div className={styles.actionGroup}>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                              className={styles.editActionBtn}
                                              style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                              title="Edit Variant"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); setDeleteTargetId(product._id!); }}
                                              className={styles.deleteActionBtn}
                                              style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                              title="Delete Variant"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                              </svg>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key="cat-list" className={styles.viewContainerSlideLeft} style={{ gap: "16px", marginTop: "-12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                    </svg>
                    <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>Categories</h1>
                  </div>
                  <button
                    onClick={() => {
                      setNewCategoryName("");
                      setSelectedProductIds([]);
                      setCategoryModalError(null);
                      setShowAddCategoryModal(true);
                    }}
                    className={styles.addPerfumeBtn}
                    style={{ padding: "8px 16px", fontSize: "0.7rem" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Category
                  </button>
                </div>

                {/* Categories list panel */}
                <div className={styles.tablePanelFull}>
                  <div className={styles.dashboardCard}>
                    <h2 className={styles.cardHeaderTitle}>All Categories</h2>
                    <div className={styles.tableResponsive}>
                      <table className={styles.inventoryTable}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left" }}>CategoryName</th>
                            <th style={{ textAlign: "center" }}>ProductsCount</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allCategories.map((catName: any) => (
                            <tr key={catName}>
                              <td style={{ textAlign: "left" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px", color: "#6b7280" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                                  </svg>
                                  <strong>{catName}</strong>
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <span className={styles.badgeCount} style={{ display: "inline-block", padding: "4px 10px", fontSize: "0.85rem", background: "#f3f4f6", color: "#000", borderRadius: "20px" }}>
                                  {products.filter((p: any) => Array.isArray(p.category) ? p.category.includes(catName) : p.category === catName).length} products
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
                                  <button
                                    onClick={() => {
                                      setSelectedCategoryView(catName);
                                    }}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#4b5563",
                                      padding: "6px",
                                      borderRadius: "4px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background-color 0.2s, color 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                    title="View Products"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRenameCategoryTarget(catName);
                                      setRenameCategoryNewName(catName);
                                    }}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#4b5563",
                                      padding: "6px",
                                      borderRadius: "4px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background-color 0.2s, color 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                    title="Edit Category"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                  </button>
                                  {catName !== "Latest Arrivals" && catName !== "Best Seller" && (
                                    <button
                                      onClick={() => setDeleteCategoryTarget(catName)}
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#ef4444",
                                        padding: "6px",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "background-color 0.2s, color 0.2s"
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                      title="Delete Category"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

    </>
  );
}
