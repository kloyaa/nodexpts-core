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
exports.logout = exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../../__core/models/user.model");
const validation_util_1 = require("../../__core/utils/validation.util");
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const jwt_util_1 = require("../../__core/utils/jwt.util");
const crypto_util_1 = require("../../__core/utils/crypto.util");
const aws_service_1 = require("../../__core/services/aws.service");
const methods_util_1 = require("../../__core/utils/methods.util");
const user_repositories_1 = require("../../__core/repositories/user.repositories");
const activity_event_1 = require("../../__core/events/activity.event");
const activity_enum_1 = require("../../__core/enum/activity.enum");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().loginAPI(req.body);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { username, password } = req.body;
        // Get secrets
        const secrets = yield (0, aws_service_1.getAwsSecrets)();
        if ((0, methods_util_1.isEmpty)(secrets)) {
            res.status(401).json(api_statuses_const_1.statuses["0300"]);
            return;
        }
        // Check if the user exists based on the username
        const user = yield user_model_1.User.findOne({ username }).exec();
        if (!user) {
            // User not found
            res.status(401).json(api_statuses_const_1.statuses["0051"]);
            return;
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            // Incorrect password
            res.status(401).json(api_statuses_const_1.statuses["0051"]);
            return;
        }
        const isClientProfile = yield (0, user_repositories_1.isClientProfileCreated)(user._id);
        if (!isClientProfile) {
            res.status(401).json(api_statuses_const_1.statuses["0104"]);
            return;
        }
        const isVerified = yield (0, user_repositories_1.isClientVerified)(user._id);
        if (!isVerified) {
            res.status(401).json(api_statuses_const_1.statuses["0055"]);
            return;
        }
        activity_event_1.emitter.emit(activity_enum_1.EventName.LOGIN, {
            user: user._id,
            description: activity_enum_1.ActivityType.LOGIN,
        });
        // Generate a JWT token for authentication
        // Return the access token in the response
        return res.status(200).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses["00"]), { data: (0, crypto_util_1.encrypt)((0, jwt_util_1.generateJwt)(user._id, secrets === null || secrets === void 0 ? void 0 : secrets.JWT_SECRET_KEY), secrets === null || secrets === void 0 ? void 0 : secrets.CRYPTO_SECRET) }));
    }
    catch (error) {
        console.log('@login error', error);
        res.status(500).json(error);
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const error = new validation_util_1.RequestValidator().registerAPI(req.body);
        // Check if there are any validation errors
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        // Check if the username or email already exists
        const existingUser = yield user_model_1.User.findOne().or([{ username }, { email }]).exec();
        if (existingUser) {
            res.status(403).json(api_statuses_const_1.statuses["0052"]);
            return;
        }
        // Generate a salt for bcrypt
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        // Hash the password using the generated salt
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create a new User document with hashed password and salt
        const newUser = new user_model_1.User({
            username,
            email,
            password: hashedPassword,
            salt,
        });
        // Save the new User document to the database
        const createdUser = yield newUser.save();
        // Get secrets
        const secrets = yield (0, aws_service_1.getAwsSecrets)();
        if ((0, methods_util_1.isEmpty)(secrets)) {
            res.status(401).json(api_statuses_const_1.statuses["0300"]);
            return;
        }
        activity_event_1.emitter.emit(activity_enum_1.EventName.ACCOUNT_CREATION, {
            user: createdUser._id,
            description: activity_enum_1.ActivityType.ACCOUNT_CREATION,
        });
        return res.status(200).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses["0050"]), { data: (0, crypto_util_1.encrypt)((0, jwt_util_1.generateJwt)(createdUser._id, secrets === null || secrets === void 0 ? void 0 : secrets.JWT_SECRET_KEY), secrets === null || secrets === void 0 ? void 0 : secrets.CRYPTO_SECRET) }));
    }
    catch (error) {
        console.log('@register error', error);
        res.status(500).json(error);
    }
});
exports.register = register;
const logout = (req, res) => {
    return res.status(200).json({
        message: "Logout success"
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map