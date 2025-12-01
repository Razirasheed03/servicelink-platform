import { Response } from 'express';
import { COOKIE_CONFIG } from '../config/cookie.config';

export class CookieHelper {
  static setRefreshToken(res: Response, token: string): Response {
    return res.cookie(
      COOKIE_CONFIG.refreshToken.name,
      token,
      COOKIE_CONFIG.refreshToken
    );
  }

  static clearRefreshToken(res: Response): Response {
    return res.clearCookie(COOKIE_CONFIG.refreshToken.name);
  }
}