import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { AuthRequest } from '../../common/middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await adminService.getDashboardStats(
      startDate as string,
      endDate as string
    );
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 100, search, category } = req.query;
    const result = await adminService.getAllProducts(
      Number(page),
      Number(limit),
      search as string,
      category as string
    );
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await adminService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await adminService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await adminService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    const orders = await adminService.getAllOrders(status as string, Number(page), Number(limit));
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await adminService.updateOrderStatus(req.params.id, req.body.status);
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBulkEnquiries = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const enquiries = await adminService.getAllBulkEnquiries(status as string);
    res.json({
      success: true,
      data: { enquiries }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBulkEnquiryStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const enquiry = await adminService.updateBulkEnquiryStatus(
      req.params.id,
      req.body.status,
      req.user.id,
      req.body.notes
    );
    res.json({
      success: true,
      data: { enquiry }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBulkEnquiry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await adminService.deleteBulkEnquiry(req.params.id);
    res.json({
      success: true,
      message: 'Bulk enquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await adminService.moderateReview(req.params.id, req.body.isApproved);
    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await adminService.getRevenueAnalytics(
      startDate as string,
      endDate as string
    );
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

export const getProductAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const analytics = await adminService.getProductAnalytics();
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};
