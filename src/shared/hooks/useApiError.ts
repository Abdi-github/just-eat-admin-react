import { useTranslation } from 'react-i18next';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiErrorBody {
  error?: { code: number; message: string; field?: string };
}

export function useApiError() {
  const { t } = useTranslation();

  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
    if (!error) return t('messages.error');

    if ('status' in error) {
      const apiError = error.data as ApiErrorBody;
      if (apiError?.error?.message) {
        return apiError.error.message;
      }

      switch (error.status) {
        case 401:
          return t('errors.unauthorized');
        case 403:
          return t('errors.forbidden');
        case 404:
          return t('errors.notFound');
        case 422:
          return t('errors.validation');
        default:
          return t('messages.error');
      }
    }

    return error.message || t('messages.error');
  };

  return { getErrorMessage };
}
