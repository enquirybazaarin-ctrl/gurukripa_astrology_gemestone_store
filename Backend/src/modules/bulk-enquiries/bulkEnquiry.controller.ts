import { Request, Response, NextFunction } from 'express';
import { bulkEnquiryService } from './bulkEnquiry.service';
import { AuthRequest } from '../../common/middleware/auth';

export const createBulkEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enquiry = await bulkEnquiryService.createBulkEnquiry(req.body, (req as AuthRequest).user?.id);
    res.status(201).json({
      success: true,
      message: 'Bulk enquiry submitted successfully',
      data: { enquiry }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnquiries = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const enquiries = await bulkEnquiryService.getMyEnquiries(req.user.id);
    res.json({
      success: true,
      data: { enquiries }
    });
  } catch (error) {
    next(error);
  }
};
