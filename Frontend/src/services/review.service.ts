import { api } from './api';

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    product: string;
    rating: number;
    title?: string;
    comment?: string;
    createdAt: string;
}

export const ReviewService = {
    getProductReviews: async (productId: string) => {
        try {
            const response = await api.get(`/reviews/product/${productId}`);
            return response.data.data.reviews;
        } catch (error) {
            console.error('Failed to fetch reviews', error);
            return [];
        }
    },

    createReview: async (reviewData: { productId: string, rating: number, title: string, comment: string }) => {
        const response = await api.post('/reviews', reviewData);
        return response.data.data.review;
    }
};
