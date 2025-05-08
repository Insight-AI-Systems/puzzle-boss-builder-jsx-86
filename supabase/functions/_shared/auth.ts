
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";
import { EdgeFunctionLogger } from "./logging.ts";

// Logger for auth module
const logger = new EdgeFunctionLogger("auth-utils");

// Interface for verification result
export interface AdminVerificationResult {
  isAdmin: boolean;
  userId: string | null;
  role: string | null;
  isProtectedAdmin: boolean;
}

// Check if a string is the protected admin email
export function isProtectedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Protected admin email - MUST match the same definition in frontend constant
  const PROTECTED_ADMIN_EMAIL = "alan@insight-ai-systems.com";
  
  // Case-insensitive comparison
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}

// Check if the current user is an admin
export async function verifyAdmin(supabase: SupabaseClient): Promise<AdminVerificationResult> {
  try {
    logger.info("Verifying admin status");
    
    // Get user from auth token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      logger.error("Error getting user from auth token", { error: userError });
      return { isAdmin: false, userId: null, role: null, isProtectedAdmin: false };
    }
    
    if (!user) {
      logger.info("No authenticated user found");
      return { isAdmin: false, userId: null, role: null, isProtectedAdmin: false };
    }
    
    // Check if user is the protected admin
    if (isProtectedAdmin(user.email)) {
      logger.info("Protected admin identified", { userId: user.id });
      return { 
        isAdmin: true, 
        userId: user.id, 
        role: "super_admin", 
        isProtectedAdmin: true 
      };
    }
    
    // Get user's role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      logger.error("Error fetching user profile", { userId: user.id, error: profileError });
      return { isAdmin: false, userId: user.id, role: null, isProtectedAdmin: false };
    }
    
    const role = profile?.role || null;
    const isAdmin = role === 'admin' || role === 'super_admin';
    
    logger.info("Admin verification complete", { userId: user.id, role, isAdmin });
    
    return { 
      isAdmin, 
      userId: user.id, 
      role, 
      isProtectedAdmin: false 
    };
    
  } catch (error) {
    logger.error("Error in admin verification", { error });
    return { isAdmin: false, userId: null, role: null, isProtectedAdmin: false };
  }
}

// Check if column exists in a table
export async function columnExists(
  supabase: SupabaseClient,
  tableName: string,
  columnName: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('column_exists', {
      p_table_name: tableName,
      p_column_name: columnName
    });
    
    if (error) {
      logger.error("Error checking column existence", { error });
      // Fallback: try to query the table with the column
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from(tableName)
          .select(columnName)
          .limit(1);
        
        // If no error, the column exists
        return !fallbackError;
      } catch {
        return false;
      }
    }
    
    return !!data;
  } catch {
    return false;
  }
}

// Create column_exists RPC function if it doesn't exist
export async function ensureColumnExistsFunction(supabase: SupabaseClient): Promise<void> {
  try {
    await supabase.rpc('column_exists', { p_table_name: 'profiles', p_column_name: 'id' });
    // If no error, function exists
    logger.info("column_exists function already exists");
  } catch {
    // Create the function
    logger.info("Creating column_exists function");
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION column_exists(p_table_name TEXT, p_column_name TEXT)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          exists_bool BOOLEAN;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = p_table_name
              AND column_name = p_column_name
          ) INTO exists_bool;
          RETURN exists_bool;
        END;
        $$;
      `
    });
    
    if (error) {
      logger.error("Error creating column_exists function", { error });
    } else {
      logger.info("column_exists function created successfully");
    }
  }
}
