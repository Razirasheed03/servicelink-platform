"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireEnvVar = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing the environment variable ${key}`);
    }
    return value;
};
exports.env = {
    PORT: requireEnvVar("PORT"),
    MONGO_URI: requireEnvVar("MONGO_URI"),
};
