import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    salt: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}


// Define the Profile interface
export interface IProfile extends Document {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    birthdate: Date;
    address: string;
    contactNumber: string;
    gender: 'male' | 'female' | 'other';
    verified: boolean;
    // Other profile properties
}