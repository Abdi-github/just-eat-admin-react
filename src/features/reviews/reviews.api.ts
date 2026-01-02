import { baseApi } from '@/shared/api/baseApi';
import type {
  ReviewListResponse,
  ReviewDetailResponse,
  ReviewQueryParams,
  ModerateReviewDto,
} from './reviews.types';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List All Reviews ────────────────────────────────────────
    getReviews: builder.query<ReviewListResponse, ReviewQueryParams>({
      query: (params) => ({
        url: '/admin/reviews',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Review' as const, id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    // ─── Get Single Review ───────────────────────────────────────
    getReview: builder.query<ReviewDetailResponse, string>({
      query: (id) => `/admin/reviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Review', id }],
    }),

    // ─── Moderate Review (approve/reject/flag) ───────────────────
    moderateReview: builder.mutation<ReviewDetailResponse, { id: string; body: ModerateReviewDto }>(
      {
        query: ({ id, body }) => ({
          url: `/admin/reviews/${id}/moderate`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: 'Review', id },
          { type: 'Review', id: 'LIST' },
        ],
      }
    ),

    // ─── Delete Review ───────────────────────────────────────────
    deleteReview: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useModerateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
