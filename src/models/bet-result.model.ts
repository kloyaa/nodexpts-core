import { Schema, model } from "mongoose";
import { IBetResult } from "../interface/bet.interface";

const betResultSchema = new Schema<IBetResult>({
    number: {
        type: String, 
        required: true 
    },
    schedule: {
        type: Date, 
        required: true 
    },
    type: {
        type: String,
        required: true,
        enum: ["3D", "STL"]
    },
    time: {
        type: String, 
        required: true,
        enum: ["10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM"]
    },
}, { timestamps: true });

export const BetResult = model<IBetResult>('BetResult', betResultSchema);