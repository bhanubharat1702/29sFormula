import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Bypass SSL certificate check for local development network environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Disable mongoose query buffering globally to avoid server hangs on slow DB connections
mongoose.set("bufferCommands", false);

const mongoURL = process.env.mongoURL;


export const connectDB = async () => {
  if (!mongoURL) {
    console.warn("Warning: mongoURL is not defined in the .env file.");
  } else {
    try {
      await mongoose.connect(mongoURL);
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err.message);
      if (mongoURL.includes("<") && mongoURL.includes(">")) {
        console.warn("Tip: It looks like your mongoURL contains '<' and '>' brackets around the password. Make sure to remove them in the .env file (e.g., replace <1234567890bhanu> with 1234567890bhanu).");
      }
    }
  }
};
