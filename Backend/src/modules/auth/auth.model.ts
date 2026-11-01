import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone?: string;
  name?: string;
  addresses?: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }[];
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  refreshToken?: string;
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple nulls/undefined but unique if present
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    // Simple Array of Addresses
    addresses: [{
      fullName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      isDefault: { type: Boolean, default: false }
    }],
    name: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
      select: false
    },
    password: {
      type: String,
      select: false
    },
    otp: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes


// Indexes
// Indexes

// Hash password before saving
// Note: We need to import bcryptjs which should be installed
import * as bcrypt from 'bcryptjs';

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password || '');
};

export const User = mongoose.model<IUser>('User', userSchema);
