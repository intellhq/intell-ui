"use client";

import { Suspense } from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { SuperAdminLoginForm } from "@/components/super-admin/super-admin-login-form";

export default function SuperAdminLoginPage() {
  return (
    <AuthWrapper>
      <div className="mt-29 lg:mt-44">
        <AuthHeader
          title="Log in as Super Admin"
          subtitle="Access Energy IQ operations, installer monitoring, feedback, support, and launch communications."
        />
        <Suspense fallback={null}>
          <SuperAdminLoginForm />
        </Suspense>
      </div>
    </AuthWrapper>
  );
}
