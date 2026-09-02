"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, AlertTriangle, Bell, Cpu, Sun, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notificationsService } from "@/services/notifications-service";
import type { NotificationItem } from "@/types/notifications";

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getNotificationIcon(notification: NotificationItem) {
  const text = `${notification.title} ${notification.subtitle}`.toLowerCase();
  if (text.includes("battery") || text.includes("alert")) return AlertTriangle;
  if (text.includes("solar")) return Sun;
  if (text.includes("save")) return TrendingUp;
  if (/\bai\b/.test(text)) return Cpu;
  return Bell;
}

export function NotificationsDropdown() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications-dropdown"],
    queryFn: () => notificationsService.getNotifications(1, 5),
    retry: false,
  });

  const notifications = query.data?.payload ?? [];
  const unreadPreviewCount = notifications.filter((item) => !item.isRead).length;
  const hasUnreadPreview = unreadPreviewCount > 0;

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
    },
  });

  const markAllRead = async () => {
    const unread = notifications.filter((item) => !item.isRead);
    await Promise.all(unread.map((item) => markReadMutation.mutateAsync(item.id)));
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-xl md:w-104.5">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          Notifications
          {hasUnreadPreview && (
            <span className="inline-flex size-2.5 rounded-full bg-danger" aria-label="Unread notifications in preview" />
          )}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void markAllRead()}
          disabled={!hasUnreadPreview || markReadMutation.isPending}
          className="h-auto px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <Check className="h-3.5 w-3.5" />
          Mark preview as read
        </Button>
      </div>

      <div className="divide-border divide-y">
        {query.isLoading ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">Loading notifications...</div>
        ) : query.isError ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">
            Notifications are unavailable right now.
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">No notifications yet.</div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification);
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  if (!notification.isRead) {
                    markReadMutation.mutate(notification.id);
                  }
                }}
                className={cn(
                  "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors",
                  !notification.isRead ? "bg-muted/40" : "bg-card",
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      notification.isRead
                        ? "text-foreground/70"
                        : "font-medium text-foreground",
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            );
          })
        )}
      </div>

      <Link
        href="/dashboard/notifications"
        className="block border-t border-border py-4 text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        View all notifications
      </Link>
    </div>
  );
}
