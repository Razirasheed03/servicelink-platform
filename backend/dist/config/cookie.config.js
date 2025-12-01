"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_CONFIG = void 0;
exports.COOKIE_CONFIG = {
    refreshToken: {
        name: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.COOKIE_SAME_SITE || 'strict',
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60 * 1000,
        path: '/',
    }
};
