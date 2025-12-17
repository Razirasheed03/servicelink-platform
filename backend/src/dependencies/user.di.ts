import { UserController } from "../controllers/implements/user.controller";
import { UserService } from "../services/implements/user.service";
import { UserRepository } from "../repositories/implements/user.repository";

export const userController = new UserController(new UserService(new UserRepository()));