import { baseApi } from '@/shared/api/baseApi';
import type {
  BrandListResponse,
  BrandQueryParams,
  BrandResponse,
  CreateBrandDto,
  UpdateBrandDto,
} from './brands.types';

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandListResponse, BrandQueryParams>({
      query: (params) => ({
        url: '/public/brands',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Brand' as const, id })),
              { type: 'Brand', id: 'LIST' },
            ]
          : [{ type: 'Brand', id: 'LIST' }],
    }),

    getBrand: builder.query<BrandResponse, string>({
      query: (id) => `/public/brands/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Brand', id }],
    }),

    createBrand: builder.mutation<BrandResponse, CreateBrandDto>({
      query: (body) => ({
        url: '/admin/brands',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    updateBrand: builder.mutation<BrandResponse, { id: string; body: UpdateBrandDto }>({
      query: ({ id, body }) => ({
        url: `/admin/brands/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Brand', id },
        { type: 'Brand', id: 'LIST' },
      ],
    }),

    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    uploadBrandLogo: builder.mutation<BrandResponse, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('logo', file);
        return {
          url: `/admin/brands/${id}/logo`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Brand', id },
        { type: 'Brand', id: 'LIST' },
      ],
    }),

    deleteBrandLogo: builder.mutation<BrandResponse, string>({
      query: (id) => ({
        url: `/admin/brands/${id}/logo`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Brand', id },
        { type: 'Brand', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useUploadBrandLogoMutation,
  useDeleteBrandLogoMutation,
} = brandsApi;
