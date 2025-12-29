import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';

// ─── Enums ───────────────────────────────────────────────────────

export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

// Terminal statuses — no further transitions allowed
export const DELIVERY_TERMINAL_STATUSES: DeliveryStatus[] = ['DELIVERED', 'CANCELLED', 'FAILED'];

// Valid status transitions
export const DELIVERY_STATUS_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  PENDING: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED'],
  IN_TRANSIT: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  CANCELLED: [],
  FAILED: [],
};

// Status badge color variants
export const DELIVERY_STATUS_VARIANTS: Record<DeliveryStatus, string> = {
  PENDING: 'warning',
  ASSIGNED: 'info',
  PICKED_UP: 'primary',
  IN_TRANSIT: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'dark',
  FAILED: 'danger',
};

// Status filter options
export const DELIVERY_STATUS_OPTIONS: DeliveryStatus[] = [
  'PENDING',
  'ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
  'FAILED',
];

// Sort options for delivery list
export const DELIVERY_SORT_OPTIONS = [
  { value: '-created_at', labelKey: 'sort.newestFirst' },
  { value: 'created_at', labelKey: 'sort.oldestFirst' },
] as const;

// ─── Embedded Types ──────────────────────────────────────────────

export interface DeliveryAddressSnapshot {
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
  floor?: string;
  instructions?: string;
}

export interface CourierLocation {
  lat: number;
  lng: number;
  updated_at: string;
}

// ─── Entities ────────────────────────────────────────────────────

export interface Delivery {
  id: string;
  order_id: string;
  order_number?: string;
  restaurant_id: string;
  restaurant_name?: string;
  restaurant_address?: string;
  courier_id: string | null;
  status: DeliveryStatus;
  pickup_address: string;
  delivery_address: DeliveryAddressSnapshot;
  delivery_fee: number;
  distance_km: number | null;
  estimated_pickup_at: string | null;
  estimated_delivery_at: string | null;
  assigned_at: string | null;
  picked_up_at: string | null;
  in_transit_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  courier_location: CourierLocation | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Query Params ────────────────────────────────────────────────

export interface DeliveryQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: DeliveryStatus;
  courier_id?: string;
  restaurant_id?: string;
  date_from?: string;
  date_to?: string;
}

// ─── Mutation DTOs ───────────────────────────────────────────────

export interface CreateDeliveryDto {
  order_id: string;
}

export interface AssignCourierDto {
  courier_id: string;
}

export interface CancelDeliveryDto {
  reason?: string;
}

// ─── Response Types ──────────────────────────────────────────────

export type DeliveryListResponse = ApiListResponse<Delivery>;
export type DeliveryDetailResponse = ApiResponse<Delivery>;
