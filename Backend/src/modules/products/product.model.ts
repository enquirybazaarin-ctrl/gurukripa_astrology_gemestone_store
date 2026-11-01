import mongoose, { Schema, Document } from 'mongoose';

export interface IAttributeOption {
  label: string;
  value?: string;
  priceAdjustment?: number;
  absolutePrice?: number; // New
  multiplier?: number;
  skuCode?: string;
  isDefault?: boolean;
  hexColor?: string;
}

export interface IAttribute {
  name: string;
  type: 'select' | 'radio' | 'color';
  isRequired: boolean;
  isBaseAttribute?: boolean; // New
  affectsPrice: boolean;
  isMultiplier: boolean;
  options: IAttributeOption[];
}

// Layer 3: Add-On Interface
export interface IAddOn {
  name: string;
  pricingMode: 'flat' | 'size_dependent';
  flatPrice?: number;
  sizePricing?: {
    sizeLabel: string;
    price: number;
  }[];
  isRequired?: boolean;
}

export interface IGiftDesign {
  id: string;
  image: string;
}

export interface IGiftOccasion {
  id: string;
  label: string;
  designs: IGiftDesign[];
}

export interface IGiftOptions {
  active: boolean;
  price: number;
  occasions: IGiftOccasion[];
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  isBestSeller: boolean;
  showOnHome: boolean;
  status: 'active' | 'draft' | 'archived';
  tags: string[];
  sortOrder: number;
  pdpLayout?: string[];

  // Dynamic Attributes
  attributes?: {
    name: string;
    type: 'select' | 'radio' | 'color';
    isRequired: boolean;
    isBaseAttribute?: boolean; // New
    affectsPrice: boolean;
    isMultiplier: boolean;
    options: {
      label: string;
      value?: string;
      absolutePrice?: number; // New
      priceAdjustment?: number;
      multiplier?: number;
      skuCode?: string;
      isDefault?: boolean;
      hexColor?: string;
    }[];
  }[];

  // Add-Ons
  // Add-Ons removed (Duplicate of Universal Add-Ons below)
  // addOns?: IAddOn[];

  // Gemstone Specific Attributes
  gemstoneType?: string;
  variety?: string;
  origin?: string;
  caratWeight?: number;
  shape?: string;
  cut?: string;
  color?: string;
  clarity?: string;
  treatment?: string;
  certification?: 'Certified' | 'Non-certified';
  certificateNumber?: string;
  certificateLaboratory?: string;
  naturalSynthetic?: 'Natural' | 'Synthetic';
  transparency?: string;
  hardness?: number;
  astrologicalAssociation?: string;
  dimensions?: {
    length?: number;
    width?: number;
    depth?: number;
    weight?: number;
  };
  specifications?: Array<{ key: string; value: string }>;
  faqs?: {
    question: string;
    answer: string;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };

  // Mobile-First PDP Specific Fields
  // Universal Pricing System
  variants?: Array<{
    _id?: any;
    label: string;
    sku?: string;
    price: number;
    originalPrice?: number;
    stock?: number;
    image?: string;
    isDefault?: boolean;
    packs?: Array<{
      _id?: any;
      label: string;
      quantity: number;
      price: number;
      originalPrice?: number;
      isDefault?: boolean;
    }>;
  }>;

  styles?: Array<{
    _id?: any;
    label: string;
    priceAdjustment: number;
    image?: string;
  }>;

  addOns?: Array<{
    _id?: any;
    label: string;
    price: number;
    description?: string;
    image?: string;
    required?: boolean;
  }>;

  colors?: Array<{
    _id?: any;
    label: string;
    hex: string;
    image?: string;
  }>;

  // Legacy/Mobile Fields (Keep for backward compat or specialized display)
  shortDescription?: string;
  sizes?: Array<{ name: string; price: number }>;
  fragrances?: string[];
  packs?: Array<{
    label: string;
    quantity: number;
    pricingType: string;
    fixedPrice?: number;
    discountPercent?: number;
  }>;
  // allowMixedFragrance kept below
  allowMixedFragrance?: boolean;
  relatedProducts?: mongoose.Types.ObjectId[];

  createdAt: Date;
  sections: {
    id?: string;
    type: string;
    title?: string;
    data: any;
  }[];

