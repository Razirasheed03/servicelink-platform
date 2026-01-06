"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ResponseHelper_1 = require("../../http/ResponseHelper");
const MessageConstant_1 = require("../../constants/MessageConstant");
class UserController {
    constructor(_userService) {
        this._userService = _userService;
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const user = yield this._userService.getProfile(userId);
                ResponseHelper_1.ResponseHelper.ok(res, { user }, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const updated = yield this._userService.updateProfile(userId, req.body);
                ResponseHelper_1.ResponseHelper.ok(res, { user: updated }, MessageConstant_1.HttpResponse.RESOURCE_UPDATED);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.listProviders = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, serviceType, page, limit } = req.query;
                const parsed = yield this._userService.listProviders({
                    search,
                    serviceType,
                    page: page ? Number(page) : undefined,
                    limit: limit ? Number(limit) : undefined,
                });
                ResponseHelper_1.ResponseHelper.ok(res, parsed, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.getProviderById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const provider = yield this._userService.getProviderById(id);
                if (!provider) {
                    ResponseHelper_1.ResponseHelper.notFound(res, MessageConstant_1.HttpResponse.USER_NOT_FOUND);
                    return;
                }
                ResponseHelper_1.ResponseHelper.ok(res, { provider }, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.reapplyVerification = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const updated = yield this._userService.reapplyVerification(userId);
                if (!updated) {
                    ResponseHelper_1.ResponseHelper.notFound(res, MessageConstant_1.HttpResponse.USER_NOT_FOUND);
                    return;
                }
                ResponseHelper_1.ResponseHelper.ok(res, { user: updated }, MessageConstant_1.HttpResponse.RESOURCE_UPDATED);
                return;
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.UserController = UserController;
