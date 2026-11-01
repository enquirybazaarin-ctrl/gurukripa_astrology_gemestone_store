import mongoose, { Schema, Document } from 'mongoose';

export type CouponType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  status: CouponStatus;
  validFrom: Date;
  validUntil: Date;
  applicableCategories?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    minPurchase: {
      type: Number,
      min: 0
    },
    maxDiscount: {
      type: Number,
      min: 0
    },
    usageLimit: {
      type: Number,
      min: 1
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active'
    },
    validFrom: {
      type: Date,
      required: true
    },
    validUntil: {
      type: Date,
      required: true
    },
    applicableCategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }]
  },
  {
    timestamps: true
  }
);

// Indexes

couponSchema.index({ status: 1 });

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
