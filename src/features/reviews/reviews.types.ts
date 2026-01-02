import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';

// ─── Enums ───────────────────────────────────────────────────────

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';

export const REVIEW_STATUS_OPTIONS: ReviewStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'];

// ─── Entities ────────────────────────────────────────────────────

export interface ReviewUser {
  id: string;
  first_name: string;
  last_name: string;
}

export interface ReviewRestaurant {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  user: ReviewUser;
  restaurant: ReviewRestaurant;
  order_id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  is_verified: boolean;
  moderation_reason?: string;
  restaurant_reply?: string;
  restaurant_reply_at?: string;
  created_at: string;
  updated_at: string;
}

// ─── Query Params ────────────────────────────────────────────────

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: ReviewStatus;
  restaurant_id?: string;
  user_id?: string;
  min_rating?: number;
  max_rating?: number;
}

// ─── Mutation DTOs ───────────────────────────────────────────────

export interface ModerateReviewDto {
  status: ReviewStatus;
  moderation_reason?: string;
}

// ─── Response Types ──────────────────────────────────────────────

export type ReviewListResponse = ApiListResponse<Review>;
export type ReviewDetailResponse = ApiResponse<Review>;
