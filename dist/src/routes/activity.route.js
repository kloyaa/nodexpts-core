"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_controller_1 = require("../controllers/activity.controller");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const role_middleware_1 = require("../../__core/middlewares/role.middleware");
const router = (0, express_1.Router)();
router.get('/activity/v1/activities', jwt_middleware_1.isAuthenticated, role_middleware_1.isAdmin, activity_controller_1.getAllActivityLogs);
exports.default = router;
//# sourceMappingURL=activity.route.js.map