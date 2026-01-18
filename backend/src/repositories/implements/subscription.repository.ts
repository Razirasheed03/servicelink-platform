import { SubscriptionModel } from "../../models/implements/subscription.model";
import { ISubscriptionRepository } from "../interface/subscription.repository.interface";
import { ISubscriptionModel } from "../../models/interfaces/subscription.model.interface";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(record: Partial<ISubscriptionModel>): Promise<ISubscriptionModel> {
    const created = await SubscriptionModel.create(record);
    return created;
  }

  async findBySessionId(sessionId: string): Promise<ISubscriptionModel | null> {
    return SubscriptionModel.findOne({ stripeSessionId: sessionId });
  }

  async markPaid(
    sessionId: string,
    update: Partial<ISubscriptionModel>
  ): Promise<ISubscriptionModel | null> {
    const updated = await SubscriptionModel.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { $set: update },
      { new: true }
    );
    return updated;
  }
}
