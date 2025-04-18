
/**
 * Authentication Testing Utilities
 * Provides mock functions and utilities for testing authentication
 */

// Export auth utilities from mockData
export { createMockUser, createMockSession, createMockUserProfile, createMockPermissions } from './mockData';

// Export auth wrapper from authTestUtils
export { createAuthWrapper } from './authTestUtils';

// Export mock context creator from mockAuthContext
export { createMockAuthContext } from './mockAuthContext';

// Export other auth testing utilities
export { mockSupabaseClient } from './mockSupabase';

