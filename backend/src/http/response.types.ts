// src/http/response.types.ts
export interface ErrorItem {
  path?: string;
  message: string;
  code?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  errors?: ErrorItem[];
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;