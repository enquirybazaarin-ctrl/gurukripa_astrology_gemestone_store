import { Request, Response, NextFunction } from 'express';
import { storyService } from './story.service';
import { getFileUrl } from '../../common/utils/fileUpload';

export const getActiveStories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stories = await storyService.getActiveStories();
        res.json({
            success: true,
            data: { stories }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllStories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stories = await storyService.getAllStories();
        res.json({
            success: true,
            data: { stories }
        });
    } catch (error) {
        next(error);
    }
};

export const createStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const storyData = { ...req.body };

        if (files['story-video']?.[0]) {
            storyData.videoUrl = getFileUrl(files['story-video'][0].filename, 'story');
        }
        if (files['story-logo']?.[0]) {
            storyData.logoUrl = getFileUrl(files['story-logo'][0].filename, 'story');
        }

        const story = await storyService.createStory(storyData);
        res.status(201).json({
            success: true,
            data: { story }
        });
    } catch (error) {
        next(error);
    }
};

export const updateStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const storyData = { ...req.body };

        if (files && files['story-video']?.[0]) {
            storyData.videoUrl = getFileUrl(files['story-video'][0].filename, 'story');
        }
        if (files && files['story-logo']?.[0]) {
            storyData.logoUrl = getFileUrl(files['story-logo'][0].filename, 'story');
        }

        const story = await storyService.updateStory(req.params.id, storyData);
        res.json({
            success: true,
            data: { story }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await storyService.deleteStory(req.params.id);
        res.json({
            success: true,
            message: 'Story deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const reorderStories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await storyService.reorderStories(req.body);
        res.json({
            success: true,
            message: 'Stories reordered successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const incrementViews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await storyService.incrementViews(req.params.id);
        res.json({
            success: true,
            message: 'Views incremented successfully'
        });
    } catch (error) {
        next(error);
    }
};
