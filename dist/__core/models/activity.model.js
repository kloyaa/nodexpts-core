"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
// Define the Activity Schema
const activitySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });
// Create the Activity model
exports.Activity = (0, mongoose_1.model)('Activity', activitySchema);
//# sourceMappingURL=activity.model.js.map