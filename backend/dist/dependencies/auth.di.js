"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_controller_1 = require("../controllers/implements/auth.controller");
const user_repository_1 = require("../repositories/implements/user.repository");
const auth_service_1 = require("../services/implements/auth.service");
exports.authController = new auth_controller_1.AuthController(new auth_service_1.AuthService(new user_repository_1.UserRepository()));
// // 1) Low-level dependency
// const userRepository = new UserRepository();
// // 2) Service depends on repository
// const authService = new AuthService(userRepository);
// // 3) Controller depends on service
// export const authController = new AuthController(authService);
