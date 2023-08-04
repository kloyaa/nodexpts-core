"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const is_user_profile_created_middleware_1 = require("../../__core/middlewares/is-user-profile-created.middleware");
const config_controller_1 = require("../controllers/config.controller");
const router = (0, express_1.Router)();
router.get('/config/v1/bet', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, config_controller_1.getBetConfigs);
exports.default = router;
//# sourceMappingURL=config.route.js.map