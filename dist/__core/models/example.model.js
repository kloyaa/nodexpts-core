"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const exampleSchema = new mongoose_1.Schema({
// Define your schema properties here
});
exports.default = (0, mongoose_1.model)('Example', exampleSchema);
