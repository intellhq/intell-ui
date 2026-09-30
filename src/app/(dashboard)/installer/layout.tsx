"use client";

import { InstallerLayout } from "@/components/installer/installer-layout";
import { InstallerAuthGuard } from "@/components/installer/installer-auth-guard";

export default function InstallerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstallerAuthGuard>
      <InstallerLayout>{children}</InstallerLayout>
    </InstallerAuthGuard>
  );
}
