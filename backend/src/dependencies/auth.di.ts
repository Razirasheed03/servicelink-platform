//dependencies/auth.di.ts
import { AuthController } from "../controllers/implements/auth.controller"
import { UserRepository } from "../repositories/implements/user.repository";
import { AuthService } from "../services/implements/auth.service";

export const authController = new AuthController(
  new AuthService(new UserRepository())
);


// // 1) Low-level dependency
// const userRepository = new UserRepository();

// // 2) Service depends on repository
// const authService = new AuthService(userRepository);

// // 3) Controller depends on service
// export const authController = new AuthController(authService);