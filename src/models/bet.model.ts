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
        enum: ["S3", "STL"]
    },
    schedule: {
        type: Date, 
        required: true 
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

export const User = model<IBet>('Bet', betSchema);
