import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Settings from "../models/Settings.js";
import dotenv from "dotenv";

dotenv.config();

// Bypass SSL certificate check for local development network environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Disable mongoose query buffering globally to avoid server hangs on slow DB connections
mongoose.set("bufferCommands", false);

const mongoURL = process.env.mongoURL;

const seedDefaultProducts = async () => {
  try {
    const img1 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591253/29sformula/kuelqnlvaaf3h0cnnvo3.jpg";
    const img2 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591255/29sformula/kfvrntcgccdabqoamlvr.jpg";
    const img3 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591257/29sformula/oqi0nzhwiyiobikiwjvc.jpg";

    const defaultItems = [
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d56"),
        name: "29s CLASSIC - OUD WOOD",
        description: "An elegant, warm, and sophisticated blend of precious oud wood, sweet cardamom, and sandalwood.",
        imageFront: img1,
        imageBack: img2,
        images: [img1, img2, img3],
        variants: [
          { size: "50ml", quantity: 50, price: 1999, category: "Latest Arrivals" },
          { size: "100ml", quantity: 50, price: 2499, category: "Best Seller" },
          { size: "150ml", quantity: 50, price: 2999, category: "Latest Arrivals" }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d57"),
        name: "29s INTENSE - CITRUS BLOSSOM",
        description: "A vibrant, refreshing, and crisp scent featuring neroli, orange blossom, and a base of light musk.",
        imageFront: img2,
        imageBack: img1,
        images: [img2, img1, img3],
        variants: [
          { size: "50ml", quantity: 40, price: 1799, category: "Best Seller" },
          { size: "100ml", quantity: 40, price: 2199, category: "Best Seller" }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d58"),
        name: "29s AMBASSADOR - JET BLACK",
        description: "A bold, mysterious, and captivating fragrance combining patchouli, black pepper, leather, and vanilla.",
        imageFront: img3,
        imageBack: img2,
        images: [img3, img2, img1],
        variants: [
          { size: "50ml", quantity: 40, price: 2499, category: "Latest Arrivals" },
          { size: "100ml", quantity: 40, price: 2999, category: "Latest Arrivals" },
          { size: "150ml", quantity: 40, price: 3499, category: "Latest Arrivals" }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d59"),
        name: "29s SPORT - COBALT BLUE",
        description: "An energetic, fresh, and aquatic scent driven by sea salt, mint, grapefruit, and cedarwood.",
        imageFront: img1,
        imageBack: img3,
        images: [img1, img3, img2],
        variants: [
          { size: "100ml", quantity: 95, price: 1599, category: "Best Seller" }
        ]
      }
    ];

    for (const item of defaultItems) {
      let product = await Product.findOne({ name: item.name });
      if (!product) {
        product = await Product.create({
          _id: item._id,
          name: item.name,
          description: item.description,
          imageFront: item.imageFront,
          imageBack: item.imageBack,
          images: item.images,
          price: Math.min(...item.variants.map(v => v.price)),
          quantity: item.variants.reduce((acc, v) => acc + v.quantity, 0),
          category: [...new Set(item.variants.flatMap(v => Array.isArray(v.category) ? v.category : [v.category]).filter(Boolean))],
          sizes: item.variants.map(v => v.size)
        });
        console.log(`Seeded base product: ${product.name}`);

        for (const v of item.variants) {
          await ProductVariant.create({
            productId: product._id,
            size: v.size,
            quantity: v.quantity,
            price: v.price,
            category: Array.isArray(v.category) ? v.category : (v.category ? [v.category] : ["Latest Arrivals"])
          });
        }
        console.log(`Seeded variants for: ${product.name}`);
      }
    }
  } catch (error) {
    console.error("Failed to seed default products:", error.message);
  }
};

const seedCustomers = async () => {
  try {
    const count = await Customer.countDocuments();
    if (count > 0) return;
    console.log("Migrating existing orders to Customer collection...");
    const orders = await Order.find({});
    const customerMap = new Map();
    
    for (const order of orders) {
      const email = order.customerEmail?.toLowerCase().trim();
      if (!email) continue;
      if (customerMap.has(email)) {
        const existing = customerMap.get(email);
        existing.totalOrders += 1;
        existing.totalSpend += order.totalAmount || 0;
        if (order.shippingAddress) existing.address = order.shippingAddress;
        existing.name = order.customerName;
        existing.phone = order.customerPhone;
      } else {
        customerMap.set(email, {
          name: order.customerName,
          email: email,
          phone: order.customerPhone,
          address: order.shippingAddress,
          totalOrders: 1,
          totalSpend: order.totalAmount || 0
        });
      }
    }
    
    for (const custData of customerMap.values()) {
      await Customer.create(custData);
    }
    console.log("Customer migration completed successfully.");
  } catch (error) {
    console.error("Failed to seed customers:", error.message);
  }
};




const seedSettings = async () => {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      const defaultSettings = new Settings();
      await defaultSettings.save();
      console.log("Default page settings seeded successfully!");
    } else {
      const settings = await Settings.findOne({});
      if (settings) {
        let changed = false;
        if (settings.videoUrl === "https://videos.pexels.com/video-files/4440939/4440939-hd_1920_1080_25fps.mp4") {
          settings.videoUrl = "";
          changed = true;
          console.log("Cleared default seed videoUrl from database settings.");
        }
        if (settings.videoFallbackColor === "#57bc74") {
          settings.videoFallbackColor = "#121212";
          changed = true;
          console.log("Updated default videoFallbackColor to premium dark #121212 in database settings.");
        }
        if (changed) {
          await settings.save();
        }
      }
    }
  } catch (error) {
    console.error("Failed to seed page settings:", error.message);
  }
};

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
