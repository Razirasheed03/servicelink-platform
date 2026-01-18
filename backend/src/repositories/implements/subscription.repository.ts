import { SubscriptionModel } from "../../models/implements/subscription.model";
import { ISubscriptionRepository } from "../interface/subscription.repository.interface";
import { ISubscriptionModel } from "../../models/interfaces/subscription.model.interface";
import { PaymentStatus } from "../../constants/subscription";

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

  async getIncomeSummary(): Promise<{
    totalIncome: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    const startOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0));
    const startOfThisMonth = startOfMonth;

    const summaryAgg = await SubscriptionModel.aggregate<{
      _id: null;
      totalIncome: number;
      totalSubscriptions: number;
    }>([
      { $match: { paymentStatus: PaymentStatus.PAID } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
          totalSubscriptions: { $sum: 1 },
        },
      },
    ]);

    const totalIncome = summaryAgg[0]?.totalIncome ?? 0;
    const totalSubscriptions = summaryAgg[0]?.totalSubscriptions ?? 0;

    const [activeSubscriptions, expiredSubscriptions, revenueThisMonthAgg, revenueLastMonthAgg] = await Promise.all([
      SubscriptionModel.countDocuments({
        paymentStatus: PaymentStatus.PAID,
        expiresAt: { $gt: now },
      }),
      SubscriptionModel.countDocuments({
        paymentStatus: PaymentStatus.PAID,
        expiresAt: { $lte: now },
      }),
      SubscriptionModel.aggregate<{ _id: null; income: number }>([
        {
          $match: {
            paymentStatus: PaymentStatus.PAID,
            paidAt: { $gte: startOfThisMonth, $lt: startOfNextMonth },
          },
        },
        { $group: { _id: null, income: { $sum: "$amount" } } },
      ]),
      SubscriptionModel.aggregate<{ _id: null; income: number }>([
        {
          $match: {
            paymentStatus: PaymentStatus.PAID,
            paidAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
          },
        },
        { $group: { _id: null, income: { $sum: "$amount" } } },
      ]),
    ]);

    return {
      totalIncome,
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      revenueThisMonth: revenueThisMonthAgg[0]?.income ?? 0,
      revenueLastMonth: revenueLastMonthAgg[0]?.income ?? 0,
    };
  }

  async getIncomeSeries(options: {
    from: Date;
    to: Date;
    groupBy: "day" | "month";
  }): Promise<Array<{ period: string; totalIncome: number; totalSubscriptions: number }>> {
    const format = options.groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";

    const result = await SubscriptionModel.aggregate<{
      _id: string;
      totalIncome: number;
      totalSubscriptions: number;
    }>([
      {
        $match: {
          paymentStatus: PaymentStatus.PAID,
          paidAt: { $gte: options.from, $lte: options.to },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format, date: "$paidAt" } },
          totalIncome: { $sum: "$amount" },
          totalSubscriptions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result.map((row) => ({
      period: row._id,
      totalIncome: row.totalIncome,
      totalSubscriptions: row.totalSubscriptions,
    }));
  }
}
