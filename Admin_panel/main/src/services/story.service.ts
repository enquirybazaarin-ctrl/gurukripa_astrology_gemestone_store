import { api } from './api';

export interface Story {
    id: string;
    _id?: string;
    title: string;
    videoUrl: string;
    logoUrl: string;
    isActive: boolean;
    order: number;
    views: number;
    createdAt: string;
}

export const StoryService = {
    async getAllStories(): Promise<Story[]> {
        const response = await api.get('/stories/all');
        return response.data.data.stories.map((s: any) => ({ ...s, id: s._id }));
    },

    async createStory(formData: FormData): Promise<Story> {
        const response = await api.post('/stories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.story;
    },

    async updateStory(id: string, formData: FormData | any): Promise<Story> {
        const isFormData = formData instanceof FormData;
        const response = await api.put(`/stories/${id}`, formData, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
        return response.data.data.story;
    },

    async deleteStory(id: string): Promise<void> {
        await api.delete(`/stories/${id}`);
    },

    async reorderStories(stories: { id: string; order: number }[]): Promise<void> {
        await api.post('/stories/reorder', stories);
    }
};
