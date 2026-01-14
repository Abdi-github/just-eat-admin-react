import type { ApiListResponse, ApiResponse } from '@/shared/types/api.types';

// Brands use plain string names (NOT translated)
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  restaurant_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BrandQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  is_active?: boolean;
}

export interface CreateBrandDto {
  name: string;
  slug?: string;
  is_active?: boolean;
}

export interface UpdateBrandDto {
  name?: string;
  slug?: string;
  is_active?: boolean;
}

export type BrandListResponse = ApiListResponse<Brand>;
export type BrandResponse = ApiResponse<Brand>;
