import React, { useState, useEffect } from 'react';
import styles from '../../page.module.css';
import { DashboardStats } from '../../types';

const generateChartPath = (
  data: { date: string; sales: number; orders: number; profit?: number }[],
  key: "sales" | "orders" | "profit",
  maxX: number,
  minX: number,
  maxY: number,
  minY: number
) => {
  if (!data || data.length === 0) return `M ${minX} ${minY} L ${maxX} ${minY}`;
  const maxValue = Math.max(...data.map(d => d[key] || 0), 1);
  const width = maxX - minX;
  const height = minY - maxY;
  const step = width / Math.max(data.length - 1, 1);

  let path = "";
  data.forEach((d, i) => {
    const x = minX + i * step;
    const y = minY - ((d[key] || 0) / maxValue) * height;
    if (i === 0) {
      path += `M ${x} ${y} `;
    } else {
      const prevX = minX + (i - 1) * step;
      const prevY = minY - ((data[i - 1][key] || 0) / maxValue) * height;
      const cpX = prevX + (x - prevX) / 2;
      path += `C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y} `;
    }
  });
  return path;
};

const generateSparklinePath = (
  data: { date: string; sales: number; orders: number }[],
  key: "sales" | "orders",
  maxX: number,
  minX: number,
  maxY: number,
  minY: number,
  fill: boolean
) => {
  if (!data || data.length === 0) return "";
  const sliceData = data.slice(-7);
  const maxValue = Math.max(...sliceData.map(d => d[key]), 1);
  const width = maxX - minX;
  const height = minY - maxY;
  const step = width / Math.max(sliceData.length - 1, 1);

  let path = "";
  sliceData.forEach((d, i) => {
    const x = minX + i * step;
    const y = minY - (d[key] / maxValue) * height;
    if (i === 0) {
      path += `M ${x} ${y} `;
    } else {
      const prevX = minX + (i - 1) * step;
      const prevY = minY - (sliceData[i - 1][key] / maxValue) * height;
      const cpX = prevX + (x - prevX) / 2;
      path += `C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y} `;
    }
  });

  if (fill) {
    path += `L ${maxX} ${minY} L ${minX} ${minY} Z`;
  }
  return path;
};

interface HomeTabProps {
  dashboardStats: DashboardStats | null;
  setActiveTab: (val: any) => void;
  setActiveSubTab: (val: any) => void;
  timelineFilter: string;
  setTimelineFilter: (val: string) => void;
  setSelectedOrder: (val: any) => void;
}

