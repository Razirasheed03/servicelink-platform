import { Document, Types } from "mongoose";

export interface IReviewModel extends Document {
  providerId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
	reply?: {
		comment?: string;
		updatedAt?: Date;
	};
  createdAt?: Date;
}

// View model returned to services/controllers/clients
export interface IReviewViewModel {
  id: string;
  userName: string;
  rating: number;
  comment?: string;
  date: string;
	isOwner: boolean;
	reply?: {
		comment: string;
		date: string;
	};
}

export interface IReviewStats {
  avgRating: number;
  total: number;
}

export interface IProviderReviewsResponse {
  reviews: IReviewViewModel[];
  avgRating: number;
  total: number;
}

export interface IProviderReviewsPagedResponse extends IProviderReviewsResponse {
	page: number;
	totalPages: number;
}

export interface IProviderDashboardResponse {
	avgRating: number;
	totalReviews: number;
	recentReviews: IReviewViewModel[];
	completedJobs: number;
}
