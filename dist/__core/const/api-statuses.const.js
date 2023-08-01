"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statuses = void 0;
exports.statuses = {
    /**
     * @alias General
     * @description from 00 - 100
     */
    "00": {
        message: "Success",
        code: "00",
    },
    "01": {
        message: "Error",
        code: "01",
    },
    "02": {
        message: "Not Found",
        code: "02",
    },
    /**
     * @alias Authentication
     * @description from 0050 - 0100
     */
    "0050": {
        message: "Account created successfully.",
        code: "0050",
    },
    "0051": {
        message: "Incorrect username or password.",
        code: "0051",
    },
    "0052": {
        message: "Account already registered, Please try logging in.",
        code: "0052",
    },
    "0053": {
        message: "Account suspended.",
        code: "0053",
    },
    "0054": {
        message: "Account blocked.",
        code: "0054",
    },
    "0055": {
        message: "Account not verified, Please contact the administrator.",
        code: "0055",
    },
    "0056": {
        message: "User not found.",
        code: "0056",
    },
    "0057": {
        message: "User not authorized for this role.",
        code: "0057",
    },
    /**
     * @alias Profile
     * @description from 0100 - 0200
     */
    "0100": {
        message: "Profile created successfully.",
        code: "0100",
    },
    "0101": {
        message: "Profile updated successfully.",
        code: "0101",
    },
    "0102": {
        message: "Profile deleted.",
        code: "0102",
    },
    "0103": {
        message: "Profile already exist.",
        code: "0103",
    },
    "0104": {
        message: "Profile not found. Please create first and try again.",
        code: "0104",
    },
    "0900": {
        message: "Something went wrong. Please try again later.",
        code: "0900",
    },
    "0901": {
        message: "Incorrect format of id.",
        code: "0901",
    },
    /**
     * @alias Profile
     * @description from 0100 - 0200
     */
    "0300": {
        message: "Invalid/Incorrect AWS S3 config.",
        code: "0300",
    },
    "500": {
        message: "Our server is currently undergoing maintenance to improve your experience. Please try again later.",
        code: "500",
    },
};
//# sourceMappingURL=api-statuses.const.js.map