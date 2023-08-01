"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceModeMiddleware = void 0;
const api_statuses_const_1 = require("../const/api-statuses.const");
require('dotenv').config();
const maintenanceModeMiddleware = (req, res, next) => {
    if (process.env.ENVIRONMENT_MAINTENANCE === "true") {
        return res.status(500).json(api_statuses_const_1.statuses["500"]);
    }
    next();
};
exports.maintenanceModeMiddleware = maintenanceModeMiddleware;
//# sourceMappingURL=is-maintenance-mode.middleware.js.map