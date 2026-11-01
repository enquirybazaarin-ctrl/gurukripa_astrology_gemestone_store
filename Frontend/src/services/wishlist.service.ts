import { api } from './api';

export interface WishlistItem {
    product: {
        _id: string;
        name: string;
        images: string[];
        price: number;
        originalPrice?: number;
        rating: number;
        totalReviews: number;
        category: {
            name: string;
            slug: string;
        };
        stock: number;
        isActive: boolean;
    };
    addedAt: string;
}

export interface Wishlist {
    _id: string;
    user: string;
    items: WishlistItem[];
    count: number;
    createdAt: string;
    updatedAt: string;
}

class WishlistService {
    async getWishlist(): Promise<{ data: { wishlist: Wishlist } }> {
        const response = await api.get('/wishlist');
        return response.data;
    }

    async addToWishlist(productId: string): Promise<{ data: { wishlist: Wishlist } }> {
        const response = await api.post(`/wishlist/${productId}`);
        return response.data;
    }

    async removeFromWishlist(productId: string): Promise<{ data: { wishlist: Wishlist } }> {
        const response = await api.delete(`/wishlist/${productId}`);
        return response.data;
    }

    async clearWishlist(): Promise<{ message: string }> {
        const response = await api.post('/wishlist/clear');
        return response.data;
    }

    async isInWishlist(productId: string): Promise<{ data: { isInWishlist: boolean } }> {
        const response = await api.get(`/wishlist/check/${productId}`);
        return response.data;
    }
}

export const wishlistService = new WishlistService();
