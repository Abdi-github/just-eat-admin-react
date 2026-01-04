import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

/**
 * Format monetary amounts in Swiss Francs (CHF).
 */
export const formatCHF = (amount: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount);
};

/**
 * Format a date string to a localized display format.
 */
export const formatDate = (date: string | Date, locale = 'de'): string => {
  return dayjs(date).locale(locale).format('LL');
};

/**
 * Format a date string to a localized display format with time.
 */
export const formatDateTime = (date: string | Date, locale = 'de'): string => {
  return dayjs(date).locale(locale).format('LLL');
};

/**
 * Format a date string to a relative time (e.g., "2 hours ago").
 */
export const formatRelativeTime = (date: string | Date, locale = 'de'): string => {
  return dayjs(date).locale(locale).fromNow();
};

/**
 * Format a number with locale-specific thousand separators.
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('de-CH').format(value);
};

/**
 * Format a percentage value.
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
};
