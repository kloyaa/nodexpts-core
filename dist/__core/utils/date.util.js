"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getISODate = void 0;
const getISODate = () => {
    const today = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    const dateObject = new Date(today); // Convert the formatted string back to a Date object
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};
exports.getISODate = getISODate;
//# sourceMappingURL=date.util.js.map