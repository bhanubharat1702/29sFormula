import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import Store from "../models/Store.js";
import { Product, ProductVariant } from "../models/Product.js";
import Order from "../models/Order.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Discount from "../models/Discount.js";
import Review from "../models/Review.js";
import ReturnRequest from "../models/ReturnRequest.js";

async function runMigration() {
  const mongoURI = process.env.mongoURL || process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("No MongoDB URI found in environment!");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB successfully.");

  // 1. Get or Create Default Store
  let defaultStore = await Store.findOne({ subdomain: "default" });
  if (!defaultStore) {
    defaultStore = await Store.create({
      name: "29sFormula Default Store",
      subdomain: "default",
      customDomain: "",
      isActive: true
    });
    console.log(`Created Default Store: "${defaultStore.name}" (ID: ${defaultStore._id})`);
  } else {
    console.log(`Found existing Default Store (ID: ${defaultStore._id})`);
  }

  const storeId = defaultStore._id;

  // 2. Update all collections to assign storeId if not present
  const collectionsToMigrate = [
    { name: "Products", model: Product },
    { name: "ProductVariants", model: ProductVariant },
    { name: "Orders", model: Order },
    { name: "Settings", model: Settings },
    { name: "Users", model: User },
    { name: "Customers", model: Customer },
    { name: "Discounts", model: Discount },
    { name: "Reviews", model: Review },
    { name: "ReturnRequests", model: ReturnRequest }
  ];

  for (const item of collectionsToMigrate) {
    const res = await item.model.updateMany(
      { storeId: { $exists: false } },
      { $set: { storeId: storeId } }
    );
    console.log(`Migrated ${item.name}: ${res.modifiedCount} documents updated.`);
  }

  console.log("Multi-tenant migration completed successfully!");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
