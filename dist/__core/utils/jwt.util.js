"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_enum_1 = require("../enum/jwt.enum");
const generateJwt = (value, secretKey) => {
    const JWT_EXPIRY = jwt_enum_1.JwtExpiry.ONE_HOUR;
    return jsonwebtoken_1.default.sign({ value }, secretKey, { expiresIn: JWT_EXPIRY });
};
exports.generateJwt = generateJwt;
//# sourceMappingURL=jwt.util.js.map