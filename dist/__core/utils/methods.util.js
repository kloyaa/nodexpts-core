"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotEmpty = exports.isEmpty = void 0;
const isEmpty = (value) => {
    return value === undefined || value === null || value === '';
};
exports.isEmpty = isEmpty;
const isNotEmpty = (value) => {
    return value !== undefined || value !== null || value !== '';
};
exports.isNotEmpty = isNotEmpty;
