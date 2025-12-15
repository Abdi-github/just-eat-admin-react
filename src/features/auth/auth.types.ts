import type { SupportedLanguage } from '@/shared/types/common.types';

// ─── API Request Types ─────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// ─── API Response Types ────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  preferred_language: SupportedLanguage;
  status: 'active' | 'pending' | 'suspended';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  roles: string[];
  permissions: string[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: 'Bearer';
  };
}

export interface GetMeResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: null;
}
