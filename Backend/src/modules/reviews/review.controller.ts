import { Request, Response, NextFunction } from 'express';
import { reviewService } from './review.service';
import { AuthRequest } from '../../common/middleware/auth';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const { reviews, pagination } = await reviewService.getProductReviews(req.params.productId, page, limit);
    res.json({
      success: true,
      data: { reviews, pagination }
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create Manual Review
export const createManualReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const review = await reviewService.createManualReview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const review = await reviewService.updateReview(req.params.id, req.user.id, req.body);
    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all reviews
export const getAllReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await reviewService.getAllReviews(req.query.status as string);
    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Toggle Review Approval
export const toggleApproval = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await reviewService.toggleApproval(req.params.id);
    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await reviewService.adminUpdateReview(req.params.id, req.body);
    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    // Check if user is admin (assuming req.user.role is populated or similar mechanism)
    // For now, let's assume if it's hitting an admin route or we check role here.
    // Simpler: Use a separate adminDeleteReview or pass params.
    // Let's rely on service logic.
    // If ordinary user deleting own review:
    await reviewService.deleteReview(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await reviewService.deleteReview(req.params.id, undefined, true);
    res.json({
      success: true,
      message: 'Review deleted as admin'
    });
  } catch (error) {
    next(error);
  }
}
