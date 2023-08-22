"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const role_middleware_1 = require("../../__core/middlewares/role.middleware");
const router = (0, express_1.Router)();
router.put('/employee/v1/profile-verification', jwt_middleware_1.isAuthenticated, role_middleware_1.isAdmin, employee_controller_1.updateProfileVerifiedStatus);
router.get('/employee/v1/daily-total', jwt_middleware_1.isAuthenticated, role_middleware_1.isAdmin, employee_controller_1.getDailyTotal);
router.post('/employee/v1/role', jwt_middleware_1.isAuthenticated, role_middleware_1.isAdmin, employee_controller_1.createRoleForUser);
exports.default = router;
//# sourceMappingURL=employee.route.js.map