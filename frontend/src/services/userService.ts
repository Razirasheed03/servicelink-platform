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

export type ReviewReply = {
	comment: string;
	date: string;
};

export type ReviewView = {
	id: string;
	userName: string;
	rating: number;
	comment?: string;
	date: string;
	isOwner: boolean;
	reply?: ReviewReply;
};

export type ProviderReviewsResponse = {
	reviews: ReviewView[];
	avgRating: number;
	total: number;
};

export type ProviderReviewsPagedResponse = ProviderReviewsResponse & {
	page: number;
	totalPages: number;
};

export type ProviderDashboardResponse = {
	avgRating: number;
	totalReviews: number;
	recentReviews: ReviewView[];
	completedJobs: number;
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

	editReview: async (reviewId: string, payload: { rating: number; comment?: string }) => {
		try {
			const res = await httpClient.patch(`/reviews/${reviewId}`, payload);
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to edit review",
				data: null,
			};
		}
	},

	getMyProviderReviews: async (params: { page?: number; limit?: number }) => {
		try {
			const res = await httpClient.get("/reviews/provider/me", { params });
			return res.data as { success: boolean; data: ProviderReviewsPagedResponse };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch reviews",
				data: null,
			};
		}
	},

	replyToReview: async (reviewId: string, payload: { comment: string }) => {
		try {
			const res = await httpClient.patch(`/reviews/${reviewId}/reply`, payload);
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to send reply",
				data: null,
			};
		}
	},

	getProviderDashboard: async () => {
		try {
			const res = await httpClient.get("/reviews/provider/dashboard");
			return res.data as { success: boolean; data: ProviderDashboardResponse };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch dashboard",
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
  addReview: async (payload: {
  providerId: string;
  rating: number;
  comment?: string;
}) => {
  const res = await httpClient.post("/reviews", payload);
  return res.data;
},

getReviewsByProvider: async (providerId: string) => {
  const res = await httpClient.get(`/reviews/${providerId}`);
  return res.data;
},

};

export default userService;