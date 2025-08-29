"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNumberOtp = void 0;
const generateNumberOtp = () => {
    return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
};
exports.generateNumberOtp = generateNumberOtp;
