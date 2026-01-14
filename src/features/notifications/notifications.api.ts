import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/types/api.types';
import type { SendNotificationDto, SendNotificationResponse } from './notifications.types';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation<ApiResponse<SendNotificationResponse>, SendNotificationDto>({
      query: (body) => ({
        url: '/admin/notifications/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const { useSendNotificationMutation } = notificationsApi;
