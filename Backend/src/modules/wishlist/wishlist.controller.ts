import { Response, NextFunction } from 'express';
import { wishlistService } from './wishlist.service';
import { AuthRequest } from '../../common/middleware/auth';

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const wishlist = await wishlistService.getWishlist(userId);

        res.json({
            success: true,
            data: { wishlist }
        });
    } catch (error) {
        next(error);
    }
};

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { productId } = req.params;

        const wishlist = await wishlistService.addToWishlist(userId, productId);

        res.json({
            success: true,
            message: 'Product added to wishlist',
            data: { wishlist }
        });
    } catch (error) {
        next(error);
    }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { productId } = req.params;

        const wishlist = await wishlistService.removeFromWishlist(userId, productId);

        res.json({
            success: true,
            message: 'Product removed from wishlist',
            data: { wishlist }
        });
    } catch (error) {
        next(error);
    }
};

export const clearWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const result = await wishlistService.clearWishlist(userId);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const checkWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { productId } = req.params;

        const isInWishlist = await wishlistService.isInWishlist(userId, productId);

        res.json({
            success: true,
            data: { isInWishlist }
        });
    } catch (error) {
        next(error);
    }
};
