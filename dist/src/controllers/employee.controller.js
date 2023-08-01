"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyTotal = exports.updateProfileVerifiedStatus = void 0;
const profile_model_1 = require("../../__core/models/profile.model");
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
const bet_model_1 = require("../models/bet.model");
const bet_controller_1 = require("./bet.controller");
// Patch request to update the 'verified' field of a profile
const updateProfileVerifiedStatus = async (req, res) => {
    try {
        // // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().updateProfileVerifiedStatusAPI(req.body);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { user, verified } = req.body; // Assuming the profile ID is provided in the request parameters
        // Find the profile by _id
        const profile = await profile_model_1.Profile.findOne({ user });
        if (!profile) {
            // If profile is not found, return an error
            res.status(404).json(api_statuses_const_1.statuses["0104"]);
            return;
        }
        profile.verified = verified;
        await profile.save();
        res.status(200).json(profile);
    }
    catch (error) {
        console.log('@updateProfileVerified error', error);
        res.status(500).json(error);
    }
};
exports.updateProfileVerifiedStatus = updateProfileVerifiedStatus;
const getDailyTotal = async (req, res) => {
    try {
        const [rambled, target] = await Promise.all([
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
};
exports.getDailyTotal = getDailyTotal;
