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
exports.me = exports.getAllProfiles = exports.getProfileByLoginId = exports.create = void 0;
const profile_model_1 = require("../../__core/models/profile.model");
const user_model_1 = require("../../__core/models/user.model");
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
const activity_event_1 = require("../../__core/events/activity.event");
const activity_enum_1 = require("../../__core/enum/activity.enum");
const mongodb_1 = require("mongodb");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().createProfileAPI(req.body);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { firstName, lastName, birthdate, address, contactNumber, gender, refferedBy } = req.body;
        // Check if the user exists
        const user = yield user_model_1.User.findById(req.user.value);
        if (!user) {
            res.status(404).json(api_statuses_const_1.statuses["0055"]);
            return;
        }
        // Check if profile already exist
        const profile = yield profile_model_1.Profile.findOne({ user }).exec();
        if (profile) {
            res.status(404).json(api_statuses_const_1.statuses["0103"]);
            return;
        }
        // Create a new Profile document and associate it with the user
        const newProfile = new profile_model_1.Profile({
            user: user._id,
            firstName,
            lastName,
            birthdate,
            address,
            contactNumber,
            gender,
            refferedBy
        });
        // Save the new Profile document to the database
        yield newProfile.save();
        activity_event_1.emitter.emit(activity_enum_1.EventName.PROFILE_CREATION, {
            user: user._id,
            description: activity_enum_1.ActivityType.PROFILE_CREATION,
        });
        res.status(201).json(api_statuses_const_1.statuses["0100"]);
    }
    catch (error) {
        console.log("@create error", error);
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
});
exports.create = create;
const getProfileByLoginId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().getProfileByLoginIdAPI(req.query);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const pipeline = [
            // Match the User collection to find the user by their username
            {
                $match: {
                    $or: [
                        { username: req.query.loginId },
                        { email: req.query.loginId }
                    ]
                }
            },
            // Lookup the Profile collection to get the profile associated with the user
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'profile'
                }
            },
            // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
            { $unwind: '$profile' },
            // Project only the required fields for the user and the profile
            {
                $project: {
                    username: 1,
                    email: 1,
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        birthdate: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1,
                        verified: 1
                    }
                }
            }
        ];
        // Execute the aggregation pipeline
        const result = yield user_model_1.User.aggregate(pipeline);
        if (result.length === 0) {
            res.status(403).json(api_statuses_const_1.statuses["0104"]);
            return;
        }
        // Return the user object along with the user's profile
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.log('@getProfileByUsername error', error);
        res.status(500).json(error);
    }
});
exports.getProfileByLoginId = getProfileByLoginId;
const getAllProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verified } = req.query;
        const pipeline = [
            // Lookup the Profile collection to get the profile associated with the user
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'profile'
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'role'
                }
            },
            // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
            { $unwind: '$profile' },
            {
                $unwind: {
                    path: '$roles',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Match only the users with verified profiles
            ...(typeof verified === 'boolean' || verified === 'true' || verified === 'false'
                ? [{ $match: { 'profile.verified': verified === 'true' ? true : false } }]
                : []),
            // Project only the required fields for the user and the profile
            {
                $project: {
                    username: 1,
                    email: 1,
                    role: 1,
                    profile: {
                        user: 1,
                        firstName: 1,
                        lastName: 1,
                        birthdate: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1,
                        verified: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        refferedBy: 1,
                    },
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ];
        // Execute the aggregation pipeline
        const result = yield user_model_1.User.aggregate(pipeline);
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('@getAllActiveProfiles error', error);
        res.status(500).json(error);
    }
});
exports.getAllProfiles = getAllProfiles;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
            // Match the User collection to find the user by their username
            { $match: { _id: new mongodb_1.ObjectId(req.user.value) } },
            // Lookup the Profile collection to get the profile associated with the user
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'profile'
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'role'
                }
            },
            // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
            { $unwind: '$profile' },
            {
                $unwind: {
                    path: '$roles',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Project only the required fields for the user and the profile
            {
                $project: {
                    username: 1,
                    email: 1,
                    role: 1,
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        birthdate: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1,
                        verified: 1
                    }
                }
            }
        ];
        // Execute the aggregation pipeline
        const result = yield user_model_1.User.aggregate(pipeline);
        if (result.length === 0) {
            res.status(403).json(api_statuses_const_1.statuses["0104"]);
            return;
        }
        // Return the user object along with the user's profile
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.log('@me error', error);
        res.status(500).json(error);
    }
});
exports.me = me;
//# sourceMappingURL=profile.controller.js.map