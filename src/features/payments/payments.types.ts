import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';

// ─── Enums ───────────────────────────────────────────────────────

export type PaymentTransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIAL_REFUND'
  | 'CANCELLED'
  | 'EXPIRED';

export type PaymentMethodType = 'card' | 'twint' | 'postfinance' | 'cash';

export type PaymentProviderName = 'stripe' | 'twint' | 'postfinance' | 'cash';

// Status badge color variants
export const PAYMENT_TX_STATUS_VARIANTS: Record<PaymentTransactionStatus, string> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  FAILED: 'danger',
  REFUNDED: 'secondary',
  PARTIAL_REFUND: 'warning',
  CANCELLED: 'dark',
  EXPIRED: 'dark',
};

// Payment method display labels (translation keys)
export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethodType; labelKey: string }[] = [
  { value: 'card', labelKey: 'methods.card' },
  { value: 'twint', labelKey: 'methods.twint' },
  { value: 'postfinance', labelKey: 'methods.postfinance' },
  { value: 'cash', labelKey: 'methods.cash' },
];

// Status filter options
export const PAYMENT_STATUS_OPTIONS: PaymentTransactionStatus[] = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED',
  'PARTIAL_REFUND',
  'CANCELLED',
  'EXPIRED',
];

// ─── Entities ────────────────────────────────────────────────────

export interface PaymentTransaction {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethodType;
  provider_name: PaymentProviderName;
  provider_transaction_id?: string;
  status: PaymentTransactionStatus;
  redirect_url?: string;
  client_secret?: string;
  session_expires_at?: string;
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: string;
  cash_confirmed?: boolean;
  cash_collected_at?: string;
  error_message?: string;
  error_code?: string;
  attempts: number;
  created_at: string;
  updated_at: string;
}

// ─── Query Params ────────────────────────────────────────────────

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PaymentTransactionStatus;
  payment_method?: PaymentMethodType;
  order_id?: string;
  user_id?: string;
}

// ─── Mutation DTOs ───────────────────────────────────────────────

export interface RefundDto {
  amount?: number;
  reason?: string;
}

// ─── Response Types ──────────────────────────────────────────────

export type PaymentListResponse = ApiListResponse<PaymentTransaction>;
export type PaymentDetailResponse = ApiResponse<PaymentTransaction>;
