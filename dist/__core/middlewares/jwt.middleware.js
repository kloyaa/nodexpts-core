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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const aws_service_1 = require("../services/aws.service");
const methods_util_1 = require("../utils/methods.util");
const crypto_util_1 = require("../utils/crypto.util");
const api_statuses_const_1 = require("../const/api-statuses.const");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json(api_statuses_const_1.statuses["10020"]);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json(api_statuses_const_1.statuses["10020"]);
    }
    const secrets = yield (0, aws_service_1.getAwsSecrets)();
    const decryptedToken = (0, crypto_util_1.decrypt)(token, secrets === null || secrets === void 0 ? void 0 : secrets.CRYPTO_SECRET);
    if (!decryptedToken) {
        return res.status(401).json(api_statuses_const_1.statuses["10020"]);
    }
    if ((0, methods_util_1.isEmpty)(secrets === null || secrets === void 0 ? void 0 : secrets.JWT_SECRET_KEY)) {
        return res.status(401).json(api_statuses_const_1.statuses["10010"]);
    }
    jsonwebtoken_1.default.verify(decryptedToken, secrets === null || secrets === void 0 ? void 0 : secrets.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json(api_statuses_const_1.statuses["10020"]);
        }
        req.user = decoded;
        next();
    });
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=jwt.middleware.js.map