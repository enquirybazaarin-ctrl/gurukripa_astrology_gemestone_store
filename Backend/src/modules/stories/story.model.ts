import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
    title: string;
    videoUrl: string;
    logoUrl: string;
    isActive: boolean;
    order: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const storySchema = new Schema<IStory>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        logoUrl: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        order: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Indexes
storySchema.index({ isActive: 1, order: 1 });

export const Story = mongoose.model<IStory>('Story', storySchema);
