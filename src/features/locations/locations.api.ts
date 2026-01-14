import { baseApi } from '@/shared/api/baseApi';
import type {
  CantonListResponse,
  CantonQueryParams,
  CantonResponse,
  CreateCantonDto,
  UpdateCantonDto,
  CityListResponse,
  CityQueryParams,
  CityResponse,
  CreateCityDto,
  UpdateCityDto,
} from './locations.types';

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Cantons ─────────────────────────────────
    getCantons: builder.query<CantonListResponse, CantonQueryParams>({
      query: (params) => ({
        url: '/public/locations/cantons',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Canton' as const, id })),
              { type: 'Canton', id: 'LIST' },
            ]
          : [{ type: 'Canton', id: 'LIST' }],
    }),

    getCanton: builder.query<CantonResponse, string>({
      query: (id) => `/public/locations/cantons/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Canton', id }],
    }),

    createCanton: builder.mutation<CantonResponse, CreateCantonDto>({
      query: (body) => ({
        url: '/admin/locations/cantons',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Canton', id: 'LIST' }],
    }),

    updateCanton: builder.mutation<CantonResponse, { id: string; body: UpdateCantonDto }>({
      query: ({ id, body }) => ({
        url: `/admin/locations/cantons/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Canton', id },
        { type: 'Canton', id: 'LIST' },
      ],
    }),

    deleteCanton: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/locations/cantons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Canton', id: 'LIST' }],
    }),

    // ─── Cities ──────────────────────────────────
    getCities: builder.query<CityListResponse, CityQueryParams>({
      query: (params) => ({
        url: '/public/locations/cities',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'City' as const, id })),
              { type: 'City', id: 'LIST' },
            ]
          : [{ type: 'City', id: 'LIST' }],
    }),

    getCity: builder.query<CityResponse, string>({
      query: (id) => `/public/locations/cities/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'City', id }],
    }),

    createCity: builder.mutation<CityResponse, CreateCityDto>({
      query: (body) => ({
        url: '/admin/locations/cities',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'City', id: 'LIST' }],
    }),

    updateCity: builder.mutation<CityResponse, { id: string; body: UpdateCityDto }>({
      query: ({ id, body }) => ({
        url: `/admin/locations/cities/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'City', id },
        { type: 'City', id: 'LIST' },
      ],
    }),

    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/locations/cities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'City', id: 'LIST' }],
    }),
  }),
});

export const {
  // Cantons
  useGetCantonsQuery,
  useGetCantonQuery,
  useCreateCantonMutation,
  useUpdateCantonMutation,
  useDeleteCantonMutation,
  // Cities
  useGetCitiesQuery,
  useGetCityQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = locationsApi;
