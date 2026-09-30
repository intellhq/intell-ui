"use client";

import Link from "next/link";
import { MessageSquareText, Send, Upload, UserRound } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { installerProfile } from "@/constants/installer";
import { useAuthStore } from "@/stores/auth-store";
import {
  InstallerCrumbs,
  ReadOnlyField,
} from "@/components/installer/installer-shared";

export function InstallerSettingsPage() {
  const settingCards = [
    {
      icon: UserRound,
      title: "Account & Profile",
      description:
        "Manage your installer identity, contact details, company information and service coverage.",
      href: "/installer/settings/profile",
    },
    {
      icon: MessageSquareText,
      title: "Feedback & Support",
      description:
        "Share installer workflow feedback, report access issues, or contact the INTELL support team.",
      href: "/installer/settings/feedback",
    },
  ];

  return (
    <div className="space-y-6 sm:p-0">
      <InstallerCrumbs
        items={[{ label: "Installer", href: "/installer" }, { label: "Settings" }]}
      />

      <div>
        <h1 className="text-2xl font-bold text-dark-text">Settings Overview</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Manage your installer profile, access, and support preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {settingCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="block h-full">
              <div className="flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-border/80">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6]">
                  <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5D5C5D]">
                  {card.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function InstallerProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const displayName =
    user && `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : installerProfile.name;

  return (
    <div className="space-y-4">
      <InstallerCrumbs
        items={[
          { label: "Installer", href: "/installer" },
          { label: "Settings", href: "/installer/settings" },
          { label: "Profile" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">Profile Settings</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Installer identity and contact details attached to customer dashboards.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-dark-text">Profile Photo</h2>
        <p className="mt-0.5 text-sm text-[#5D5C5D]">PNG or JPG, up to 2MB.</p>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#D1D5DB]">
            <span className="text-xl font-semibold text-[#374151]">
              {displayName
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-dark-text transition-colors hover:bg-muted"
          >
            <Upload className="h-4 w-4" />
            Upload photo
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-text">
            Installer Profile
          </h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            These details help customers identify who has access to their dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Name" value={displayName} />
          <ReadOnlyField label="Email" value={user?.email ?? installerProfile.email} />
          <ReadOnlyField label="Phone" value={installerProfile.phone} />
          <ReadOnlyField label="Company" value={installerProfile.company} />
          <ReadOnlyField label="Role" value={installerProfile.role} />
          <ReadOnlyField label="Installer type" value={installerProfile.installerType} />
          <ReadOnlyField label="Service area" value={installerProfile.serviceArea} />
        </div>
      </div>
    </div>
  );
}

export function InstallerFeedbackPage() {
  const user = useAuthStore((state) => state.user);
  const [category, setCategory] = useState("Customer dashboard access");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const displayName = useMemo(() => {
    const authName =
      user && `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return authName || installerProfile.name;
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Installer feedback submitted successfully.");
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <InstallerCrumbs
        items={[
          { label: "Installer", href: "/installer" },
          { label: "Settings", href: "/installer/settings" },
          { label: "Feedback & Support" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">
          Feedback & Support
        </h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Send installer workflow feedback, access issues, or monitoring support
          requests to INTELL.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-text">
            Account Information
          </h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            Your installer account details are attached automatically.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Name" value={displayName} />
          <ReadOnlyField label="Email" value={user?.email ?? installerProfile.email} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-base font-semibold text-dark-text">
              Submit Installer Feedback
            </h2>
            <p className="mt-0.5 text-sm text-[#5D5C5D]">
              Add enough context for the team to understand the customer,
              dashboard, or inverter issue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InstallerSelect label="Category" value={category} onChange={setCategory} options={["Customer dashboard access", "Inverter monitoring issue", "Alert visibility", "Partner onboarding"]} />
            <InstallerSelect label="Priority" value={priority} onChange={setPriority} options={["Low", "Medium", "High"]} />
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="installer-feedback-message" className="text-sm font-medium text-dark-text">
              Message
            </Label>
            <Textarea
              id="installer-feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe the customer dashboard, inverter, access, or alert issue."
              className="min-h-52 resize-none rounded-lg border-input bg-background px-3 py-3 text-sm"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 sm:w-auto">
              <Send className="h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InstallerSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-dark-text">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-14 rounded-lg border-input bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
