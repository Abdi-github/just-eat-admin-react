import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, ApiListResponse } from '@/shared/types/api.types';
import type {
  PlatformDashboardData,
  RevenueTimeSeriesPoint,
  TopRestaurantData,
  DashboardQueryParams,
  RevenueQueryParams,
  TopRestaurantsQueryParams,
  RecentOrder,
  PendingRestaurant,
  DashboardUserStats,
} from './dashboard.types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Platform dashboard overview
    getDashboardStats: builder.query<ApiResponse<PlatformDashboardData>, DashboardQueryParams>({
      query: (params) => {
        return {
          url: '/admin/analytics/dashboard',
          params,
        };
      },
      providesTags: ['Dashboard'],
    }),

    // Revenue time series for charts
    getRevenueTimeSeries: builder.query<ApiResponse<RevenueTimeSeriesPoint[]>, RevenueQueryParams>({
      query: (params) => ({
        url: '/admin/analytics/revenue',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Top restaurants by revenue
    getTopRestaurants: builder.query<ApiResponse<TopRestaurantData[]>, TopRestaurantsQueryParams>({
      query: (params) => ({
        url: '/admin/analytics/top-restaurants',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Recent orders (for dashboard feed)
    getRecentOrders: builder.query<
      ApiListResponse<RecentOrder>,
      { page?: number; limit?: number; sort?: string }
    >({
      query: (params) => {
        return {
          url: '/admin/orders',
          params: { page: 1, limit: 5, sort: '-created_at', ...params },
        };
      },
      providesTags: [{ type: 'Order', id: 'RECENT' }],
    }),

    // Pending approval restaurants (for dashboard widget)
    getPendingRestaurants: builder.query<
      ApiListResponse<PendingRestaurant>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: '/admin/restaurants',
        params: { page: 1, limit: 5, status: 'PENDING_APPROVAL', ...params },
      }),
      providesTags: [{ type: 'Restaurant', id: 'PENDING' }],
    }),

    // User statistics (for dashboard stats card)
    getDashboardUserStats: builder.query<ApiResponse<DashboardUserStats>, void>({
      query: () => '/admin/users/statistics',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueTimeSeriesQuery,
  useGetTopRestaurantsQuery,
  useGetRecentOrdersQuery,
  useGetPendingRestaurantsQuery,
  useGetDashboardUserStatsQuery,
} = dashboardApi;
