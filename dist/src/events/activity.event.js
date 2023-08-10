"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const activity_enum_1 = require("../enum/activity.enum");
const activity_model_1 = require("../../__core/models/activity.model");
// Create an EventEmitter instance
exports.emitter = new eventemitter3_1.default();
// Event listener for 'login-activity' event
exports.emitter.on(activity_enum_1.BetEventName.PLACE_BET, (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new Activity document
        const newActivity = new activity_model_1.Activity({
            user: payload.user,
            description: payload.description
        });
        // Save the new activity log to the database
        yield newActivity.save();
        console.log({ activity: payload.description });
    }
    catch (error) {
        console.error(`@${activity_enum_1.BetEventName.PLACE_BET} error`, error);
    }
}));
// Event listener for 'login-activity' event
exports.emitter.on(activity_enum_1.BetEventName.BET_ACTIVITY, (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new Activity document
        const newActivity = new activity_model_1.Activity({
            user: payload.user,
            description: payload.description
        });
        // Save the new activity log to the database
        yield newActivity.save();
        console.log({ activity: payload.description });
    }
    catch (error) {
        console.error(`@${payload.description} error`, error);
    }
}));
//# sourceMappingURL=activity.event.js.map