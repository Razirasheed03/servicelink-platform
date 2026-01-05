"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_controller_1 = require("../controllers/implements/auth.controller");
const user_repository_1 = require("../repositories/implements/user.repository");
const auth_service_1 = require("../services/implements/auth.service");
exports.authController = new auth_controller_1.AuthController(new auth_service_1.AuthService(new user_repository_1.UserRepository()));
