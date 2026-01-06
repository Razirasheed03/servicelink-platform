"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const roles_1 = require("../constants/roles");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(roles_1.UserRole),
        default: roles_1.UserRole.USER,
        required: true,
    },
    serviceType: { type: String },
    location: { type: String },
    experience: { type: Number, min: 0 },
    consultationFee: { type: Number, min: 0 },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    verificationReason: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", UserSchema);
