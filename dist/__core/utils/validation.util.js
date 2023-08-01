"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class RequestValidator {
    registerAPI(body) {
        const { error } = joi_1.default.object({
            username: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(6).required(),
        }).validate(body);
        return error;
    }
    loginAPI(body) {
        const { error } = joi_1.default.object({
            username: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
        }).validate(body);
        return error;
    }
    createRoleForUser(body) {
        const { error } = joi_1.default.object({
            name: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            user: joi_1.default.string().required(),
        }).validate(body);
        return error;
    }
    createProfileAPI(body) {
        const { error } = joi_1.default.object({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
            birthdate: joi_1.default.string().required(),
            address: joi_1.default.string().required(),
            contactNumber: joi_1.default.string().required(),
            gender: joi_1.default.string().required(),
        }).validate(body);
        return error;
    }
    getProfileByLoginIdAPI(query) {
        const { error } = joi_1.default.object({
            loginId: joi_1.default.string().required(),
        }).validate(query);
        return error;
    }
    createBetResultAPI(body) {
        const { error } = joi_1.default.object({
            type: joi_1.default.string().valid("3D", "STL").required(),
            schedule: joi_1.default.string().required(),
            number: joi_1.default.string().required().length(3),
            time: joi_1.default.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").required(),
        }).validate(body);
        return error;
    }
    getBetResultAPI(body) {
        const { error } = joi_1.default.object({
            schedule: joi_1.default.string().required(),
            time: joi_1.default.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").required(),
        }).validate(body);
        return error;
    }
    createBetAPI(body) {
        const { error } = joi_1.default.object({
            type: joi_1.default.string().valid("3D", "STL").required(),
            schedule: joi_1.default.string().required(),
            time: joi_1.default.string().required(),
            number: joi_1.default.string().required().length(3),
            amount: joi_1.default.number().min(1).required(),
            rambled: joi_1.default.boolean().required(),
        }).validate(body);
        return error;
    }
    getAllBetsAPI(query) {
        const { error } = joi_1.default.object({
            type: joi_1.default.string().valid("3D", "STL").optional(),
            user: joi_1.default.string().hex().length(24).optional(),
            time: joi_1.default.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").optional(),
            schedule: joi_1.default.date().iso().optional(),
        }).validate(query);
        return error;
    }
    updateProfileVerifiedStatusAPI(body) {
        const { error } = joi_1.default.object({
            verified: joi_1.default.boolean().required(),
            user: joi_1.default.string().hex().length(24)
        }).validate(body);
        ;
        return error;
    }
}
exports.RequestValidator = RequestValidator;
//# sourceMappingURL=validation.util.js.map