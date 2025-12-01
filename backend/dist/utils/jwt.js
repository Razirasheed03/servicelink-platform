"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
// utils/jwt.ts (or similar)
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}
function generateRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}
