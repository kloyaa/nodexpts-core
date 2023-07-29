import { Types, Document } from "mongoose";

export interface IBet extends Document {
    user: Types.ObjectId;
    type: "S3" | "STL";
    schedule: Date;
    amount: number;
    rambled: boolean;
}