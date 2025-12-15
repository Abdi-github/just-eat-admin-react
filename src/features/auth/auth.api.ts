import { baseApi } from '@/shared/api/baseApi';
import type { LoginRequest, LoginResponse, LogoutResponse, GetMeResponse } from './auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        return {
          url: '/public/auth/login',
          method: 'POST',
          body: credentials,
        };
      },
      async onQueryStarted(credentials, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (err) {
        }
      },
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => {
        return {
          url: '/public/auth/logout',
          method: 'POST',
        };
      },
      // On logout, reset all cached API data
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          // Even if the logout API call fails (e.g., token already expired),
          // we still want to clear the local state
        }
        dispatch(baseApi.util.resetApiState());
      },
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => {
        return '/public/auth/me';
      },
      providesTags: ['Auth'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (err) {
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
