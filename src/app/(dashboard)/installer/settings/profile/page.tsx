import type { Metadata } from "next";
import { InstallerProfileSettingsPage } from "@/components/installer/installer-pages";

export const metadata: Metadata = {
  title: "Installer Profile Settings",
  description: "Manage installer account profile details.",
};

export default function InstallerProfilePage() {
  return <InstallerProfileSettingsPage />;
}
