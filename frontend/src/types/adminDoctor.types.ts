export type VerificationStatus = "pending" | "verified" | "rejected";

export type DoctorRow = {
  userId: string; // stringified ObjectId
  username: string;
  email: string;
  status: VerificationStatus;
  certificateUrl?: string;
  submittedAt?: string;
};

export type DoctorListResponse = {
  data: DoctorRow[];
  page: number;
  totalPages: number;
  total: number;
};

export type DoctorDetail = {
  userId: string;
  username: string;
  email: string;
  status: VerificationStatus;
  // verification
  certificateUrl?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReasons?: string[];
  // profile
  displayName?: string;
  bio?: string;
  specialties?: string[];
  experienceYears?: number;
  licenseNumber?: string;
  avatarUrl?: string;
  consultationFee?: number;
};
