import Link from "next/link";
import {
  Eye,
  UserRound,
  Wrench,
  Bell,
  Users,
  ShieldCheck,
  RefreshCw,
  MessageSquareText,
} from "lucide-react";

const SETTING_CARDS = [
  {
    icon: UserRound,
    title: "Account & Profile",
    description:
      "Manage your enterprise identity, update localisation preference, and configure multi-factor authentication protocols.",
    href: "/dashboard/settings/profile",
  },
  {
    icon: Wrench,
    title: "System & Device",
    description:
      "Manage your enterprise identity, update localisation preference, and configure multi-factor authentication protocols.", // Matched to UI screenshot
    href: "/dashboard/settings/system",
  },
  {
    icon: Users,
    title: "Team & Access",
    description:
      "Control organisational hierarchies by assigning specific user roles, permissions, and administrative access levels.",
    href: "/dashboard/settings/team",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Control organisational hierarchies by assigning specific user roles, permissions, and administrative access levels.", // Matched to UI screenshot
    href: "/dashboard/settings/notifications",
  },
  {
    icon: MessageSquareText,
    title: "Feedback & Support",
    description:
      "Share product feedback, report inverter monitoring issues, or contact the INTELL support team.",
    href: "/dashboard/settings/feedback",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 sm:p-0">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">Settings Overview</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Manage your INTELL environment, team permissions and system health
        </p>
      </div>

      {/* System Status Pill - Mobile Only */}
      <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3 text-sm sm:hidden">
        <div className="flex items-center gap-2 font-medium text-[#10B981]">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" />
          All systems are working fine
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <span>2 min ago</span>
          <RefreshCw className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Security Audit Banner */}
      <div className="rounded-xl border border-border bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            {/* Shield Icon Container */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-gray-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-dark-text">Security Audit</h2>
              <p className="mt-0.5 text-sm text-[#5D5C5D]">
                Last audit completed 2 hours ago. No anomalies detected.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/settings/review-logs"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1E293B] sm:w-auto"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Review Logs
          </Link>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SETTING_CARDS.map((card) => {
          const Icon = card.icon;
          const inner = (
            <div className="flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-border/80">
              {/* Rounded-xl changes it from a circle to a soft square */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6]">
                <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-dark-text">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5D5C5D]">
                {card.description}
              </p>
            </div>
          );

          return (
            <Link
              key={card.title}
              href={card.href}
              className="block block h-full"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
