import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vcacfysfjgoahledqdwa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWNmeXNmamdvYWhsZWRxZHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDI3MDgsImV4cCI6MjA1OTk3ODcwOH0.sSWBAAsoofM3b-aLNseRtXhNulg6kaGqXTcXRVd_IWo";

// Create Supabase client configured for Clerk authentication
export const supabaseWithClerk = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
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
export const getSupabaseWithClerkToken = (token: string) => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};