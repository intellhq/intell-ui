"use client";

import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/schemas/auth";
import { useAuthQueries } from "@/hooks/use-auth-queries";
import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function AuthSignupForm() {
  const { useRegister } = useAuthQueries();
  const registerMutation = useRegister();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken") ?? "";
  const inviteEmail = searchParams.get("email") ?? "";

  const { tempEmail, setAuth, logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      email: inviteEmail || tempEmail || "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const inviteRegisterMutation = useMutation({
    mutationFn: AuthService.registerFromInvite,
    onSuccess: async (data) => {
      try {
        await setAuth({
          user: data.user,
          accessToken: data.accessToken,
          sessionId: data.sessionId,
          inverterAccess: data.inverterAccess,
        });
        toast.success("Invitation accepted successfully!");
        router.replace("/dashboard");
      } catch {
        logout();
        toast.error("Account created, but we could not start your session.");
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to accept invite");
    },
  });

  const formValues = useWatch({
    control,
    defaultValue: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const isFormFilled =
    !!formValues.firstName &&
    !!formValues.lastName &&
    !!formValues.email &&
    !!formValues.password;

  const passwordVal = formValues.password || "";
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

  const onSubmit = (data: RegisterFormValues) => {
    if (inviteToken) {
      inviteRegisterMutation.mutate({
        inviteToken,
        email: inviteEmail || data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      return;
    }
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6" noValidate>
      <div className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <AuthInput
            label="First Name"
            id="firstName"
            placeholder="Enter first name"
            type="text"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <AuthInput
            label="Last Name"
            id="lastName"
            placeholder="Enter last name"
            type="text"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
          <AuthInput
            label="Email Address"
            id="email"
            placeholder="Enter your email address"
            type="email"
            error={errors.email?.message}
            disabled={Boolean(inviteEmail)}
            {...register("email")}
          />
        <AuthInput
          label="Password"
          id="password"
          placeholder="************"
          type="password"
          statusColor={passwordStatus}
          helperText={passwordHelperText}
          {...register("password")}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 md:mt-12">
          <Button
            type="submit"
            disabled={(registerMutation.isPending || inviteRegisterMutation.isPending) || !isFormFilled}
            className="w-full max-w-[527px] h-[54px] rounded-lg px-16 py-2 text-base font-semibold md:text-lg transition-colors flex items-center justify-center mx-auto shadow-sm bg-secondary text-white hover:bg-secondary/90 disabled:bg-[#E8E8E8] disabled:text-dark-text disabled:opacity-100 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {registerMutation.isPending || inviteRegisterMutation.isPending ? "Signing Up..." : "Sign Up"}
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
            className="h-10 w-full py-4 md:h-12 md:py-6"
            onClick={() => AuthService.googleLogin()}
          >
            Continue with Google
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-grey-light text-sm font-normal md:text-base">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-amber-50 capitalize hover:underline"
          >
            Sign In
          </Link>
        </p>

        <p className="text-grey-light text-xs font-normal capitalize md:text-base md:leading-none">
          By signing up, you agree to our{" "}
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
    </form>
  );
}
