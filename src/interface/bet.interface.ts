import { Types, Document } from "mongoose";

export interface IBet extends Document {
    user: Types.ObjectId;
    type: "S3" | "STL";
    schedule: Date;
    amount: number;
    rambled: boolean;
    time: "10:30 AM" | "3:00 PM" | "8:00 PM" | "2:00 PM" | "5:00 PM" | "9:00 PM";
}