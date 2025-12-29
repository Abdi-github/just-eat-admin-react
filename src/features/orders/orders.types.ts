import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';

// ─── Enums ───────────────────────────────────────────────────────
export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderType = 'delivery' | 'pickup';

export type PaymentMethod = 'card' | 'twint' | 'postfinance' | 'cash';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';

// Terminal statuses — no further transitions allowed
export const TERMINAL_STATUSES: OrderStatus[] = ['REJECTED', 'DELIVERED', 'CANCELLED'];

// Valid status transitions from each status
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  REJECTED: [],
  PREPARING: ['READY'],
  READY: ['PICKED_UP', 'DELIVERED'],
  PICKED_UP: ['IN_TRANSIT'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

// Status badge color variants
export const ORDER_STATUS_VARIANTS: Record<OrderStatus, string> = {
  PLACED: 'info',
  ACCEPTED: 'primary',
  REJECTED: 'danger',
  PREPARING: 'warning',
  READY: 'info',
  PICKED_UP: 'primary',
  IN_TRANSIT: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export const PAYMENT_STATUS_VARIANTS: Record<PaymentStatus, string> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'secondary',
};

// Sort options for order list
export const ORDER_SORT_OPTIONS = [
  { value: '-created_at', labelKey: 'sort.newestFirst' },
  { value: 'created_at', labelKey: 'sort.oldestFirst' },
  { value: '-total', labelKey: 'sort.highestTotal' },
  { value: 'total', labelKey: 'sort.lowestTotal' },
  { value: '-placed_at', labelKey: 'sort.recentlyPlaced' },
  { value: 'placed_at', labelKey: 'sort.earliestPlaced' },
] as const;

// ─── Entities ────────────────────────────────────────────────────

export interface OrderItemOption {
  name: string;
  price: number;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string | null;
  options?: OrderItemOption[];
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name?: string;
  courier_id?: string | null;
  delivery_address_id?: string | null;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  tip: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  special_instructions?: string | null;
  estimated_delivery_at?: string | null;
  placed_at: string;
  accepted_at?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
  preparing_at?: string | null;
  ready_at?: string | null;
  picked_up_at?: string | null;
  in_transit_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Query Params ────────────────────────────────────────────────

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: OrderStatus;
  order_type?: OrderType;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  restaurant_id?: string;
  user_id?: string;
  courier_id?: string;
  date_from?: string;
  date_to?: string;
  order_number?: string;
}

// ─── Mutation DTOs ───────────────────────────────────────────────

export interface OrderStatusChangeDto {
  status: OrderStatus;
  rejection_reason?: string;
  cancellation_reason?: string;
}

// ─── Response Types ──────────────────────────────────────────────

export type OrderListResponse = ApiListResponse<Order>;
export type OrderDetailResponse = ApiResponse<Order>;
