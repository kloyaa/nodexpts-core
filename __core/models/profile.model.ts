import { Schema, model, Document, Types } from 'mongoose';
import { IProfile } from '../interfaces/schema.interface';

// Define the ProfileSchema
const profileSchema = new Schema<IProfile>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the User model
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    birthdate: { 
        type: Date, 
        required: false 
    },
    address: { 
        type: String, 
        required: false 
    },
    contactNumber: { 
        type: String, 
        required: false 
    },
    gender: { 
        type: String, enum: ['male', 'female', 'other'], 
        required: false 
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    // Other profile properties
}, { timestamps: true });

// Create and export the Profile model
export const Profile = model<IProfile>('Profile', profileSchema);
