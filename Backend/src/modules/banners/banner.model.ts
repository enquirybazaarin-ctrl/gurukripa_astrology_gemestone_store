import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image: string;
  mobileImage?: string;
  link?: string;
  category?: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  page: 'home' | 'bulk-enquiry';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    mobileImage: {
      type: String
    },
    link: {
      type: String
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    page: {
      type: String,
      enum: ['home', 'bulk-enquiry'],
      default: 'home'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
bannerSchema.index({ isActive: 1 });
bannerSchema.index({ order: 1 });

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
