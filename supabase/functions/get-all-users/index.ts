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
  custom_gender?: string | null;
}

// Check if the user has admin privileges
async function verifyAdminAccess(supabase: any, userId: string): Promise<boolean> {
  try {
    // Special case: Check if the user is the protected admin by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (!userError && userData?.user?.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase()) {
      logger.info("Protected admin detected, granting access regardless of role");
      return true;
    }
    
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
async function columnExists(supabase: any, tableName: string, columnName: string): Promise<boolean> {
  try {
    // Use the column_exists function we created in the database
    const { data, error } = await supabase.rpc('column_exists', { 
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) {
      logger.warn(`Column check for ${columnName}: failed to check`, { error: error.message });
      
      // Fallback method: Try direct SQL execution if RPC fails
      const query = `SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '${tableName}'
          AND column_name = '${columnName}'
      ) AS exists`;
      
      const { data: sqlData, error: sqlError } = await supabase.rpc('execute_sql', { sql: query });
      
      if (sqlError) {
        logger.warn(`Column check for ${columnName}: fallback method failed too`, { error: sqlError.message });
        return false;
      }
      
      const exists = sqlData?.result?.exists || false;
      logger.info(`Column check for ${columnName}: ${exists ? 'exists' : 'does not exist'} (fallback method)`);
      return exists;
    }
    
    logger.info(`Column check for ${columnName}: ${data ? 'exists' : 'does not exist'}`);
    return !!data;
  } catch (err) {
    logger.warn(`Error checking column ${columnName}`, { error: err });
    return false;
  }
}

// Fetch all users with profile data - with robust column detection
async function fetchAllUsers(supabase: any): Promise<UserData[]> {
  try {
    // First, let's get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
      perPage: 1000,  // Ensure we get a good amount of users
    });
    
    if (authError) {
      logger.error("Error fetching auth users", { error: authError });
      throw new Error("Error fetching users: " + authError.message);
    }
    
    if (!authUsers || !Array.isArray(authUsers.users)) {
      logger.error("No users returned from auth.admin.listUsers or invalid format", {
        hasUsers: !!authUsers,
        isArray: Array.isArray(authUsers?.users),
        userCount: authUsers?.users?.length
      });
      return [];
    }

    logger.info(`Retrieved ${authUsers.users.length} users from auth service`);
    
    // First check if the profiles table exists and has the basic columns we need
    const hasProfilesTable = await columnExists(supabase, "profiles", "id");
    
    if (!hasProfilesTable) {
      logger.error("Profiles table doesn't exist or is inaccessible");
      // Return minimal data from auth.users
      return authUsers.users.map(user => ({
        id: user.id,
        email: user.email || '',
        display_name: user.email?.split('@')[0] || 'User',
        role: 'player',
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in: user.last_sign_in_at || null
      }));
    }
    
    // Check which columns exist in profiles table
    const columnsToCheck = [
      "role", "username", "created_at", "updated_at", "country", "last_sign_in", 
      "credits", "avatar_url", "categories_played", "gender", "age_group", 
      "custom_gender", "email"
    ];
    
    let availableColumns: string[] = [];
    
    // Check each column
    for (const column of columnsToCheck) {
      const exists = await columnExists(supabase, "profiles", column);
      if (exists) {
        availableColumns.push(column);
      }
    }
    
    if (availableColumns.length === 0) {
      logger.warn("No usable columns found in profiles table");
      // Return minimal data from auth.users
      return authUsers.users.map(user => ({
        id: user.id,
        email: user.email || '',
        display_name: user.email?.split('@')[0] || 'User',
        role: 'player',
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in: user.last_sign_in_at || null
      }));
    }
    
    // Construct our select statement
    const selectColumns = ["id", ...availableColumns].join(", ");
    logger.info(`Using profiles query with columns: ${selectColumns}`);
    
    // Get profiles with detected fields
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(selectColumns);
    
    if (profilesError) {
      logger.error("Error fetching profiles data", { error: profilesError });
      
      // Try fetching just IDs as a fallback
      const { data: profileIds, error: idsError } = await supabase
        .from("profiles")
        .select("id");
        
      if (idsError) {
        logger.error("Failed to fetch even profile IDs", { error: idsError });
        throw new Error("Error fetching profiles: " + profilesError.message);
      }
      
      // Map basic user info if we have IDs
      logger.info(`Retrieved ${profileIds?.length || 0} profile IDs as fallback`);
      const profileMap = new Map();
      profileIds?.forEach(profile => {
        profileMap.set(profile.id, { id: profile.id });
      });
      
      return authUsers.users.map(user => {
        const profile = profileMap.get(user.id) || {};
        return {
          id: user.id,
          email: user.email || '',
          display_name: user.email?.split('@')[0] || 'User',
          role: 'player',
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in: user.last_sign_in_at || null
        };
      });
    }

    logger.info(`Retrieved ${profiles?.length || 0} profiles from database`);
    
    // Create maps for efficient lookups
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    // Combine auth users with their profiles and optional fields
    const combinedUsers = authUsers.users.map(user => {
      const profile = profileMap.get(user.id) || {};
      
      // Special case for protected admin
      const isProtectedAdminUser = user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
      
      // Build the user data object with available fields
      const userData: UserData = {
        id: user.id,
        email: user.email || '',
        display_name: profile.username || user.email?.split('@')[0] || 'User',
        // For protected admin, always set role to super_admin regardless of what's in the database
        role: isProtectedAdminUser ? 'super_admin' : (profile.role || 'player'),
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
      if (profile.custom_gender !== undefined) userData.custom_gender = profile.custom_gender;
      if (profile.updated_at !== undefined) userData.updated_at = profile.updated_at;
      
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
    // Create Supabase admin client
    const config = getSupabaseConfig();
    if (!config.url || !config.serviceRoleKey) {
      logger.error("Missing Supabase configuration");
      return errorResponse(
        "Server configuration error",
        "server_error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
    const supabaseAdmin = createClient(config.url, config.serviceRoleKey);
    
    // Try a simple auth test before proceeding
    try {
      const { data: testData, error: testError } = await supabaseAdmin.auth.getUser();
      if (testError) {
        logger.error("Supabase client test failed", { error: testError });
      } else {
        logger.info("Supabase client auth check passed");
      }
    } catch (testErr) {
      logger.error("Supabase client initialization error", { error: testErr });
    }

    // Verify authentication
    const { user, error } = await verifyAuth(req);
    if (error) return error;
    if (!user) {
      return errorResponse("Authentication required", "unauthorized", HttpStatus.UNAUTHORIZED);
    }
    
    logger.info("Request authenticated", { userId: user.id, userEmail: user.email });

    // Special case for protected admin
    if (user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase()) {
      logger.info("Protected admin detected, bypassing role check");
      
      // Fetch all users for the protected admin
      try {
        const users = await fetchAllUsers(supabaseAdmin);
        logger.info(`Successfully retrieved ${users.length} users for protected admin`);
        return successResponse(users);
      } catch (fetchError) {
        logger.error("Error fetching users for protected admin", { error: fetchError });
        return errorResponse(
          "Error fetching users: " + (fetchError.message || "Unknown error"),
          "server_error", 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    
    // For other users, verify they have admin privileges
    const isAdmin = await verifyAdminAccess(supabaseAdmin, user.id);
    if (!isAdmin) {
      logger.warn("Unauthorized admin access attempt", { userId: user.id, userEmail: user.email });
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
