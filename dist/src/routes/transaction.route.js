"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const router = (0, express_1.Router)();
router.post('/transaction/v1', jwt_middleware_1.isAuthenticated, transaction_controller_1.createTransaction);
router.get('/transaction/v1/ref/:reference', jwt_middleware_1.isAuthenticated, transaction_controller_1.getTransactionByReference);
router.get('/transaction/v1/all', jwt_middleware_1.isAuthenticated, transaction_controller_1.getTransactionsByDate);
router.get('/transaction/v1/me', jwt_middleware_1.isAuthenticated, transaction_controller_1.getTransactionsByUser);
exports.default = router;
//# sourceMappingURL=transaction.route.js.map