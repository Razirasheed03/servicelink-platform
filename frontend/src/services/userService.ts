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

export type UpdateProfilePayload = {
  phone?: string;
  serviceType?: string;
  location?: string;
  experience?: number;
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

  updateProfile: async (payload: UpdateProfilePayload) => {
    try {
      const res = await httpClient.put("/user/update", payload);
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Profile update failed",
        data: null,
      };
    }
  },

  getProviders: async (params: { search?: string; serviceType?: string; page?: number; limit?: number }) => {
    try {
      const res = await httpClient.get("/user/providers", { params });
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to fetch providers",
        data: null,
      };
    }
  },

  getProviderById: async (id: string) => {
    try {
      const res = await httpClient.get(`/user/providers/${id}`);
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to fetch provider",
        data: null,
      };
    }
  },
};

export default userService;