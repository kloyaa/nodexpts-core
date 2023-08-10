"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetResult = void 0;
const mongoose_1 = require("mongoose");
const betResultSchema = new mongoose_1.Schema({
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
        enum: ['3D', 'STL']
    },
    time: {
        type: String,
        required: true,
        enum: ['10:30 AM', '3:00 PM', '8:00 PM', '2:00 PM', '5:00 PM', '9:00 PM']
    }
}, { timestamps: true });
exports.BetResult = (0, mongoose_1.model)('BetResult', betResultSchema);
//# sourceMappingURL=bet-result.model.js.map