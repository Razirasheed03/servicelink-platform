//constants/apiRoutes.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
export const AUTH_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  REFRESH: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  RESEND_OTP: `${API_BASE_URL}/auth/resend-otp`,
  GOOGLE: `${API_BASE_URL}/auth/google`
};

export const USER_ROUTES = {
  PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/update`,
};
