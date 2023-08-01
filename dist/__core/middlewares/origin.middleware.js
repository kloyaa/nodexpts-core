"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserOrigin = void 0;
const checkUserOrigin = (req, res, next) => {
    const from = req.headers['from'];
    if (!from) {
        return res.status(403).json({ error: 'Invalid or Incorrect origin name.' });
    }
    // Assuming 'from' is a string value, you can modify this logic based on your use case.
    if (from === 'mobile' || from === 'web') {
        req.from = from;
        next();
    }
    else {
        return res.status(403).json({ error: 'Invalid or Incorrect origin name.' });
    }
};
exports.checkUserOrigin = checkUserOrigin;
//# sourceMappingURL=origin.middleware.js.map