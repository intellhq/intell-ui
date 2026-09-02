export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  textContent: string | null;
  isRead: boolean;
  iconUrl: string | null;
  metaData: Record<string, unknown> | null;
  channelRoomId: string;
  userId: string;
  inAppDeliveryStatus: "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED";
  pushDeliveryStatus: "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListResponse {
  payload: NotificationItem[];
  total: number;
  page: number;
  limit: number;
}
