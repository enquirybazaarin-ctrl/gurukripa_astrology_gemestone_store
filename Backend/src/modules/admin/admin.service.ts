import { Product } from '../products/product.model';
import { Order } from '../orders/order.model';
import { bulkEnquiryService } from '../bulk-enquiries/bulkEnquiry.service';
import { BulkEnquiry } from '../bulk-enquiries/bulkEnquiry.model';
import { Review } from '../reviews/review.model';
import { CustomError } from '../../common/middleware/errorHandler';

export class AdminService {
  async getDashboardStats(startDate?: string, endDate?: string) {
    const dateQuery: any = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const matchDelivered = { status: 'delivered', ...dateQuery };

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      pendingEnquiries,
      totalReviews
    ] = await Promise.all([
      Product.countDocuments({ status: 'active', ...dateQuery }),
      Order.countDocuments({ ...dateQuery }),
      Order.countDocuments({ status: { $in: ['pending_payment', 'confirmed'] }, ...dateQuery }),
      Order.aggregate([
        { $match: matchDelivered },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      BulkEnquiry.countDocuments({ status: 'pending', ...dateQuery }),
      Review.countDocuments({ isApproved: true, ...dateQuery })
    ]);

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingEnquiries,
      totalReviews
    };
  }

  async createProduct(productData: any) {
    const product = await Product.create(productData);

    if (productData.manualReviews && Array.isArray(productData.manualReviews) && productData.manualReviews.length > 0) {
      const reviewsToInsert = productData.manualReviews.map((rev: any) => ({
        product: product._id,
        manualName: rev.manualName,
        rating: rev.rating || 5,
        title: rev.title,
        comment: rev.comment,
        isVerified: rev.isVerified ?? true,
        isApproved: true,
        createdAt: rev.createdAt ? new Date(rev.createdAt) : new Date()
      }));

      await Review.insertMany(reviewsToInsert);
    }

    return product;
  }

  async updateProduct(productId: string, updateData: any) {
    const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    return product;
  }

  async deleteProduct(productId: string) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
  }

  async getAllProducts(page: number = 1, limit: number = 20, search?: string, category?: string) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      // Using simpler regex for admin search for now, to ensure it hits titles easily without text index dependency if missing
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } } // back-compat
      ];
    }

    if (category) {
      query.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name') // Populate category name
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getAllOrders(status?: string, page: number = 1, limit: number = 20) {
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      throw new CustomError('Order not found', 404);
    }
    return order;
  }

  async getAllBulkEnquiries(status?: string) {
    const query: any = {};
    if (status) {
      query.status = status;
    }
    return bulkEnquiryService.getAllEnquiries(query);
  }

  async updateBulkEnquiryStatus(enquiryId: string, status: string, adminId: string, notes?: string) {
    return bulkEnquiryService.updateEnquiryStatus(enquiryId, status, adminId, notes);
  }

  async deleteBulkEnquiry(enquiryId: string) {
    return bulkEnquiryService.deleteEnquiry(enquiryId);
  }

  async moderateReview(reviewId: string, isApproved: boolean) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    );
    if (!review) {
      throw new CustomError('Review not found', 404);
    }
    return review;
  }

  async getRevenueAnalytics(startDate?: string, endDate?: string) {
    const matchQuery: any = { status: 'delivered' };
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    return Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);
  }

  async getProductAnalytics() {
    return Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);
  }
}

export const adminService = new AdminService();
