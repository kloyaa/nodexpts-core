"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReference = void 0;
const cuid2_1 = require("@paralleldrive/cuid2");
exports.generateReference = (0, cuid2_1.init)({
    length: 8,
    // A custom fingerprint for the host environment. This is used to help
    // prevent collisions when generating ids in a distributed system.
    fingerprint: 'swertesaya-backend',
});
//# sourceMappingURL=generator.util.js.map