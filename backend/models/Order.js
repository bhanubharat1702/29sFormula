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
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Processing" },
  deletedByAdmin: { type: Boolean, default: false },
  cancellationReason: { type: String },
  refundStatus: { type: String, default: "Not Refunded" },
  timeline: [
    {
      event: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
