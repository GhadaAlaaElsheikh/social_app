"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.validation = void 0;
const zod_1 = require("zod");
const validation = (schema) => {
    return (req, res, next) => {
        console.log(Object.keys(schema));
        const errors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const error = validationResult.error;
                errors.push({ key,
                    issues: error.issues.map(err => {
                        return { path: err.path[0], message: err.message };
                    })
                });
            }
        }
        if (errors.length) {
            return res.status(400).json({ message: "validation error", errors });
        }
        return next();
    };
};
exports.validation = validation;
exports.generalFields = {
    username: zod_1.z.string({ error: "username is required" })
        .min(2, { error: "min is :2" }).
        max(20),
    email: zod_1.z.email(),
    password: zod_1.z.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    confirmPassword: zod_1.z.string(),
    otp: zod_1.z.string().regex(/^\d{6}$/),
};
