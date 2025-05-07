
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
    
    return hasAccess;
  } catch (error) {
    logger.error("Error in admin access verification", { error, userId });
    return false;
  }
}

// Check if a column exists in a table
async function checkColumnExists(supabase: any, table: string, column: string): Promise<boolean> {
  try {
    // Test query to see if column exists
    await supabase
      .from(table)
      .select(column)
      .limit(1);
    
    return true;
  } catch (error) {
    const errorMsg = error.toString();
    if (errorMsg.includes(`column ${table}.${column} does not exist`)) {
      return false;
    }
    // Re-throw unexpected errors
    throw error;
  }
}

// Fetch all users with profile data
async function fetchAllUsers(supabase: any): Promise<UserData[]> {
  try {
    // First check which columns exist in the profiles table
    logger.info("Checking available columns in profiles table");
    const hasGenderColumn = await checkColumnExists(supabase, "profiles", "gender");
    const hasAgeGroupColumn = await checkColumnExists(supabase, "profiles", "age_group");
    
    logger.info("Column availability", { hasGenderColumn, hasAgeGroupColumn });

    // Dynamically build the select query based on available columns
    let selectQuery = "id, role, username, country, last_sign_in";
    if (hasGenderColumn) selectQuery += ", gender";
    if (hasAgeGroupColumn) selectQuery += ", age_group";
    
    // Fetch all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      logger.error("Error fetching auth users", { error: authError });
      throw new Error("Error fetching users: " + authError.message);
    }
    
    // Fetch all profiles
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
      
      // Prioritize profile's last_sign_in field but fall back to auth user's last_sign_in_at if needed
      const lastSignIn = profile.last_sign_in || user.last_sign_in_at || null;
      
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        display_name: profile.username || user.email?.split('@')[0] || 'N/A',
        role: profile.role || 'player',
        country: profile.country || null,
        gender: hasGenderColumn ? profile.gender || null : null,
        age_group: hasAgeGroupColumn ? profile.age_group || null : null,
        last_sign_in: lastSignIn
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
