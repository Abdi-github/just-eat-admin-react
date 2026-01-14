import { baseApi } from '@/shared/api/baseApi';
import type {
  PaymentListResponse,
  PaymentDetailResponse,
  PaymentQueryParams,
  RefundDto,
} from './payments.types';

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List All Payment Transactions ─────────────────────────────
    getPayments: builder.query<PaymentListResponse, PaymentQueryParams>({
      query: (params) => {
        return {
          url: '/admin/payments',
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Payment' as const, id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),

    // ─── Get Single Payment Transaction ────────────────────────────
    getPayment: builder.query<PaymentDetailResponse, string>({
      query: (id) => `/admin/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),

    // ─── Process Refund ────────────────────────────────────────────
    processRefund: builder.mutation<PaymentDetailResponse, { orderId: string; body: RefundDto }>({
      query: ({ orderId, body }) => {
        return {
          url: `/admin/payments/${orderId}/refund`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Payment', id: 'LIST' },
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const { useGetPaymentsQuery, useGetPaymentQuery, useProcessRefundMutation } = paymentsApi;
