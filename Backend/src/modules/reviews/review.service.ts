import { Review, IReview } from './review.model';
import { Product } from '../products/product.model';
import { CustomError } from '../../common/middleware/errorHandler';
import mongoose from 'mongoose';

export class ReviewService {
  async getProductReviews(productId: string, page: number = 1, limit: number = 5): Promise<{ reviews: IReview[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ product: productId, isApproved: true });

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as any as IReview[];

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Admin: Get all reviews with status filter
  async getAllReviews(status?: string): Promise<IReview[]> {
    const filter: any = {};
    if (status === 'pending') filter.isApproved = false;
    if (status === 'approved') filter.isApproved = true;

    return Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name slug images')
      .sort({ createdAt: -1 })
      .lean() as any as IReview[];
  }

  async createReview(userId: string, reviewData: any): Promise<IReview> {
    const existingReview = await Review.findOne({
      product: reviewData.productId,
      user: userId
    });

    if (existingReview) {
      throw new CustomError('You have already reviewed this product', 400);
    }

    const review = await Review.create({
      ...reviewData,
      user: userId,
      product: reviewData.productId
    });

    await this.recalculateProductRating(reviewData.productId);
    return review;
  }

  // Admin: Create Manual Review
  async createManualReview(adminId: string, reviewData: any): Promise<IReview> {
    // Admin can create multiple reviews for same product (on behalf of different users)

    const review = await Review.create({
      ...reviewData,
      product: reviewData.product || reviewData.productId, // Frontend sends 'product' or 'productId'
      user: undefined, // Manual reviews should display `manualName`, not the admin user
      isVerified: true, // Assume verified since admin added it
      isApproved: true, // Auto-approve
      createdAt: reviewData.createdAt ? new Date(reviewData.createdAt) : new Date()
    });

    await this.recalculateProductRating(review.product.toString());
    return review;
  }

  async updateReview(reviewId: string, userId: string, updateData: any): Promise<IReview> {
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      throw new CustomError('Review not found', 404);
    }

    Object.assign(review, updateData);
    await review.save();

    await this.recalculateProductRating(review.product.toString());
    return review;
  }

  // Admin: Update Review
  async adminUpdateReview(reviewId: string, updateData: any): Promise<IReview> {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new CustomError('Review not found', 404);
    }

    Object.assign(review, updateData);
    await review.save();

    await this.recalculateProductRating(review.product.toString());
    return review;
  }

  // Admin or User delete
  async deleteReview(reviewId: string, userId?: string, isAdmin: boolean = false): Promise<void> {
    const query: any = { _id: reviewId };
    if (!isAdmin && userId) {
      query.user = userId;
    }

    const review = await Review.findOne(query);
    if (!review) {
      throw new CustomError('Review not found', 404);
    }

    const productId = review.product.toString();
    await review.deleteOne();

    await this.recalculateProductRating(productId);
  }

  // Admin: Toggle Approval
  async toggleApproval(reviewId: string): Promise<IReview> {
    const review = await Review.findById(reviewId);
    if (!review) throw new CustomError('Review not found', 404);

    review.isApproved = !review.isApproved;
    await review.save();

    await this.recalculateProductRating(review.product.toString());
    return review;
  }

  private async recalculateProductRating(productId: string) {
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Number(stats[0].avgRating.toFixed(1)),
        totalReviews: stats[0].totalReviews
      });
    } else {
      // Reset to default if no approved reviews
      await Product.findByIdAndUpdate(productId, {
        rating: 4.6, // Default display rating
        totalReviews: 0
      });
    }
  }
}
export const reviewService = new ReviewService();
