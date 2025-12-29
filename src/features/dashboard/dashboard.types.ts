// ─── Dashboard API Response Types ──────────────────────────────────

export interface PlatformDashboardOverview {
  total_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  avg_order_value: number;
  total_restaurants: number;
  active_restaurants: number;
}

// User statistics (from /admin/users/statistics)
export interface DashboardUserStats {
  total: number;
  active: number;
  verified: number;
  new_last_30_days: number;
  by_status: Record<string, number>;
}

export interface OrderStatusBreakdown {
  PLACED: number;
  ACCEPTED: number;
  REJECTED: number;
  PREPARING: number;
  READY: number;
  PICKED_UP: number;
  IN_TRANSIT: number;
  DELIVERED: number;
  CANCELLED: number;
}

export interface OrderTypeBreakdown {
  delivery: number;
  pickup: number;
}

export interface PaymentMethodBreakdown {
  card: number;
  twint: number;
  postfinance: number;
  cash: number;
}

export interface RestaurantStatusBreakdown {
  DRAFT: number;
  PENDING_APPROVAL: number;
  APPROVED: number;
  PUBLISHED: number;
  REJECTED: number;
  SUSPENDED: number;
  ARCHIVED: number;
}

export interface PlatformDashboardData {
  date_range: { from: string; to: string };
  overview: PlatformDashboardOverview;
  order_status_breakdown: OrderStatusBreakdown;
  order_type_breakdown: OrderTypeBreakdown;
  payment_method_breakdown: PaymentMethodBreakdown;
  restaurant_status_breakdown: RestaurantStatusBreakdown;
}

export interface RevenueTimeSeriesPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopRestaurantData {
  restaurant_id: string;
  name: string;
  slug: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

// ─── Query Parameter Types ─────────────────────────────────────────

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

export interface DashboardQueryParams {
  preset?: DatePreset;
  from?: string;
  to?: string;
}

export interface RevenueQueryParams extends DashboardQueryParams {
  period?: AnalyticsPeriod;
}

export interface TopRestaurantsQueryParams extends DashboardQueryParams {
  limit?: number;
}

// ─── Recent Order (simplified for dashboard) ───────────────────────

export interface RecentOrder {
  id: string;
  order_number: string;
  restaurant_name?: string;
  order_type: 'delivery' | 'pickup';
  status: string;
  total: number;
  currency: string;
  payment_method: string;
  placed_at: string;
  created_at: string;
}

// ─── Pending Restaurant (simplified for dashboard) ─────────────────

export interface PendingRestaurant {
  id: string;
  name: string;
  slug: string;
  status: string;
  city?: { id: string; name: string } | null;
  canton?: { id: string; name: string; code?: string } | null;
  owner_id?: string | null;
  created_at: string;
}
