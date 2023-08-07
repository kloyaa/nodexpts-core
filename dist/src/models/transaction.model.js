"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: mongoose_1.Schema.Types.Array,
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
exports.Transaction = (0, mongoose_1.model)('Transaction', transaction);
//# sourceMappingURL=transaction.model.js.map