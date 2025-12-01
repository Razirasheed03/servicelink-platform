export type AdminPetCategory = {
  id: string;
  name: string;
  description?: string;
  iconKey?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCategoryListResponse = {
  data: AdminPetCategory[];
  page: number;
  totalPages: number;
  total: number;
};