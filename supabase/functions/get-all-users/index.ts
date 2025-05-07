
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { verifyAuth } from "../_shared/auth.ts";
import { EdgeFunctionLogger } from "../_shared/logging.ts";
import { getSupabaseConfig } from "../_shared/config.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("get-all-users");

// Interface for the user data we return
interface UserData {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
  last_sign_in: string | null;
  gender?: string | null;
  age_group?: string | null;
  country?: string | null;
}

// Check if the user has admin privileges
async function verifyAdminAccess(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      logger.error("Error fetching user role", { error: profileError, userId });
      return false;
    }

    const hasAccess = profile && ["admin", "super_admin", "cfo"].includes(profile.role);
    logger.info("Admin access check", { userId, role: profile?.role, hasAccess });
    
    // Special case for protected admin email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (!userError && userData?.user?.email === 'alan@insight-ai-systems.com') {
      logger.info("Protected admin detected, granting access regardless of role");
      return true;
    }
    
    return hasAccess;
  } catch (error) {
    logger.error("Error in admin access verification", { error, userId });
    return false;
  }
}

// Check if a column exists in a table with safe error handling
async function checkColumnExists(supabase: any, table: string, column: string): Promise<boolean> {
  try {
    // Use RPC to check if column exists to avoid exceptions
    const { data, error } = await supabase.rpc(
      'column_exists',
      { table_name: table, column_name: column }
    );
    
    if (error) {
      // If RPC doesn't exist, fall back to a safer method
      try {
        // Attempt to get column info from information_schema instead
        const { data: columnInfo, error: infoError } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_name', table)
          .eq('column_name', column)
          .single();
          
        if (infoError) {
          logger.warn(`Could not check column ${column} via schema, assuming false`, { error: infoError });
          return false;
        }
        
        return columnInfo !== null;
      } catch (schemaError) {
        logger.warn(`Falling back to basic query test for column ${column}`, { error: schemaError });
        // Last resort: just try a simple query and see if it fails
        try {
          await supabase
            .from(table)
            .select(column)
            .limit(1);
          return true;
        } catch (queryError) {
          logger.error(`Error testing column ${column} existence`, { error: queryError });
          return false;
        }
      }
    }
    
    return !!data;
  } catch (e) {
    logger.error(`Error checking if column ${column} exists in ${table}`, { error: e });
    return false;
  }
}

// Fetch all users with profile data
async function fetchAllUsers(supabase: any): Promise<UserData[]> {
  try {
    // First, let's get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      logger.error("Error fetching auth users", { error: authError });
      throw new Error("Error fetching users: " + authError.message);
    }
    
    // Build basic select query that always works
    let selectQuery = "id, role, username, created_at, updated_at";
    
    // Add optional fields if they exist
    const hasCountryColumn = await checkColumnExists(supabase, "profiles", "country");
    const hasLastSignInColumn = await checkColumnExists(supabase, "profiles", "last_sign_in");
    const hasCreditsColumn = await checkColumnExists(supabase, "profiles", "credits");
    
    if (hasCountryColumn) selectQuery += ", country";
    if (hasLastSignInColumn) selectQuery += ", last_sign_in";
    if (hasCreditsColumn) selectQuery += ", credits";
    
    logger.info("Using profiles query", { selectQuery });
    
    // Fetch all profiles with safe column selection
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(selectQuery);
    
    if (profilesError) {
      logger.error("Error fetching profiles", { error: profilesError });
      throw new Error("Error fetching profiles: " + profilesError.message);
    }

    // Create a map of profiles by user id for easy lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });

    // Combine auth users with their profiles
    const combinedUsers = authUsers.users.map(user => {
      const profile = profileMap.get(user.id) || {};
      
      // Get last sign in from either profile or auth user
      const lastSignIn = hasLastSignInColumn ? 
        profile.last_sign_in || user.last_sign_in_at || null : 
        user.last_sign_in_at || null;
      
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        display_name: profile.username || user.email?.split('@')[0] || 'N/A',
        role: profile.role || 'player',
        country: hasCountryColumn ? profile.country || null : null,
        last_sign_in: lastSignIn,
        // Don't include gender or age_group fields that caused the error
      };
    });

    logger.info(`Retrieved ${combinedUsers.length} users`);
    return combinedUsers;
  } catch (error) {
    logger.error("Error in fetchAllUsers", { error });
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Verify authentication
    const { user, error } = await verifyAuth(req);
    if (error) return error;
    if (!user) {
      return errorResponse("Authentication required", "unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // Create Supabase admin client
    const config = getSupabaseConfig();
    const supabaseAdmin = createClient(config.url, config.serviceRoleKey);
    
    // Verify the user has admin privileges
    const isAdmin = await verifyAdminAccess(supabaseAdmin, user.id);
    if (!isAdmin) {
      logger.warn("Unauthorized admin access attempt", { userId: user.id });
      return errorResponse(
        "Unauthorized - not an admin",
        "forbidden",
        HttpStatus.FORBIDDEN
      );
    }

    // Fetch all users
    const users = await fetchAllUsers(supabaseAdmin);
    
    // Return success response with users
    return successResponse(users);
  } catch (error) {
    logger.error("Unexpected error", { error });
    return errorResponse(
      error.message || "An unexpected error occurred",
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
});
