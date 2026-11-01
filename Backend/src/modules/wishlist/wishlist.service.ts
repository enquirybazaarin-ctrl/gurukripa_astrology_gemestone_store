import { Wishlist } from './wishlist.model';
import { Product } from '../products/product.model';
import { CustomError } from '../../common/middleware/errorHandler';


export class WishlistService {
    async getWishlist(userId: string): Promise<any> {
        let wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name images price originalPrice rating totalReviews category stock isActive status',
                populate: {
                    path: 'category',
                    select: 'name slug'
                }
            })
            .lean() as any;

        if (!wishlist) {
            // Create empty wishlist if doesn't exist
            const newWishlist = await Wishlist.create({ user: userId, items: [] });
            return {
                ...newWishlist.toObject(),
                items: [],
                count: 0
            };
        }

        // Filter out inactive products
        const activeItems = wishlist.items.filter((item: any) => item.product?.isActive);

        return {
            ...wishlist,
            items: activeItems,
            count: activeItems.length
        };
    }

    async addToWishlist(userId: string, productId: string): Promise<any> {
        // Verify product exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            throw new CustomError('Product not found or inactive', 404);
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                items: [{ product: productId, addedAt: new Date() }]
            });
        } else {
            // Check if product already in wishlist
            const exists = wishlist.items.some(
                (item) => item.product.toString() === productId
            );

            if (exists) {
                throw new CustomError('Product already in wishlist', 400);
            }

            wishlist.items.push({ product: productId as any, addedAt: new Date() });
        }

        await wishlist.save();
        return this.getWishlist(userId);
    }

    async removeFromWishlist(userId: string, productId: string): Promise<any> {
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            throw new CustomError('Wishlist not found', 404);
        }

        wishlist.items = wishlist.items.filter(
            (item) => item.product.toString() !== productId
        );

        await wishlist.save();
        return this.getWishlist(userId);
    }

    async clearWishlist(userId: string): Promise<{ message: string }> {
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            throw new CustomError('Wishlist not found', 404);
        }

        wishlist.items = [];
        await wishlist.save();

        return { message: 'Wishlist cleared successfully' };
    }

    async isInWishlist(userId: string, productId: string): Promise<boolean> {
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return false;
        }

        return wishlist.items.some(
            (item) => item.product.toString() === productId
        );
    }
}

export const wishlistService = new WishlistService();
