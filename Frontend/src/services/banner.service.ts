import { api } from './api';

export interface Banner {
  _id: string;
  title: string;
  image: string;
  mobileImage?: string;
  link?: string;
  order: number;
}

export const bannerService = {
  getActiveBanners: async (page?: string) => {
    try {
      const response = await api.get('/banners', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch banners', error);
      return { data: { banners: [] } };
    }
  },
};
