"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ResponseHelper_1 = require("./ResponseHelper");
const errors_1 = require("./errors");
function errorHandler(err, _req, res, _next) {
    // Known typed error
    if (err instanceof errors_1.AppError) {
        ResponseHelper_1.ResponseHelper.error(res, err.statusCode, err.code, err.message, undefined, err.details);
        return;
    }
    // Fallback
    ResponseHelper_1.ResponseHelper.internal(res);
}
