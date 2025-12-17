import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../services/interfaces/auth.service.interface";
import { signupSchema } from "../../validation/userSchemas";
import { OAuth2Client } from "google-auth-library";
import { CookieHelper } from "../../utils/cookieHelper";
import { ResponseHelper } from "../../http/ResponseHelper";
import { HttpResponse } from "../../constants/MessageConstant";
import { IAuthController } from "../interface/IAuthController";

export class AuthController implements IAuthController {
  constructor(private readonly _authService: IAuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("ZOD SIGNUP ERROR:", parsed.error.issues);
      ResponseHelper.badRequest(
        res,
        parsed.error.issues[0]?.message || HttpResponse.VALIDATION_FAILED,
        parsed.error.issues.map((i) => ({
          message: i.message,
          path: i.path?.join("."),
        }))
      );
      return;
    }
    try {
      const { confirmPassword, ...cleanData } = parsed.data;
      const result = await this._authService.signup(cleanData);
      ResponseHelper.created(
        res,
        result,
        HttpResponse.USER_CREATION_SUCCESS
      );
      return;
    } catch (err) {
      next(err);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken, user } =
        await this._authService.verifyOtp(email, otp);

      CookieHelper.setRefreshToken(res, refreshToken);

      ResponseHelper.ok(
        res,
        { accessToken, user },
        HttpResponse.RESOURCE_FOUND
      );
      return;
    } catch (err) {
      next(err);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this._authService.resendOtp(email);

      ResponseHelper.ok(res, { ok: true }, "OTP resent!");
      return;
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) {
        ResponseHelper.unauthorized(res, HttpResponse.NO_TOKEN);
        return;
      }

      const { accessToken } = await this._authService.refreshToken(token);

      ResponseHelper.ok(
        res,
        { accessToken },
        HttpResponse.RESOURCE_FOUND
      );
      return;
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } =
        await this._authService.login(email, password);

      CookieHelper.setRefreshToken(res, refreshToken);

      ResponseHelper.ok(
        res,
        { accessToken, user },
        HttpResponse.RESOURCE_FOUND
      );
      return;
    } catch (err) {
      next(err);
    }
  };

  googleLoginWithToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { idToken } = req.body;
      const { accessToken, refreshToken, user } =
        await this._authService.googleLogin(idToken);

      CookieHelper.setRefreshToken(res, refreshToken);

      ResponseHelper.ok(
        res,
        { accessToken, user },
        HttpResponse.GOOGLE_LOGIN_SUCCESS
      );
      return;
    } catch (err) {
      next(err);
    }
  };

  googleRedirect = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      res.redirect(url);
      return;
    } catch (err) {
      next(err);
    }
  };

  googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = req.query.code as string;
      if (!code) {
        ResponseHelper.badRequest(res, "Missing code");
        return;
      }

      const client = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      });

      const { tokens } = await client.getToken(code);
      const idToken = tokens.id_token;

      if (!idToken) {
        ResponseHelper.badRequest(res, "No id_token from Google");
        return;
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

      res.redirect(302, frontendUrl);
      return;
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this._authService.forgotPassword(email);

      ResponseHelper.ok(
        res,
        { ok: true },
        "If this email is registered, a reset link has been sent."
      );
      return;
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, token, newPassword } = req.body;
      await this._authService.resetPassword(id, token, newPassword);

      ResponseHelper.ok(
        res,
        { ok: true },
        "Password reset successful."
      );
      return;
    } catch (err) {
      next(err);
    }
  };
}