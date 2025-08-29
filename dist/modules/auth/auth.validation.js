"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmail = exports.signup = exports.login = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
exports.login = {
    body: zod_1.z.strictObject({
        username: validation_middleware_1.generalFields.username,
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        confirmPassword: validation_middleware_1.generalFields.confirmPassword,
    })
};
exports.signup = {
    body: exports.login.body.extend({
        username: validation_middleware_1.generalFields.username,
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        confirmPassword: validation_middleware_1.generalFields.confirmPassword,
    })
        .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "password mismatch confirmPassword",
                path: ["confirmPassword"]
            });
        }
        if (data.username.split(" ").length != 2) {
            ctx.addIssue({
                code: "custom",
                message: "in-valid username musst consist of 2 part like JON DOE",
                path: ['username']
            });
        }
    })
};
exports.confirmEmail = {
    body: (0, zod_1.strictObject)({
        email: validation_middleware_1.generalFields.email,
        otp: validation_middleware_1.generalFields.otp
    })
};
