export type NotificationType =
  | 'ORDER_PLACED'
  | 'ORDER_ACCEPTED'
  | 'ORDER_REJECTED'
  | 'ORDER_PREPARING'
  | 'ORDER_READY'
  | 'ORDER_PICKED_UP'
  | 'ORDER_IN_TRANSIT'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_REFUNDED'
  | 'RESTAURANT_APPROVED'
  | 'RESTAURANT_REJECTED'
  | 'RESTAURANT_PUBLISHED'
  | 'RESTAURANT_SUSPENDED'
  | 'REVIEW_APPROVED'
  | 'REVIEW_REJECTED'
  | 'PROMOTION_AVAILABLE'
  | 'ACCOUNT_UPDATE'
  | 'SYSTEM';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'BOTH';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface SendNotificationDto {
  user_ids: string[];
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channel?: NotificationChannel;
  priority?: NotificationPriority;
}

export interface SendNotificationResponse {
  sent: number;
}
