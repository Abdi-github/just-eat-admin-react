import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { updateTokens, logout } from '@/shared/state/auth.slice';
import type { RefreshTokenResponse } from '@/features/auth/auth.types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    // Add auth token
    if (state.auth.token) {
      headers.set('Authorization', `Bearer ${state.auth.token}`);
    }

    // Add language header (MANDATORY for localized API responses)
    headers.set('Accept-Language', state.language.current);

    // Only set Content-Type if not already set (e.g., for FormData)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  },
});

/**
 * Base query with automatic token refresh on 401 responses.
 * If the access token has expired, attempts to refresh it using the refresh token.
 * If refresh also fails, logs the user out.
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await rawBaseQuery(
        {
          url: '/public/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const refreshData = refreshResult.data as RefreshTokenResponse;

        // Store new tokens (user stays the same)
        api.dispatch(
          updateTokens({
            token: refreshData.data.access_token,
            refreshToken: refreshData.data.refresh_token,
          })
        );

        // Retry original request with new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — logout
        api.dispatch(logout());
      }
    } else {
      // No refresh token — logout
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    // Auth
    'Auth',
    // Core entities
    'Restaurant',
    'Order',
    'User',
    'Review',
    'Cuisine',
    'Brand',
    'Canton',
    'City',
    'Payment',
    'Delivery',
    'Coupon',
    'StampCard',
    'Notification',
    // RBAC
    'Role',
    'Permission',
    // Applications
    'Application',
    // Aggregates
    'Dashboard',
    'Analytics',
  ],
  endpoints: () => ({}),
});
