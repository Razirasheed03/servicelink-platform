// frontend/src/types/booking.ts
export type UIMode = "video" | "audio" | "inPerson";
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";
export type BookingStatus = "pending" | "paid" | "cancelled" | "failed" | "refunded";

export interface BookingRow {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  doctorSpecialty?: string;
  doctorProfilePic?: string;
  slotId?: string | null;
  date: string;
  time: string;
  durationMins: number;
  mode: UIMode;
  amount: number;
  currency: string;
  petName: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  paymentProvider?: string;
  paymentSessionId?: string;
  bookingNumber?:string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingListParams {
  page?: number;
  limit?: number;
  scope?: "upcoming" | "today" | "past" | "all";
  status?: BookingStatus;
  q?: string;
  mode?: UIMode;
}