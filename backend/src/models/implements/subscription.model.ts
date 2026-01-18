import { Model } from "mongoose";
import { Subscription } from "../../schema/subscription.schema";
import { ISubscriptionModel } from "../interfaces/subscription.model.interface";

export const SubscriptionModel: Model<ISubscriptionModel> = Subscription;
