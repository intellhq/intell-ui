"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Mail, MapPin, MessageSquareText, Phone, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY_CONTACT, SOCIAL_LINKS } from "@/constants/marketing";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardFeedbackPage() {
  const user = useAuthStore((state) => state.user);
  const [category, setCategory] = useState("Product feedback");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Feedback submitted successfully.");
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Feedback & Support" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">
          Feedback & Support
        </h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Share product feedback, monitoring issues, or support requests with
          the INTELL team.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-gray-700">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-dark-text">
              Account Information
            </h2>
            <p className="mt-0.5 text-sm text-[#5D5C5D]">
              Your account details are attached automatically and cannot be
              changed from this form.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Name" value={displayName || "Not available"} />
          <ReadOnlyField label="Email" value={user?.email ?? "Not available"} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-base font-semibold text-dark-text">
              Submit Feedback
            </h2>
            <p className="mt-0.5 text-sm text-[#5D5C5D]">
              Give the team enough context to review the issue or suggestion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-dark-text">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 rounded-lg border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product feedback">
                    Product feedback
                  </SelectItem>
                  <SelectItem value="Inverter monitoring issue">
                    Inverter monitoring issue
                  </SelectItem>
                  <SelectItem value="AI assistant response">
                    AI assistant response
                  </SelectItem>
                  <SelectItem value="Billing or savings report">
                    Billing or savings report
                  </SelectItem>
                  <SelectItem value="Installer support">
                    Installer support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-dark-text">
                Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-14 rounded-lg border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <Label
              htmlFor="feedback-message"
              className="text-sm font-medium text-dark-text"
            >
              Message
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe what happened, what you expected, or what INTELL should improve."
              className="min-h-52 resize-none rounded-lg border-input bg-background px-3 py-3 text-sm"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-text">
            Contact INTELL
          </h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            For urgent support, contact the team directly.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ContactLink
              icon={Mail}
              label="Email"
              value={COMPANY_CONTACT.email}
              href={`mailto:${COMPANY_CONTACT.email}`}
            />
            <ContactLink
              icon={Phone}
              label="Phone"
              value={COMPANY_CONTACT.phone}
              href={`tel:${COMPANY_CONTACT.phone.replace(/\s/g, "")}`}
            />
            <ContactLink
              icon={MapPin}
              label="Location"
              value={COMPANY_CONTACT.location}
            />
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="size-5"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-dark-text">{label}</Label>
      <Input
        value={value}
        disabled
        readOnly
        className="h-14 w-full rounded-lg border-input bg-background px-3 text-sm outline-none disabled:cursor-default disabled:opacity-60"
      />
    </div>
  );
}

function ContactLink({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
      <Icon className="h-4 w-4 shrink-0 text-secondary" />
      <div className="min-w-0">
        <p className="text-xs text-[#5D5C5D]">{label}</p>
        <p className="truncate text-sm font-medium text-dark-text">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
