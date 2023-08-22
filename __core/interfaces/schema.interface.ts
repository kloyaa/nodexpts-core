import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    salt: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserRole extends Document {
    user: Types.ObjectId;
    name: string;
    description: string;
  // Add any other properties you want to store in the User Role document
}

// Define the Profile interface
export interface IProfile extends Document {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    birthdate: Date;
    address: string;
    contactNumber: string;
    refferedBy: string;
    gender: 'male' | 'female' | 'other';
    verified: boolean;
    revoked: boolean;
    // Other profile properties
}

// Interface for the Activity document
export interface IActivity extends Document {
    user: Types.ObjectId;
    description: string;
    timestamp: Date;
}