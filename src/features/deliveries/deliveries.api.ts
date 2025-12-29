import { baseApi } from '@/shared/api/baseApi';
import type {
  DeliveryListResponse,
  DeliveryDetailResponse,
  DeliveryQueryParams,
  CreateDeliveryDto,
  AssignCourierDto,
  CancelDeliveryDto,
} from './deliveries.types';

export const deliveriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List All Deliveries ───────────────────────────────────────
    getDeliveries: builder.query<DeliveryListResponse, DeliveryQueryParams>({
      query: (params) => ({
        url: '/admin/deliveries',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Delivery' as const, id })),
              { type: 'Delivery', id: 'LIST' },
            ]
          : [{ type: 'Delivery', id: 'LIST' }],
    }),

    // ─── Get Single Delivery ───────────────────────────────────────
    getDelivery: builder.query<DeliveryDetailResponse, string>({
      query: (id) => `/admin/deliveries/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Delivery', id }],
    }),

    // ─── Create Delivery for Order ─────────────────────────────────
    createDelivery: builder.mutation<DeliveryDetailResponse, CreateDeliveryDto>({
      query: (body) => ({
        url: '/admin/deliveries/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Delivery', id: 'LIST' },
        { type: 'Order', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // ─── Assign Courier ────────────────────────────────────────────
    assignCourier: builder.mutation<DeliveryDetailResponse, { id: string; body: AssignCourierDto }>(
      {
        query: ({ id, body }) => ({
          url: `/admin/deliveries/${id}/assign`,
          method: 'POST',
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: 'Delivery', id },
          { type: 'Delivery', id: 'LIST' },
          { type: 'Order', id: 'LIST' },
        ],
      }
    ),

    // ─── Cancel Delivery ───────────────────────────────────────────
    cancelDelivery: builder.mutation<
      DeliveryDetailResponse,
      { id: string; body: CancelDeliveryDto }
    >({
      query: ({ id, body }) => ({
        url: `/admin/deliveries/${id}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Delivery', id },
        { type: 'Delivery', id: 'LIST' },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDeliveriesQuery,
  useGetDeliveryQuery,
  useCreateDeliveryMutation,
  useAssignCourierMutation,
  useCancelDeliveryMutation,
} = deliveriesApi;
