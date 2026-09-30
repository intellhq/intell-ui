"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
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
import { SUPER_ADMIN_COMMUNICATION_ROWS } from "@/constants/super-admin";
import { cn } from "@/lib/utils";
import type { SuperAdminTableRow } from "@/types/super-admin";

function statusLabel(value?: string | null) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ");
}

function statusClass(value?: string | null) {
  const status = value?.toLowerCase();
  if (["delivered", "active", "resolved"].includes(status ?? "")) {
    return "bg-chart-battery text-success-alt";
  }
  if (["draft", "pending", "open"].includes(status ?? "")) {
    return "bg-muted text-muted-foreground";
  }
  if (["scheduled", "qualified"].includes(status ?? "")) {
    return "bg-secondary/10 text-secondary";
  }
  if (["failed"].includes(status ?? "")) {
    return "bg-destructive/10 text-destructive";
  }
  return "bg-amber-30/20 text-amber-50";
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

function PageHeader({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}

function ListPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} />
      {children}
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

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
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
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SuperAdminCommunicationsPage() {
  const rows = SUPER_ADMIN_COMMUNICATION_ROWS;

  return (
    <ListPageShell title="Communications">
      <div className="flex justify-end">
        <Button asChild className="bg-secondary text-white">
          <Link href="/super-admin/communications/new">
            <Plus className="size-4" />
            New Broadcast
          </Link>
        </Button>
      </div>
      <DataTable
        columns={["Subject", "Audience", "Status", "CTA", "Date"]}
        rows={rows.map((row) => (
          <tr key={row.id} className="border-t border-border hover:bg-muted/40">
            <td className="px-5 py-4">
              <Link
                href={`/super-admin/communications/${row.id}`}
                className="font-semibold text-foreground"
              >
                {row.name}
              </Link>
              <p className="max-w-md truncate text-xs text-muted-foreground">
                {row.content}
              </p>
            </td>
            <td className="px-5 py-4 text-muted-foreground">{row.audience}</td>
            <td className="px-5 py-4">
              <StatusBadge value={row.status} />
            </td>
            <td className="px-5 py-4 text-muted-foreground">
              {row.actionLabel}
            </td>
            <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
          </tr>
        ))}
      />
    </ListPageShell>
  );
}

export function SuperAdminCommunicationDetailPage({
  row,
}: {
  row: SuperAdminTableRow;
}) {
  return (
    <DetailShell backHref="/super-admin/communications" title={row.name}>
      <DetailCard>
        <InfoItem label="Audience" value={row.audience} />
        <InfoItem label="Status" value={row.status} />
        <InfoItem label="CTA label" value={row.actionLabel} />
        <InfoItem label="CTA URL" value={row.actionUrl} />
        <InfoItem label="Date" value={row.date} />
      </DetailCard>
      <DetailCard>
        <h2 className="text-base font-semibold text-foreground">Message body</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {row.body || row.content}
        </p>
      </DetailCard>
    </DetailShell>
  );
}

export function SuperAdminNewCommunicationPage() {
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("Pilot users");
  const [ctaType, setCtaType] = useState("Open dashboard");

  return (
    <DetailShell backHref="/super-admin/communications" title="New broadcast">
      <form className="space-y-5 rounded-xl border border-border bg-card p-6">
        <InputField label="Subject" value={subject} onChange={setSubject} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectGroup
            label="Audience"
            value={audience}
            options={[
              "Pilot users",
              "Installer partners",
              "Onboarding leads",
              "All users",
            ]}
            onChange={setAudience}
          />
          <SelectGroup
            label="Action button"
            value={ctaType}
            options={[
              "Open dashboard",
              "Join waitlist",
              "Follow social media",
              "Read update",
            ]}
            onChange={setCtaType}
          />
        </div>
        <Textarea
          placeholder="Write the full broadcast message."
          className="min-h-64"
        />
        <Button className="bg-secondary text-white">Save Broadcast</Button>
      </form>
    </DetailShell>
  );
}
