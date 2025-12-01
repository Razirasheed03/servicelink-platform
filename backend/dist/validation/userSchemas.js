"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name too short"),
    email: zod_1.z.email("Invalid email address"),
    phone: zod_1.z.string().optional(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-]).{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-)"
    }),
    confirmPassword: zod_1.z.string(),
    role: zod_1.z.nativeEnum(roles_1.UserRole).default(roles_1.UserRole.USER),
    serviceType: zod_1.z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
