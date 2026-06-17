export type NotificationType =
  | "complaint_update"
  | "maintenance"
  | "regulation_news"
  | "fraud_alert"
  | "qos_alert"
  | "system";

export interface Notification {
  id: string;
  userId?: string;          // null = broadcast
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCreate {
  userId?: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}
