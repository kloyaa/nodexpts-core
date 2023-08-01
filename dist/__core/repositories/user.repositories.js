"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClientVerified = exports.isClientProfileCreated = void 0;
const profile_model_1 = require("../models/profile.model");
// Checking
const isClientProfileCreated = async (clientId) => {
    const profile = await profile_model_1.Profile.findOne({ user: clientId }).exec();
    if (profile !== null) {
        return true;
    }
    else {
        return false;
    }
};
exports.isClientProfileCreated = isClientProfileCreated;
const isClientVerified = async (clientId) => {
    const profile = await profile_model_1.Profile.findOne({ user: clientId }).exec();
    if ((profile === null || profile === void 0 ? void 0 : profile.verified) === true && profile !== null) {
        return true;
    }
    else {
        return false;
    }
};
exports.isClientVerified = isClientVerified;
