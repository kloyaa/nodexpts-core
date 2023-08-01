"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserProfileCreated = void 0;
const api_statuses_const_1 = require("../const/api-statuses.const");
const user_repositories_1 = require("../repositories/user.repositories");
const isUserProfileCreated = async (req, res, next) => {
    if (!req.user.value) {
        return res.status(403).json({ error: 'Failed to authenticate token.' });
    }
    const isClientProfile = await (0, user_repositories_1.isClientProfileCreated)(req.user.value);
    if (!isClientProfile) {
        res.status(401).json(api_statuses_const_1.statuses["0104"]);
        return;
    }
    next();
};
exports.isUserProfileCreated = isUserProfileCreated;
