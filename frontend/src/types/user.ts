//types/user.ts
export type Role = "user" | "service_provider" | "admin";
export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isBlocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserStats {
  totalUsers: number;
  totalDoctors: number;
  blockedUsers: number;
}
