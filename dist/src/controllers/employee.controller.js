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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleForUser = exports.getDailyTotal = exports.updateProfileVerifiedStatus = void 0;
const profile_model_1 = require("../../__core/models/profile.model");
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
const bet_model_1 = require("../models/bet.model");
const bet_controller_1 = require("./bet.controller");
const user_model_1 = require("../../__core/models/user.model");
const roles_model_1 = require("../../__core/models/roles.model");
const mongoose_1 = require("mongoose");
const activity_event_1 = require("../../__core/events/activity.event");
const activity_enum_1 = require("../../__core/enum/activity.enum");
const updateProfileVerifiedStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().updateProfileVerifiedStatusAPI(req.body);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const { user, verified } = req.body; // Assuming the profile ID is provided in the request parameters
        if (!(0, mongoose_1.isValidObjectId)(user)) {
            return res.status(400).json(api_statuses_const_1.statuses['0901']);
        }
        // Find the profile by _id
        const profile = yield profile_model_1.Profile.findOne({ user });
        if (!profile) {
            // If profile is not found, return an error
            res.status(404).json(api_statuses_const_1.statuses['0104']);
            return;
        }
        profile.verified = verified;
        yield profile.save();
        activity_event_1.emitter.emit(activity_enum_1.EventName.PROFILE_VERIFICATION, {
            user: req.user.value,
            description: activity_enum_1.ActivityType.PROFILE_VERIFICATION
        });
        res.status(200).json(profile);
    }
    catch (error) {
        console.log('@updateProfileVerified error', error);
        res.status(500).json(error);
    }
});
exports.updateProfileVerifiedStatus = updateProfileVerifiedStatus;
const getDailyTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rambled, target] = yield Promise.all([
            bet_model_1.Bet.find({ rambled: true }).exec(),
            bet_model_1.Bet.find({ rambled: false }).exec()
        ]);
        return res.status(200).json({
            rambled: (0, bet_controller_1.getNumbersTotalAmount)(rambled),
            target: (0, bet_controller_1.getNumbersTotalAmount)(target)
        });
    }
    catch (error) {
        console.log('@getDailyTotal error', error);
        res.status(500).json(error);
    }
});
exports.getDailyTotal = getDailyTotal;
const createRoleForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().createRoleForUser(req.body);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const { user, name, description } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(user)) {
            return res.status(400).json(api_statuses_const_1.statuses['0901']);
        }
        // Check if the user exists in the database
        const existingUser = yield user_model_1.User.findById(user).exec();
        if (!existingUser) {
            return res.status(403).json(api_statuses_const_1.statuses['0056']);
        }
        // Create the user role
        const userRole = new roles_model_1.UserRole({ user, name, description });
        // Save the user role to the database
        yield userRole.save();
        activity_event_1.emitter.emit(activity_enum_1.EventName.ROLE_CREATION, {
            user: user._id,
            description: activity_enum_1.ActivityType.ROLE_CREATION
        });
        return res.status(201).json(userRole);
    }
    catch (error) {
        console.error('Error creating user role:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createRoleForUser = createRoleForUser;
//# sourceMappingURL=employee.controller.js.map