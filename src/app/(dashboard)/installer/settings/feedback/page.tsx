import type { Metadata } from "next";
import { InstallerFeedbackPage } from "@/components/installer/installer-pages";

export const metadata: Metadata = {
  title: "Installer Feedback & Support",
  description: "Submit installer dashboard feedback and support requests.",
};

export default function InstallerFeedbackSettingsPage() {
  return <InstallerFeedbackPage />;
}
