/**
 * Application constants.
 */
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Just Eat Admin';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4005/api/v1';
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'de';

/**
 * Pagination defaults.
 */
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Admin roles that have access to this dashboard.
 */
export const ADMIN_ROLES = ['super_admin', 'platform_admin', 'support_agent'];

/**
 * Status variant mappings for Bootstrap badge colors.
 */
export const STATUS_VARIANTS: Record<string, string> = {
  // Restaurant statuses
  DRAFT: 'secondary',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'info',
  REJECTED: 'danger',
  PUBLISHED: 'success',
  SUSPENDED: 'dark',
  ARCHIVED: 'dark',
  // Order statuses
  PLACED: 'info',
  ACCEPTED: 'primary',
  PREPARING: 'warning',
  READY: 'info',
  PICKED_UP: 'primary',
  IN_TRANSIT: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  // Review statuses
  PENDING: 'warning',
  FLAGGED: 'danger',
  // Payment statuses
  PROCESSING: 'warning',
  PAID: 'success',
  COMPLETED: 'success',
  REFUNDED: 'secondary',
  PARTIAL_REFUND: 'warning',
  EXPIRED: 'dark',
  FAILED: 'danger',
  // Delivery statuses
  ASSIGNED: 'info',
  // Generic
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  // User statuses (lowercase from API)
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
  inactive: 'secondary',
};

/**
 * Language labels for display.
 */
export const LANGUAGE_LABELS: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
};
