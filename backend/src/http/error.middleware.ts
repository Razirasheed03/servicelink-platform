// src/http/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from './ResponseHelper';
import { AppError } from './errors';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // Known typed error
  if (err instanceof AppError) {
    ResponseHelper.error(res, err.statusCode, err.code, err.message, undefined, err.details);
    return;
  }
  // Fallback
  ResponseHelper.internal(res);
}