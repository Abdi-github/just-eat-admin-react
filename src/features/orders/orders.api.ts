import { baseApi } from '@/shared/api/baseApi';
import type {
  OrderListResponse,
  OrderDetailResponse,
  OrderQueryParams,
  OrderStatusChangeDto,
} from './orders.types';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List All Orders ─────────────────────────────────────────
    getOrders: builder.query<OrderListResponse, OrderQueryParams>({
      query: (params) => {
        return {
          url: '/admin/orders',
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // ─── Get Single Order ────────────────────────────────────────
    getOrder: builder.query<OrderDetailResponse, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    // ─── Change Order Status (Admin Override) ────────────────────
    changeOrderStatus: builder.mutation<
      OrderDetailResponse,
      { id: string; body: OrderStatusChangeDto }
    >({
      query: ({ id, body }) => {
        return {
          url: `/admin/orders/${id}/status`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useChangeOrderStatusMutation } = ordersApi;
