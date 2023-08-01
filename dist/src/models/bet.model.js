"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bet = exports.NumberStats = void 0;
const mongoose_1 = require("mongoose");
const betSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
const numberSatsSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
}, { timestamps: true });
exports.NumberStats = (0, mongoose_1.model)('NumberStats', numberSatsSchema);
exports.Bet = (0, mongoose_1.model)('Bet', betSchema);
