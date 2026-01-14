import type { ApiResponse } from '@/shared/types/api.types';

// ── Enums ──────────────────────────────────────────────────────────

export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_year';

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';

// ── Query Params ───────────────────────────────────────────────────

export interface AnalyticsDateParams {
  preset?: DatePreset;
  from?: string;
  to?: string;
}

export interface RevenueQueryParams extends AnalyticsDateParams {
  period?: AnalyticsPeriod;
}

export interface TopRestaurantsQueryParams extends AnalyticsDateParams {
  limit?: number;
}

// ── Dashboard Response ─────────────────────────────────────────────

export interface PlatformDashboard {
  date_range: {
    from: string;
    to: string;
  };
  overview: {
    total_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    avg_order_value: number;
    total_restaurants: number;
    active_restaurants: number;
    new_users_period: number;
    total_users: number;
  };
  order_status_breakdown: Record<string, number>;
  order_type_breakdown: {
    delivery: number;
    pickup: number;
  };
  payment_method_breakdown: Record<string, number>;
  restaurant_status_breakdown: Record<string, number>;
}

export type PlatformDashboardResponse = ApiResponse<PlatformDashboard>;

// ── Revenue Response ───────────────────────────────────────────────

export interface RevenueTimeSeriesPoint {
  date: string;
  revenue: number;
  orders: number;
}

export type RevenueResponse = ApiResponse<RevenueTimeSeriesPoint[]>;

// ── Top Restaurants Response ───────────────────────────────────────

export interface TopRestaurant {
  restaurant_id: string;
  name: string;
  slug: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

export type TopRestaurantsResponse = ApiResponse<TopRestaurant[]>;
