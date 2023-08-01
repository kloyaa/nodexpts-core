"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_util_1 = __importDefault(require("../__core/utils/db.util"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const bet_route_1 = __importDefault(require("./routes/bet.route"));
const employee_route_1 = __importDefault(require("./routes/employee.route"));
const is_maintenance_mode_middleware_1 = require("../__core/middlewares/is-maintenance-mode.middleware");
const app = (0, express_1.default)();
const envVars = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    ENVIRONMENT_MAINTENANCE: process.env.ENVIRONMENT_MAINTENANCE,
    PORT: process.env.PORT,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    DB_CONNECTION_STRING_LOCAL: process.env.DB_CONNECTION_STRING_LOCAL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
    BET_DOUBLE_NUM_LIMIT: process.env.BET_DOUBLE_NUM_LIMIT,
    BET_TRIPLE_NUM_LIMIT: process.env.BET_TRIPLE_NUM_LIMIT,
    BET_NORMAL_NUM_LIMIT: process.env.BET_NORMAL_NUM_LIMIT,
    BET_RAMBLE_NUM_LIMIT: process.env.BET_RAMBLE_NUM_LIMIT,
};
// Middleware
app.use((0, helmet_1.default)()); // Apply standard security headers
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json());
// Routes
app.use(is_maintenance_mode_middleware_1.maintenanceModeMiddleware);
app.use('/api', auth_route_1.default);
app.use('/api', profile_route_1.default);
app.use('/api', bet_route_1.default);
app.use('/api', employee_route_1.default);
app.get('/', (_, res) => res.send('Express Typescript on Vercel'));
// Connect to MongoDB
(0, db_util_1.default)();
// Start the server
app.listen(Number(envVars.PORT) || 5000, () => {
    console.log({
        'Environment': envVars.ENVIRONMENT,
        'Port': envVars.PORT
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map