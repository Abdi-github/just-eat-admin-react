import { baseApi } from '@/shared/api/baseApi';
import type {
  UserListResponse,
  UserDetailResponse,
  UserStatsResponse,
  UserQueryParams,
  CreateUserDto,
  UpdateUserDto,
  AssignRoleDto,
} from './users.types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── User Statistics ─────────────────────────────────────────
    getUserStatistics: builder.query<UserStatsResponse, void>({
      query: () => '/admin/users/statistics',
      providesTags: [{ type: 'User', id: 'STATS' }],
    }),

    // ─── List All Users ──────────────────────────────────────────
    getUsers: builder.query<UserListResponse, UserQueryParams>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // ─── Get Single User ────────────────────────────────────────
    getUser: builder.query<UserDetailResponse, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // ─── Create User ────────────────────────────────────────────
    createUser: builder.mutation<UserDetailResponse, CreateUserDto>({
      query: (body) => {
        return {
          url: '/admin/users',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),

    // ─── Update User ────────────────────────────────────────────
    updateUser: builder.mutation<UserDetailResponse, { id: string; body: UpdateUserDto }>({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),

    // ─── Activate User ──────────────────────────────────────────
    activateUser: builder.mutation<UserDetailResponse, string>({
      query: (id) => {
        return {
          url: `/admin/users/${id}/activate`,
          method: 'PATCH',
        };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),

    // ─── Suspend User ───────────────────────────────────────────
    suspendUser: builder.mutation<UserDetailResponse, string>({
      query: (id) => {
        return {
          url: `/admin/users/${id}/suspend`,
          method: 'PATCH',
        };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),

    // ─── Delete User ────────────────────────────────────────────
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),

    // ─── Assign Role ────────────────────────────────────────────
    assignRole: builder.mutation<UserDetailResponse, { id: string; body: AssignRoleDto }>({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}/roles`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // ─── Remove Role ────────────────────────────────────────────
    removeRole: builder.mutation<UserDetailResponse, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/roles/${role}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUserStatisticsQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useActivateUserMutation,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useAssignRoleMutation,
  useRemoveRoleMutation,
} = usersApi;
