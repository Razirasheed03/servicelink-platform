//validation/userSchemas.ts
import { z } from "zod";
import { UserRole } from "../constants/roles";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  role: z.nativeEnum(UserRole),
  serviceType: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;
