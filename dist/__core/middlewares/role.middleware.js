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
exports.isAdmin = void 0;
const roles_model_1 = require("../models/roles.model");
const api_statuses_const_1 = require("../const/api-statuses.const");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user ID exists on the request object
        const userId = req.user.value;
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in the request' });
        }
        // Find the user's role based on the user ID
        const userRole = yield roles_model_1.UserRole.findOne({ user: userId }).exec();
        // Check if the user has the admin role
        if (!userRole || userRole.name !== 'admin') {
            return res.status(401).json(api_statuses_const_1.statuses["0057"]);
        }
        // If the user has the admin role, continue to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('@isAdmin', error);
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=role.middleware.js.map