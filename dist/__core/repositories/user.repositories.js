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
exports.isClientVerified = exports.isClientProfileCreated = void 0;
const profile_model_1 = require("../models/profile.model");
// Checking
const isClientProfileCreated = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield profile_model_1.Profile.findOne({ user: clientId }).exec();
    if (profile !== null) {
        return true;
    }
    else {
        return false;
    }
});
exports.isClientProfileCreated = isClientProfileCreated;
const isClientVerified = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield profile_model_1.Profile.findOne({ user: clientId }).exec();
    if ((profile === null || profile === void 0 ? void 0 : profile.verified) === true && profile !== null) {
        return true;
    }
    else {
        return false;
    }
});
exports.isClientVerified = isClientVerified;
//# sourceMappingURL=user.repositories.js.map