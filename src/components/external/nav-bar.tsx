"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { cn } from "@/lib/utils";
import { NAV_LINKS, VALID_PATHS } from "@/constants/navlinks";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { useCurrentUserSync } from "@/hooks/use-current-user-sync";
import { useMounted } from "@/hooks/use-mounted";
import { UserAvatar, UserDropdown } from "./nav-user-menu";
import { LogOut } from "lucide-react";

const IconMenu = ({ className }: { className?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.19922 6.99998C4.19922 6.62867 4.34672 6.27258 4.60927 6.01003C4.87182 5.74748 5.22792 5.59998 5.59922 5.59998H22.3992C22.7705 5.59998 23.1266 5.74748 23.3892 6.01003C23.6517 6.27258 23.7992 6.62867 23.7992 6.99998C23.7992 7.37128 23.6517 7.72737 23.3892 7.98992C23.1266 8.25248 22.7705 8.39998 22.3992 8.39998H5.59922C5.22792 8.39998 4.87182 8.25248 4.60927 7.98992C4.34672 7.72737 4.19922 7.37128 4.19922 6.99998ZM4.19922 14C4.19922 13.6287 4.34672 13.2726 4.60927 13.01C4.87182 12.7475 5.22792 12.6 5.59922 12.6H13.9992C14.3705 12.6 14.7266 12.7475 14.9892 13.01C15.2517 13.2726 15.3992 13.6287 15.3992 14C15.3992 14.3713 15.2517 14.7274 14.9892 14.9899C14.7266 15.2525 14.3705 15.4 13.9992 15.4H5.59922C5.22792 15.4 4.87182 15.2525 4.60927 14.9899C4.34672 14.7274 4.19922 14.3713 4.19922 14ZM4.19922 21C4.19922 20.6287 4.34672 20.2726 4.60927 20.01C4.87182 19.7475 5.22792 19.6 5.59922 19.6H22.3992C22.7705 19.6 23.1266 19.7475 23.3892 20.01C23.6517 20.2726 23.7992 20.6287 23.7992 21C23.7992 21.3713 23.6517 21.7274 23.3892 21.9899C23.1266 22.2525 22.7705 22.4 22.3992 22.4H5.59922C5.22792 22.4 4.87182 22.2525 4.60927 21.9899C4.34672 21.7274 4.19922 21.3713 4.19922 21Z"
      fill="#111827"
    />
  </svg>
);

const IconX = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Services");
  const mounted = useMounted();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuthActions();
  useCurrentUserSync({ enabled: isAuthenticated });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(() => {
      setDropdownOpen(false);
      setOpen(false);
    });
  };

  const activeLabel = useMemo(() => {
    const matchedLink = NAV_LINKS.find((link) => link.href === pathname);
    if (matchedLink) return matchedLink.label;
    if (pathname.startsWith("/services/")) return "Services";

    if (pathname === "/") return selectedLabel === "FAQ" ? "FAQ" : null;
    if (!VALID_PATHS.has(pathname)) return null;

    return null;
  }, [pathname, selectedLabel]);

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = [
        { id: "faq", label: "FAQ" },
      ];

      if (window.scrollY < 200) {
        setSelectedLabel("");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            setSelectedLabel((prev) =>
              prev !== section.label ? section.label : prev,
            );
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <nav className="mx-auto flex h-16 max-w-350 items-center justify-between px-4 lg:h-20 lg:px-8">
        <Logo size="md" />

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => {
            const isActive = activeLabel === l.label;

            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setSelectedLabel(l.label)}
                  className={cn(
                    "text-sm transition-colors duration-200",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/50 hover:text-foreground font-medium",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {mounted && isAuthenticated && user ? (
            <UserDropdown
              user={user}
              isOpen={dropdownOpen}
              onToggle={() => setDropdownOpen(!dropdownOpen)}
              onLogout={handleLogout}
              dropdownRef={dropdownRef}
            />
          ) : (
            <>
              <Button
                variant="outline"
                className="border-foreground/20 text-foreground hover:bg-background/90 h-10 rounded-md px-6 font-medium"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>

              <Button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 rounded-md px-5 font-medium"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground grid h-10 w-10 place-items-center lg:hidden"
        >
          {open ? (
            <IconX className="h-6 w-6" />
          ) : (
            <IconMenu className="h-6 w-6" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "border-border bg-background overflow-hidden border-t transition-all duration-300 lg:hidden",
          open ? "max-h-150" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-6 px-4 py-6">
          <ul className="flex flex-col items-center gap-2 text-center">
            {NAV_LINKS.map((l) => (
              <li key={l.label} className="w-full">
                <Link
                  href={l.href}
                  onClick={() => {
                    setSelectedLabel(l.label);
                    setOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-lg px-3 py-3 text-sm transition-colors",
                    activeLabel === l.label
                      ? "text-foreground bg-muted/50 font-semibold"
                      : "text-foreground/60 hover:text-foreground font-medium",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {mounted && isAuthenticated && user ? (
            <div className="flex flex-col items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex w-full max-w-xs flex-col items-center gap-3 rounded-lg bg-muted/30 px-4 py-4"
              >
                <UserAvatar user={user} className="h-12 w-12" />
                <div className="flex flex-col items-center text-center">
                  <span className="text-foreground text-sm font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-foreground/60 text-xs">{user.email}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-foreground/20 text-foreground hover:bg-muted/30 h-11 w-full rounded-md font-medium justify-center"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/login">Sign In</Link>
              </Button>

              <Button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 w-full rounded-md font-medium justify-center"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
