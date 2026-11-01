import { api } from './api';

export const CouponService = {
    validateCoupon: async (code: string, amount: number) => {
        const response = await api.post('/admin/coupons/validate', { code, amount });
        return response.data.data.coupon;
    }
};
