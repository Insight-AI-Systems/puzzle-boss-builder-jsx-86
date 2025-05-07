
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handleCorsOptions, corsHeaders } from "../_shared/cors.ts";
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

// Check if a column exists in a table
async function columnExists(supabase: any, tableName: string, columnName: string): Promise<boolean> {
  try {
    // Try to select a single row with just that column
    const query = `SELECT ${columnName} FROM ${tableName} LIMIT 1`;
    const { error } = await supabase.rpc('execute_sql', { sql: query });
    
    if (error) {
      logger.warn(`Column check for ${columnName}: column does not exist`, { error: error.message });
      return false;
    }
    
    logger.info(`Column check for ${columnName}: column exists`);
    return true;
  } catch (err) {
    logger.warn(`Error checking column ${columnName}`, { error: err });
    return false;
  }
}

// Fetch all users with profile data - with robust column detection
async function fetchAllUsers(supabase: any): Promise<UserData[]> {
  try {
    // First, let's get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      logger.error("Error fetching auth users", { error: authError });
      throw new Error("Error fetching users: " + authError.message);
    }
    
    if (!authUsers || !authUsers.users) {
      logger.error("No users returned from auth.admin.listUsers");
      return [];
    }

    logger.info(`Retrieved ${authUsers.users.length} users from auth service`);
    
    // Check which columns exist in profiles table
    const baseColumns = "id, role, username, created_at, updated_at";
    let extraColumns: string[] = [];
    
    // Check for optional columns
    const columnsToCheck = [
      "country", "last_sign_in", "credits", "avatar_url", "categories_played", 
      "gender", "age_group", "custom_gender"
    ];
    
    for (const column of columnsToCheck) {
      const exists = await columnExists(supabase, "profiles", column);
      if (exists) {
        extraColumns.push(column);
      }
    }
    
    // Construct our select statement
    const selectColumns = [baseColumns, ...extraColumns].join(", ");
    logger.info(`Using profiles query`, { selectColumns });
    
    // Get profiles with detected fields
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(selectColumns);
    
    if (profilesError) {
      logger.error("Error fetching base profiles data", { error: profilesError });
      throw new Error("Error fetching profiles: " + profilesError.message);
    }

    // Create maps for efficient lookups
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    // Combine auth users with their profiles and optional fields
    const combinedUsers = authUsers.users.map(user => {
      const profile = profileMap.get(user.id) || {};
      
      // Build the user data object with available fields
      const userData: UserData = {
        id: user.id,
        email: user.email || '',
        display_name: profile.username || user.email?.split('@')[0] || 'User',
        role: profile.role || 'player',
        created_at: user.created_at || profile.created_at || new Date().toISOString(),
        last_sign_in: profile.last_sign_in || user.last_sign_in_at || null,
      };
      
      // Add optional fields if they exist in the profile
      if (profile.country !== undefined) userData.country = profile.country;
      if (profile.avatar_url !== undefined) userData.avatar_url = profile.avatar_url;
      if (profile.credits !== undefined) userData.credits = profile.credits;
      if (profile.categories_played !== undefined) userData.categories_played = profile.categories_played;
      if (profile.gender !== undefined) userData.gender = profile.gender;
      if (profile.age_group !== undefined) userData.age_group = profile.age_group;
      
      userData.updated_at = profile.updated_at || user.updated_at || null;
      
      return userData;
    });

    logger.info(`Successfully processed ${combinedUsers.length} users`);
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
