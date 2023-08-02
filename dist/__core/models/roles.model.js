"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the User Role
const userRoleSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    // Add other schema properties here
}, { timestamps: true });
// Create and export the User Role model based on the schema
exports.UserRole = (0, mongoose_1.model)('Roles', userRoleSchema);
//# sourceMappingURL=roles.model.js.map