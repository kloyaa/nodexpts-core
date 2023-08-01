"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const router = (0, express_1.Router)();
router.post('/employee/v1/profile-verification', jwt_middleware_1.isAuthenticated, employee_controller_1.updateProfileVerifiedStatus);
router.get('/employee/v1/daily-total', jwt_middleware_1.isAuthenticated, employee_controller_1.getDailyTotal);
exports.default = router;
//# sourceMappingURL=employee.route.js.map