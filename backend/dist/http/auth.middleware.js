"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ResponseHelper_1 = require("./ResponseHelper");
const MessageConstant_1 = require("../constants/MessageConstant");
function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const match = header.match(/^Bearer\s+(.+)$/i);
        const token = match === null || match === void 0 ? void 0 : match[1];
        if (!token) {
            return ResponseHelper_1.ResponseHelper.unauthorized(res, MessageConstant_1.HttpResponse.NO_TOKEN);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        return next();
    }
    catch (err) {
        return ResponseHelper_1.ResponseHelper.unauthorized(res, MessageConstant_1.HttpResponse.UNAUTHORIZED);
    }
}
