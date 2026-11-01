import { Story, IStory } from './story.model';
import { CustomError } from '../../common/middleware/errorHandler';

class StoryService {
    async getActiveStories(): Promise<IStory[]> {
        return Story.find({ isActive: true }).sort({ order: 1 });
    }

    async getAllStories(): Promise<IStory[]> {
        return Story.find().sort({ order: 1 });
    }

    async createStory(storyData: Partial<IStory>): Promise<IStory> {
        const lastStory = await Story.findOne().sort({ order: -1 });
        const order = lastStory ? lastStory.order + 1 : 0;

        const story = new Story({
            ...storyData,
            order: storyData.order !== undefined ? storyData.order : order
        });

        return story.save();
    }

    async updateStory(id: string, storyData: Partial<IStory>): Promise<IStory> {
        const story = await Story.findByIdAndUpdate(
            id,
            { $set: storyData },
            { new: true, runValidators: true }
        );

        if (!story) {
            throw new CustomError('Story not found', 404);
        }

        return story;
    }

    async deleteStory(id: string): Promise<void> {
        const story = await Story.findByIdAndDelete(id);
        if (!story) {
            throw new CustomError('Story not found', 404);
        }
    }

    async reorderStories(stories: { id: string; order: number }[]): Promise<void> {
        const bulkOps = stories.map((item) => ({
            updateOne: {
                filter: { _id: item.id as any },
                update: { $set: { order: item.order } },
            },
        }));

        await Story.bulkWrite(bulkOps);
    }

    async incrementViews(id: string): Promise<void> {
        await Story.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }
}

export const storyService = new StoryService();
