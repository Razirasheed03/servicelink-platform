"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const userSchemas_1 = require("../../validation/userSchemas");
const google_auth_library_1 = require("google-auth-library");
const cookieHelper_1 = require("../../utils/cookieHelper");
const ResponseHelper_1 = require("../../http/ResponseHelper");
const MessageConstant_1 = require("../../constants/MessageConstant");
class AuthController {
    constructor(_authService) {
        this._authService = _authService;
        this.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const parsed = userSchemas_1.signupSchema.safeParse(req.body);
            if (!parsed.success) {
                return ResponseHelper_1.ResponseHelper.badRequest(res, ((_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) || MessageConstant_1.HttpResponse.VALIDATION_FAILED, parsed.error.issues.map((i) => {
                    var _a;
                    return ({
                        message: i.message,
                        path: (_a = i.path) === null || _a === void 0 ? void 0 : _a.join("."),
                    });
                }));
            }
            try {
                const result = yield this._authService.signup(parsed.data);
                return ResponseHelper_1.ResponseHelper.created(res, result, MessageConstant_1.HttpResponse.USER_CREATION_SUCCESS);
            }
            catch (err) {
                next(err);
            }
        });
        this.verifyOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const { accessToken, refreshToken, user } = yield this._authService.verifyOtp(email, otp);
                cookieHelper_1.CookieHelper.setRefreshToken(res, refreshToken);
                return ResponseHelper_1.ResponseHelper.ok(res, { accessToken, user }, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
            }
            catch (err) {
                next(err);
            }
        });
        this.resendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this._authService.resendOtp(email);
                return ResponseHelper_1.ResponseHelper.ok(res, { ok: true }, "OTP resent!");
            }
            catch (err) {
                next(err);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.refreshToken || req.body.refreshToken;
                if (!token) {
                    return ResponseHelper_1.ResponseHelper.unauthorized(res, MessageConstant_1.HttpResponse.NO_TOKEN);
                }
                const { accessToken } = yield this._authService.refreshToken(token);
                return ResponseHelper_1.ResponseHelper.ok(res, { accessToken }, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { accessToken, refreshToken, user } = yield this._authService.login(email, password);
                cookieHelper_1.CookieHelper.setRefreshToken(res, refreshToken);
                return ResponseHelper_1.ResponseHelper.ok(res, { accessToken, user }, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
            }
            catch (err) {
                next(err);
            }
        });
        this.googleLoginWithToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { idToken } = req.body;
                const { accessToken, refreshToken, user } = yield this._authService.googleLogin(idToken);
                cookieHelper_1.CookieHelper.setRefreshToken(res, refreshToken);
                return ResponseHelper_1.ResponseHelper.ok(res, { accessToken, user }, MessageConstant_1.HttpResponse.GOOGLE_LOGIN_SUCCESS);
            }
            catch (err) {
                next(err);
            }
        });
        this.googleRedirect = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const client = new google_auth_library_1.OAuth2Client({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    redirectUri: process.env.GOOGLE_REDIRECT_URI,
                });
                const scopes = ["openid", "profile", "email"];
                const url = client.generateAuthUrl({
                    access_type: "offline",
                    prompt: "consent",
                    scope: scopes,
                });
                return res.redirect(url);
            }
            catch (err) {
                next(err);
            }
        });
        this.googleCallback = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const code = req.query.code;
                if (!code) {
                    return ResponseHelper_1.ResponseHelper.badRequest(res, "Missing code");
                }
                const client = new google_auth_library_1.OAuth2Client({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    redirectUri: process.env.GOOGLE_REDIRECT_URI,
                });
                const { tokens } = yield client.getToken(code);
                const idToken = tokens.id_token;
                if (!idToken) {
                    return ResponseHelper_1.ResponseHelper.badRequest(res, "No id_token from Google");
                }
                const { accessToken, refreshToken, user } = yield this._authService.googleLogin(idToken);
                cookieHelper_1.CookieHelper.setRefreshToken(res, refreshToken);
                const frontendUrl = `${process.env.FRONTEND_BASE_URL}/login?accessToken=${encodeURIComponent(accessToken)}&user=${encodeURIComponent(JSON.stringify({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }))}`;
                return res.redirect(302, frontendUrl);
            }
            catch (err) {
                next(err);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this._authService.forgotPassword(email);
                return ResponseHelper_1.ResponseHelper.ok(res, { ok: true }, "If this email is registered, a reset link has been sent.");
            }
            catch (err) {
                next(err);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, token, newPassword } = req.body;
                yield this._authService.resetPassword(id, token, newPassword);
                return ResponseHelper_1.ResponseHelper.ok(res, { ok: true }, "Password reset successful.");
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AuthController = AuthController;
