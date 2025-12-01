// src/types/common.types.ts

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export interface CommonApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId?: string;
}

export interface CommonPaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
  requestId?: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  error: ApiError;
  timestamp: string;
  requestId?: string;
};
