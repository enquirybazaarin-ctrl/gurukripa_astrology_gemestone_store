import { Request, Response, NextFunction } from 'express';
import { addressService } from './address.service';
import { AuthRequest } from '../../common/middleware/auth';

export const createAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const address = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: { address }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAddresses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const addresses = await addressService.getUserAddresses(req.user.id);
    res.json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
    res.json({
      success: true,
      data: { address }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await addressService.deleteAddress(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const address = await addressService.setDefaultAddress(req.params.id, req.user.id);
    res.json({
      success: true,
      data: { address }
    });
  } catch (error) {
    next(error);
  }
};
