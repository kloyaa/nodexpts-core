"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bet = void 0;
const mongoose_1 = require("mongoose");
const betSchema = new mongoose_1.Schema({
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
exports.Bet = (0, mongoose_1.model)('Bet', betSchema);
//# sourceMappingURL=bet-config.model.js.map