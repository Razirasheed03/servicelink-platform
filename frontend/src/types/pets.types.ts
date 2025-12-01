// src/types/pets.types.ts

export type PetCategory = {
  _id: string;
  name: string;
  description?: string;
  iconKey?: string;
};

export type CreatePetBody = {
  name: string;
  speciesCategoryId: string;
  sex?: 'male' | 'female' | 'unknown';
  birthDate?: string; // ISO date string
  notes?: string;
  photoUrl?: string;
};
