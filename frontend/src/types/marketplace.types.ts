//types/marketplace.types.ts
export interface ListingResponse {
  _id: string;
  title: string;
  description: string;
  photos: string[];
  price: number | null;
  type: 'sell' | 'adopt';
  status: 'active' | 'inactive' | 'sold' | 'adopted' | 'reserved' | 'closed';
  ageText?: string;
  place: string;
  contact: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  photos: string[];
  price: number | null;
  ageText?: string;
  place: string;
  contact: string;
}

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  photos?: string[];
  price?: number | null;
  ageText?: string;
  place?: string;
  contact?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ListingSearchParams {
  page?: number;
  limit?: number;
  type?: 'sell' | 'adopt';
  q?: string;
  place?: string;
  minPrice?: number;
  maxPrice?: number;
  excludeFree?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'title_az' | 'title_za';
}

export type ListingStatus = 'active' | 'inactive' | 'sold' | 'adopted';
export type LegacyStatus = 'active' | 'reserved' | 'closed';
