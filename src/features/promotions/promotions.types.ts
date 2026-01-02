import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';

// ── Enums ──────────────────────────────────────────────────────────

export type DiscountType = 'PERCENTAGE' | 'FLAT';

export type PromotionScope = 'PLATFORM' | 'RESTAURANT';

/** Computed status — not stored in DB */
export type PromotionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

// ── Coupon ─────────────────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order: number;
  maximum_discount: number | null;
  scope: PromotionScope;
  restaurant_id: string | null;
  restaurant_name: string | null;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  per_user_limit: number;
  usage_count: number;
  is_active: boolean;
  status: PromotionStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCouponDto {
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order?: number;
  maximum_discount?: number;
  scope: PromotionScope;
  restaurant_id?: string;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
  per_user_limit?: number;
  is_active?: boolean;
}

export interface UpdateCouponDto {
  description?: string;
  discount_type?: DiscountType;
  discount_value?: number;
  minimum_order?: number;
  maximum_discount?: number | null;
  valid_from?: string | null;
  valid_until?: string | null;
  usage_limit?: number | null;
  per_user_limit?: number;
  is_active?: boolean;
}

export interface CouponQueryParams {
  page?: number;
  limit?: number;
  scope?: PromotionScope;
  status?: string; // 'active' | 'inactive' | 'expired' (lowercase in query)
  restaurant_id?: string;
  sort?: string;
}

export type CouponResponse = ApiResponse<Coupon>;
export type CouponListResponse = ApiListResponse<Coupon>;

// ── Stamp Card ─────────────────────────────────────────────────────

export interface StampCard {
  id: string;
  name: string;
  description: string | null;
  restaurant_id: string;
  restaurant_name: string | null;
  stamps_required: number;
  reward_description: string;
  reward_type: DiscountType;
  reward_value: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStampCardDto {
  name: string;
  description?: string;
  restaurant_id: string;
  stamps_required: number;
  reward_description: string;
  reward_type: DiscountType;
  reward_value: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
}

export interface UpdateStampCardDto {
  name?: string;
  description?: string;
  stamps_required?: number;
  reward_description?: string;
  reward_type?: DiscountType;
  reward_value?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

export interface StampCardQueryParams {
  page?: number;
  limit?: number;
  restaurant_id?: string;
  sort?: string;
}

export type StampCardResponse = ApiResponse<StampCard>;
export type StampCardListResponse = ApiListResponse<StampCard>;
