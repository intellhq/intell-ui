import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(
    8,
    "Password is short. Minimum of least 8 characters and a special key",
  )
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password is short. Minimum of least 8 characters and a special key",
  );

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password must be at most 72 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: passwordValidation,
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(40, "First name must be at most 40 characters")
    .regex(/^[\p{L}]+(?:[ '-][\p{L}]+){0,2}$/u, "Names can only contain letters, spaces, hyphens, or apostrophes"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(40, "Last name must be at most 40 characters")
    .regex(/^[\p{L}]+(?:[ '-][\p{L}]+){0,2}$/u, "Names can only contain letters, spaces, hyphens, or apostrophes"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const refreshTokenSchema = z.object({
  sessionId: z.string().uuid("Session ID is required"),
});

export type RefreshTokenFormValues = z.infer<typeof refreshTokenSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
