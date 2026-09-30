"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useSuperAdminFeedbackDetail,
  useSuperAdminInstaller,
  useSuperAdminLead,
  useSuperAdminUser,
  useUpdateFeedback,
  useUpdateInstallerStatus,
  useUpdateLeadStatus,
} from "@/hooks/use-super-admin-queries";
import { cn } from "@/lib/utils";
import type {
  FeedbackPriority,
  FeedbackRecord,
  FeedbackStatus,
  InstallerStatus,
  OnboardingLeadStatus,
  SuperAdminUser,
} from "@/types/super-admin-api";

function formatDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function fullName(user: Pick<SuperAdminUser, "firstName" | "lastName">) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unnamed user";
}

function userStatus(user: SuperAdminUser) {
  if (user.isActive === false) return "inactive";
  if (user.emailVerified === false) return "pending";
  return "active";
}

function statusLabel(value?: string | null) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ");
}

function statusClass(value?: string | null) {
  const status = value?.toLowerCase();
  if (["active", "resolved", "converted", "qualified"].includes(status ?? "")) {
    return "bg-chart-battery text-success-alt";
  }
  if (["open", "new", "pending"].includes(status ?? "")) {
    return "bg-muted text-muted-foreground";
  }
  if (["in_progress", "contacted"].includes(status ?? "")) {
    return "bg-amber-30/20 text-amber-50";
  }
  if (["suspended", "closed", "inactive"].includes(status ?? "")) {
    return "bg-destructive/10 text-destructive";
  }
  return "bg-secondary/10 text-secondary";
}

function StatusBadge({ value }: { value?: string | null }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        statusClass(value),
      )}
    >
      {statusLabel(value)}
    </span>
  );
}

