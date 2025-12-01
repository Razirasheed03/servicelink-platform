import httpClient from "./httpClient";

export type SignupPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: "user" | "service_provider";
  serviceType?: string;
};

const userService = {
  login: async (email: string, password: string) => {
    try {
      const res = await httpClient.post("/auth/login", { email, password });
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Invalid email or password",
        data: null,
      };
    }
  },

  signup: async (payload: SignupPayload) => {
    try {
      const res = await httpClient.post("/auth/signup", payload);
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Signup failed",
        data: null,
      };
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const res = await httpClient.post("/auth/verify-otp", { email, otp });
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "OTP failed",
        data: null,
      };
    }
  },

  resendOtp: async (email: string) => {
    try {
      const res = await httpClient.post("/auth/resend-otp", { email });
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to resend OTP",
        data: null,
      };
    }
  },
};

export default userService;
