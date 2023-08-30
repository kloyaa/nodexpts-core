"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaysOfMonth = void 0;
const generateDaysOfMonth = () => {
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysOfMonth = Array.from({ length: lastDayOfMonth }, (_, index) => (index + 1).toString());
    return daysOfMonth;
};
exports.generateDaysOfMonth = generateDaysOfMonth;
//# sourceMappingURL=generate.util.js.map