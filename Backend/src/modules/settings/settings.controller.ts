import { Request, Response, NextFunction } from 'express';
import { Settings } from './settings.model';
import { CustomError } from '../../common/middleware/errorHandler';

export const getSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const isPublicRoute = req.path.includes('/public/'); // Define based on route registration

        const setting = await Settings.findOne({ key });

        if (!setting) {
            // If setting doesn't exist, we return a 404
            throw new CustomError('Setting not found', 404);
        }

        // If the route is public, ensure the setting is marked as public
        if (isPublicRoute && !setting.isPublic) {
            throw new CustomError('Unauthorized access to setting', 403);
        }

        res.status(200).json({
            success: true,
            data: {
                setting
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const { value, isPublic, description } = req.body;

        // We use findOneAndUpdate with upsert to create if it doesn't exist
        const setPayload: any = { value, updatedBy: (req as any).user._id };

        if (isPublic !== undefined) setPayload.isPublic = isPublic;
        if (description !== undefined) setPayload.description = description;

        const setting = await Settings.findOneAndUpdate(
            { key },
            { $set: setPayload },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: {
                setting
            }
        });
    } catch (error) {
        next(error);
    }
};
