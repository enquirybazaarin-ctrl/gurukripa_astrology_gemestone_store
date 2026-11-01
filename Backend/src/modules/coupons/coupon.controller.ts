import { Request, Response, NextFunction } from 'express';
import { couponService } from './coupon.service';
import { AuthRequest } from '../../common/middleware/auth';

export const validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, amount } = req.body;
    const coupon = await couponService.validateCoupon(code, amount);
    res.json({
      success: true,
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json({
      success: true,
      data: { coupons }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.json({
      success: true,
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
