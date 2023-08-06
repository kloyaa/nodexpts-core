"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gtISODate = void 0;
const gtISODate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};
exports.gtISODate = gtISODate;
//# sourceMappingURL=date.util.js.map