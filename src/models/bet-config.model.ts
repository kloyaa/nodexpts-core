import { Schema, model } from "mongoose";
import { IBet } from "../interface/bet.interface";

const betSchema = new Schema<any>({
    rambleLimit: {
        type: Number,
        required: true,
    },
    normalNumLimit: {
        type: Number,
        required: true 
    },
    doubleNumLimit: {
        type: Number,
        required: true 
    },
    tripleNum: {
        type: Number,
        required: true 
    },
}, { timestamps: true });

export const Bet = model<IBet>('Bet', betSchema);
