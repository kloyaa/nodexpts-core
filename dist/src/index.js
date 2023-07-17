"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const example_route_1 = __importDefault(require("./routes/example.route"));
const db_util_1 = __importDefault(require("../__core/utils/db.util"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/example', example_route_1.default);
// Connect to MongoDB
(0, db_util_1.default)();
exports.default = app;
