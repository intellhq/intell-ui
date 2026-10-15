"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  AlertTriangle,
  FileText,
  Headphones,
  Settings,
  X,
  LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useUIStore } from "@/stores/ui-stores";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  label,
  icon: Icon,
  href,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex h-10 w-52 items-center rounded px-3 py-2 font-sans text-[16px] leading-none font-medium transition-colors",
        isActive
          ? "bg-nav-active-bg text-nav-active-text"
          : "bg-sidebar text-secondary hover:bg-muted/50",
      )}
    >
      <Icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Cost and Savings",
    icon: Landmark,
    href: "/dashboard/cost-and-savings",
  },
  { label: "Alert", icon: AlertTriangle, href: "/dashboard/alerts" },
  { label: "Reports", icon: FileText, href: "/dashboard/reports" },
  { label: "AI Assistant", icon: Headphones, href: "/dashboard/ai-assistant" },
];

export function DashboardSidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "bg-sidebar border-border-disabled fixed top-0 left-0 z-50 flex h-screen flex-col gap-12 border-r px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:z-40 lg:w-60 lg:translate-x-0",
          isSidebarOpen ? "w-64 translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        {/* Header/Logo Section */}
        <div className="sm:mt-5 mr-0 flex h-10 items-center justify-between">
          <div className="w-47">
            <Logo size="lg" href="/" />
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeSidebar}
            className="text-secondary hover:bg-muted flex translate-x-2 items-center justify-center rounded-full p-2 lg:hidden"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isExactMatch = pathname === item.href;
            const isSubRoute =
              item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`);

            return (
              <SidebarItem
                key={item.href}
                label={item.label}
                icon={item.icon}
                href={item.href}
                isActive={isExactMatch || isSubRoute}
                onClick={closeSidebar}
              />
            );
          })}
        </nav>

        {/* Account / Settings Section */}
        <div className="mt-6 flex w-52 flex-col">
          <span className="text-muted-foreground mb-2 h-5.25 w-15.75 text-xs font-semibold tracking-wider uppercase">
            Account
          </span>

          <SidebarItem
            label="Settings"
            icon={Settings}
            href="/dashboard/settings"
            isActive={pathname.startsWith("/dashboard/settings")}
            onClick={closeSidebar}
          />
        </div>
      </aside>
    </>
  );
}
