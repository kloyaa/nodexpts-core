"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const activity_model_1 = require("../models/activity.model");
const activity_enum_1 = require("../enum/activity.enum");
// Create an EventEmitter instance
exports.emitter = new eventemitter3_1.default();
// Event listener for 'login-activity' event
exports.emitter.on(activity_enum_1.EventName.LOGIN, async (payload) => {
    try {
        // Create a new Activity document
        const newActivity = new activity_model_1.Activity({
            user: payload.user,
            description: payload.description,
        });
        // Save the new activity log to the database
        await newActivity.save();
        console.log({ activity: payload.description });
    }
    catch (error) {
        console.error(`@${activity_enum_1.EventName.LOGIN} error`, error);
    }
});
exports.emitter.on(activity_enum_1.EventName.ACCOUNT_CREATION, async (payload) => {
    try {
        // Create a new Activity document
        const newActivity = new activity_model_1.Activity({
            user: payload.user,
            description: payload.description,
        });
        // Save the new activity log to the database
        await newActivity.save();
        console.log({ activity: payload.description });
    }
    catch (error) {
        console.error(`@${activity_enum_1.EventName.ACCOUNT_CREATION} error`, error);
    }
});