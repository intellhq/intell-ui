"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { useUIStore } from "@/stores/ui-stores";
import { cn } from "@/lib/utils";
import { installerProfile } from "@/constants/installer";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/installer" },
  { label: "Settings", icon: Settings, href: "/installer/settings" },
];

function SidebarItem({
  label,
  icon: Icon,
  href,
  isActive,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  onClick: () => void;
}) {
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
}

function InstallerSidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
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
        <div className="mt-5 mr-0 ml-4 flex h-10 items-center justify-between">
          <div className="w-47">
            <Logo size="md" href="/installer" />
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

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/installer"
                ? pathname === "/installer" ||
                  (pathname.startsWith("/installer/") &&
                    !pathname.startsWith("/installer/settings"))
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <SidebarItem
                key={item.href}
                label={item.label}
                icon={item.icon}
                href={item.href}
                isActive={isActive}
                onClick={closeSidebar}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function InstallerHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificationsMenu = notificationsOpen ? (
    <div className="absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-white p-4 shadow-lg">
      <p className="text-sm font-semibold text-foreground">
        Installer notifications
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        No new installer updates.
      </p>
    </div>
  ) : null;

  const profileMenu = dropdownOpen ? (
    <div className="border-border bg-background absolute right-0 top-full mt-2 w-48 rounded-lg border py-2 shadow-lg">
      <div className="border-b border-border px-4 pb-2">
        <p className="truncate text-sm font-semibold text-foreground">
          {installerProfile.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {installerProfile.email}
        </p>
      </div>
      <Link
        href="/installer/settings/profile"
        onClick={() => setDropdownOpen(false)}
        className="text-foreground/70 hover:text-foreground hover:bg-muted/50 flex items-center gap-2 px-4 py-2 text-sm transition-colors"
      >
        <Settings className="h-4 w-4" />
        Profile Settings
      </Link>
    </div>
  ) : null;

  const profileButton = (
    <button
      type="button"
      onClick={() => setDropdownOpen((open) => !open)}
      className="flex items-center gap-3 focus:outline-none cursor-pointer"
    >
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-[16px]">
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <UserRound className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <ChevronDown
        className={cn(
          "text-secondary h-4 w-4 transition-transform duration-200",
          dropdownOpen && "rotate-180",
        )}
      />
    </button>
  );

  return (
    <header className="bg-card lg:border-border-disabled sticky top-0 z-30 flex h-16 w-full justify-between lg:h-17.25 lg:items-center lg:border-b">
      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          title="Open navigation menu"
          className="mt-4.5 mb-4.5 ml-6"
        >
          <Menu className="text-secondary h-7 w-7" />
        </button>
      </div>

      <div className="flex-1 lg:hidden" />

      <div className="flex items-center lg:hidden" ref={dropdownRef}>
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="View notifications"
            title="View notifications"
            className="flex items-center justify-center cursor-pointer"
          >
            <Bell className="text-secondary h-5 w-5" strokeWidth={1.2} />
          </button>
          {notificationsMenu}
        </div>

        <div className="relative mt-4 mr-6 mb-4">
          {profileButton}
          {profileMenu}
        </div>
      </div>

      <div className="hidden items-center gap-6 pr-6 lg:flex lg:ml-auto">
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="View notifications"
            title="View notifications"
            className="flex items-center justify-center cursor-pointer"
          >
            <Bell className="text-secondary h-5 w-5" strokeWidth={1.2} />
          </button>
          {notificationsMenu}
        </div>

        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {profileButton}
          {profileMenu}
        </div>
      </div>
    </header>
  );
}

export function InstallerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen max-w-full">
      <InstallerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <InstallerHeader />
        <main className="bg-background mx-auto w-full max-w-7xl flex-1 overflow-auto px-6 py-6 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
