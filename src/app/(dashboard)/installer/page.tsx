import type { Metadata } from "next";
import { InstallerOverviewPage } from "@/components/installer/installer-pages";

export const metadata: Metadata = {
  title: "Installer Dashboard",
  description:
    "View customer dashboards and inverter alerts assigned to an INTELL installer.",
};

export default function InstallerPage() {
  return <InstallerOverviewPage />;
}
