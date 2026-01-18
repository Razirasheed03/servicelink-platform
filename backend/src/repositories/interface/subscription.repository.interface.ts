import { ISubscriptionModel } from "../../models/interfaces/subscription.model.interface";

export interface ISubscriptionRepository {
  create(record: Partial<ISubscriptionModel>): Promise<ISubscriptionModel>;
  findBySessionId(sessionId: string): Promise<ISubscriptionModel | null>;
  markPaid(sessionId: string, update: Partial<ISubscriptionModel>): Promise<ISubscriptionModel | null>;

  getIncomeSummary(): Promise<{
    totalIncome: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
  }>;

  getIncomeSeries(options: {
    from: Date;
    to: Date;
    groupBy: "day" | "month";
  }): Promise<Array<{
    period: string;
    totalIncome: number;
    totalSubscriptions: number;
  }>>;
}
