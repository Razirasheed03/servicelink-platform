// src/types/doctor.types.ts

export type UIMode = "video" | "audio" | "inPerson";
export type BookingStatus = "pending" | "paid" | "cancelled" | "failed" | "refunded";

export type SessionRow = {
  _id: string;
  date: string;         // YYYY-MM-DD
  time: string;         // HH:mm
  durationMins: number; // minutes
  mode: UIMode;
  status: BookingStatus;
  petName: string;
  notes?: string;
  patientId: string;
  patientName?: string;
  patientEmail?: string;
};

export type SessionDetail = SessionRow & {
  doctorId: string;
  slotId?: string | null;
  amount: number;
  currency: string;
  createdAt?: string;
};

export type DoctorCard = {
  doctorId: string;
  displayName: string;
  avatarUrl?: string;
  experienceYears?: number;
  specialties?: string[];
  consultationFee?: number;
  isOnline?: boolean;
  nextSlot?: { date: string; time: string };
  modes?: UIMode[];
};

export type DoctorDetailPublic = {
  doctorId: string;
  displayName: string;
  avatarUrl?: string;
  experienceYears?: number;
  specialties?: string[];
  consultationFee?: number;
  bio?: string;
  languages?: string[];
  location?: string;
  modes?: UIMode[];
};

export type VetSlot = {
  _id: string;
  date: string;
  time: string;
  durationMins: number;
  fee: number;
  modes: UIMode[] | string[];
  status: "available" | "booked";
};
