"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = require("mongoose");
// Define the ProfileSchema
const profileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    contactNumber: {
        type: String,
        required: false
    },
    gender: {
        type: String, enum: ['male', 'female', 'other'],
        required: false
    },
    refferedBy: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    // Other profile properties
}, { timestamps: true });
// Create and export the Profile model
exports.Profile = (0, mongoose_1.model)('Profile', profileSchema);
//# sourceMappingURL=profile.model.js.map