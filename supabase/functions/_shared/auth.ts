
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { errorResponse } from "./response.ts";

// Types
export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

// Verify auth token and return user info
export async function verifyAuth(req: Request): Promise<{ user: AuthUser | null; error?: Response }> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return { 
        user: null, 
        error: errorResponse('Missing authorization header', 'unauthorized', 401) 
      };
    }

    // Create Supabase client with anon key for token verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return { 
        user: null, 
        error: errorResponse('Server configuration error', 'config_error', 500) 
      };
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get JWT token from header and verify user
    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabaseClient.auth.getUser(token);
    
    if (error || !data.user) {
      console.error('Auth error:', error);
      return { 
        user: null, 
        error: errorResponse('Invalid or expired token', 'unauthorized', 401) 
      };
    }

    return { user: { id: data.user.id, email: data.user.email } };
  } catch (error) {
    console.error('Error verifying authentication:', error);
    return { 
      user: null, 
      error: errorResponse('Authentication error', 'auth_error', 500)
    };
  }
}

// Get user role from profiles table
export async function getUserRole(supabase: any, userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (error) {
    console.error('Exception fetching user role:', error);
    return null;
  }
}

// Check if user has admin role
export async function isUserAdmin(supabase: any, userId: string): Promise<boolean> {
  const role = await getUserRole(supabase, userId);
  return role === 'admin' || role === 'super_admin';
}
