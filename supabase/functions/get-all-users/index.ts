
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
  categories_played?: string[] | null;
  avatar_url?: string | null;
  credits?: number | null;
  updated_at?: string | null;
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
    
    // Special case for protected admin email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (!userError && userData?.user?.email === 'alan@insight-ai-systems.com') {
      logger.info("Protected admin detected, granting access regardless of role");
      return true;
    }

    const hasAccess = profile && ["admin", "super_admin", "cfo"].includes(profile.role);
    logger.info("Admin access check", { userId, role: profile?.role, hasAccess });
    return hasAccess;
  } catch (error) {
    logger.error("Error in admin access verification", { error, userId });
    return false;
  }
}

// Check if a column exists in a table with safe error handling
async function checkColumnExists(supabase: any, table: string, column: string): Promise<boolean> {
  try {
    // Try different approaches to check if column exists
    
    // Method 1: Use direct SQL to check
    try {
      const { data, error } = await supabase.functions.invoke("column-exists", {
        body: { table_name: table, column_name: column }
      });
      
      if (!error) {
        return !!data;
      }
      
      logger.warn(`Error checking column via function: ${error?.message || "Unknown error"}`);
    } catch (fnError) {
      logger.warn(`Exception calling column-exists function: ${fnError.message}`);
    }
    
    // Method 2: Fallback to direct query
    try {
      await supabase
        .from(table)
        .select(column)
        .limit(1);
      
      return true;
    } catch (e) {
      if (e.message?.includes(`column "${column}" does not exist`)) {
        return false;
      }
      
      logger.warn(`Unexpected error in column check: ${e.message}`);
    }
    
    return false;
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
    
    // Build a base query that should always work
    let selectQuery = "id, role, username, created_at, updated_at";
    
    // Check for additional fields
    const hasCountryColumn = await checkColumnExists(supabase, "profiles", "country");
    const hasLastSignInColumn = await checkColumnExists(supabase, "profiles", "last_sign_in");
    const hasCreditsColumn = await checkColumnExists(supabase, "profiles", "credits");
    const hasAvatarUrlColumn = await checkColumnExists(supabase, "profiles", "avatar_url");
    const hasGenderColumn = await checkColumnExists(supabase, "profiles", "gender");
    const hasAgeGroupColumn = await checkColumnExists(supabase, "profiles", "age_group");
    const hasCategoriesPlayedColumn = await checkColumnExists(supabase, "profiles", "categories_played");
    
    // Add columns that exist to the query
    if (hasCountryColumn) selectQuery += ", country";
    if (hasLastSignInColumn) selectQuery += ", last_sign_in";
    if (hasCreditsColumn) selectQuery += ", credits";
    if (hasAvatarUrlColumn) selectQuery += ", avatar_url";
    if (hasGenderColumn) selectQuery += ", gender";
    if (hasAgeGroupColumn) selectQuery += ", age_group";
    if (hasCategoriesPlayedColumn) selectQuery += ", categories_played";
    
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
      
      // Build the user data object with available fields
      const userData: UserData = {
        id: user.id,
        email: user.email || '',
        display_name: profile.username || user.email?.split('@')[0] || 'N/A',
        role: profile.role || 'player',
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in: lastSignIn,
      };
      
      // Add optional fields if they exist
      if (hasCountryColumn) userData.country = profile.country || null;
      if (hasAvatarUrlColumn) userData.avatar_url = profile.avatar_url || null;
      if (hasCreditsColumn) userData.credits = profile.credits || 0;
      if (hasGenderColumn) userData.gender = profile.gender || null;
      if (hasAgeGroupColumn) userData.age_group = profile.age_group || null;
      if (hasCategoriesPlayedColumn) userData.categories_played = profile.categories_played || [];
      
      userData.updated_at = profile.updated_at || user.updated_at || null;
      
      return userData;
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
