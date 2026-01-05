"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
//validation/userSchemas.ts
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    phone: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 chars"),
    confirmPassword: zod_1.z.string().min(6, "Confirm password is required"),
    role: zod_1.z.nativeEnum(roles_1.UserRole),
    serviceType: zod_1.z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
