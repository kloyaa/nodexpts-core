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
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)()); // Apply standard security headers
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json());
// Routes
app.use('/api', auth_route_1.default);
app.use('/api', profile_route_1.default);
app.use('/api', bet_route_1.default);
app.use('/api', employee_route_1.default);
// Connect to MongoDB
(0, db_util_1.default)();
// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
exports.default = app;
