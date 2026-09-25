export interface StatusBadgeStyle {
  bg: string;
  color: string;
  dot: string;
}

export const getStatusBadgeStyle = (status: string): StatusBadgeStyle => {
  if (!status) return { bg: "#f3f4f6", color: "#4b5563", dot: "#6b7280" };

  switch (status) {
    case "Pending":
    case "Payment Pending":
      return { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" };
    case "Confirmed":
      return { bg: "#f3e8ff", color: "#6b21a8", dot: "#9333ea" };
    case "Packed":
      return { bg: "#e0f2fe", color: "#0369a1", dot: "#0284c7" };
    case "Shipped":
    case "Dispatched":
      return { bg: "#eff6ff", color: "#1d4ed8", dot: "#2563eb" };
    case "Out for Delivery":
      return { bg: "#ccfbf1", color: "#0f766e", dot: "#0d9488" };
    case "Delivery Attempted":
      return { bg: "#ffedd5", color: "#c2410c", dot: "#ea580c" };
    case "RTO Initiated":
      return { bg: "#fff7ed", color: "#c2410c", dot: "#ea580c" };
    case "RTO Delivered":
      return { bg: "#fef2f2", color: "#991b1b", dot: "#dc2626" };
    case "Delivered":
    case "Refunded":
      return { bg: "#eaf7ee", color: "#15803d", dot: "#16a34a" };
    case "Returned":
      return { bg: "#ffedd5", color: "#c2410c", dot: "#ea580c" };
    case "Cancelled":
    case "Not Refunded":
      return { bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" };
    case "Return Requested":
      return { bg: "#fef3c7", color: "#b45309", dot: "#d97706" };
    case "Return Approved":
    case "Approved":
      return { bg: "#ecfccb", color: "#4d7c0f", dot: "#65a30d" };
    case "Return Rejected":
    case "Rejected":
      return { bg: "#fef2f2", color: "#991b1b", dot: "#dc2626" };
    default:
      return { bg: "#f3f4f6", color: "#4b5563", dot: "#6b7280" };
  }
};

export const getStockBadgeStyle = (qty: number) => {
  const count = Number(qty) || 0;
  if (count <= 0) {
    return { label: "Out of Stock", bg: "#fef2f2", color: "#991b1b", dot: "#dc2626" };
  } else if (count <= 5) {
    return { label: `Low Stock (${count})`, bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" };
  } else {
    return { label: `In Stock (${count})`, bg: "#eaf7ee", color: "#15803d", dot: "#16a34a" };
  }
};
