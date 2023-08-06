import { Types, Document } from "mongoose";

export interface IBet  {
    user: Types.ObjectId;
    type: "3D" | "STL";
    schedule: Date;
    amount: number;
    number: String;
    rambled: boolean;
    reference: String;
    code: String;
    time: "10:30 AM" | "3:00 PM" | "8:00 PM" | "2:00 PM" | "5:00 PM" | "9:00 PM";
}

export interface IBetConfig {
    rambleLimit: number;
    normalNumLimit: number;
    doubleNumLimit: number;
    tripleNum: number;
}

export interface INumberStats {
    user: Types.ObjectId;
    schedule: Date;
    amount: number;
    number: String;
    time: "10:30 AM" | "3:00 PM" | "8:00 PM" | "2:00 PM" | "5:00 PM" | "9:00 PM";
}

export interface IBetResult {
    type: "S3" | "STL";
    schedule: Date;
    number: String;
    time: "10:30 AM" | "3:00 PM" | "8:00 PM" | "2:00 PM" | "5:00 PM" | "9:00 PM";
}

export type TNumbeClassification = "double" | "triple" | "normal" | "ramble"