import mongoose, { Schema, Document } from 'mongoose';

// Plain object interface (for API responses and .lean() queries)
export interface ICategoryBase {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  mobileBanner?: string;
  icon?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface (for Mongoose operations)
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  mobileBanner?: string;
  icon?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    banner: {
      type: String
    },
    mobileBanner: {
      type: String
    },
    icon: {
      type: String
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
