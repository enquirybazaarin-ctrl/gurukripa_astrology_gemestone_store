import { Coupon, ICoupon } from './coupon.model';
import { CustomError } from '../../common/middleware/errorHandler';

export class CouponService {
  async validateCoupon(code: string, amount: number): Promise<ICoupon> {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      throw new CustomError('Invalid coupon code', 400);
    }

    if (coupon.status !== 'active') {
      throw new CustomError('Coupon is not active', 400);
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new CustomError('Coupon has expired', 400);
    }

    if (coupon.minPurchase && amount < coupon.minPurchase) {
      throw new CustomError(`Minimum purchase of ₹${coupon.minPurchase} required`, 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new CustomError('Coupon usage limit reached', 400);
    }

    return coupon;
  }

  async createCoupon(couponData: any): Promise<ICoupon> {
    return Coupon.create(couponData);
  }

  async getAllCoupons(): Promise<ICoupon[]> {
    return Coupon.find().sort({ createdAt: -1 }).lean() as any as ICoupon[];
  }

  async updateCoupon(couponId: string, updateData: any): Promise<ICoupon> {
    const coupon = await Coupon.findByIdAndUpdate(couponId, updateData, { new: true });
    if (!coupon) {
      throw new CustomError('Coupon not found', 404);
    }
    return coupon;
  }

  async deleteCoupon(couponId: string): Promise<void> {
    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      throw new CustomError('Coupon not found', 404);
    }
  }
}

export const couponService = new CouponService();
