import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SECURITY_CONFIG } from '@/config/security';

// Create Supabase client configured for Clerk authentication
export const supabaseWithClerk = createClient<Database>(
  SECURITY_CONFIG.SUPABASE_URL, 
  SECURITY_CONFIG.SUPABASE_ANON_KEY, 
  {
  auth: {
    // Disable Supabase auth since we're using Clerk
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      // Will be set dynamically by Clerk JWT when needed
    }
  }
});

// Function to create a Supabase client with Clerk JWT token
export const getSupabaseWithClerkToken = async (clerkToken: string) => {
  return createClient<Database>(
    SECURITY_CONFIG.SUPABASE_URL, 
    SECURITY_CONFIG.SUPABASE_ANON_KEY, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`
        }
      }
    }
  );
};

// Create Supabase profiles entry for Clerk users - simplified approach
export const ensureClerkProfile = async (clerkUser: any, clerkToken: string) => {
  // For now, we'll handle this in the regular Supabase client
  // The profile sync will happen through the existing auth system
  return null;
};