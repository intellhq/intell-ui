import { apiFetch } from "@/lib/api/client";
import type {
  NotificationItem,
  NotificationsListResponse,
} from "@/types/notifications";

export const notificationsService = {
  registerDeviceToken: async (data: { sessionId: string; token: string }) => {
    return apiFetch<boolean>(
      "/users/firebase-fid",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  getNotifications: async (page = 1, pageSize = 20) => {
    return apiFetch<NotificationsListResponse>(
      `/notifications?page_number=${page}&page_size=${pageSize}`,
      { method: "GET" },
      true,
    );
  },

  getUnreadNotifications: async (page = 1, pageSize = 20) => {
    return apiFetch<NotificationsListResponse>(
      `/notifications/unread?page_number=${page}&page_size=${pageSize}`,
      { method: "GET" },
      true,
    );
  },

  markAsRead: async (notificationId: string) => {
    return apiFetch<NotificationItem>(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
      { method: "PATCH" },
      true,
    );
  },
};
