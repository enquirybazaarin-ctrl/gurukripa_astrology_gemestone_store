import { api } from './api';

export interface CreateOrderParams {
    items: {
        productId: string;
        quantity: number;
        image: string;
        variantId?: string;
        packId?: string;
        styleId?: string;
        addOnIds?: string[];
        selectedAttributes?: { [key: string]: string }; // Attribute Name -> Option Label
        size?: string;
        fragrance?: string;
        fragrances?: string[];
        giftCustomization?: {
            occasion: string;
            designId: string;
            message: string;
            price: number;
        };
        breakdown?: {
            basePrice: number;
            attributes: { key: string; value: string }[];
            addOns: string[];
            styles?: string[];
            multiplier: number;
        };
        styles?: string[]; // Top level labels for easy access
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentMethod: 'cod' | 'online';
    couponCode?: string;
}

export const OrderService = {
    createOrder: async (data: CreateOrderParams) => {
        const response = await api.post('/orders', data);
        return response.data.data; // Returns { order, token }
    },

    verifyPayment: async (data: {
        orderId: string;
        paymentId: string;
        signature: string;
        razorpayOrderId: string;
    }) => {
        const response = await api.post('/orders/verify-payment', data);
        return response.data.data.order;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data.data.orders;
    },

    getOrderById: async (id: string) => {
        const response = await api.get(`/orders/${id}`);
        return response.data.data.order;
    },

    downloadInvoice: async (id: string) => {
        const response = await api.get(`/orders/${id}/invoice`);
        return response.data.data;
    }
};
