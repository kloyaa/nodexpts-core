"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/auth/v1/login', auth_controller_1.login);
router.post('/auth/v1/register', auth_controller_1.register);
router.post('/auth/v1/logout', auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.route.js.map