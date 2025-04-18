
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';

export const createMockUser = (overrides = {}): User => {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      username: 'TestUser',
      avatar_url: null
    },
    aud: 'authenticated',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: '',
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

export const createMockSession = (user = createMockUser()): Session => {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user
  };
};

export const createMockUserProfile = (role: UserRole = 'player', overrides = {}): any => {
  return {
    id: 'test-user-id',
    username: 'TestUser',
    display_name: 'Test User',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    credits: 0,
    role,
    bio: null,
    email_change_token: null,
    email_change_token_expires_at: null,
    email_change_new_email: null,
    last_sign_in: null,
    active_sessions: [],
    two_factor_enabled: false,
    security_questions: null,
    account_locked: false,
    failed_login_attempts: 0,
    last_password_change: null,
    ...overrides
  };
};

export const createMockPermissions = (permissions: string[] = []): string[] => {
  return permissions;
};
