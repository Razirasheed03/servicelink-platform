"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationAppError = exports.NotFoundError = exports.AppError = void 0;
// src/http/errors.ts
class AppError extends Error {
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = 'Not found') { super(404, 'NOT_FOUND', message); }
}
exports.NotFoundError = NotFoundError;
class ValidationAppError extends AppError {
    constructor(message = 'Validation failed', details) { super(400, 'VALIDATION_ERROR', message, details); }
}
exports.ValidationAppError = ValidationAppError;
