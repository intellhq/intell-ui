"use client";

import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthResetPasswordForm } from "@/components/auth/auth-reset-password-form";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <AuthWrapper>
      <div className="mt-28 lg:mt-44">
        {!isSuccess && (
          <AuthHeader
            title="Change Your Password"
            subtitle="Create a new password for your INTELL account."
          />
        )}
        <AuthResetPasswordForm onSuccess={() => setIsSuccess(true)} />
      </div>
    </AuthWrapper>
  );
}
