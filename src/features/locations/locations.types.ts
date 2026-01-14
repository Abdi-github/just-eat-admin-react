import type { TranslatedField } from '@/shared/types/common.types';
import type { ApiListResponse, ApiResponse } from '@/shared/types/api.types';

// ─── Canton ────────────────────────────────────────────
export interface Canton {
  id: string;
  code: string; // 2-letter canton code (e.g., "ZH", "BE")
  name: string | TranslatedField;
  slug: string;
  is_active: boolean;
  city_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CantonQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  is_active?: boolean;
}

export interface CreateCantonDto {
  code: string;
  name: TranslatedField;
  slug?: string;
  is_active?: boolean;
}

export interface UpdateCantonDto {
  code?: string;
  name?: TranslatedField;
  slug?: string;
  is_active?: boolean;
}

export type CantonListResponse = ApiListResponse<Canton>;
export type CantonResponse = ApiResponse<Canton>;

// ─── City ──────────────────────────────────────────────
export interface City {
  id: string;
  canton_id: string;
  canton?: Canton;
  name: string | TranslatedField;
  slug: string;
  postal_codes: number[];
  is_active: boolean;
  restaurant_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CityQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  canton_id?: string;
  postal_code?: number;
  is_active?: boolean;
}

export interface CreateCityDto {
  canton_id: string;
  name: TranslatedField;
  slug?: string;
  postal_codes: number[];
  is_active?: boolean;
}

export interface UpdateCityDto {
  canton_id?: string;
  name?: TranslatedField;
  slug?: string;
  postal_codes?: number[];
  is_active?: boolean;
}

export type CityListResponse = ApiListResponse<City>;
export type CityResponse = ApiResponse<City>;
