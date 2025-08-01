import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  categoryIds: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  attributes: {
    color: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    material: {
      type: String,
      default: null
    },
    brand: {
      type: String,
      default: null
    },
    size: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    weight: {
      type: String,
      default: null
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    details: {
      type: Map,
      of: Number,
      default: () => new Map([
        ['1', 0],
        ['2', 0],
        ['3', 0],
        ['4', 0],
        ['5', 0]
      ])
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isHotTrend: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isHotTrend: 1 });
productSchema.index({ categoryIds: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ viewCount: -1 });
productSchema.index({ createdAt: -1 });

// Virtual để tính discount percentage tự động
productSchema.virtual('calculatedDiscountPercentage').get(function () {
  if (this.salePrice && this.salePrice < this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return this.discountPercentage || 0;
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