export default function HomeTab({
  dashboardStats,
  setActiveTab,
  setActiveSubTab,
  timelineFilter,
  setTimelineFilter,
  setSelectedOrder
}: HomeTabProps) {
  const [activeChartMetric, setActiveChartMetric] = useState<"sales" | "profit" | "orders">("sales");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilter, setMobileFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let chartData = dashboardStats?.historicalData || [];
  if (isMobile) {
    chartData = chartData.slice(-9);
  }
  
  const rawMax = Math.max(...chartData.map(d => d[activeChartMetric] || 0), 10);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)) || 1);
  const yAxisMax = Math.max(Math.ceil(rawMax / magnitude) * magnitude, 40);
  
  const yTicks = [yAxisMax, yAxisMax * 0.75, yAxisMax * 0.5, yAxisMax * 0.25, 0];
  
  const formatYTick = (val: number) => {
    const isCurrency = activeChartMetric !== "orders";
    const prefix = isCurrency ? "₹" : "";
    if (val === 0) return `${prefix}0`;
    if (val >= 1000) return `${prefix}${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return `${prefix}${val}`;
  };

  const chartW = 800;
  const chartH = 360;
  const leftPad = isMobile ? 75 : 60;
  const rightPad = 20;
  const topPad = 60;
  const bottomPad = isMobile ? 45 : 30;

  const innerW = chartW - leftPad - rightPad;
  const innerH = chartH - topPad - bottomPad;
  const barStep = chartData.length > 0 ? innerW / chartData.length : 0;
  const barWidth = Math.min(48, Math.max(10, barStep * 0.6));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (chartData.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * chartW;
    
    // Find closest bar index based on X coordinate
    let closestIndex = Math.floor((mouseX - leftPad) / barStep);
    if (closestIndex < 0) closestIndex = 0;
    if (closestIndex >= chartData.length) closestIndex = chartData.length - 1;
    setHoveredBarIndex(closestIndex);
  };

  return (
            <div className={styles.viewContainer}>
              <h1 className={styles.pageHeading}>Dashboard</h1>

              {/* Stats widgets layout row */}
              <section className={styles.statsRow}>
                {/* Card 1: Total Revenue */}
                <div className={styles.statBox}>
                  <div className={styles.statTop}>
                    <div className={styles.statIconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={styles.statIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    {(dashboardStats?.cardStats?.totalRevenue.change ?? 0) >= 0 ? (
                      <span className={styles.statPillGreen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                        {dashboardStats?.cardStats?.totalRevenue.change ?? 0}%
                      </span>
                    ) : (
                      <span className={styles.statPillRed}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        {Math.abs(dashboardStats?.cardStats?.totalRevenue.change ?? 0)}%
                      </span>
                    )}
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statMainValue}>
                      ₹{dashboardStats ? (dashboardStats.cardStats?.totalRevenue.value || 0).toLocaleString("en-IN") : "0"}
                    </span>
                    <span className={styles.statMainLabel}>Total Revenue</span>
                    <span className={styles.statSubLabel}>vs last month</span>
                  </div>
                </div>

                {/* Card 2: Total Orders */}
                <div className={styles.statBox}>
                  <div className={styles.statTop}>
                    <div className={styles.statIconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={styles.statIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                    {(dashboardStats?.cardStats?.totalOrders.change ?? 0) >= 0 ? (
                      <span className={styles.statPillGreen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                        {dashboardStats?.cardStats?.totalOrders.change ?? 0}%
                      </span>
                    ) : (
                      <span className={styles.statPillRed}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        {Math.abs(dashboardStats?.cardStats?.totalOrders.change ?? 0)}%
                      </span>
                    )}
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statMainValue}>
                      {dashboardStats ? (dashboardStats.cardStats?.totalOrders.value || 0).toLocaleString() : "0"}
                    </span>
                    <span className={styles.statMainLabel}>Total Orders</span>
                    <span className={styles.statSubLabel}>vs last month</span>
                  </div>
                </div>

                {/* Card 3: Net Profit */}
                <div className={styles.statBox}>
                  <div className={styles.statTop}>
                    <div className={styles.statIconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={styles.statIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                      </svg>
                    </div>
                    {(dashboardStats?.cardStats?.netProfit.change ?? 0) >= 0 ? (
                      <span className={styles.statPillGreen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                        {dashboardStats?.cardStats?.netProfit.change ?? 0}%
                      </span>
                    ) : (
                      <span className={styles.statPillRed}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        {Math.abs(dashboardStats?.cardStats?.netProfit.change ?? 0)}%
                      </span>
                    )}
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statMainValue}>
                      ₹{dashboardStats ? (dashboardStats.cardStats?.netProfit.value || 0).toLocaleString("en-IN") : "0"}
                    </span>
                    <span className={styles.statMainLabel}>Net Profit</span>
                    <span className={styles.statSubLabel}>vs last month</span>
                  </div>
                </div>

                {/* Card 4: Active Customers */}
                <div 
                  className={styles.statBox}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveTab("customers");
                    setActiveSubTab("all");
                  }}
                >
                  <div className={styles.statTop}>
                    <div className={styles.statIconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={styles.statIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                    </div>
                    {(dashboardStats?.cardStats?.activeCustomers.change ?? 0) >= 0 ? (
                      <span className={styles.statPillGreen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                        {dashboardStats?.cardStats?.activeCustomers.change ?? 0}%
                      </span>
                    ) : (
                      <span className={styles.statPillRed}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        {Math.abs(dashboardStats?.cardStats?.activeCustomers.change ?? 0)}%
                      </span>
                    )}
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statMainValue}>
                      {dashboardStats ? (dashboardStats.cardStats?.activeCustomers.value || 0).toLocaleString() : "0"}
                    </span>
                    <span className={styles.statMainLabel}>Active Customers</span>
                    <span className={styles.statSubLabel}>vs last month</span>
                  </div>
                </div>
              </section>

              {/* Middle Row Charts Section */}
              <section className={styles.chartPanelGrid}>
                {/* Main Curve Chart */}
                <div className={styles.chartContainerCard}>
                  <div className={styles.chartTopRow}>
                    <div className={styles.chartTitleBlock}>
                      <span className={styles.chartMainTitle}>Performance Overview</span>
                      <span className={styles.chartSubTitle}>Revenue • Profit • Orders — switch metric below</span>
                      <div className={styles.chartToggles}>
                        <button 
                          className={`${styles.chartToggleBtn} ${activeChartMetric === "sales" ? styles.chartToggleBtnActive : ""}`}
                          onClick={() => setActiveChartMetric("sales")}
                        >
                          Revenue
                        </button>
                        <button 
                          className={`${styles.chartToggleBtn} ${activeChartMetric === "profit" ? styles.chartToggleBtnActive : ""}`}
                          onClick={() => setActiveChartMetric("profit")}
                        >
                          Profit
                        </button>
                        <button 
                          className={`${styles.chartToggleBtn} ${activeChartMetric === "orders" ? styles.chartToggleBtnActive : ""}`}
                          onClick={() => setActiveChartMetric("orders")}
                        >
                          Orders
                        </button>
                      </div>
                    </div>
                    <div className={styles.chartDateRange}>
                      Jan – Sep 2026
                    </div>
                  </div>

                  {/* Combination SVG Chart */}
                  <div className={styles.chartCanvasArea} style={{ position: "relative" }}>
                    <svg 
                      viewBox={`0 0 ${chartW} ${chartH}`} 
                      className={styles.mainSvgChart}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ overflow: 'visible', width: '100%', height: 'auto' }}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#374151" />
                          <stop offset="100%" stopColor="#9ca3af" />
                        </linearGradient>
                      </defs>

                      {/* Y-Axis Grid Lines & Labels */}
                      {yTicks.map((tick, i) => {
                        const y = topPad + (i * (innerH / 4));
                        return (
                          <g key={i}>
                            <line x1={leftPad} y1={y} x2={chartW - rightPad} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                            <text x={leftPad - 10} y={y + 4} fill="#9ca3af" fontSize={isMobile ? "20" : "13"} fontWeight="500" textAnchor="end">
                              {formatYTick(tick)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Bars */}
                      {chartData.map((d, i) => {
                        const val = d[activeChartMetric] || 0;
                        const barH = (val / yAxisMax) * innerH;
                        const x = leftPad + (i * barStep) + (barStep / 2) - (barWidth / 2);
                        const y = topPad + innerH - barH;
                        const isHovered = hoveredBarIndex === i;
                        const isFaded = hoveredBarIndex !== null && hoveredBarIndex !== i;
                        
                        return (
                          <g key={`bar-${i}`}>
                            {/* X-Axis Label */}
                            <text 
                              x={x + barWidth / 2} 
                              y={chartH - bottomPad + (isMobile ? 30 : 20)} 
                              fill={isHovered ? "#000" : "#9ca3af"} 
                              fontWeight={isHovered ? "700" : "500"}
                              fontSize={isMobile ? "20" : "13"} 
                              textAnchor="middle"
                              style={{ transition: 'all 0.2s' }}
                            >
                              {d.date.split(" ")[0]}
                            </text>
                            
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barH}
                              fill={isHovered ? "#374151" : "url(#barGradient)"}
                              opacity={isFaded ? 0.3 : 1}
                              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                            />
                          </g>
                        );
                      })}

                      {/* Profit Trend Line (Overlay) */}
                      {chartData.length > 0 && activeChartMetric === 'sales' && (
                        <path
                          d={chartData.map((d, i) => {
                            const val = d.profit || 0;
                            const profitMax = Math.max(...chartData.map(cd => cd.profit || 0), 10);
                            // Scale trend line proportionally to its own max to remain visible, or scale it to current Y-axis?
                            // Standard combo charts often scale line relative to Y-axis unless it's a dual axis.
                            // We will scale it relative to the yAxisMax so it's a true overlay.
                            const y = topPad + innerH - ((val / yAxisMax) * innerH);
                            const x = leftPad + (i * barStep) + (barStep / 2);
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(" ")}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          style={{ pointerEvents: 'none' }}
                        />
                      )}

                      {/* Profit Trend Dots */}
                      {activeChartMetric === 'sales' && chartData.map((d, i) => {
                        const val = d.profit || 0;
                        const y = topPad + innerH - ((val / yAxisMax) * innerH);
                        const x = leftPad + (i * barStep) + (barStep / 2);
                        return (
                          <circle
                            key={`dot-${i}`}
                            cx={x} cy={y} r="4"
                            fill="#10b981"
                            style={{ pointerEvents: 'none' }}
                          />
                        );
                      })}

                    </svg>

                    {/* Custom Tooltip Overlay */}
                    {hoveredBarIndex !== null && chartData[hoveredBarIndex] && (
                      <div style={{
                        position: 'absolute',
                        left: `${(leftPad + (hoveredBarIndex * barStep) + (barStep / 2)) / chartW * 100}%`,
                        top: `${(topPad + innerH - ((chartData[hoveredBarIndex][activeChartMetric] || 0) / yAxisMax) * innerH - 12) / chartH * 100}%`,
                        transform: 'translate(-50%, -100%)',
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        pointerEvents: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <div style={{ fontWeight: '600' }}>
                          {activeChartMetric === 'sales' ? 'Revenue: ' : activeChartMetric === 'orders' ? 'Orders: ' : 'Profit: '}
                          {activeChartMetric !== 'orders' ? '₹' : ''}{(chartData[hoveredBarIndex][activeChartMetric] || 0).toLocaleString('en-IN')}
                        </div>
                        {activeChartMetric === 'sales' && (
                          <div style={{ fontWeight: '500', color: '#10b981', fontSize: '12px' }}>
                            Profit: ₹{(chartData[hoveredBarIndex].profit || 0).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.chartLegendRow}>
                    <span className={styles.legendText}>
                      <span className={styles.legendIconSquare} />
                      {activeChartMetric === "sales" ? "Revenue" : activeChartMetric === "profit" ? "Profit" : "Orders"}
                    </span>
                    {activeChartMetric === 'sales' && (
                      <span className={styles.legendText}>
                        <span className={styles.legendIconLine} />
                        Profit trend
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Recent Orders Table */}
              <section className={styles.chartPanelGrid} style={{ marginTop: '24px', display: 'block' }}>
                <div className={styles.chartContainerCard}>
                  <div className={`${styles.chartHeader} ${styles.desktopHeaderContainer}`} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div className={styles.chartHeaderLeft}>
                      <span className={styles.chartHeaderLabel}>Latest orders</span>
                    </div>
                    <button 
                      onClick={() => { setActiveTab("orders"); setActiveSubTab("all"); }}
                      style={{ background: 'transparent', border: 'none', color: '#000', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                    >
                      View All
                    </button>
                  </div>

                  <div className={styles.mobileHeaderContainer}>
                    <div className={styles.mobileTitleRow}>
                      <div>
                        <h1 className={styles.mobileTitle}>Latest Orders</h1>
                        <div className={styles.mobileSubtitle}>{dashboardStats?.recentOrders?.length || 0} orders</div>
                      </div>
                      <button className={styles.mobileRefreshBtn} onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }} className={isRefreshing ? styles.spinAnimation : ""}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className={styles.mobileFiltersScroll}>
                      <div className={`${styles.mobileFilterPill} ${mobileFilter === 'All' ? styles.mobileFilterPillActive : ''}`} onClick={() => setMobileFilter('All')}>
                        All <span className={styles.mobileFilterCount}>{dashboardStats?.recentOrders?.length || 0}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${mobileFilter === 'Delivered' ? styles.mobileFilterPillActive : ''}`} onClick={() => setMobileFilter('Delivered')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#166534' }}></div>
                        Delivered <span className={styles.mobileFilterCount}>{dashboardStats?.recentOrders?.filter((o:any)=>o.status==='Delivered').length || 0}</span>
                      </div>
                      <div className={`${styles.mobileFilterPill} ${mobileFilter === 'Processing' ? styles.mobileFilterPillActive : ''}`} onClick={() => setMobileFilter('Processing')}>
                        <div className={styles.mobileStatusDot} style={{ backgroundColor: '#b45309' }}></div>
                        Processing <span className={styles.mobileFilterCount}>{dashboardStats?.recentOrders?.filter((o:any)=>o.status==='Processing').length || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead className={styles.hideOnMobile}>
                        <tr>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>ID</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Name</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Items</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>Qty</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>Amount</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Status</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!dashboardStats ? (
                          <tr><td colSpan={7} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>Loading...</td></tr>
                        ) : !dashboardStats.recentOrders || dashboardStats.recentOrders.length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>No latest orders found.</td></tr>
                        ) : (
                          (mobileFilter === "All" ? dashboardStats.recentOrders : dashboardStats.recentOrders.filter((o:any) => o.status === mobileFilter)).map((order: any) => (
                            <React.Fragment key={order._id}>
                            <tr 
                              className={styles.desktopRow}
                              style={{ borderBottom: '1px solid #f9fafb', cursor: 'pointer' }}
                              onClick={() => setSelectedOrder(order)}
                            >
                              <td style={{ padding: '12px 16px', fontSize: '12px', color: '#374151', verticalAlign: 'top' }}>
                                {order.orderId ? (order.orderId.length > 12 ? order.orderId.substring(0, 4) + '...' + order.orderId.slice(-6) : order.orderId) : `ORD-${order._id.substring(order._id.length - 4).toUpperCase()}`}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '14px', color: '#000', textTransform: 'capitalize', verticalAlign: 'top' }}>
                                {order.customerName ? order.customerName.toLowerCase() : "N/A"}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280', maxWidth: '180px', verticalAlign: 'top' }}>
                                {order.cartItems && order.cartItems.length > 0 
                                  ? order.cartItems.map((item: any, idx: number) => (
                                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                                        <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, color: '#475569', flexShrink: 0 }}>
                                          {item.quantity}x {item.size}
                                        </span>
                                      </div>
                                    ))
                                  : "N/A"}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151', textAlign: 'center', fontWeight: 500, verticalAlign: 'top' }}>
                                {order.cartItems ? order.cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 0}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827', textAlign: 'right', verticalAlign: 'top' }}>
                                ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                                <span style={{ 
                                  display: 'inline-block',
                                  padding: '2px 6px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                                  backgroundColor: order.status === 'Processing' ? '#fef3c7' : order.status === 'Dispatched' ? '#e0e7ff' : order.status === 'Delivered' ? '#dcfce7' : order.status === 'Cancelled' ? '#f3f4f6' : '#fee2e2',
                                  color: order.status === 'Processing' ? '#b45309' : order.status === 'Dispatched' ? '#4338ca' : order.status === 'Delivered' ? '#15803d' : order.status === 'Cancelled' ? '#4b5563' : '#b91c1c'
                                }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280', verticalAlign: 'top' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                            </tr>
                            <tr className={styles.mobileCard} onClick={() => setSelectedOrder(order)}>
                              <td colSpan={7} style={{ padding: 0, border: 'none' }}>
                                <div className={styles.mobileCardContainer}>
                                  <div className={styles.mobileCardHeader}>
                                    <div>
                                      <div className={styles.mobileCustomerName}>{order.customerName ? order.customerName.toLowerCase() : "N/A"}</div>
                                      <div className={styles.mobileOrderMeta}>
                                        {order.orderId ? (order.orderId.length > 12 ? order.orderId.substring(0, 4) + '...' + order.orderId.slice(-6) : order.orderId) : `ORD-${order._id.substring(order._id.length - 4).toUpperCase()}`} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div className={styles.mobileOrderAmount}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</div>
                                      <div className={styles.mobileStatusBadge} style={{
                                        backgroundColor: order.status === 'Processing' ? '#fef3c7' : order.status === 'Dispatched' ? '#e0e7ff' : order.status === 'Delivered' ? '#f0fdf4' : order.status === 'Cancelled' ? '#f3f4f6' : '#fee2e2',
                                        color: order.status === 'Processing' ? '#b45309' : order.status === 'Dispatched' ? '#4338ca' : order.status === 'Delivered' ? '#166534' : order.status === 'Cancelled' ? '#4b5563' : '#b91c1c'
                                      }}>
                                        <div className={styles.mobileStatusDot} style={{
                                          backgroundColor: order.status === 'Processing' ? '#b45309' : order.status === 'Dispatched' ? '#4338ca' : order.status === 'Delivered' ? '#166534' : order.status === 'Cancelled' ? '#4b5563' : '#b91c1c'
                                        }}></div>
                                        {order.status}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className={styles.mobileProductsList}>
                                    {order.cartItems && order.cartItems.map((item: any, idx: number) => (
                                      <div key={idx} className={styles.mobileProductPill}>
                                        {item.name} · <span className={styles.mobileProductWeight}>{item.size} ×{item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className={styles.mobileItemsSummary}>
                                    {order.cartItems ? order.cartItems.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) : 0} items · {order.cartItems?.length || 0} products
                                  </div>
                                </div>
                              </td>
                            </tr>
                            </React.Fragment>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
  );
}
