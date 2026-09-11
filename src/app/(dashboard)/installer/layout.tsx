"use client";

import { InstallerLayout } from "@/components/installer/installer-layout";

export default function InstallerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstallerLayout>
      {children}
    </InstallerLayout>
  );
}
