"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useAuthQueries } from "@/hooks/use-auth-queries";
import { AuthHeader } from "@/components/auth/auth-header";
import { useAuthStore } from "@/stores/auth-store";

const OTP_VALIDITY_SECONDS = 299;

export function AuthVerifyEmailForm() {
  const router = useRouter();
  const tempEmail = useAuthStore((state) => state.tempEmail);
  const [email] = useState(() => {
  if (typeof window === "undefined") return tempEmail ?? "";
  return tempEmail ?? localStorage.getItem("temp_email") ?? "";
});

  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      router.replace("/signup");
    }
  }, [email, router]);

  const [otp, setOtp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(OTP_VALIDITY_SECONDS);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}s`;
  };

  const { useVerifyEmail, useResendEmailOtp } = useAuthQueries();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendEmailOtp();

  const isComplete = otp.length === 6;

  const handleResend = () => {
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setTimeLeft(OTP_VALIDITY_SECONDS);
        },
      },
    );
  };

  const handleVerify = async () => {
    if (!isComplete) return;
    setError(null);

    verifyMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (err: unknown) => {
          setError(
            err instanceof Error
              ? err.message
              : "Oh no! The code you entered is incorrect.",
          );
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] duration-300">
        <div
          className={cn(
            "animate-in zoom-in-95 mx-4 flex w-full flex-col items-center justify-center bg-white p-10 text-center shadow-2xl duration-300",
            "min-h-102.75 max-w-122.25 rounded-[8px]",
          )}
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center">
            <svg
              width="98"
              height="98"
              viewBox="0 0 98 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="98" height="98" rx="49" fill="#E1FAEA" />
              <rect
                x="12"
                y="12"
                width="74"
                height="74"
                rx="37"
                fill="#4ADE80"
              />
              <path
                d="M42.332 50.2663L45.3437 53.7082C46.1905 54.6759 47.7173 54.6046 48.4702 53.5621L55.6654 43.5996"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M44.4256 32.2805C45.5881 31.2898 46.1694 30.7944 46.7772 30.5039C48.1829 29.832 49.8171 29.832 51.2228 30.5039C51.8306 30.7944 52.4119 31.2898 53.5744 32.2805C54.7713 33.3005 55.9876 33.8152 57.5878 33.9429C59.1105 34.0644 59.8718 34.1252 60.507 34.3495C61.976 34.8684 63.1316 36.024 63.6505 37.493C63.8748 38.1282 63.9356 38.8895 64.0571 40.4122C64.1848 42.0124 64.6995 43.2287 65.7195 44.4256C66.7102 45.5881 67.2056 46.1694 67.4961 46.7772C68.168 48.1829 68.168 49.8171 67.4961 51.2228C67.2056 51.8306 66.7102 52.4119 65.7195 53.5744C64.6782 54.7963 64.1822 56.0203 64.0571 57.5878C63.9356 59.1105 63.8748 59.8718 63.6505 60.507C63.1316 61.976 61.976 63.1316 60.507 63.6505C59.8718 63.8748 59.1105 63.9356 57.5878 64.0571C55.9876 64.1848 54.7713 64.6995 53.5744 65.7195C52.4119 66.7102 51.8306 67.2056 51.2228 67.4961C49.8171 68.168 48.1829 68.168 46.7772 67.4961C46.1694 67.2056 45.5881 66.7102 44.4256 65.7195C43.2037 64.6782 41.9797 64.1822 40.4122 64.0571C38.8895 63.9356 38.1282 63.8748 37.493 63.6505C36.024 63.1316 34.8684 61.976 34.3495 60.507C34.1252 59.8718 34.0644 59.1105 33.9429 57.5878C33.8152 55.9876 33.3005 54.7713 32.2805 53.5744C31.2898 52.4119 30.7944 51.8306 30.5039 51.2228C29.832 49.8171 29.832 48.1829 30.5039 46.7772C30.7944 46.1694 31.2898 45.5881 32.2805 44.4256C33.3218 43.2037 33.8178 41.9797 33.9429 40.4122C34.0644 38.8895 34.1252 38.1282 34.3495 37.493C34.8684 36.024 36.024 34.8684 37.493 34.3495C38.1282 34.1252 38.8895 34.0644 40.4122 33.9429C42.0124 33.8152 43.2287 33.3005 44.4256 32.2805Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-dark-bg mb-2 text-3xl font-bold md:text-4xl">
            Email Verification Successful
          </h2>

          <p className="text-grey-dark mb-8 text-base md:text-lg">
            Your email has been successfully verified.
          </p>

          <Button
            className="h-14 w-full rounded-xl bg-[#1A1F2C] text-xl font-medium text-white hover:bg-[#1A1F2C]/90"
            asChild
          >
            <Link href="/onboarding">Continue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-center">
      <AuthHeader
        title="Email Verification"
        subtitle={`Hello, enter the 6-digit code sent to ${email} to verify and activate your INTELL account.`}
      />

      <div className="mt-10">
        <p className="text-foreground text-sm font-medium">
          Please paste (or type) your 6-digit code
        </p>

        <div className="mt-8 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (error) setError(null);
            }}
            containerClassName="justify-center gap-2"
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={cn(
                    "h-10 w-10 rounded-lg border bg-transparent text-lg font-medium shadow-none transition-colors md:h-20 md:w-20",
                    "data-[active=true]:border-positive data-[active=true]:ring-positive/20 data-[active=true]:ring-[3px]",
                    "focus:ring-0 md:text-2xl",
                    error ? "border-red-600" : "border-[#00000037]",
                    "focus:border-primary",
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="mt-8 text-sm">
          {timeLeft > 0 ? (
            <p>
              <span className="text-slate-60">Code is valid for </span>
              <span className="text-foreground font-medium">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="font-semibold text-amber-50 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {resendMutation.isPending ? "Resending..." : "Resend Code"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-14 flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
        <Button
          size="lg"
          onClick={handleVerify}
          disabled={!isComplete || verifyMutation.isPending}
          className={cn(
            "text-md h-14 w-full rounded-[12px] font-medium transition-all md:order-2 md:text-lg",
            isComplete && !verifyMutation.isPending
              ? "bg-[#1A1F2C] text-white shadow-none hover:bg-[#1A1F2C]/90"
              : "cursor-not-allowed bg-[#1A1F2C] text-white opacity-80",
          )}
        >
          {verifyMutation.isPending ? "Verifying..." : "Confirm Email"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          asChild
          className="text-md h-14 rounded-xl border border-slate-200 bg-transparent font-medium text-slate-900 shadow-none transition-colors hover:bg-slate-50 md:order-1 md:text-lg"
        >
          <Link href="/signup">Back</Link>
        </Button>
      </div>
    </div>
  );
}
