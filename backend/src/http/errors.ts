// src/http/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) { super(message); }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') { super(404, 'NOT_FOUND', message); }
}
export class ValidationAppError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) { super(400, 'VALIDATION_ERROR', message, details); }
}