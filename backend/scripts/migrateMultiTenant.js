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

export async function runMigration({ standalone = false } = {}) {
  try {
    if (standalone) {
      const mongoURI = process.env.mongoURL || process.env.MONGODB_URI;
      if (!mongoURI) {
        console.error("No MongoDB URI found in environment!");
        process.exit(1);
      }
      console.log("Connecting to MongoDB for migration...");
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB successfully.");
    }

    // 1. Get or Create Default Store
    let defaultStore = await Store.findOne({ subdomain: "default" });
    if (!defaultStore) {
      defaultStore = await Store.create({
        name: "Default Main Store",
        subdomain: "default",
        customDomain: "",
        isActive: true
      });
      console.log(`Created Default Store: "${defaultStore.name}" (ID: ${defaultStore._id})`);
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
      await item.model.updateMany(
        { storeId: { $exists: false } },
        { $set: { storeId: storeId } }
      );
    }

    // 3. Clean up any legacy perfume seed data in Settings collection
    await Settings.updateMany(
      {
        $or: [
          { brandLogoValue: /29s/i },
          { brandLogoValue: "STORE ENGINE" },
          { heroTitle: /29s/i },
          { heroTitle: "STORE ENGINE" },
          { heroManifesto: /SCENT IS THE DIFFERENCE/i },
          { videoSubtitle: /Smells divine/i },
          { lifestyleText: /Intense notes/i }
        ]
      },
      {
        $set: {
          brandLogoValue: "MY STORE",
          heroTitle: "WELCOME TO OUR STORE",
          heroTitleFontColor: "#ffffff",
          heroManifestoFontColor: "#ffffff",
          mobileHeroTitleFontColor: "#ffffff",
          mobileHeroManifestoFontColor: "#ffffff",
          heroManifesto: "PREMIUM QUALITY YOU CAN TRUST. EVERY PRODUCT IS CRAFTED WITH CARE AND DELIVERED WITH PASSION.",
          heroButtonColor: "#ffffff",
          heroButtonTextColor: "#000000",
          mobileHeroButtonColor: "#ffffff",
          mobileHeroButtonTextColor: "#000000",
          videoTitle: "NEW ARRIVALS",
          videoTitleFontColor: "#ffffff",
          videoSubtitleFontColor: "#ffffff",
          videoSubtitle: "Explore our latest arrivals crafted with care and premium quality.",
          videoButtonColor: "#ffffff",
          videoButtonTextColor: "#000000",
          mobileVideoButtonColor: "#ffffff",
          mobileVideoButtonTextColor: "#000000",
          lifestyleText: "Uncompromising Quality, Curated for You.",
          lifestyleTextFontColor: "#ffffff",
          lifestyleButtonColor: "#ffffff",
          lifestyleButtonTextColor: "#000000",
          mobileLifestyleButtonColor: "#ffffff",
          mobileLifestyleButtonTextColor: "#000000",
          primaryColor: "#ffffff",
          contactUsText: "Need help? Email us at support@yourstore.com and our support team will get back to you within 24 hours."
        }
      }
    );

    console.log("Multi-tenant & seed sanitizer migration ran successfully.");
  } catch (err) {
    console.error("Migration execution error:", err);
  } finally {
    if (standalone) {
      process.exit(0);
    }
  }
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith("migrateMultiTenant.js")) {
  runMigration({ standalone: true });
}
