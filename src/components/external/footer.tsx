"use client";

import Link from "next/link";
import { Logo } from "../ui/logo";
import { useState } from "react";
import { toast } from "sonner";
import { WaitlistService } from "@/services/waitlist-service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FooterLink = {
  name: string;
  href?: string;
};

const footerLinks: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Onboard", href: "/onboard" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blogs", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms & Conditions", href: "/terms-and-conditions" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWaitlist = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await WaitlistService.joinWaitlist(normalizedEmail);
      toast.success("Thanks for your interest in INTELL.");
      setEmail("");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Failed to submit your email. Please try again.";
      toast.error(message, {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="flex w-full justify-center bg-[#1A1F2C] text-white">
      <div className="container mx-auto flex w-full max-w-[1400px] flex-col px-6 py-16 md:px-12">
        <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:gap-24">
          {/* Left Section */}
          <div className="flex flex-col space-y-8 lg:max-w-md">
            <div className="flex flex-col space-y-6">
              <Logo textClassName="text-white" />
              <p className="text-base leading-relaxed text-[#E6E6E6]">
                AI-powered energy management & optimization platform for
                Nigerian SMEs and African businesses. Nigeria has the energy
                problem. We have the intelligence solution.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-base font-medium text-white">
                Enter your email to receive INTELL updates.
              </p>
              <div className="flex max-w-md items-center gap-2 rounded-xl bg-white p-1.5 focus-within:ring-2 focus-within:ring-[#F5A623]">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent px-4 py-2 text-[#1A1F2C] outline-none placeholder:text-gray-400 disabled:opacity-50 border-none"
                  onKeyDown={(e) => e.key === "Enter" && handleJoinWaitlist()}
                />
                <Button
                  onClick={handleJoinWaitlist}
                  disabled={isLoading}
                  className="rounded-lg bg-[#F5A623] px-6 py-2 font-bold text-[#1A1F2C] transition-colors hover:bg-[#E59513] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section (Links) */}
          <div className="grid flex-1 grid-cols-1 gap-10 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-lg font-bold">{section.title}</h3>
                <ul className="space-y-4 text-base text-[#E6E6E6]">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href ?? "#"}
                        className="transition-colors hover:text-[#F5A623]"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex w-full flex-col items-center justify-between border-t border-gray-700 pt-8 md:flex-row">
          <p className="mb-6 text-sm text-[#e6e6e67b] md:mb-0">
            Copyright © {new Date().getFullYear()} INTELL | All Rights
            Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
