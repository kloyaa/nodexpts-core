"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const origin_middleware_1 = require("../../__core/middlewares/origin.middleware");
const router = (0, express_1.Router)();
router.post('/auth/v1/login', origin_middleware_1.checkUserOrigin, auth_controller_1.login);
router.post('/auth/v1/login/ecrypt', origin_middleware_1.checkUserOrigin, auth_controller_1.encryptLogin);
router.post('/auth/v1/login/encrypted', origin_middleware_1.checkUserOrigin, auth_controller_1.encryptedLogin);
router.post('/auth/v1/register', origin_middleware_1.checkUserOrigin, auth_controller_1.register);
router.post('/auth/v1/logout', auth_controller_1.logout);
router.post('/auth/v1/token/verify', origin_middleware_1.checkUserOrigin, auth_controller_1.verifyToken);
exports.default = router;
//# sourceMappingURL=auth.route.js.map