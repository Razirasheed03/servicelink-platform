import { ISubscriptionModel } from "../../models/interfaces/subscription.model.interface";

export interface ISubscriptionRepository {
  create(record: Partial<ISubscriptionModel>): Promise<ISubscriptionModel>;
  findBySessionId(sessionId: string): Promise<ISubscriptionModel | null>;
  markPaid(sessionId: string, update: Partial<ISubscriptionModel>): Promise<ISubscriptionModel | null>;
}
