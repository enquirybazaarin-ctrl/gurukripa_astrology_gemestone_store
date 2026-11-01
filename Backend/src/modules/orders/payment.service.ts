import Razorpay from 'razorpay';
import crypto from 'crypto';
import { CustomError } from '../../common/middleware/errorHandler';

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
};

export const paymentService = {
    createRazorpayOrder: async (amount: number, receipt: string) => {
        try {
            // Mock Mode: If keys are default/missing, return mock order
            if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id' || process.env.RAZORPAY_KEY_ID === 'rzp_test_1234567890abcdef') {
                console.log('⚠️ Using Mock Razorpay Order');
                return {
                    id: `order_mock_${Date.now()}`,
                    entity: 'order',
                    amount: Math.round(amount * 100),
                    amount_paid: 0,
                    amount_due: Math.round(amount * 100),
                    currency: 'INR',
                    receipt,
                    status: 'created',
                    attempts: 0,
                    notes: [],
                    created_at: Math.floor(Date.now() / 1000),
                };
            }

            if (!process.env.RAZORPAY_KEY_SECRET) {
                throw new CustomError('Razorpay secret key is missing', 500);
            }

            const options = {
                amount: Math.round(amount * 100), // Razorpay expects amount in paise
                currency: 'INR',
                receipt,
            };

            const razorpay = getRazorpayInstance();
            const order = await razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error('Razorpay Create Order Error:', error);
            throw new CustomError('Failed to create payment order', 500);
        }
    },

    verifyPaymentSignature: (
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string
    ): boolean => {
        const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

        // Mock Verification
        if (razorpayOrderId.startsWith('order_mock_')) {
            return true;
        }

        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        return generatedSignature === razorpaySignature;
    },

    verifyWebhookSignature: (rawBody: string, signature: string): boolean => {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) return false;

        const generatedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        return generatedSignature === signature;
    }
};
