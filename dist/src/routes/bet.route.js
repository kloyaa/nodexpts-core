"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bet_controller_1 = require("../controllers/bet.controller");
const jwt_middleware_1 = require("../../__core/middlewares/jwt.middleware");
const is_user_profile_created_middleware_1 = require("../../__core/middlewares/is-user-profile-created.middleware");
const router = (0, express_1.Router)();
router.post('/bet/v1/place', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.placeBet);
router.get('/bet/v1/bets', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.getAll);
router.post('/bet/v1/result', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.createBetResult);
router.get('/bet/v1/daily-result', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.getBetResult);
router.get('/bet/v1/results', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.getAllBetResults);
router.get('/bet/v1/numberstats', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.numberStats);
router.get('/bet/v1/daily-total', jwt_middleware_1.isAuthenticated, is_user_profile_created_middleware_1.isUserProfileCreated, bet_controller_1.getDailyTotal);
exports.default = router;
//# sourceMappingURL=bet.route.js.map