function PriorityBadge({ value }: { value?: FeedbackPriority }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        value === "high"
          ? "bg-destructive/10 text-destructive"
          : value === "medium"
            ? "bg-blue-500/10 text-blue-600"
            : "bg-muted text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

function SectionSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <p className="font-semibold text-destructive">Unable to load this record.</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function DetailShell({
  backHref,
  title,
  children,
}: {
  backHref: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 h-9 px-3">
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      {children}
    </div>
  );
}

function DetailCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-6">{children}</div>;
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="max-w-[60%] text-right text-sm font-semibold text-foreground">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export function SuperAdminDetailPage({ id }: { id: string }) {
  const query = useSuperAdminUser(id);

  if (query.isLoading) return <SectionSkeleton />;
  if (query.isError || !query.data) return <ErrorState onRetry={() => query.refetch()} />;

  const user = query.data;

  return (
    <DetailShell backHref="/super-admin/users" title="User details">
      <DetailCard>
        <h2 className="text-xl font-bold text-foreground">{fullName(user)}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        <div className="mt-3">
          <StatusBadge value={userStatus(user)} />
        </div>
      </DetailCard>
      <DetailCard>
        <InfoItem label="Role" value={user.role} />
        <InfoItem label="Phone" value={user.phoneNumber} />
        <InfoItem label="State" value={user.settings?.state} />
        <InfoItem label="City" value={user.settings?.city} />
        <InfoItem label="Inverter brand" value={user.inverterBrand} />
        <InfoItem label="Last login" value={formatDate(user.lastLoginAt)} />
        <InfoItem label="Joined" value={formatDate(user.createdAt)} />
      </DetailCard>
    </DetailShell>
  );
}

export function SuperAdminLeadDetailPage({ id }: { id: string }) {
  const query = useSuperAdminLead(id);
  const update = useUpdateLeadStatus(id);

  if (query.isLoading) return <SectionSkeleton />;
  if (query.isError || !query.data) return <ErrorState onRetry={() => query.refetch()} />;

  const lead = query.data;

  return (
    <DetailShell backHref="/super-admin/onboarding-leads" title="Lead details">
      <DetailCard>
        <h2 className="text-xl font-bold text-foreground">
          {lead.firstName} {lead.lastName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{lead.email}</p>
        <div className="mt-3">
          <StatusBadge value={lead.status} />
        </div>
      </DetailCard>
      <DetailCard>
        <InfoItem label="Phone" value={lead.phoneNumber} />
        <InfoItem label="State" value={lead.state} />
        <InfoItem label="Inverter type" value={lead.inverterType} />
        <InfoItem label="Interest" value={statusLabel(lead.interest)} />
        <InfoItem label="Source" value={lead.source} />
        <InfoItem label="Submitted" value={formatDate(lead.createdAt)} />
      </DetailCard>
      <StatusUpdateCard<OnboardingLeadStatus>
        value={lead.status}
        options={["new", "contacted", "qualified", "converted", "closed"]}
        isPending={update.isPending}
        onSubmit={(status) => update.mutate(status)}
      />
      <DetailCard>
        <h2 className="text-base font-semibold text-foreground">Message</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {lead.message || "No message was submitted."}
        </p>
      </DetailCard>
    </DetailShell>
  );
}

export function SuperAdminInstallerDetailPage({ id }: { id: string }) {
  const query = useSuperAdminInstaller(id);
  const update = useUpdateInstallerStatus(id);

  if (query.isLoading) return <SectionSkeleton />;
  if (query.isError || !query.data) return <ErrorState onRetry={() => query.refetch()} />;

  const installer = query.data;

  return (
    <DetailShell backHref="/super-admin/installers" title="Installer details">
      <DetailCard>
        <h2 className="text-xl font-bold text-foreground">{installer.contactName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{installer.email}</p>
        <div className="mt-3">
          <StatusBadge value={installer.status} />
        </div>
      </DetailCard>
      <DetailCard>
        <InfoItem label="Type" value={installer.type} />
        <InfoItem label="Company" value={installer.companyName} />
        <InfoItem label="Phone" value={installer.phoneNumber} />
        <InfoItem label="State" value={installer.state} />
        <InfoItem label="Region" value={installer.region} />
        <InfoItem label="Supported brands" value={installer.supportedBrands?.join(", ")} />
        <InfoItem label="Assignments" value={`${installer.assignments?.length ?? 0}`} />
        <InfoItem label="Joined" value={formatDate(installer.createdAt)} />
      </DetailCard>
      <StatusUpdateCard<InstallerStatus>
        value={installer.status}
        options={["pending", "active", "suspended"]}
        isPending={update.isPending}
        onSubmit={(status) => update.mutate(status)}
      />
    </DetailShell>
  );
}

export function SuperAdminFeedbackDetailPage({ id }: { id: string }) {
  const query = useSuperAdminFeedbackDetail(id);
  const update = useUpdateFeedback(id);

  if (query.isLoading) return <SectionSkeleton />;
  if (query.isError || !query.data) return <ErrorState onRetry={() => query.refetch()} />;

  const feedback = query.data;

  return (
    <DetailShell backHref="/super-admin/feedback" title="Feedback details">
      <DetailCard>
        <h2 className="text-xl font-bold text-foreground">
          {feedback.name ?? "INTELL user"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{feedback.email}</p>
        <div className="mt-3 flex gap-2">
          <StatusBadge value={feedback.status} />
          <PriorityBadge value={feedback.priority} />
        </div>
      </DetailCard>
      <DetailCard>
        <InfoItem label="Category" value={feedback.category} />
        <InfoItem label="Submitted" value={formatDate(feedback.createdAt)} />
        <InfoItem label="Updated" value={formatDate(feedback.updatedAt)} />
        <InfoItem label="Admin note" value={feedback.adminNote} />
      </DetailCard>
      <FeedbackUpdateCard
        feedback={feedback}
        isPending={update.isPending}
        onSubmit={(data) => update.mutate(data)}
      />
      <DetailCard>
        <h2 className="text-base font-semibold text-foreground">
          Feedback message
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {feedback.message}
        </p>
      </DetailCard>
    </DetailShell>
  );
}

function StatusUpdateCard<TStatus extends string>({
  value,
  options,
  isPending,
  onSubmit,
}: {
  value: TStatus;
  options: TStatus[];
  isPending: boolean;
  onSubmit: (status: TStatus) => void;
}) {
  const [status, setStatus] = useState<TStatus>(value);
  return (
    <DetailCard>
      <h2 className="text-base font-semibold text-foreground">Status update</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(next) => setStatus(next as TStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {statusLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={isPending}
          onClick={() => onSubmit(status)}
          className="bg-secondary text-white"
        >
          {isPending ? "Updating..." : "Update status"}
        </Button>
      </div>
    </DetailCard>
  );
}

function FeedbackUpdateCard({
  feedback,
  isPending,
  onSubmit,
}: {
  feedback: FeedbackRecord;
  isPending: boolean;
  onSubmit: (data: {
    status: FeedbackStatus;
    priority: FeedbackPriority;
    adminNote?: string;
  }) => void;
}) {
  const [status, setStatus] = useState<FeedbackStatus>(feedback.status);
  const [priority, setPriority] = useState<FeedbackPriority>(feedback.priority);
  const [adminNote, setAdminNote] = useState(feedback.adminNote ?? "");

  return (
    <DetailCard>
      <h2 className="text-base font-semibold text-foreground">Review update</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SelectGroup
          label="Status"
          value={status}
          options={["open", "in_progress", "resolved"]}
          onChange={(value) => setStatus(value as FeedbackStatus)}
        />
        <SelectGroup
          label="Priority"
          value={priority}
          options={["low", "medium", "high"]}
          onChange={(value) => setPriority(value as FeedbackPriority)}
        />
      </div>
      <div className="mt-4 space-y-2">
        <Label>Admin note</Label>
        <Textarea
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
        />
      </div>
      <Button
        disabled={isPending}
        onClick={() => onSubmit({ status, priority, adminNote })}
        className="mt-4 bg-secondary text-white"
      >
        {isPending ? "Updating..." : "Update feedback"}
      </Button>
    </DetailCard>
  );
}

function SelectGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {statusLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
