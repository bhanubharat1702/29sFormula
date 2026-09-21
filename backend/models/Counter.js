import mongoose from "mongoose";
import Order from "./Order.js";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export default Counter;

/**
 * Atomically generates the next unique sequential order ID (e.g., ORD-1001).
 * Uses MongoDB findOneAndUpdate with $inc to guarantee atomic increments
 * even during high concurrency / identical millisecond requests.
 */
export const getNextOrderId = async (session = null) => {
  const opts = session ? { session } : {};
  // Check if counter exists
  let counter = await Counter.findOne({ _id: "orderId" }, null, opts);

  // If counter does not exist yet (first run), auto-seed from highest existing orderId
  if (!counter) {
    let maxNum = 1000;
    try {
      const lastOrder = await Order.findOne({ orderId: /^ORD-\d+$/ }, null, opts).sort({ _id: -1 });
      if (lastOrder && lastOrder.orderId) {
        const parts = lastOrder.orderId.split("-");
        const lastNum = parseInt(parts[1], 10);
        if (!isNaN(lastNum) && lastNum >= 1000) {
          maxNum = lastNum;
        }
      }
    } catch (err) {
      console.error("Error finding last order for counter seed:", err);
    }

    try {
      await Counter.updateOne(
        { _id: "orderId" },
        { $setOnInsert: { seq: maxNum } },
        { upsert: true, ...opts }
      );
    } catch (err) {
      // Ignore duplicate key error if another concurrent request created it first
    }
  }

  // Atomically increment sequence
  const updatedCounter = await Counter.findOneAndUpdate(
    { _id: "orderId" },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true, ...opts }
  );

  return `ORD-${updatedCounter.seq}`;
};
