import { SubscriptionController } from "../controllers/implements/subscription.controller";
import { SubscriptionService } from "../services/implements/subscription.service";
import { UserRepository } from "../repositories/implements/user.repository";
import { SubscriptionRepository } from "../repositories/implements/subscription.repository";

const userRepo = new UserRepository();
const subscriptionRepo = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(userRepo, subscriptionRepo);

export const subscriptionController = new SubscriptionController(subscriptionService, userRepo);
