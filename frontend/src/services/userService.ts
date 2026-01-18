import httpClient from "./httpClient";

export type ApiResult<T> = {
	success: boolean;
	data: T | null;
	message?: string;
};

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
	consultationFee?: number;
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

export type VerificationStatus = "pending" | "approved" | "rejected";
export type SubscriptionStatus =
  | "PENDING_APPROVAL"
  | "APPROVED_BUT_UNSUBSCRIBED"
  | "ACTIVE"
  | "EXPIRED";

export type AdminDashboardStats = {
	totalUsers: number;
	totalProviders: number;
	verifiedProviders: number;
	pendingVerifications: number;
	activeProviders: number;
	newProvidersThisMonth: number;
	providerStatusCounts: {
		approved: number;
		pending: number;
		rejected: number;
		blocked: number;
	};
};

export type AdminRevenueSummary = {
	totalIncome: number;
	totalSubscriptions: number;
	activeSubscriptions: number;
	expiredSubscriptions: number;
	revenueThisMonth: number;
	revenueLastMonth: number;
};

export type AdminIncomePoint = {
	period: string;
	totalIncome: number;
	totalSubscriptions: number;
};

export type AdminProviderView = {
	_id: string;
	username: string;
	email: string;
	phone?: string;
	serviceType?: string;
	location?: string;
	experience?: number;
	consultationFee?: number;
	isBlocked?: boolean;
	isVerified?: boolean;
	verificationStatus?: VerificationStatus;
	verificationReason?: string;
};

export type AdminUserView = {
	_id: string;
	username: string;
	email: string;
	isBlocked?: boolean;
};

export type AdminProvidersResponse = {
	providers: AdminProviderView[];
	total: number;
	page: number;
	totalPages: number;
};

export type AdminUsersResponse = {
	users: AdminUserView[];
	total: number;
	page: number;
	totalPages: number;
};

export type ProfileResponse = {
	user: {
		_id?: string;
		username?: string;
		email?: string;
		role?: "user" | "service_provider" | "admin";
		phone?: string;
		serviceType?: string;
		experience?: number;
		location?: string;
		consultationFee?: number;
		isBlocked?: boolean;
		isVerified?: boolean;
		verificationStatus?: VerificationStatus;
		verificationReason?: string;
		subscriptionStatus?: SubscriptionStatus;
		subscriptionStartDate?: string | null;
		subscriptionEndDate?: string | null;
		stripeCustomerId?: string;
	};
};

export type SubscriptionStatusResponse = {
	status: SubscriptionStatus;
	startDate: string | null;
	endDate: string | null;
	message?: string;
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

	startProviderSubscription: async () => {
		try {
			const res = await httpClient.post("/provider/subscribe");
			return res.data as {
				success: boolean;
				data?: { checkoutUrl: string; sessionId: string };
				message?: string;
			};
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to start subscription",
				data: null,
			};
		}
	},

	getProviderSubscriptionStatus: async () => {
		try {
			const res = await httpClient.get("/provider/subscription-status");
			return res.data as { success: boolean; data: SubscriptionStatusResponse; message?: string };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch subscription status",
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

	getAdminProviderById: async (providerId: string) => {
		try {
			const res = await httpClient.get(`/admin/providers/${providerId}`);
			return res.data as ApiResult<{ provider: AdminProviderView }>;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch provider",
				data: null,
			} as ApiResult<{ provider: AdminProviderView }>;
		}
	},

	getProfile: async () => {
		try {
			const res = await httpClient.get("/user/profile");
			return res.data as { success: boolean; data: ProfileResponse };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch profile",
				data: null,
			};
		}
	},

	reapplyProviderVerification: async () => {
		try {
			const res = await httpClient.post("/user/provider/reapply-verification");
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to reapply verification",
				data: null,
			};
		}
	},

	getAdminDashboard: async () => {
		try {
			const res = await httpClient.get("/admin/dashboard");
			return res.data as { success: boolean; data: AdminDashboardStats };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch dashboard",
				data: null,
			};
		}
	},

	getAdminRevenueSummary: async () => {
		try {
			const res = await httpClient.get("/admin/dashboard/summary");
			return res.data as { success: boolean; data: AdminRevenueSummary };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch revenue summary",
				data: null,
			};
		}
	},

	getAdminIncome: async (params: {
		range?: "7d" | "30d" | "12m" | "custom";
		from?: string;
		to?: string;
		groupBy?: "day" | "month";
	}) => {
		try {
			const res = await httpClient.get("/admin/dashboard/income", { params });
			return res.data as { success: boolean; data: AdminIncomePoint[] };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch income",
				data: null,
			};
		}
	},

	getAdminProviders: async (params: { page?: number; limit?: number }) => {
		try {
			const res = await httpClient.get("/admin/providers", { params });
			return res.data as { success: boolean; data: AdminProvidersResponse };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch providers",
				data: null,
			};
		}
	},

	approveProvider: async (providerId: string) => {
		try {
			const res = await httpClient.patch(`/admin/providers/${providerId}/approve`);
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to approve provider",
				data: null,
			};
		}
	},

	rejectProvider: async (providerId: string, reason: string) => {
		try {
			const res = await httpClient.patch(`/admin/providers/${providerId}/reject`, { reason });
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to reject provider",
				data: null,
			};
		}
	},

	setProviderBlocked: async (providerId: string, isBlocked: boolean) => {
		try {
			const res = await httpClient.patch(`/admin/providers/${providerId}/block`, { isBlocked });
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to update provider block status",
				data: null,
			};
		}
	},

	getAdminUsers: async (params: { page?: number; limit?: number }) => {
		try {
			const res = await httpClient.get("/admin/users", { params });
			return res.data as { success: boolean; data: AdminUsersResponse };
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to fetch users",
				data: null,
			};
		}
	},

	setUserBlocked: async (userId: string, isBlocked: boolean) => {
		try {
			const res = await httpClient.patch(`/admin/users/${userId}/block`, { isBlocked });
			return res.data;
		} catch (error: any) {
			return {
				success: false,
				message: error?.response?.data?.message || "Failed to update user block status",
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