import { baseApi } from '@/shared/api/baseApi';
import type {
  CouponListResponse,
  CouponQueryParams,
  CouponResponse,
  CreateCouponDto,
  UpdateCouponDto,
  StampCardListResponse,
  StampCardQueryParams,
  StampCardResponse,
  CreateStampCardDto,
  UpdateStampCardDto,
} from './promotions.types';

export const promotionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Coupons ──────────────────────────────────────

    getCoupons: builder.query<CouponListResponse, CouponQueryParams>({
      query: (params) => ({
        url: '/admin/promotions/coupons',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Coupon' as const, id })),
              { type: 'Coupon', id: 'LIST' },
            ]
          : [{ type: 'Coupon', id: 'LIST' }],
    }),

    getCoupon: builder.query<CouponResponse, string>({
      query: (id) => `/admin/promotions/coupons/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Coupon', id }],
    }),

    createCoupon: builder.mutation<CouponResponse, CreateCouponDto>({
      query: (body) => ({
        url: '/admin/promotions/coupons',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),

    updateCoupon: builder.mutation<CouponResponse, { id: string; body: UpdateCouponDto }>({
      query: ({ id, body }) => ({
        url: `/admin/promotions/coupons/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),

    deleteCoupon: builder.mutation<ApiDeleteResponse, string>({
      query: (id) => ({
        url: `/admin/promotions/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),

    // ── Stamp Cards ──────────────────────────────────

    getStampCards: builder.query<StampCardListResponse, StampCardQueryParams>({
      query: (params) => ({
        url: '/admin/promotions/stamps',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'StampCard' as const, id })),
              { type: 'StampCard', id: 'LIST' },
            ]
          : [{ type: 'StampCard', id: 'LIST' }],
    }),

    getStampCard: builder.query<StampCardResponse, string>({
      query: (id) => `/admin/promotions/stamps/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'StampCard', id }],
    }),

    createStampCard: builder.mutation<StampCardResponse, CreateStampCardDto>({
      query: (body) => ({
        url: '/admin/promotions/stamps',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'StampCard', id: 'LIST' }],
    }),

    updateStampCard: builder.mutation<StampCardResponse, { id: string; body: UpdateStampCardDto }>({
      query: ({ id, body }) => ({
        url: `/admin/promotions/stamps/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'StampCard', id },
        { type: 'StampCard', id: 'LIST' },
      ],
    }),

    deleteStampCard: builder.mutation<ApiDeleteResponse, string>({
      query: (id) => ({
        url: `/admin/promotions/stamps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'StampCard', id: 'LIST' }],
    }),
  }),
});

/** Generic delete response from the API */
interface ApiDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}

export const {
  // Coupons
  useGetCouponsQuery,
  useGetCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  // Stamp Cards
  useGetStampCardsQuery,
  useGetStampCardQuery,
  useCreateStampCardMutation,
  useUpdateStampCardMutation,
  useDeleteStampCardMutation,
} = promotionsApi;
