"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_controller_1 = require("../controllers/implements/admin.controller");
const admin_service_1 = require("../services/implements/admin.service");
const admin_repository_1 = require("../repositories/implements/admin.repository");
const user_repository_1 = require("../repositories/implements/user.repository");
exports.adminController = new admin_controller_1.AdminController(new admin_service_1.AdminService(new admin_repository_1.AdminRepository(), new user_repository_1.UserRepository()));
