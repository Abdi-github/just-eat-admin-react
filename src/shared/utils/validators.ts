import { z } from 'zod';

/**
 * Translated field schema: requires all 4 Swiss languages.
 */
export const translatedFieldSchema = z.object({
  en: z.string().min(1, 'English translation is required'),
  fr: z.string().min(1, 'French translation is required'),
  de: z.string().min(1, 'German translation is required'),
  it: z.string().min(1, 'Italian translation is required'),
});

/**
 * Email validation.
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Swiss phone number (basic pattern).
 */
export const swissPhoneSchema = z
  .string()
  .regex(/^\+41\d{9}$/, 'Must be a valid Swiss phone number (+41XXXXXXXXX)')
  .optional()
  .or(z.literal(''));

/**
 * Positive decimal (for prices).
 */
export const priceSchema = z.number().min(0, 'Price must be non-negative');

/**
 * Pagination params schema.
 */
export const paginationParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});
