import mongoose from "mongoose";

const taxZoneSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    }, // ISO 2-letter code e.g. "US", "IN", "DE" or "*" for default/all
    regions: [
      {
        type: String,
        uppercase: true,
        trim: true
      }
    ], // Array of state/province codes e.g. ["CA", "NY"], or "*" for all regions
    postalCodes: [
      {
        type: String,
        trim: true
      }
    ], // Prefix patterns e.g. ["90001", "90*"] or empty for all
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }, // Tax percentage (e.g. 8.25 for 8.25%)
    taxName: {
      type: String,
      default: "Tax",
      trim: true
    }, // e.g. "Sales Tax", "VAT", "GST"
    isInclusive: {
      type: Boolean,
      default: false
    }, // If true, product prices in catalog are tax inclusive for this region
    priority: {
      type: Number,
      default: 0
    }, // Higher priority matches first
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Compound index for fast lookup by storeId, country, and active status
taxZoneSchema.index({ storeId: 1, country: 1, active: 1, priority: -1 });

const TaxZone = mongoose.models.TaxZone || mongoose.model("TaxZone", taxZoneSchema);

export default TaxZone;
