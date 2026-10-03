import mongoose from "mongoose";
import dotenv from "dotenv";
import { runMigration } from "../scripts/migrateMultiTenant.js";

dotenv.config();

// Avoid Node process warning for TLS rejection bypass in local development
if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
}

// Enable mongoose query buffering to prevent startup race condition when database is connecting
mongoose.set("bufferCommands", true);

const mongoURL = process.env.mongoURL;

export const connectDB = async () => {
  if (!mongoURL) {
    console.warn("Warning: mongoURL is not defined in the .env file.");
  } else {
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Waiting for reconnection...");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected successfully!");
    });
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    try {
      await mongoose.connect(mongoURL, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });
      console.log("Connected to MongoDB successfully!");
      // Automatically run multi-tenant seed migration and legacy data sanitizer on server startup
      runMigration({ standalone: false }).catch((err) => {
        console.warn("Startup migration warning:", err.message);
      });
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err.message);
      if (mongoURL.includes("<") && mongoURL.includes(">")) {
        console.warn("Tip: It looks like your mongoURL contains '<' and '>' brackets around the password. Make sure to remove them in the .env file (e.g., replace <1234567890bhanu) with 1234567890bhanu).");
      }
    }
  }
};
