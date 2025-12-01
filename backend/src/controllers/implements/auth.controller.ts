// src/controllers/implements/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../services/interfaces/auth.service.interface";
import { signupSchema } from "../../validation/userSchemas";
import { OAuth2Client } from "google-auth-library";
import { CookieHelper } from "../../utils/cookieHelper";
import { ResponseHelper } from "../../http/ResponseHelper";
import { HttpResponse } from "../../constants/MessageConstant";

export class AuthController {
  constructor(private readonly _authService: IAuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        console.log("ZOD SIGNUP ERROR:", parsed.error.issues);
      return ResponseHelper.badRequest(
        res,
        parsed.error.issues[0]?.message || HttpResponse.VALIDATION_FAILED,
        parsed.error.issues.map((i) => ({
          message: i.message,
          path: i.path?.join("."),
        }))
      );
    }
    try {
    const { confirmPassword, ...cleanData } = parsed.data;
const result = await this._authService.signup(cleanData);
      return ResponseHelper.created(
        res,
        result,
        HttpResponse.USER_CREATION_SUCCESS
      );
    } catch (err) {
      next(err);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken, user } =
        await this._authService.verifyOtp(email, otp);
      CookieHelper.setRefreshToken(res, refreshToken);
      return ResponseHelper.ok(
        res,
        { accessToken, user },
        HttpResponse.RESOURCE_FOUND
      );
    } catch (err) {
      next(err);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this._authService.resendOtp(email);
      return ResponseHelper.ok(res, { ok: true }, "OTP resent!");
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) {
        return ResponseHelper.unauthorized(res, HttpResponse.NO_TOKEN);
      }
      const { accessToken } = await this._authService.refreshToken(token);
      return ResponseHelper.ok(
        res,
        { accessToken },
        HttpResponse.RESOURCE_FOUND
      );
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await this._authService.login(
        email,
        password
      );
      CookieHelper.setRefreshToken(res, refreshToken);
      return ResponseHelper.ok(
        res,
        { accessToken, user },
        HttpResponse.RESOURCE_FOUND
      );
    } catch (err) {
      next(err);
    }
  };

  googleLoginWithToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { idToken } = req.body;
      const { accessToken, refreshToken, user } =
        await this._authService.googleLogin(idToken);
      CookieHelper.setRefreshToken(res, refreshToken);
      return ResponseHelper.ok(
        res,
        { accessToken, user },
        HttpResponse.GOOGLE_LOGIN_SUCCESS
      );
    } catch (err) {
      next(err);
    }
  };

  googleRedirect = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const client = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      });
      const scopes = ["openid", "profile", "email"];
      const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
      });
      return res.redirect(url);
    } catch (err) {
      next(err);
    }
  };

  googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;
      if (!code) {
        return ResponseHelper.badRequest(res, "Missing code");
      }

      const client = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      });

      const { tokens } = await client.getToken(code);
      const idToken = tokens.id_token;
      if (!idToken) {
        return ResponseHelper.badRequest(res, "No id_token from Google");
      }

      const { accessToken, refreshToken, user } =
        await this._authService.googleLogin(idToken);
      CookieHelper.setRefreshToken(res, refreshToken);

      const frontendUrl = `${
        process.env.FRONTEND_BASE_URL
      }/login?accessToken=${encodeURIComponent(
        accessToken
      )}&user=${encodeURIComponent(
        JSON.stringify({
          _id: (user as any)._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      )}`;

      return res.redirect(302, frontendUrl);
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this._authService.forgotPassword(email);
      return ResponseHelper.ok(
        res,
        { ok: true },
        "If this email is registered, a reset link has been sent."
      );
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, token, newPassword } = req.body;
      await this._authService.resetPassword(id, token, newPassword);
      return ResponseHelper.ok(res, { ok: true }, "Password reset successful.");
    } catch (err) {
      next(err);
    }
  };
}