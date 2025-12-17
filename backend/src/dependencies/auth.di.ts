import { AuthController } from "../controllers/implements/auth.controller"
import { UserRepository } from "../repositories/implements/user.repository";
import { AuthService } from "../services/implements/auth.service";

export const authController = new AuthController(new AuthService(new UserRepository()));