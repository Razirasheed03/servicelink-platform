"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHelper = void 0;
const cookie_config_1 = require("../config/cookie.config");
class CookieHelper {
    static setRefreshToken(res, token) {
        return res.cookie(cookie_config_1.COOKIE_CONFIG.refreshToken.name, token, cookie_config_1.COOKIE_CONFIG.refreshToken);
    }
    static clearRefreshToken(res) {
        return res.clearCookie(cookie_config_1.COOKIE_CONFIG.refreshToken.name);
    }
}
exports.CookieHelper = CookieHelper;
