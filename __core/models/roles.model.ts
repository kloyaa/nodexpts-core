import { model, Schema } from 'mongoose';
import { IUserRole } from '../interfaces/schema.interface';

// Define the schema for the User Role
const userRoleSchema = new Schema<IUserRole>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String, 
        required: true 
    },
  // Add other schema properties here
});

// Create and export the User Role model based on the schema
export const UserRole = model<IUserRole>('Roles', userRoleSchema);