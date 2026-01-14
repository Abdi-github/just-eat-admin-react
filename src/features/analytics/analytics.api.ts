import { baseApi } from '@/shared/api/baseApi';
import type {
  AnalyticsDateParams,
  PlatformDashboardResponse,
  RevenueQueryParams,
  RevenueResponse,
  TopRestaurantsQueryParams,
  TopRestaurantsResponse,
} from './analytics.types';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformDashboard: builder.query<PlatformDashboardResponse, AnalyticsDateParams>({
      query: (params) => ({
        url: '/admin/analytics/dashboard',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getRevenueTimeSeries: builder.query<RevenueResponse, RevenueQueryParams>({
      query: (params) => ({
        url: '/admin/analytics/revenue',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getTopRestaurants: builder.query<TopRestaurantsResponse, TopRestaurantsQueryParams>({
      query: (params) => ({
        url: '/admin/analytics/top-restaurants',
        params,
      }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetPlatformDashboardQuery,
  useGetRevenueTimeSeriesQuery,
  useGetTopRestaurantsQuery,
} = analyticsApi;