  giftOptions?: IGiftOptions;

  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    images: [{
      type: String,
      required: true
    }],
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    rating: {
      type: Number,
      default: 4.6, // Default display rating
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    showOnHome: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }],
    sortOrder: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft'
    },
    pdpLayout: [{
      type: String
    }],

    // Dynamic Product Attributes
    attributes: [{
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['select', 'radio', 'color'],
        default: 'select'
      },
      isRequired: { type: Boolean, default: false },
      isBaseAttribute: { type: Boolean, default: false }, // Only ONE per product
      affectsPrice: { type: Boolean, default: false },
      isMultiplier: { type: Boolean, default: false }, // Only ONE per product
      options: [{
        label: { type: String, required: true },
        value: { type: String },

        // Layer 1: Base Price (Absolute)
        absolutePrice: { type: Number },

        // Layer 2: Secondary Adjustment (Relative)
        priceAdjustment: { type: Number, default: 0 },

        // Layer 4: Multiplier
        multiplier: { type: Number, default: 1, min: 1 },

        skuCode: { type: String },
        isDefault: { type: Boolean, default: false },
        hexColor: { type: String }
      }]
    }],

    // Layer 3: Add-Ons - Removed (Duplicate of Universal Add-Ons below)
    // addOns: ...

    // Gemstone Specific Attributes for Filtering
    gemstoneType: { type: String },
    variety: { type: String },
    origin: { type: String },
    caratWeight: { type: Number },
    shape: { type: String },
    cut: { type: String },
    color: { type: String },
    clarity: { type: String },
    treatment: { type: String },
    certification: { type: String, enum: ['Certified', 'Non-certified'] },
    certificateNumber: { type: String },
    certificateLaboratory: { type: String },
    naturalSynthetic: { type: String, enum: ['Natural', 'Synthetic'] },
    transparency: { type: String },
    hardness: { type: Number },
    astrologicalAssociation: { type: String },
    dimensions: {
      length: Number,
      width: Number,
      depth: Number,
      weight: Number
    },

    specifications: [{
      key: { type: String },
      value: { type: String }
    }],
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }],
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String
    },

    // Universal Variant System
    variants: [{
      label: { type: String, required: true }, // e.g. "Small", "Red", "100ml"
      sku: { type: String },
      price: { type: Number, required: true, min: 0 },
      originalPrice: { type: Number, min: 0 },
      stock: { type: Number, default: 0 },
      image: { type: String },
      isDefault: { type: Boolean, default: false },

      // Variant-Level Packs (e.g. "Pack of 2" for "Small")
      packs: [{
        label: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }, // Bundle Price
        originalPrice: { type: Number, min: 0 },
        isDefault: { type: Boolean, default: false },
        styles: [{
          label: { type: String, required: true },
          priceAdjustment: { type: Number, required: true, default: 0 },
          image: { type: String }
        }]
      }]
    }],

    // Universal Style Options (e.g. "Lid Type", "Finish")
    styles: [{
      label: { type: String, required: true },
      priceAdjustment: { type: Number, default: 0 },
      image: { type: String }
    }],

    // Dedicated Product Colors
    colors: [{
      label: { type: String, required: true },
      hex: { type: String, required: true },
      image: { type: String }
    }],

    // Universal Add-Ons (e.g. "Gift Wrap")
    addOns: [{
      label: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      description: { type: String },
      image: { type: String },
      required: { type: Boolean, default: false }
    }],

    // Fallbacks & Legacy Support - Remapped or Removed to avoid duplicates
    // sizes: handled by new schema if needed, or keep separate if distinct.
    // packs: handled by new schema if distinct. But we have conflict. 
    // To allow both, we must rename one or merge. 
    // For now, I will comment out the legacy 'packs' and 'styles' and 'sizes' in favor of the new ones above.
    // If we need to preserve data, we would need a migration.

    // sizes: [{ name: String, price: Number }], // Duplicated
    packs: [{
      label: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      originalPrice: { type: Number },
      isDefault: { type: Boolean, default: false },
      styles: [{
        label: { type: String, required: true },
        priceAdjustment: { type: Number, required: true, default: 0 },
        image: { type: String }
      }]
    }],
    // styles: ... // Duplicated

    allowMixedFragrance: { type: Boolean, default: false },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],

    sections: [{
      id: { type: String },
      title: { type: String },
      data: { type: Schema.Types.Mixed } // Flexible data structure for each section type
    }],

    giftOptions: {
      active: { type: Boolean, default: false },
      price: { type: Number, default: 0 },
      occasions: [{
        id: String,
        label: String,
        designs: [{
          id: String,
          image: String
        }]
      }]
    }
  },
  {
    timestamps: true
  }
);

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 }); // Common filter
productSchema.index({ status: 1, showOnHome: 1 }); // Homepage filter
productSchema.index({ isActive: 1, isBestSeller: 1 }); // Best sellers
productSchema.index({ isActive: 1, createdAt: -1 }); // New arrivals
productSchema.index({ isActive: 1, rating: -1, totalReviews: -1 }); // Top rated
productSchema.index({ sortOrder: 1, createdAt: -1 }); // Manual sort + Recency

// Sync isActive with status
productSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.isActive = this.status === 'active';
  }
  next();
});

productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any;
  if (update.$set && update.$set.status !== undefined) {
    update.$set.isActive = update.$set.status === 'active';
  } else if (update.status !== undefined) {
    update.isActive = update.status === 'active';
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
