import { baseApi } from '@/shared/api/baseApi';
import type {
  RestaurantListResponse,
  RestaurantDetailResponse,
  RestaurantQueryParams,
  RestaurantUpdateDto,
  RestaurantStatusChangeDto,
} from './restaurants.types';

export const restaurantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List All Restaurants ────────────────────────────────────
    getRestaurants: builder.query<RestaurantListResponse, RestaurantQueryParams>({
      query: (params) => {
        return {
          url: '/admin/restaurants',
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Restaurant' as const, id })),
              { type: 'Restaurant', id: 'LIST' },
            ]
          : [{ type: 'Restaurant', id: 'LIST' }],
    }),

    // ─── Pending Approval Queue ──────────────────────────────────
    getPendingRestaurants: builder.query<RestaurantListResponse, { page?: number; limit?: number }>(
      {
        query: (params) => ({
          url: '/admin/restaurants/pending',
          params,
        }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map(({ id }) => ({ type: 'Restaurant' as const, id })),
                { type: 'Restaurant', id: 'PENDING' },
              ]
            : [{ type: 'Restaurant', id: 'PENDING' }],
      }
    ),

    // ─── Get Single Restaurant ───────────────────────────────────
    getRestaurant: builder.query<RestaurantDetailResponse, string>({
      query: (id) => `/admin/restaurants/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Restaurant', id }],
    }),

    // ─── Update Restaurant ───────────────────────────────────────
    updateRestaurant: builder.mutation<
      RestaurantDetailResponse,
      { id: string; body: RestaurantUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/restaurants/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Restaurant', id },
        { type: 'Restaurant', id: 'LIST' },
        { type: 'Restaurant', id: 'PENDING' },
      ],
    }),

    // ─── Change Restaurant Status ────────────────────────────────
    changeRestaurantStatus: builder.mutation<
      RestaurantDetailResponse,
      { id: string; body: RestaurantStatusChangeDto }
    >({
      query: ({ id, body }) => {
        return {
          url: `/admin/restaurants/${id}/status`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Restaurant', id },
        { type: 'Restaurant', id: 'LIST' },
        { type: 'Restaurant', id: 'PENDING' },
        { type: 'Dashboard' },
      ],
    }),

    // ─── Delete Restaurant ───────────────────────────────────────
    deleteRestaurant: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => {
        return {
          url: `/admin/restaurants/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Restaurant', id },
        { type: 'Restaurant', id: 'LIST' },
        { type: 'Restaurant', id: 'PENDING' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetPendingRestaurantsQuery,
  useGetRestaurantQuery,
  useUpdateRestaurantMutation,
  useChangeRestaurantStatusMutation,
  useDeleteRestaurantMutation,
} = restaurantsApi;
