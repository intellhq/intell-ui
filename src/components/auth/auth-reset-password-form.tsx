"use client";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthResetSuccessView } from "@/components/auth/auth-reset-success-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState, Suspense } from "react";
import { useAuthQueries } from "@/hooks/use-auth-queries";
import { useSearchParams } from "next/navigation";

import { passwordValidation } from "@/lib/schemas/auth";
import { trackEvent } from "@/lib/analytics";

// Validation schema for the UI
const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent({ onSuccess }: { onSuccess?: () => void }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const searchParams = useSearchParams();
  const { useResetPassword } = useAuthQueries();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const token = searchParams.get("token");
  const savedEmail = sessionStorage.getItem("reset_email") || null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" });
  const confirmPasswordValue = useWatch({ control, name: "confirmPassword" });
  const resolvedEmail = savedEmail || emailInput.trim();
  const isFormFilled = !!(passwordValue && confirmPasswordValue && token && resolvedEmail);

  const passwordVal = passwordValue || "";
  const hasMinLength = passwordVal.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordVal);
  const isPasswordValid = hasMinLength && hasSpecialChar;

  let passwordStatus: "yellow" | "red" | "green" | undefined = undefined;
  let passwordHelperText: string | undefined = undefined;

  if (errors.password?.message) {
    passwordStatus = "red";
    passwordHelperText =
      "Password is short. Minimum of least 8 characters and a special key";
  } else if (passwordVal.length > 0) {
    if (isPasswordValid) {
      passwordStatus = "green";
      passwordHelperText = "Successful";
    } else {
      passwordStatus = "yellow";
      passwordHelperText =
        "Password must be at least 8 characters and a special key";
    }
  }

  let confirmPasswordStatusColor: "red" | "green" | undefined = undefined;
  if (errors.confirmPassword) {
    confirmPasswordStatusColor = "red";
  } else if (confirmPasswordValue && confirmPasswordValue === passwordValue) {
    confirmPasswordStatusColor = "green";
  }

  const onSubmit = (data: ResetPasswordValues) => {
    trackEvent("Reset Password Submitted", { has_token: Boolean(token) });

    if (!token) {
      toast.error(
        "Reset token is missing. Please use the link sent to your email.",
      );
      return;
    }

    const payload: { token: string; password: string; email?: string } = {
      token,
      password: data.password,
    };

    if (resolvedEmail) {
      payload.email = resolvedEmail;
    }

    resetPassword(payload, {
      onSuccess: () => {
        trackEvent("Reset Password Submission Succeeded");
        setIsSuccess(true);
        sessionStorage.removeItem("reset_email");
        onSuccess?.();
      },
      onError: (err: unknown) => {
        trackEvent("Reset Password Submission Failed");
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "object" &&
                err !== null &&
                "message" in err &&
                typeof err.message === "string"
              ? err.message
              : "An error occurred during reset.";

        toast.error(message);
      },
    });
  };

  if (isSuccess) {
    return <AuthResetSuccessView />;
  }

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <div className="space-y-3 md:space-y-4">
          {!savedEmail && (
            <AuthInput
              label="Email Address"
              id="reset-email"
              type="email"
              placeholder="Enter your email address"
              disabled={isPending}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          )}
          <AuthInput
            label="New Password"
            id="password"
            type="password"
            placeholder="Enter a new password"
            disabled={isPending}
            statusColor={passwordStatus}
            helperText={passwordHelperText}
            {...register("password")}
          />

          <AuthInput
            label="Confirm New Password"
            id="confirm-password"
            type="password"
            placeholder="Confirm the new password"
            disabled={isPending}
            error={errors.confirmPassword?.message}
            statusColor={confirmPasswordStatusColor}
            {...register("confirmPassword")}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-10 md:mt-12 md:gap-16">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-border text-dark-text h-12 w-full rounded-lg px-4 py-4 text-sm font-medium hover:bg-slate-50 sm:flex-1 md:px-8 md:py-6"
          >
            <Link href="/login">Back to Login</Link>
          </Button>

          <Button
            type="submit"
            disabled={!isFormFilled || isPending}
            className="bg-secondary hover:bg-secondary/90 h-12 w-full rounded-lg px-8 py-4 text-sm font-semibold text-white disabled:opacity-50 sm:flex-1 md:h-14 md:py-5 md:text-lg"
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function AuthResetPasswordForm(props: { onSuccess?: () => void }) {
  return (
    <Suspense fallback={<div>Loading reset details...</div>}>
      <ResetPasswordFormContent {...props} />
    </Suspense>
  );
}
