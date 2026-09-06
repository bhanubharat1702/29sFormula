import React from 'react';
import styles from '../../../page.module.css';
import { Product } from '../../../types';

interface CategoriesSubTabProps {
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
  setEditCategorySelectedProductIds: any;
}

export default function CategoriesSubTab({
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
  setDeleteCategoryTarget,
  setEditCategorySelectedProductIds
}: CategoriesSubTabProps) {
  const activeSubTab = "categories" as string;

  return (
    <>
          {activeTab === "products" && activeSubTab === "all" && (
            <div className={styles.viewContainer} style={{ gap: "16px", marginTop: "-12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>Products</h1>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                    setShowCrudModal(true);
                  }}
                  className={styles.addPerfumeBtn}
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
                <div className={styles.dashboardCard}>
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
                            <th>ProductDetails</th>
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
                                    <span className={styles.tableDesc}>{product.description || "No description set"}</span>
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
                      <>
                        {/* Desktop View */}
                        <div className={`${styles.tableResponsive} ${styles.hideOnMobile}`}>
                          <table className={styles.inventoryTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Cover</th>
                                <th>ProductDetails</th>
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
                                          <span className={styles.tableDesc}>{product.description || "No description set"}</span>
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

                        {/* Mobile View */}
                        <div className={styles.showOnMobile} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "15px" }}>
                          {products
                            .filter((p: any) => Array.isArray(p.category) ? p.category.includes(selectedCategoryView) : p.category === selectedCategoryView)
                            .sort((a: any, b: any) => a.name.localeCompare(b.name))
                            .map((product: any) => {
                              const hasVariants = (product.options && product.options.length > 0) || (product.variants && product.variants.length > 0);
                              const variantsList = product.options && product.options.length > 0 ? product.options : (product.variants || []);
                              const isExpanded = expandedProducts.has(product._id!);
                              const totalStock = hasVariants ? variantsList.reduce((acc: number, v: any) => acc + (Number(v.quantity) || 0), 0) : (product.quantity || 0);

                              return (
                                <div key={`mobile-${product._id}`} style={{ display: "flex", flexDirection: "column", backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                                  <div style={{ display: "flex", gap: "15px" }}>
                                    <img src={product.imageFront} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #f3f4f6" }} alt={product.name} />
                                    <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                                      <div>
                                        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#111827", lineHeight: "1.2" }}>{product.name}</h3>
                                        <span style={{ fontSize: "0.85rem", color: "#6b7280", display: "block" }}>
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
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "4px 8px", backgroundColor: "#f3f4f6", borderRadius: "6px", color: totalStock <= 3 ? "#dc2626" : "#374151" }}>
                                          Stock: {totalStock}
                                        </span>
                                        {hasVariants && (
                                          <button onClick={() => toggleExpand(product._id!)} style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 600, background: "none", border: "none", display: "flex", alignItems: "center", gap: "4px", padding: 0 }}>
                                            Variants <svg style={{ width: "14px", height: "14px", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {isExpanded && hasVariants && (
                                    <div style={{ marginTop: "16px", borderTop: "1px solid #f3f4f6", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                      {variantsList.map((v: any, i: number) => (
                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", backgroundColor: "#f9fafb", padding: "10px", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                                          <span style={{ fontWeight: 600, color: "#374151" }}>{v.size}</span>
                                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                            <span style={{ fontWeight: 700, color: "#111827" }}>₹{Number(v.price).toLocaleString("en-IN")}</span>
                                            <span style={{ color: Number(v.quantity) <= 3 ? "#dc2626" : "#6b7280", fontWeight: 500, fontSize: "0.8rem" }}>{v.quantity} qty</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div style={{ display: "flex", gap: "8px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
                                    <button onClick={() => handleEdit(product)} style={{ flex: 1, padding: "10px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", color: "#374151", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                      </svg>
                                      Edit
                                    </button>
                                    <button onClick={() => setDeleteTargetId(product._id!)} style={{ flex: 1, padding: "10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", color: "#dc2626", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                      </svg>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
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
                    {/* Desktop View */}
                    <div className={`${styles.tableResponsive} ${styles.hideOnMobile}`}>
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
                                      const productsInCat = products.filter((p: any) => {
                                        const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
                                        return cats.includes(catName);
                                      }).map((p: any) => p._id);
                                      setEditCategorySelectedProductIds(productsInCat);
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

                    {/* Mobile View */}
                    <div className={styles.showOnMobile} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                      {allCategories.map((catName: any) => (
                        <div key={catName} style={{ display: "flex", flexDirection: "column", backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ backgroundColor: "#f3f4f6", padding: "8px", borderRadius: "8px", color: "#4b5563" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                                </svg>
                              </div>
                              <strong style={{ fontSize: "1.1rem", color: "#111827" }}>{catName}</strong>
                            </div>
                            <span style={{ display: "inline-block", padding: "4px 10px", fontSize: "0.8rem", fontWeight: 700, background: "#f3f4f6", color: "#374151", borderRadius: "20px" }}>
                              {products.filter((p: any) => Array.isArray(p.category) ? p.category.includes(catName) : p.category === catName).length} items
                            </span>
                          </div>
                          
                          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", paddingTop: "12px", gap: "8px" }}>
                            <button
                              onClick={() => setSelectedCategoryView(catName)}
                              style={{ flex: 1, padding: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#374151", fontSize: "0.85rem", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => {
                                setRenameCategoryTarget(catName);
                                setRenameCategoryNewName(catName);
                                const productsInCat = products.filter((p: any) => {
                                  const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
                                  return cats.includes(catName);
                                }).map((p: any) => p._id);
                                setEditCategorySelectedProductIds(productsInCat);
                              }}
                              style={{ flex: 1, padding: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#374151", fontSize: "0.85rem", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                              Edit
                            </button>
                            {catName !== "Latest Arrivals" && catName !== "Best Seller" && (
                              <button
                                onClick={() => setDeleteCategoryTarget(catName)}
                                style={{ flex: 1, padding: "8px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.85rem", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

    </>
  );
}
