import mongoose from "mongoose";

// Define Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: false, index: true },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  shippingAddress: { type: mongoose.Schema.Types.Mixed },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.Mixed, required: false },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      makingPrice: { type: Number, default: 0 },
      size: { type: String },
      quantity: { type: Number, required: true },
      image: { type: String },
      isGiftSet: { type: Boolean, default: false },
      giftSetDetails: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  subtotal: { type: Number, default: 0 },
  discountCode: { type: String, default: "" },
  discountAmount: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Pending" },
  deliveredAt: { type: Date },
  deletedByAdmin: { type: Boolean, default: false },
  cancellationReason: { type: String },
  refundStatus: { type: String, default: "Not Refunded" },
  rtoCharges: { type: Number, default: 0 },
  courierPartner: { type: String, default: "" },
  awbNumber: { type: String, default: "" },
  trackingUrl: { type: String, default: "" },
  timeline: [
    {
      event: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// ─── Indexes ────────────────────────────────────────────────────────────────
// "My Orders" page + order tracking by email (ESR: equality → sort)
orderSchema.index({ customerEmail: 1, createdAt: -1 });

// Admin order list: filter by status + soft-delete flag + date sort
// Serves: Order.find({ status, deletedByAdmin }).sort({ createdAt: -1 })
orderSchema.index({ status: 1, deletedByAdmin: 1, createdAt: -1 });

// Admin dashboard: all orders sorted by newest (no filter, only sort)
orderSchema.index({ createdAt: -1 });

// Refund management queue: find all orders with a pending refund
orderSchema.index({ refundStatus: 1 });

// AWB/courier tracking lookup (sparse: many orders have no AWB yet)
orderSchema.index({ awbNumber: 1 }, { sparse: true });

// Customer order history by ObjectId (used when customer._id is known)
orderSchema.index({ customerId: 1, createdAt: -1 });
// ────────────────────────────────────────────────────────────────────────────

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
