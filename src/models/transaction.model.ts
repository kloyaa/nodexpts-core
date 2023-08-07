import { Schema, model } from "mongoose";
import { ITransaction } from "../interface/bet.interface";

const transaction = new Schema<ITransaction>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the User model
    content: {
        type: Schema.Types.Array,
        required: true,
    },
    schedule: {
        type: Date, 
        required: true 
    },
    time: {
        type: String, 
        required: true,
        enum: ["10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM"]
    },
    total: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true,
        enum: ["3D", "STL"]
    }
}, { timestamps: true });


export const Transaction = model<ITransaction>('Transaction', transaction);
