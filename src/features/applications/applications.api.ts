import { baseApi } from '@/shared/api/baseApi';
import type {
  ApplicationListResponse,
  ApplicationActionResponse,
  ApplicationQueryParams,
} from './applications.types';

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── List Applications ─────────────────────────────────────
    getApplications: builder.query<ApplicationListResponse, ApplicationQueryParams>({
      query: (params) => ({
        url: '/admin/applications',
        params,
      }),
      providesTags: (result) =>
        result?.data?.applications
          ? [
              ...result.data.applications.map(({ id }) => ({
                type: 'Application' as const,
                id,
              })),
              { type: 'Application', id: 'LIST' },
            ]
          : [{ type: 'Application', id: 'LIST' }],
    }),

    // ─── Approve Application ───────────────────────────────────
    approveApplication: builder.mutation<ApplicationActionResponse, string>({
      query: (userId) => {
        return {
          url: `/admin/applications/${userId}/approve`,
          method: 'PATCH',
        };
      },
      invalidatesTags: (_result, _error, userId) => [
        { type: 'Application', id: userId },
        { type: 'Application', id: 'LIST' },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),

    // ─── Reject Application ────────────────────────────────────
    rejectApplication: builder.mutation<ApplicationActionResponse, { userId: string; reason: string }>({
      query: ({ userId, reason }) => {
        return {
          url: `/admin/applications/${userId}/reject`,
          method: 'PATCH',
          body: { reason },
        };
      },
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'Application', id: userId },
        { type: 'Application', id: 'LIST' },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
} = applicationsApi;
