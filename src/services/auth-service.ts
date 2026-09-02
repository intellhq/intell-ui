import { apiFetch } from "@/lib/api/client";
// import { env } from "@/env/client";
import {
  InverterAccess,
  LoginResponse,
  RegisterResponse,
  VerifyEmailResponse,
  RefreshTokenResponse,
  MeResponse,
} from "@/types/auth";
import {
  LoginFormValues,
  RegisterFormValues,
  VerifyEmailFormValues,
  RefreshTokenFormValues,
} from "@/lib/schemas/auth";

export const AuthService = {
  googleLogin: () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const returnUrl = `${window.location.origin}/dashboard`;

    if (!apiBaseUrl) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
      return;
    }

    const baseUrl = apiBaseUrl.replace(/\/+$/, "");
    const state = encodeURIComponent(`web:${encodeURIComponent(returnUrl)}`);
    window.location.href = `${baseUrl}/auth/google?state=${state}`;
  },

  login: async (data: LoginFormValues) => {
    return apiFetch<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  register: async (data: RegisterFormValues) => {
    return apiFetch<RegisterResponse>(
      "/auth/register",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  verifyEmail: async (data: VerifyEmailFormValues) => {
    return apiFetch<VerifyEmailResponse>(
      "/auth/verify-email",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  resendEmailOtp: async (data: { email: string }) => {
    return apiFetch<{ message: string }>(
      "/auth/resend-email-otp",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  refresh: async (data: RefreshTokenFormValues) => {
    return apiFetch<RefreshTokenResponse>(
      "/auth/refresh",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  logout: async () => {
    return apiFetch<void>(
      "/auth/logout",
      {
        method: "POST",
      },
      true,
    );
  },

  me: async () => {
    return apiFetch<MeResponse>(
      "/auth/me",
      {
        method: "GET",
      },
      true,
    );
  },

  acceptInvite: async (inviteToken: string) => {
    return apiFetch<{ inverterId: string; role: InverterAccess["role"] }>(
      "/auth/accept-invite",
      {
        method: "POST",
        data: { inviteToken },
      },
      true,
    );
  },

  registerFromInvite: async (data: {
    inviteToken: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    return apiFetch<LoginResponse>(
      "/auth/invite-register",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  forgotPassword: async (data: { email: string }) => {
    return apiFetch<{ message: string }>(
      "auth/forgot-password",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  resetPassword: async (data: { token: string; password: string; email?: string }) => {
    return apiFetch<{ message: string }>(
      "auth/reset-password",
      {
        method: "POST",
        data,
      },
      true,
    );
  },
};
