export interface TranslatedField {
  en: string;
  fr: string;
  de: string;
  it: string;
}

export interface TranslatedFieldPartial {
  en?: string;
  fr?: string;
  de?: string;
  it?: string;
}

export type SupportedLanguage = 'de' | 'en' | 'fr' | 'it';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['de', 'en', 'fr', 'it'];

export const ADMIN_ROLES = ['super_admin', 'platform_admin', 'support_agent'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
