import { baseApi } from '@/shared/api/baseApi';
import type {
  CuisineListResponse,
  CuisineDetailResponse,
  CuisineQueryParams,
  CreateCuisineDto,
  UpdateCuisineDto,
} from './cuisines.types';

export const cuisinesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List Cuisines (public endpoint, used by admin) ──────────
    getCuisines: builder.query<CuisineListResponse, CuisineQueryParams>({
      query: (params) => ({
        url: '/public/cuisines',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Cuisine' as const, id })),
              { type: 'Cuisine', id: 'LIST' },
            ]
          : [{ type: 'Cuisine', id: 'LIST' }],
    }),

    // ─── Get Single Cuisine ──────────────────────────────────────
    getCuisine: builder.query<CuisineDetailResponse, string>({
      query: (id) => `/public/cuisines/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Cuisine', id }],
    }),

    // ─── Create Cuisine ─────────────────────────────────────────
    createCuisine: builder.mutation<CuisineDetailResponse, CreateCuisineDto>({
      query: (body) => ({
        url: '/admin/cuisines',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Cuisine', id: 'LIST' }],
    }),

    // ─── Update Cuisine ─────────────────────────────────────────
    updateCuisine: builder.mutation<CuisineDetailResponse, { id: string; body: UpdateCuisineDto }>({
      query: ({ id, body }) => ({
        url: `/admin/cuisines/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Cuisine', id },
        { type: 'Cuisine', id: 'LIST' },
      ],
    }),

    // ─── Delete Cuisine ─────────────────────────────────────────
    deleteCuisine: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/cuisines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Cuisine', id },
        { type: 'Cuisine', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCuisinesQuery,
  useGetCuisineQuery,
  useCreateCuisineMutation,
  useUpdateCuisineMutation,
  useDeleteCuisineMutation,
} = cuisinesApi;
