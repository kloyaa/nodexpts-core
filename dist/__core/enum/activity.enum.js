"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityType = exports.EventName = void 0;
var EventName;
(function (EventName) {
    EventName["LOGIN"] = "login-activity";
    EventName["ACCOUNT_CREATION"] = "register-activity";
    EventName["LOGOUT"] = "logout-activity";
    EventName["ROLE_CREATION"] = "role-creation-activity";
    EventName["PROFILE_CREATION"] = "profile-creation-activity";
    EventName["PROFILE_VERIFICATION"] = "profile-verification-activity";
})(EventName || (exports.EventName = EventName = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["ROLE_CREATION"] = "Role created.";
    ActivityType["PROFILE_CREATION"] = "Profile created.";
    ActivityType["PROFILE_VERIFICATION"] = "Account approved.";
    ActivityType["LOGIN"] = "Login successfully..";
    ActivityType["LOGIN_SAVED"] = "Saved login.";
    ActivityType["LOGIN_FAILURE"] = "Login failed.";
    ActivityType["LOGOUT"] = "Logout successfully";
    ActivityType["ACCOUNT_CREATION"] = "Account created";
    ActivityType["WITHDRAWAL_CREATION"] = "WITHDRAWAL_CREATION";
    ActivityType["DEPOSIT_CREATION"] = "DEPOSIT_CREATION";
    ActivityType["ORDER_PLACEMENT"] = "ORDER_PLACEMENT";
    ActivityType["ORDER_CANCELLATION"] = "ORDER_CANCELLATION";
    ActivityType["ACCOUNT_WALLET_CHANGES"] = "ACCOUNT_WALLET_CHANGES";
    ActivityType["ACCOUNT_SETTING_CHANGES"] = "ACCOUNT_SETTING_CHANGES";
    ActivityType["ACCOUNT_PROFILE_CHANGES"] = "ACCOUNT_PROFILE_CHANGES";
    ActivityType["SYSTEM_ERROR"] = "SYSTEM_ERROR";
    ActivityType["API_REQUEST"] = "API_REQUEST";
    ActivityType["SECURITY_EVENT"] = "SECURITY_EVENT";
    ActivityType["ADMIN_ACTION"] = "ADMIN_ACTION";
    ActivityType["EMAIL_NOTIFICATION"] = "EMAIL_NOTIFICATION";
    ActivityType["SMS_NOTIFICATTION"] = "SMS_NOTIFICATTION";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
//# sourceMappingURL=activity.enum.js.map