"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const MessageConstant_1 = require("../constants/MessageConstant");
class ResponseHelper {
    static ok(res, data, message) {
        const body = Object.assign({ success: true, data }, (message ? { message } : {}));
        return res.status(httpStatus_1.HttpStatus.OK).json(body);
    }
    static created(res, data, message) {
        const body = Object.assign({ success: true, data }, (message ? { message } : {}));
        return res.status(httpStatus_1.HttpStatus.CREATED).json(body);
    }
    static noContent(res) {
        return res.status(httpStatus_1.HttpStatus.NO_CONTENT).send();
    }
    static error(res, status, code, message, errors, details) {
        const body = Object.assign(Object.assign({ success: false, code,
            message }, (errors ? { errors } : {})), (details !== undefined
            ? { details }
            : {}));
        return res.status(status).json(body);
    }
    static badRequest(res, message = MessageConstant_1.HttpResponse.VALIDATION_FAILED, errors) {
        return this.error(res, httpStatus_1.HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message, errors);
    }
    static unauthorized(res, message = MessageConstant_1.HttpResponse.UNAUTHORIZED) {
        return this.error(res, httpStatus_1.HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", message);
    }
    static forbidden(res, message = MessageConstant_1.HttpResponse.FORBIDDEN) {
        return this.error(res, httpStatus_1.HttpStatus.FORBIDDEN, "FORBIDDEN", message);
    }
    static notFound(res, message = MessageConstant_1.HttpResponse.PAGE_NOT_FOUND) {
        return this.error(res, httpStatus_1.HttpStatus.NOT_FOUND, "NOT_FOUND", message);
    }
    static conflict(res, message = MessageConstant_1.HttpResponse.CONFLICT) {
        return this.error(res, httpStatus_1.HttpStatus.CONFLICT, "CONFLICT", message);
    }
    static internal(res, message = MessageConstant_1.HttpResponse.SERVER_ERROR, details) {
        return this.error(res, httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", message, undefined, details);
    }
}
exports.ResponseHelper = ResponseHelper;
