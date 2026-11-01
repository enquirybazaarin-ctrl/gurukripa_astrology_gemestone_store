import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { wishlistService, WishlistItem } from '../services/wishlist.service';
import { api } from '../services/api';
import { RootState } from '../store';

interface WishlistContextType {
    wishlist: WishlistItem[];
    wishlistCount: number;
    isLoading: boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const GUEST_WISHLIST_KEY = 'guest_wishlist';

const getLocalGuestWishlist = (): WishlistItem[] => {
    try {
        const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const setLocalGuestWishlist = (items: WishlistItem[]) => {
    try {
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    } catch (e) {
        console.error('Failed to save guest wishlist to localStorage', e);
    }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const refreshWishlist = async () => {
        if (!isAuthenticated) {
            const guestItems = getLocalGuestWishlist();
            setWishlist(guestItems);
            setWishlistCount(guestItems.length);
            return;
        }

        try {
            setIsLoading(true);

            // Sync guest items to user account upon login if any exist
            const guestItems = getLocalGuestWishlist();
            if (guestItems.length > 0) {
                for (const item of guestItems) {
                    const prodId = item.product._id || (item.product as any).id;
                    if (prodId) {
                        try {
                            await wishlistService.addToWishlist(prodId);
                        } catch (e) {
                            // Item might already be in user's wishlist, safely ignore
                        }
                    }
                }
                localStorage.removeItem(GUEST_WISHLIST_KEY);
            }

            const response = await wishlistService.getWishlist();
            setWishlist(response.data.wishlist.items);
            setWishlistCount(response.data.wishlist.count);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            setWishlist([]);
            setWishlistCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshWishlist();
    }, [isAuthenticated]);

    const addToWishlist = async (productId: string) => {
        if (isAuthenticated) {
            try {
                const response = await wishlistService.addToWishlist(productId);
                setWishlist(response.data.wishlist.items);
                setWishlistCount(response.data.wishlist.count);
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
            }
        } else {
            const guestItems = getLocalGuestWishlist();
            const exists = guestItems.some(item => (item.product._id || (item.product as any).id) === productId);
            if (exists) return;

            try {
                const response = await api.get(`/products/${productId}`);
                const fetchedProduct = response.data?.data?.product || response.data?.product || response.data;

                if (!fetchedProduct) {
                    throw new Error('Product details unavailable');
                }

                const newItem: WishlistItem = {
                    product: {
                        _id: fetchedProduct._id || fetchedProduct.id || productId,
                        name: fetchedProduct.name || fetchedProduct.title || 'Product',
                        images: fetchedProduct.images || [],
                        price: fetchedProduct.price || 0,
                        originalPrice: fetchedProduct.originalPrice,
                        rating: fetchedProduct.rating || 0,
                        totalReviews: fetchedProduct.totalReviews || 0,
                        category: fetchedProduct.category || { name: '', slug: '' },
                        stock: fetchedProduct.stock ?? 1,
                        isActive: fetchedProduct.isActive ?? true,
                    },
                    addedAt: new Date().toISOString()
                };

                const updated = [newItem, ...guestItems];
                setLocalGuestWishlist(updated);
                setWishlist(updated);
                setWishlistCount(updated.length);
            } catch (error: any) {
                console.error('Failed to add guest wishlist item:', error);
                throw new Error('Failed to add item to wishlist');
            }
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (isAuthenticated) {
            try {
                const response = await wishlistService.removeFromWishlist(productId);
                setWishlist(response.data.wishlist.items);
                setWishlistCount(response.data.wishlist.count);
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
            }
        } else {
            const guestItems = getLocalGuestWishlist();
            const updated = guestItems.filter(item => (item.product._id || (item.product as any).id) !== productId);
            setLocalGuestWishlist(updated);
            setWishlist(updated);
            setWishlistCount(updated.length);
        }
    };

    const clearWishlist = async () => {
        if (isAuthenticated) {
            try {
                await wishlistService.clearWishlist();
                setWishlist([]);
                setWishlistCount(0);
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
            }
        } else {
            localStorage.removeItem(GUEST_WISHLIST_KEY);
            setWishlist([]);
            setWishlistCount(0);
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlist.some(item => (item.product._id || (item.product as any).id) === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                wishlistCount,
                isLoading,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                isInWishlist,
                refreshWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
