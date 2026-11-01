import { Banner, IBanner } from './banner.model';

export class BannerService {
  async getActiveBanners(page?: string): Promise<IBanner[]> {
    const query: any = { isActive: true };
    if (page) {
      if (page === 'home') {
        query.$or = [{ page: 'home' }, { page: { $exists: false } }];
      } else {
        query.page = page;
      }
    }
    
    return Banner.find(query)
      .sort({ order: 1 })
      .lean() as any as IBanner[];
  }

  async getAllBanners(page?: string): Promise<IBanner[]> {
    const query: any = {};
    if (page) {
      if (page === 'home') {
        query.$or = [{ page: 'home' }, { page: { $exists: false } }];
      } else {
        query.page = page;
      }
    }
    return Banner.find(query).sort({ order: 1, createdAt: -1 }).lean() as any as IBanner[];
  }

  async createBanner(bannerData: any): Promise<IBanner> {
    return Banner.create(bannerData);
  }

  async updateBanner(bannerId: string, updateData: any): Promise<IBanner> {
    const banner = await Banner.findByIdAndUpdate(bannerId, updateData, { new: true });
    if (!banner) {
      throw new Error('Banner not found'); // Using Error for now, mapped to 500 or 404 by generic handler usually, but standard is CustomError if available
      // Note: CustomError is available in coupon service, let's verify if I should import it.
    }
    return banner;
  }

  async deleteBanner(bannerId: string): Promise<void> {
    const banner = await Banner.findByIdAndDelete(bannerId);
    if (!banner) {
      throw new Error('Banner not found');
    }
  }
}

export const bannerService = new BannerService();
