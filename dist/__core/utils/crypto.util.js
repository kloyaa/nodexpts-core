"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (json, secretKey) => {
    try {
        const text = JSON.stringify(json);
        const algorithm = 'AES-256-CBC';
        const key = crypto_1.default.scryptSync(secretKey, 'salt', 32);
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}.${encrypted}`;
    }
    catch (error) {
        console.log("@encrypt error", error);
        return null;
    }
};
exports.encrypt = encrypt;
const decrypt = (encryptedData, secretKey) => {
    try {
        const [hashIv, hashData] = encryptedData.split(".");
        const algorithm = 'AES-256-CBC';
        const key = crypto_1.default.scryptSync(secretKey, 'salt', 32);
        const iv = Buffer.from(hashIv, 'hex');
        const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(hashData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
    catch (error) {
        console.log("@decrypt error", error);
        return null;
    }
};
exports.decrypt = decrypt;
//# sourceMappingURL=crypto.util.js.map