import type { ApiResponse } from '@/shared/types/api.types';

// ─── Enums ───────────────────────────────────────────────────────
export type ApplicationStatus = 'pending_approval' | 'approved' | 'rejected';
export type ApplicationType = 'restaurant_owner' | 'courier';
export type VehicleType = 'bicycle' | 'motorcycle' | 'car' | 'e_bike' | 'on_foot';

export const APPLICATION_STATUS_VARIANTS: Record<ApplicationStatus, string> = {
  pending_approval: 'warning',
  approved: 'success',
  rejected: 'danger',
};

export const APPLICATION_TYPE_VARIANTS: Record<ApplicationType, string> = {
  restaurant_owner: 'primary',
  courier: 'info',
};

// ─── Entities ────────────────────────────────────────────────────

export interface ApplicationRestaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  status: string;
}

export interface Application {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  application_status: ApplicationStatus;
  application_type: ApplicationType;
  application_note?: string;
  application_rejection_reason?: string;
  application_reviewed_at?: string;
  is_verified: boolean;
  created_at: string;
  // Courier-specific
  vehicle_type?: VehicleType;
  date_of_birth?: string;
  // Restaurant owner-specific
  restaurant?: ApplicationRestaurant;
}

// ─── Query Params ────────────────────────────────────────────────

export interface ApplicationQueryParams {
  status?: ApplicationStatus;
  type?: ApplicationType;
  page?: number;
  limit?: number;
}

// ─── Response Types ──────────────────────────────────────────────

export interface ApplicationListData {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export type ApplicationListResponse = ApiResponse<ApplicationListData>;
export type ApplicationActionResponse = ApiResponse<null>;
