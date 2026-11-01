import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
    key: string;
    value: any;
    description?: string;
    isPublic: boolean;
    updatedBy?: mongoose.Types.ObjectId;
}

const settingsSchema = new Schema<ISettings>(
    {
        key: {
            type: String,
            required: [true, 'Setting key is required'],
            unique: true,
            trim: true,
            index: true
        },
        value: {
            type: Schema.Types.Mixed,
            required: [true, 'Setting value is required']
        },
        description: {
            type: String,
            trim: true
        },
        isPublic: {
            type: Boolean,
            default: false, // If true, can be accessed without authentication (like announcement bar)
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
