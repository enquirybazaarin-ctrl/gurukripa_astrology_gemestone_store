import mongoose, { Schema, Document } from 'mongoose';

export type BulkEnquiryStatus = 'pending' | 'contacted' | 'confirmed' | 'rejected' | 'archived';

// Type for lean documents (plain objects without Mongoose Document methods)
export type LeanBulkEnquiry = Omit<IBulkEnquiry, keyof Document> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export interface IBulkEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  products?: string[];
  category?: string;
  quantity?: string;
  status: BulkEnquiryStatus;
  adminNotes?: string;
  contactedBy?: mongoose.Types.ObjectId;
  contactedAt?: Date;
  user?: mongoose.Types.ObjectId; // If logged in user
  createdAt: Date;
  updatedAt: Date;
}

const bulkEnquirySchema = new Schema<IBulkEnquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    products: [{
      type: String
    }],
    category: {
      type: String,
      trim: true
    },
    quantity: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'rejected', 'archived'],
      default: 'pending'
    },
    adminNotes: {
      type: String
    },
    contactedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    contactedAt: {
      type: Date
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
bulkEnquirySchema.index({ status: 1 });
bulkEnquirySchema.index({ createdAt: -1 });

export const BulkEnquiry = mongoose.model<IBulkEnquiry>('BulkEnquiry', bulkEnquirySchema);
