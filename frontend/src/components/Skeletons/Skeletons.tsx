import React from 'react';

// 1. Dashboard Stats Card Skeleton
export const StatCardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        minHeight: '120px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-shimmer" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton-shimmer" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
      </div>
      <div className="skeleton-shimmer" style={{ width: '65%', height: '28px', marginTop: '4px' }} />
      <div className="skeleton-shimmer" style={{ width: '50%', height: '12px' }} />
    </div>
  );
};

// 2. Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <div className="skeleton-shimmer" style={{ width: '100%', aspectRatio: '1/1' }} />
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skeleton-shimmer" style={{ width: '30%', height: '10px' }} />
        <div className="skeleton-shimmer" style={{ width: '85%', height: '16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <div className="skeleton-shimmer" style={{ width: '40%', height: '18px' }} />
          <div className="skeleton-shimmer" style={{ width: '30px', height: '30px', borderRadius: '6px' }} />
        </div>
      </div>
    </div>
  );
};

// 3. Table Rows Skeleton
interface TableRowSkeletonProps {
  columns?: number;
  rows?: number;
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({ columns = 5, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} style={{ borderBottom: '1px solid #f3f4f6' }}>
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
              <div
                className="skeleton-shimmer"
                style={{
                  width: cIdx === 0 ? '60%' : cIdx === columns - 1 ? '40%' : '80%',
                  height: '14px'
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// 4. Chart Section Skeleton
export const ChartSkeleton: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '300px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-shimmer" style={{ width: '30%', height: '18px' }} />
        <div className="skeleton-shimmer" style={{ width: '20%', height: '14px' }} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          height: '200px',
          paddingTop: '20px'
        }}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton-shimmer"
            style={{
              flex: 1,
              height: `${30 + ((idx * 23) % 65)}%`,
              borderRadius: '4px 4px 0 0'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 5. Product Detail Page Skeleton (Preview Page)
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}
      >
        {/* Left Gallery Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton-shimmer" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-shimmer" style={{ width: '70px', height: '70px', borderRadius: '8px' }} />
            ))}
          </div>
        </div>

        {/* Right Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="skeleton-shimmer" style={{ width: '25%', height: '14px' }} />
          <div className="skeleton-shimmer" style={{ width: '80%', height: '32px' }} />
          <div className="skeleton-shimmer" style={{ width: '40%', height: '24px' }} />
          <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="skeleton-shimmer" style={{ width: '20%', height: '14px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              {['S', 'M', 'L', 'XL'].map((s) => (
                <div key={s} className="skeleton-shimmer" style={{ width: '45px', height: '40px', borderRadius: '8px' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <div className="skeleton-shimmer" style={{ flex: 1, height: '52px', borderRadius: '30px' }} />
            <div className="skeleton-shimmer" style={{ flex: 1, height: '52px', borderRadius: '30px' }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: '100%', height: '80px', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
};

// 6. Storefront Grid Skeleton (Shop / Collections Page)
export const StorefrontGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
        width: '100%',
        padding: '20px 0'
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

// 7. Search Results List Skeleton
export const SearchListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}
        >
          <div
            className="skeleton-shimmer"
            style={{ width: '44px', height: '44px', borderRadius: '8px', marginRight: '12px', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <div className="skeleton-shimmer" style={{ width: `${45 + ((idx * 20) % 35)}%`, height: '14px', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ width: '25%', height: '10px', borderRadius: '4px' }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: '45px', height: '14px', borderRadius: '4px', marginLeft: '12px', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
};

