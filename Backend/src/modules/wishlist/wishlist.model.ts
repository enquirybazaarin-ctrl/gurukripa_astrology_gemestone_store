import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
    product: mongoose.Types.ObjectId;
    addedAt: Date;
}

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId;
    items: IWishlistItem[];
    createdAt: Date;
    updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    {
        timestamps: true
    }
);

// Indexes
// Removed duplicate index as 'user' already has unique: true
wishlistSchema.index({ 'items.product': 1 });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
