"use client";

import Link from "next/link";

import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { AuthInput } from "@/components/auth/auth-input";

import { Button } from "@/components/ui/button";

import { useAuthQueries } from "@/hooks/use-auth-queries";
import { trackEvent } from "@/lib/analytics";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function AuthForgotPasswordForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { useForgotPassword } = useAuthQueries();

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const email = useWatch({
    control,

    name: "email",

    defaultValue: "",
  });

  const isFormFilled = email.trim().length > 0;

  const onSubmit = (data: ForgotPasswordValues) => {
    trackEvent("Forgot Password Submitted");
    forgotPassword(data, {
      onSuccess: () => {
        trackEvent("Forgot Password Submission Succeeded");
        sessionStorage.setItem("reset_email", data.email);
        onSuccess?.();
      },
      onError: () => {
        trackEvent("Forgot Password Submission Failed");
      },
    });
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <div className="space-y-3 md:space-y-4">
          <AuthInput
            label="Email Address"
            id="email"
            placeholder="Enter your email address"
            type="email"
            disabled={isPending}
            error={errors.email?.message}
            statusColor={errors.email ? "red" : undefined}
            {...register("email")}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-10 md:mt-12 md:gap-16">
        <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
          <Button
            type="submit"
            disabled={!isFormFilled || isPending}
            className="bg-secondary hover:bg-secondary/90 h-12 flex-1 rounded-lg px-8 py-4 text-sm font-semibold text-white disabled:opacity-50 md:py-6 md:text-lg"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>

          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isPending}
            className="border-border text-dark-text md:text-md h-12 flex-1 rounded-lg px-4 py-4 text-sm font-semibold hover:bg-slate-50 md:px-8 md:py-6"
          >
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
