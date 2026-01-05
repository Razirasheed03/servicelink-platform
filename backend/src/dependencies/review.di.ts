import { ReviewController } from "../controllers/implements/review.controller";
import { ReviewService } from "../services/implements/review.service";
import { ReviewRepository } from "../repositories/implements/review.repository";
import { UserRepository } from "../repositories/implements/user.repository";

export const reviewController = new ReviewController(
  new ReviewService(new ReviewRepository(), new UserRepository())
);
