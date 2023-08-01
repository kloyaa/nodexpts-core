"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.ENVIRONMENT === "development"
    ? process.env.DB_CONNECTION_STRING_LOCAL
    : process.env.DB_CONNECTION_STRING;
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Database connection success');
    }
    catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
};
exports.default = connectDB;
