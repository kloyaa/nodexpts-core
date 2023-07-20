import { Schema, model, Document } from 'mongoose';
import { IUser } from '../interfaces/schema.interface';

const userSchema = new Schema<IUser>({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: false, 
    },
    salt: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
