import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';
import type { TranslatedField } from '@/shared/types/common.types';

// ─── Entities ────────────────────────────────────────────────────

export interface Cuisine {
  id: string;
  name: string | TranslatedField;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  restaurant_count?: number;
  created_at: string;
  updated_at: string;
}

// ─── Query Params ────────────────────────────────────────────────

export interface CuisineQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  is_active?: string;
}

// ─── Mutation DTOs ───────────────────────────────────────────────

export interface CreateCuisineDto {
  name: TranslatedField;
  slug?: string;
  image_url?: string | null;
  is_active?: boolean;
}

export interface UpdateCuisineDto {
  name?: Partial<TranslatedField>;
  slug?: string;
  image_url?: string | null;
  is_active?: boolean;
}

// ─── Response Types ──────────────────────────────────────────────

export type CuisineListResponse = ApiListResponse<Cuisine>;
export type CuisineDetailResponse = ApiResponse<Cuisine>;
