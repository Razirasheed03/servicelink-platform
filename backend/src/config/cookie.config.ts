export const COOKIE_CONFIG = {
  refreshToken: {
    name: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict',
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60 * 1000,
    path: '/',
  }
} as const;