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
exports.isUserProfileCreated = void 0;
const api_statuses_const_1 = require("../const/api-statuses.const");
const user_repositories_1 = require("../repositories/user.repositories");
const isUserProfileCreated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user.value) {
        return res.status(403).json({ error: 'Failed to authenticate token.' });
    }
    const isClientProfile = yield (0, user_repositories_1.isClientProfileCreated)(req.user.value);
    if (!isClientProfile) {
        res.status(401).json(api_statuses_const_1.statuses["0104"]);
        return;
    }
    next();
});
exports.isUserProfileCreated = isUserProfileCreated;
//# sourceMappingURL=is-user-profile-created.middleware.js.map