import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { LoginFormValues } from "@/lib/schemas/auth";
import { ApiError } from "@/lib/api/error";

type ErrorWithMessage = {
  message?: string;
};

interface RegistrationErrorDetails {
  isVerified?: boolean;
  user?: {
    isEmailVerified?: boolean;
  };
}

const getSafeRedirect = (redirect: string | null, fallback: string): string => {
  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    !redirect.includes("://")
  ) {
    return redirect;
  }

  return fallback;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  let message = fallback;

  if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    message = (error as ErrorWithMessage).message ?? fallback;
  }

  const lowercaseMessage = message.toLowerCase();

  if (
    lowercaseMessage === "the request conflicts with the current resource state"
  ) {
    return "This email is already registered";
  }

  if (lowercaseMessage.includes("too many requests")) {
    return "Too many attempts. Please try again later.";
  }

  if (
    lowercaseMessage === "authentication is required or has failed" ||
    lowercaseMessage === "unauthorized" ||
    lowercaseMessage === "user not found"
  ) {
    return "We couldn't find an account matching that email address.";
  }

  if (
    lowercaseMessage === "password must be longer than or equal to 8 characters"
  ) {
    return "The provided email or password is incorrect";
  }

  return message;
};

export const useAuthQueries = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    setAuth,
    logout: storeLogout,
    isAuthenticated,
    setTempEmail,
  } = useAuthStore();

  const useLogin = () =>
    useMutation({
      mutationFn: (variables: LoginFormValues & { rememberMe?: boolean }) =>
        AuthService.login({
          email: variables.email,
          password: variables.password,
        }),
      onSuccess: async (data, variables) => {
        try {
          await setAuth({
            user: data.user,
            accessToken: data.accessToken,
            sessionId: data.sessionId,
            inverterAccess: data.inverterAccess,
            rememberMe: variables.rememberMe ?? false,
          });
        } catch {
          storeLogout();
          toast.error("Signed in, but we could not start your session. Please try again.");
          return;
        }

        toast.success("Welcome back!", {
          duration: 5000,
        });
        const redirect = searchParams.get("redirect");
        router.replace(getSafeRedirect(redirect, "/dashboard"));
      },
      onError: (error: unknown) => {
        const message = getErrorMessage(
          error,
          "The provided email or password is incorrect",
        );
        const safeMessages = new Set([
          "Too many attempts. Please try again later.",
        ]);
        const finalMessage = safeMessages.has(message)
          ? message
          : "The provided email or password is incorrect";

        toast.error(finalMessage, {
          duration: 5000,
        });
      },
    });

  const useRegister = () =>
    useMutation({
      mutationFn: AuthService.register,
      onSuccess: (_, variables) => {
        setTempEmail(variables.email);
        toast.success("Account created successfully!");
        router.push("/verify-email");
      },
      onError: (error: unknown, variables) => {
        const message = getErrorMessage(error, "Registration failed");

        // If account exists, it might be unverified, so we redirect to verify-email
        if (message === "This email is already registered") {
          const apiError = error instanceof ApiError ? error : null;
          const details = apiError?.details as
            | RegistrationErrorDetails
            | undefined;

          // Check if the backend explicitly indicates verification status
          const isVerified =
            details?.isVerified || details?.user?.isEmailVerified;

          if (isVerified === true) {
            toast.info("Account already exists and is verified. Please login.");
            router.push("/login");
            return;
          }

          setTempEmail(variables.email);
          toast.info("Account already exists. Redirecting to verification...");
          router.push("/verify-email");
          return;
        }

        toast.error(message);
      },
    });

  const useVerifyEmail = () =>
    useMutation({
      mutationFn: AuthService.verifyEmail,
      onSuccess: async (data) => {
        if (!data.sessionId || !data.accessToken) {
          toast.info("Email is already verified. Please sign in.");
          router.replace("/login");
          return;
        }

        try {
          await setAuth({
            user: data.user,
            accessToken: data.accessToken,
            sessionId: data.sessionId,
            inverterAccess: data.inverterAccess ?? [],
          });
        } catch {
          storeLogout();
          toast.error(
            "Email verified, but we could not start your session. Please sign in again.",
          );
          return;
        }

        toast.success("Email verified successfully!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Verification failed"), {
          duration: 5000,
        });
      },
    });

  const useResendEmailOtp = () =>
    useMutation({
      mutationFn: AuthService.resendEmailOtp,
      onSuccess: (data) => {
        toast.success(data.message || "OTP resent successfully!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to resend OTP"));
      },
    });

  const useLogout = () =>
    useMutation({
      mutationFn: AuthService.logout,
      onSuccess: () => {
        storeLogout();
        queryClient.clear();
        toast.success("Logged out successfully");
        router.push("/login");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Logout failed"));
      },
    });

  const useMe = () =>
    useQuery({
      queryKey: ["auth-me"],
      queryFn: AuthService.me,
      enabled: isAuthenticated,
    });

  const useForgotPassword = () =>
    useMutation({
      mutationFn: AuthService.forgotPassword,
      onSuccess: (data) => {
        toast.success(data.message || "Reset link sent to your email!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to send reset link"));
      },
    });

  const useResetPassword = () =>
    useMutation({
      mutationFn: AuthService.resetPassword,
      onSuccess: () => {
        toast.success("Password reset successfully!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Reset failed"));
      },
    });

  return {
    useLogin,
    useRegister,
    useVerifyEmail,
    useResendEmailOtp,
    useLogout,
    useMe,
    useForgotPassword,
    useResetPassword,
  };
};
