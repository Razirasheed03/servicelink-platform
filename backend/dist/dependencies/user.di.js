"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_controller_1 = require("../controllers/implements/user.controller");
const user_service_1 = require("../services/implements/user.service");
const user_repository_1 = require("../repositories/implements/user.repository");
exports.userController = new user_controller_1.UserController(new user_service_1.UserService(new user_repository_1.UserRepository()));
