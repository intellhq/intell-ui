import { z } from "zod";

export const waitlistLeadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phoneNumber: z.string().trim().min(7, "Phone number is required"),
  state: z.string().trim().min(1, "Select your state"),
  inverterType: z.string().trim().min(1, "Select your inverter type"),
  interest: z.string().trim().min(1, "Select how you want to use INTELL"),
  source: z.string().trim().min(1, "Select how you found INTELL"),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be at most 1000 characters")
    .optional(),
});

export type WaitlistLeadValues = z.infer<typeof waitlistLeadSchema>;
