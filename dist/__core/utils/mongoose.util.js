"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = void 0;
const mongoose_1 = require("mongoose");
const isValidObjectId = (value) => {
    try {
        if (!value || typeof value !== 'string') {
            return false;
        }
        return mongoose_1.Types.ObjectId.isValid(value);
    }
    catch (error) {
        console.log("@isValidObjectId", error);
        return false;
    }
};
exports.isValidObjectId = isValidObjectId;
//# sourceMappingURL=mongoose.util.js.map