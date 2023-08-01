"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const role_middleware_1 = require("../../__core/middlewares/role.middleware");
const router = (0, express_1.Router)();
router.post('/clients/v1/profile', jwt_middleware_1.isAuthenticated, profile_controller_1.create);
router.get('/clients/v1/profile', jwt_middleware_1.isAuthenticated, profile_controller_1.getProfileByLoginId);
router.get('/clients/v1/profiles', jwt_middleware_1.isAuthenticated, role_middleware_1.isAdmin, profile_controller_1.getAllProfiles);
router.get('/clients/v1/me', jwt_middleware_1.isAuthenticated, profile_controller_1.me);
exports.default = router;
//# sourceMappingURL=profile.route.js.map