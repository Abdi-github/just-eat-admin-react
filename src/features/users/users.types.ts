import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';

// ─── Enums ───────────────────────────────────────────────────────
export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export type UserRoleName =
  | 'super_admin'
  | 'platform_admin'
  | 'support_agent'
  | 'restaurant_owner'
  | 'restaurant_staff'
  | 'courier'
  | 'customer';

export const USER_STATUS_VARIANTS: Record<UserStatus, string> = {
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
  inactive: 'secondary',
};

export const ALL_ROLES: UserRoleName[] = [
  'super_admin',
  'platform_admin',
  'support_agent',
  'restaurant_owner',
  'restaurant_staff',
  'courier',
  'customer',
];

export const USER_SORT_OPTIONS = [
  { value: '-created_at', labelKey: 'sort.newestFirst' },
  { value: 'created_at', labelKey: 'sort.oldestFirst' },
  { value: 'first_name', labelKey: 'sort.nameAZ' },
  { value: '-first_name', labelKey: 'sort.nameZA' },
  { value: '-last_login_at', labelKey: 'sort.lastLogin' },
] as const;

// ─── Entities ────────────────────────────────────────────────────

export interface UserRole {
  id: string;
  name: string;
  code: string;
}

export interface NotificationPreferences {
  email_order_updates: boolean;
  email_promotions: boolean;
  email_newsletter: boolean;
  push_enabled: boolean;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  preferred_language: string;
  notification_preferences?: NotificationPreferences;
  status: UserStatus;
  is_active: boolean;
  is_verified: boolean;
  verified_at?: string;
  last_login_at?: string;
  roles: UserRole[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  total: number;
  by_status: Record<UserStatus, number>;
  active: number;
  verified: number;
  new_last_30_days: number;
}

// ─── Query Params ────────────────────────────────────────────────

export interface UserQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: UserStatus;
  is_active?: string;
  is_verified?: string;
}

// ─── Mutation DTOs ───────────────────────────────────────────────

export interface CreateUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  preferred_language?: 'en' | 'fr' | 'de' | 'it';
  status?: UserStatus;
  is_active?: boolean;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferred_language?: 'en' | 'fr' | 'de' | 'it';
  status?: UserStatus;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface AssignRoleDto {
  role: string;
}

// ─── Response Types ──────────────────────────────────────────────

export type UserListResponse = ApiListResponse<User>;
export type UserDetailResponse = ApiResponse<User>;
export type UserStatsResponse = ApiResponse<UserStatistics>;
