import mongoose from 'mongoose';

const StoreMarketSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  currencyCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  exchangeRate: {
    type: Number,
    required: true,
    min: [0, 'Exchange rate cannot be negative']
  },
  shippingRate: {
    type: Number,
    default: 0,
    min: [0, 'Shipping rate cannot be negative']
  },
  freeShippingThreshold: {
    type: Number,
    default: null,
    min: [0, 'Free shipping threshold cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound unique index ensuring one configuration per country per merchant store
StoreMarketSchema.index({ storeId: 1, countryCode: 1 }, { unique: true });

const StoreMarket = mongoose.models.StoreMarket || mongoose.model('StoreMarket', StoreMarketSchema);

export default StoreMarket;
