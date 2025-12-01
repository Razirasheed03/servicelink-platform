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
exports.getGoogleAuthUrl = getGoogleAuthUrl;
exports.getGoogleTokens = getGoogleTokens;
exports.verifyIdToken = verifyIdToken;
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
function getGoogleAuthUrl() {
    const scopes = [
        "openid",
        "profile",
        "email",
    ];
    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
    return url;
}
function getGoogleTokens(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokens } = yield client.getToken(code);
        return tokens;
    });
}
function verifyIdToken(idToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    });
}
