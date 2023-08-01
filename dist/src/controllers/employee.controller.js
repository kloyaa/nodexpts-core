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
exports.getDailyTotal = exports.updateProfileVerifiedStatus = void 0;
const profile_model_1 = require("../../__core/models/profile.model");
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
const bet_model_1 = require("../models/bet.model");
const bet_controller_1 = require("./bet.controller");
// Patch request to update the 'verified' field of a profile
const updateProfileVerifiedStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const profile = yield profile_model_1.Profile.findOne({ user });
        if (!profile) {
            // If profile is not found, return an error
            res.status(404).json(api_statuses_const_1.statuses["0104"]);
            return;
        }
        profile.verified = verified;
        yield profile.save();
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
//# sourceMappingURL=employee.controller.js.map