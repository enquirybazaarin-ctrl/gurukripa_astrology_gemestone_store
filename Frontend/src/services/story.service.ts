import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface Story {
    _id: string;
    title: string;
    videoUrl: string;
    logoUrl: string;
    isActive: boolean;
    order: number;
    views: number;
    createdAt: string;
}

class StoryService {
    async getActiveStories(): Promise<{ success: boolean; data: { stories: Story[] } }> {
        const response = await axios.get(`${API_URL}/stories`);
        return response.data;
    }

    async incrementViews(id: string): Promise<void> {
        await axios.post(`${API_URL}/stories/${id}/view`);
    }

    // Admin methods
    async getAllStories(): Promise<{ success: boolean; data: { stories: Story[] } }> {
        const response = await axios.get(`${API_URL}/stories/all`, { withCredentials: true });
        return response.data;
    }

    async createStory(formData: FormData): Promise<any> {
        const response = await axios.post(`${API_URL}/stories`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        return response.data;
    }

    async updateStory(id: string, formData: FormData): Promise<any> {
        const response = await axios.put(`${API_URL}/stories/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        return response.data;
    }

    async deleteStory(id: string): Promise<any> {
        const response = await axios.delete(`${API_URL}/stories/${id}`, { withCredentials: true });
        return response.data;
    }

    async reorderStories(stories: { id: string; order: number }[]): Promise<any> {
        const response = await axios.post(`${API_URL}/stories/reorder`, stories, { withCredentials: true });
        return response.data;
    }
}

export const storyService = new StoryService();
