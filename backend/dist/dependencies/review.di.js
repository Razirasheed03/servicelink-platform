"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const review_controller_1 = require("../controllers/implements/review.controller");
const review_service_1 = require("../services/implements/review.service");
const review_repository_1 = require("../repositories/implements/review.repository");
const user_repository_1 = require("../repositories/implements/user.repository");
exports.reviewController = new review_controller_1.ReviewController(new review_service_1.ReviewService(new review_repository_1.ReviewRepository(), new user_repository_1.UserRepository()));
