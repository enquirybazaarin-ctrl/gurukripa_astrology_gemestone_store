import { api } from './api';

export interface ProductParams {
  category?: string;
  tag?: string;
  priceRange?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const ProductService = {
  getAllProducts: async (params?: ProductParams) => {
    const response = await api.get('/products', { params });
    const products = response.data.data.products;
    return products.map((p: any) => ({
      ...p,
      category: p.category?.slug || p.category?.name || p.category, // Use slug for links
      categoryId: p.category?._id || (typeof p.category === 'string' ? p.category : undefined),
      categorySlug: p.category?.slug,
      categoryName: p.category?.name,
      id: p._id
    }));
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    const product = response.data.data.product;
    return {
      ...product,
      category: product.category?.slug || product.category?.name || product.category, // Ensure slug
      id: product._id
    };
  },

  getProductBySlug: async (slug: string) => {
    // If backend supports slug, strictly usage. If not, this might need adjustment.
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data.product;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data.categories;
  }
};
