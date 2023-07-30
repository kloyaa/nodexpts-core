import { Schema, model } from "mongoose";
import { IBet } from "../interface/bet.interface";

const betSchema = new Schema<IBet>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the User model
    type: {
        type: String,
        required: true,
        enum: ["3D", "STL"]
    },
    number: {
        type: String, 
        required: true 
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
    amount: {
        type: Number,
        required: true
    },
    rambled: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export const Bet = model<IBet>('Bet', betSchema);
