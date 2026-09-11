import type { Metadata } from "next";
import { InstallerSettingsPage } from "@/components/installer/installer-pages";

export const metadata: Metadata = {
  title: "Installer Settings",
  description: "Manage installer profile and support settings.",
};

export default function SettingsPage() {
  return <InstallerSettingsPage />;
}
