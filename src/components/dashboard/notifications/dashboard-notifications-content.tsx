"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Inbox,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { notificationsService } from "@/services/notifications-service";
import type { NotificationItem } from "@/types/notifications";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDeliveryLabel(status: NotificationItem["inAppDeliveryStatus"]) {
  if (status === "SUCCESSFUL") return "Delivered";
  if (status === "FAILED") return "Failed";
  if (status === "PROCESSING") return "Processing";
  return "Pending";
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Bell;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#F3F4F6]">
        <Icon className="size-4.5 text-[#111827]" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function NotificationRow({
  notification,
  onRead,
  isMutating,
}: {
  notification: NotificationItem;
  onRead: () => void;
  isMutating: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onRead}
      disabled={notification.isRead || isMutating}
      className={cn(
        "flex w-full flex-col gap-4 border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 sm:px-6",
        !notification.isRead && "bg-muted/20",
        notification.isRead ? "hover:bg-muted/30" : "cursor-pointer hover:bg-muted/40",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6]">
          {notification.isRead ? (
            <ShieldCheck className="size-4.5 text-[#111827]" />
          ) : (
            <Bell className="size-4.5 text-[#111827]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p
                className={cn(
                  "text-sm leading-6 text-foreground",
                  !notification.isRead && "font-semibold",
                )}
              >
                {notification.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {notification.subtitle || notification.textContent || "System notification"}
              </p>
            </div>
            {!notification.isRead ? (
              <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTimestamp(notification.createdAt)}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{getDeliveryLabel(notification.inAppDeliveryStatus)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function NotificationSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:px-6"
        >
          <div className="size-10 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardNotificationsContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const queryClient = useQueryClient();

  const allNotificationsQuery = useQuery({
    queryKey: ["notifications-page", "all"],
    queryFn: () => notificationsService.getNotifications(1, 20),
    retry: false,
  });

  const unreadNotificationsQuery = useQuery({
    queryKey: ["notifications-page", "unread"],
    queryFn: () => notificationsService.getUnreadNotifications(1, 20),
    retry: false,
  });

  const activeQuery =
    filter === "unread" ? unreadNotificationsQuery : allNotificationsQuery;

  const notifications = activeQuery.data?.payload ?? [];
  const visibleUnreadNotifications = notifications.filter((item) => !item.isRead);
  const totalNotifications =
    allNotificationsQuery.data?.total ?? notifications.length;
  const unreadNotifications =
    unreadNotificationsQuery.data?.total ??
    notifications.filter((item) => !item.isRead).length;
  const latestTimestamp =
    allNotificationsQuery.data?.payload?.length
      ? formatTimestamp(allNotificationsQuery.data.payload[0].createdAt)
      : notifications.length === 0
      ? "No activity yet"
      : formatTimestamp(notifications[0].createdAt);

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] });
    },
  });

  const markVisibleRead = async () => {
    await Promise.all(
      visibleUnreadNotifications.map((item) => markReadMutation.mutateAsync(item.id)),
    );
  };

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notifications" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            Track alerts and system updates across your account without leaving the dashboard.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void markVisibleRead()}
          disabled={
            visibleUnreadNotifications.length === 0 || markReadMutation.isPending
          }
          className="h-11 w-full lg:w-auto bg-black hover:bg-black text-white"
        >
          {markReadMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CheckCheck className="size-4" />
          )}
          Mark visible as read
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Notifications"
          value={totalNotifications}
          icon={Bell}
        />
        <StatCard
          label="Unread Notifications"
          value={unreadNotifications}
          icon={ShieldCheck}
        />
        <StatCard
          label="Latest Activity"
          value={latestTimestamp}
          icon={AlertTriangle}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Activity Feed</h2>
            <p className="text-sm text-muted-foreground">
              Review all alerts or focus on unread items only.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "outline" : "ghost"}
              onClick={() => setFilter("all")}
              className="h-10"
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "outline" : "ghost"}
              onClick={() => setFilter("unread")}
              className="h-10"
            >
              Unread
            </Button>
          </div>
        </div>

        <div>
          {activeQuery.isLoading ? (
            <NotificationSkeleton />
          ) : activeQuery.isError ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <AlertTriangle className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">
                  Notifications are unavailable right now
                </p>
                <p className="text-sm text-muted-foreground">
                  We could not load your notification feed. Try again when the service is available.
                </p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Inbox className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">
                  No notifications found
                </p>
                <p className="text-sm text-muted-foreground">
                  New alerts and system updates will appear here as they come in.
                </p>
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                isMutating={markReadMutation.isPending}
                onRead={() => {
                  if (!notification.isRead) {
                    markReadMutation.mutate(notification.id);
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
