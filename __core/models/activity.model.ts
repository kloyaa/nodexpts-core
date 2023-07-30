import { Schema, Document, model } from 'mongoose';
import { IActivity } from '../interfaces/schema.interface';

// Define the Activity Schema
const activitySchema = new Schema<IActivity>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the User model
    description: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Create the Activity model
export const Activity = model<IActivity>('Activity', activitySchema);