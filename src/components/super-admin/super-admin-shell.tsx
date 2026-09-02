"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPER_ADMIN_NAV_ITEMS } from "@/constants/super-admin";
import { cn } from "@/lib/utils";
import { useSuperAdminAuthStore } from "@/stores/super-admin-auth-store";

export function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useSuperAdminAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await fetch("/api/super-admin/session", { method: "DELETE" });
    logout();
    router.replace("/super-admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 px-4 lg:px-6">
          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-5 lg:flex">
              {SUPER_ADMIN_NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative py-5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                      isActive && "text-foreground",
                    )}
                  >
                    {item.label}
                    {isActive ? (
                      <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-secondary" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 min-w-36 justify-between rounded-lg border-border bg-card text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-foreground" />
                    Admin
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleLogout} className="gap-2">
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t border-border bg-card lg:hidden">
          <nav className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-4 py-2">
            {SUPER_ADMIN_NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground",
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 lg:px-6">
        {children}
      </main>
    </div>
  );
}
