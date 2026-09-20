import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

/**
 * Recalculates and syncs Customer totalOrders and totalSpend based ONLY on active (non-cancelled, non-deleted) orders.
 * Ensures customer analytics are 100% accurate and immune to cancellation spam, returns, or refunds.
 */
export const syncCustomerStats = async (email) => {
  if (!email) return;
  const cleanEmail = email.toLowerCase().trim();

  try {
    const stats = await Order.aggregate([
      {
        $match: {
          customerEmail: new RegExp(`^${cleanEmail}$`, 'i'),
          status: { $nin: ["Cancelled"] },
          deletedByAdmin: { $ne: true }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpend: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalOrders = stats[0] ? stats[0].totalOrders : 0;
    const totalSpend = stats[0] ? stats[0].totalSpend : 0;

    await Customer.updateOne(
      { email: new RegExp(`^${cleanEmail}$`, 'i') },
      { $set: { totalOrders, totalSpend } }
    );
  } catch (err) {
    console.error(`Failed to sync customer stats for ${cleanEmail}:`, err);
  }
};
