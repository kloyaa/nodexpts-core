"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfiles = exports.getProfileByLoginId = exports.create = void 0;
const profile_model_1 = require("../../__core/models/profile.model");
const user_model_1 = require("../../__core/models/user.model");
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
const create = async (req, res) => {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().createProfileAPI(req.body);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { firstName, lastName, birthdate, address, contactNumber, gender } = req.body;
        // Check if the user exists
        const user = await user_model_1.User.findById(req.user.value);
        if (!user) {
            res.status(404).json(api_statuses_const_1.statuses["0055"]);
            return;
        }
        // Check if profile already exist
        const profile = await profile_model_1.Profile.findOne({ user }).exec();
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
        });
        // Save the new Profile document to the database
        await newProfile.save();
        res.status(201).json(api_statuses_const_1.statuses["0100"]);
    }
    catch (error) {
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
};
exports.create = create;
const getProfileByLoginId = async (req, res) => {
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
        const result = await user_model_1.User.aggregate(pipeline);
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
};
exports.getProfileByLoginId = getProfileByLoginId;
const getAllProfiles = async (req, res) => {
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
            // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
            { $unwind: '$profile' },
            // Match only the users with verified profiles
            ...(typeof verified === 'boolean' || verified === 'true' || verified === 'false'
                ? [{ $match: { 'profile.verified': verified === 'true' ? true : false } }]
                : []),
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
        const result = await user_model_1.User.aggregate(pipeline);
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
};
exports.getAllProfiles = getAllProfiles;