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
exports.AdminController = void 0;
const ResponseHelper_1 = require("../../http/ResponseHelper");
const MessageConstant_1 = require("../../constants/MessageConstant");
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.getDashboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const stats = yield this.adminService.getDashboardStats(adminUserId);
                ResponseHelper_1.ResponseHelper.ok(res, stats, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.listProviders = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const { page, limit } = req.query;
                const data = yield this.adminService.listProviders(adminUserId, {
                    page: page ? Number(page) : undefined,
                    limit: limit ? Number(limit) : undefined,
                });
                ResponseHelper_1.ResponseHelper.ok(res, data, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.listUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const { page, limit } = req.query;
                const data = yield this.adminService.listUsers(adminUserId, {
                    page: page ? Number(page) : undefined,
                    limit: limit ? Number(limit) : undefined,
                });
                ResponseHelper_1.ResponseHelper.ok(res, data, MessageConstant_1.HttpResponse.RESOURCE_FOUND);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.approveProvider = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const { providerId } = req.params;
                const updated = yield this.adminService.approveProvider(adminUserId, providerId);
                ResponseHelper_1.ResponseHelper.ok(res, { provider: updated }, MessageConstant_1.HttpResponse.RESOURCE_UPDATED);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.rejectProvider = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const { providerId } = req.params;
                const { reason } = req.body;
                const updated = yield this.adminService.rejectProvider(adminUserId, providerId, reason);
                ResponseHelper_1.ResponseHelper.ok(res, { provider: updated }, MessageConstant_1.HttpResponse.RESOURCE_UPDATED);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.setUserBlocked = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const { userId } = req.params;
                const { isBlocked } = req.body;
                const updated = yield this.adminService.setUserBlocked(adminUserId, userId, !!isBlocked);
                ResponseHelper_1.ResponseHelper.ok(res, { user: updated }, MessageConstant_1.HttpResponse.RESOURCE_UPDATED);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.setProviderBlocked = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserId = req.userId;
                const { providerId } = req.params;
                const { isBlocked } = req.body;
                const updated = yield this.adminService.setProviderBlocked(adminUserId, providerId, !!isBlocked);
                ResponseHelper_1.ResponseHelper.ok(res, { provider: updated }, MessageConstant_1.HttpResponse.RESOURCE_UPDATED);
                return;
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AdminController = AdminController;
