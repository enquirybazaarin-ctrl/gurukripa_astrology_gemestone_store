import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'pending_payment' | 'payment_success' | 'pending_verification' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'upi' | 'online';
export type PaymentStatus = 'pending' | 'verified' | 'failed';
export interface ITrackingEvent {
  status: string;
  activity: string;
  location: string;
  timestamp: Date;
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string; // Product Name
  image: string; // Product/Variant Image
  price: number; // Final Unit Price (Calculated)
  originalPrice?: number;
  quantity: number;

  // Universal Snapshots
  variant?: {
    id?: string;
    label: string;
    price: number;
    sku?: string;
  };
  pack?: {
    id?: string;
    label: string;
    price: number;
  };
  style?: {
    id?: string;
    label: string;
    priceAdjustment: number;
  };
  size?: string;
  addOns?: Array<{
    id?: string;
    label: string;
    price: number;
  }>;
  fragrance?: string;
  fragrances?: string[];
  giftCustomization?: {
    occasion: string;
    designId: string;
    message: string;
    price: number;
    active: boolean;
  };

  // Legacy (Optional/Deprecated)
  selectedAttributes?: any;
  basePriceSnapshot?: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId; // Optional for Guest Checkout
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    email: string; // Snapshot
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProof?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingCharges: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  courierName?: string;
  awbNumber?: string;
  trackingUrl?: string;
  packageWeight?: number;
  shiprocketOrderId?: number;
  shiprocketShipmentId?: number;
  trackingHistory?: ITrackingEvent[];
  notes?: string;

  // NEW FIELDS
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  ipAddress?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      originalPrice: { type: Number },
      quantity: { type: Number, required: true, min: 1 },

      // Universal Snapshots
      variant: {
        id: String,
        label: String,
        price: Number,
        sku: String
      },
      pack: {
        id: String,
        label: String,
        price: Number
      },
      style: {
        id: String,
        label: String,
        priceAdjustment: Number
      },
      size: String,
      addOns: [{
        id: String,
        label: String,
        price: Number
      }],
      fragrance: String,
      fragrances: [String],
      giftCustomization: {
        occasion: String,
        designId: String,
        message: String,
        price: Number,
        active: Boolean
      },

      // Legacy Snapshots (Kept for backward compat data if needed, but made optional)
      selectedAttributes: Schema.Types.Mixed,
      basePriceSnapshot: Number,
      selectedAddOns: [{ type: Schema.Types.Mixed }],
      totalPriceSnapshot: Number
    }],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String }
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'upi', 'online'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending'
    },
    paymentProof: {
      type: String
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: ['pending_payment', 'payment_success', 'pending_verification', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending_payment'
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    shippingCharges: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    couponCode: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    courierName: {
      type: String
    },
    awbNumber: {
      type: String
    },
    trackingUrl: {
      type: String
    },
    packageWeight: {
      type: Number
    },
    shiprocketOrderId: {
      type: Number
    },
    shiprocketShipmentId: {
      type: Number
    },
    trackingHistory: [
      {
        status: String,
        activity: String,
        location: String,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    notes: {
      type: String
    },
    // NEW FIELDS
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ipAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Generate order number before save
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes
// orderSchema.index({ user: 1 }); // Removed duplicate index, will re-verify if needed
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
