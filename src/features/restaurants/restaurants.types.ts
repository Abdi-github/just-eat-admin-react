import type { ApiListResponse, ApiResponse } from '@/shared/types/api.types';

// ─── Status Enum ───────────────────────────────────────────────────

export type RestaurantStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'ARCHIVED';

/**
 * Valid status transitions for the approval workflow.
 * Key = current status, Value = array of allowed next statuses.
 */
export const STATUS_TRANSITIONS: Record<RestaurantStatus, RestaurantStatus[]> = {
  DRAFT: ['PENDING_APPROVAL'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
  APPROVED: ['PUBLISHED'],
  PUBLISHED: ['SUSPENDED', 'ARCHIVED'],
  REJECTED: ['DRAFT'],
  SUSPENDED: ['PUBLISHED', 'ARCHIVED'],
  ARCHIVED: [],
};

// ─── Populated Sub-Types ───────────────────────────────────────────

export interface RestaurantCity {
  id: string;
  name: string;
  slug: string;
}

export interface RestaurantCanton {
  id: string;
  name: string;
  slug: string;
  code?: string;
}

export interface RestaurantBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
}

export interface RestaurantCuisine {
  id: string;
  name: string;
  slug: string;
}

// ─── Restaurant Response DTO ───────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  postal_code: string;
  city_id: string;
  canton_id: string;
  city: RestaurantCity | null;
  canton: RestaurantCanton | null;
  brand_id: string | null;
  brand: RestaurantBrand | null;
  owner_id: string | null;
  rating: number;
  review_count: number;
  logo_url: string | null;
  cover_image_url: string | null;
  delivery_fee: number | null;
  minimum_order: number | null;
  estimated_delivery_minutes: { min: number; max: number } | null;
  supports_delivery: boolean;
  supports_pickup: boolean;
  is_partner_delivery: boolean;
  phone: string | null;
  email: string | null;
  status: RestaurantStatus;
  is_active: boolean;
  is_featured: boolean;
  cuisines?: RestaurantCuisine[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Query Parameters ──────────────────────────────────────────────

export interface RestaurantQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: RestaurantStatus;
  city_id?: string;
  canton_id?: string;
  cuisine_id?: string;
  brand_id?: string;
  postal_code?: string;
  min_rating?: number;
  search?: string;
  is_active?: string;
}

// ─── Mutation Types ────────────────────────────────────────────────

export interface RestaurantUpdateDto {
  name?: string;
  slug?: string;
  description?: {
    en?: string;
    fr?: string;
    de?: string;
    it?: string;
  };
  address?: string;
  postal_code?: string;
  city_id?: string;
  canton_id?: string;
  brand_id?: string | null;
  phone?: string;
  email?: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
  delivery_fee?: number | null;
  minimum_order?: number | null;
  estimated_delivery_minutes?: {
    min: number;
    max: number;
  };
  supports_delivery?: boolean;
  supports_pickup?: boolean;
  is_partner_delivery?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface RestaurantStatusChangeDto {
  status: RestaurantStatus;
  rejection_reason?: string;
}

// ─── API Response Aliases ──────────────────────────────────────────

export type RestaurantListResponse = ApiListResponse<Restaurant>;
export type RestaurantDetailResponse = ApiResponse<Restaurant>;
