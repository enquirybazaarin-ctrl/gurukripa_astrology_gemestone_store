import { Request, Response, NextFunction } from 'express';
import { bannerService } from './banner.service';

export const getActiveBanners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page } = req.query;
    const banners = await bannerService.getActiveBanners(page as string);
    res.json({
      success: true,
      data: { banners }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBanners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page } = req.query;
    const banners = await bannerService.getAllBanners(page as string);
    res.json({
      success: true,
      data: { banners }
    });
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banner = await bannerService.createBanner(req.body);
    res.status(201).json({
      success: true,
      data: { banner }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body);
    res.json({
      success: true,
      data: { banner }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
