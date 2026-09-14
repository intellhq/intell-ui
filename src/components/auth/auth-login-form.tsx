"use client";

import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth";
import { useAuthQueries } from "@/hooks/use-auth-queries";
import { AuthService } from "@/services/auth-service";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function AuthLoginForm() {
  const { useLogin } = useAuthQueries();
  const loginMutation = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = useWatch({
    control,
    name: "email",
    defaultValue: "",
  });
  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });
  const isFormFilled = email.length > 0 && password.length > 0;

  let emailStatusColor: "green" | "red" | undefined = undefined;
  if (errors.email) {
    emailStatusColor = "red";
  }

  let passwordStatusColor: "red" | "green" | undefined = undefined;
  if (loginMutation.isError || errors.password) {
    passwordStatusColor = "red";
  }

  useEffect(() => {
    if (loginMutation.isError) {
      loginMutation.reset();
    }
  }, [email, password, loginMutation]);

  const onSubmit = (data: LoginFormValues) => {
    trackEvent("Login Submitted", { remember_me: rememberMe });
    loginMutation.mutate({ ...data, rememberMe });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 md:space-y-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <div className="space-y-3 md:space-y-4">
          <AuthInput
            label="Email Address"
            id="email"
            placeholder="Enter your email address"
            type="email"
            error={errors.email?.message}
            statusColor={emailStatusColor}
            {...register("email")}
          />
          <AuthInput
            label="Password"
            id="password"
            placeholder="************"
            type="password"
            error={errors.password?.message}
            statusColor={passwordStatusColor}
            {...register("password")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="border-amber-30 checked:bg-amber-30 relative h-4 w-4 cursor-pointer appearance-none rounded-sm border transition-colors before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-[10px] before:font-bold before:text-white before:content-[''] checked:before:content-['✔'] focus:outline-none"
            />
            <label
              htmlFor="remember"
              className="text-slate-80 cursor-pointer text-sm font-light md:text-base md:leading-none"
            >
              Remember Password
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-error-text text-sm font-semibold hover:text-amber-50 md:text-base md:leading-none"
          >
            Forgot Password
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:mt-12">
          <Button
            type="submit"
            disabled={loginMutation.isPending || !isFormFilled}
            className="w-full max-w-[527px] h-[54px] rounded-lg px-16 py-2 text-base font-semibold md:text-lg transition-colors flex items-center justify-center mx-auto shadow-sm bg-secondary text-white hover:bg-secondary/90 disabled:bg-[#E8E8E8] disabled:text-dark-text disabled:opacity-100 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm md:text-base">
              <span className="bg-white px-2 font-normal text-gray-400">
                OR
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="google"
            className="w-full py-4 md:py-6"
            onClick={() => {
              trackEvent("Google Auth Clicked", { context: "login" });
              AuthService.googleLogin();
            }}
          >
            Continue with Google
          </Button>
        </div>

        <div className="flex flex-col gap-4 text-center">
          <p className="text-grey-light text-sm font-normal md:text-base">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-amber-50 capitalize hover:underline"
            >
              Create One
            </Link>
          </p>

          <p className="text-grey-light text-xs font-normal capitalize md:text-base md:leading-none">
            By signing in, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-grey-light font-bold hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-grey-light font-bold hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
