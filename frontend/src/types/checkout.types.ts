export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export type GetQuotePayload = {
  doctorId: string;
  date: string;
  time: string;
  durationMins: number;
  mode: "video" | "audio" | "inPerson";
  baseFee: number;
};

export type QuoteResponse = {
  amount: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  currency: string;
};

export type CreateCheckoutPayload = {
  doctorId: string;
  date: string;
  time: string;
  durationMins: number;
  mode: "video" | "audio" | "inPerson";
  amount: number;
  currency: string;
  petName: string;
  notes?: string;
  paymentMethod: PaymentMethod;
};

export type CreateCheckoutResponse = {
  bookingId?: string;
  redirectUrl?: string;
};

export type MockPayResponse = {
  bookingId: string;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
};
