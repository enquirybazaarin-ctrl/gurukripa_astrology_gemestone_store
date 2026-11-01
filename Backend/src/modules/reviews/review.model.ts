import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  manualName?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  video?: string; // New: Optional video URL
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false // Optional for manual admin reviews
    },
    manualName: { // Name displayed if user is not present
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true
    },
    comment: {
      type: String,
      trim: true
    },
    images: [String],
    video: {
      type: String, // Allow video URL 
      required: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: true // Auto-approve, admin can moderate
    },
    helpfulCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ isApproved: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
