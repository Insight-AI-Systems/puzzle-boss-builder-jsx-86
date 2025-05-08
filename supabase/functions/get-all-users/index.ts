
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handleCorsOptions, corsHeaders } from "../_shared/cors.ts";

// Define HTTP status codes here since they're missing from the shared module
enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

// Helper functions for creating standardized responses
function successResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    {
      status: HttpStatus.OK,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

function errorResponse(message: string, code: string, status: HttpStatus) {
  return new Response(
    JSON.stringify({ error: { message, code } }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

// Special admin email for direct access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

// Initialize logger
class EdgeFunctionLogger {
  functionName: string;

  constructor(functionName: string) {
    this.functionName = functionName;
  }

  info(message: string, data: any = {}) {
    console.log(JSON.stringify({
      level: 'info',
      function: this.functionName,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  warn(message: string, data: any = {}) {
    console.log(JSON.stringify({
      level: 'warn',
      function: this.functionName,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  error(message: string, data: any = {}) {
    console.log(JSON.stringify({
      level: 'error',
      function: this.functionName,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }
}

const logger = new EdgeFunctionLogger("get-all-users");

// Function to get Supabase configuration from environment variables
function getSupabaseConfig() {
  return {
    url: Deno.env.get('SUPABASE_URL'),
    serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  };
}

// Check if a user is protected admin by email
function isProtectedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}

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

// Verify authentication from request
async function verifyAuth(request: Request) {
  try {
    // Extract the JWT from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return { 
        user: null, 
        error: errorResponse("No authorization header", "no_auth", HttpStatus.UNAUTHORIZED) 
      };
    }

    const token = authHeader.replace('Bearer ', '');
    const config = getSupabaseConfig();
    if (!config.url || !config.serviceRoleKey) {
      return { 
        user: null, 
        error: errorResponse("Server configuration error", "server_error", HttpStatus.INTERNAL_SERVER_ERROR) 
      };
    }

    // Create a Supabase client to verify the token
    const supabaseAdmin = createClient(config.url, config.serviceRoleKey);
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      logger.warn("Auth verification failed", { error });
      return { 
        user: null, 
        error: errorResponse("Invalid token", "invalid_token", HttpStatus.UNAUTHORIZED)
      };
    }

    return { user: data.user, error: null };
  } catch (err) {
    logger.error("Error in verifyAuth", { error: err });
    return { 
      user: null, 
      error: errorResponse("Authentication error", "auth_error", HttpStatus.UNAUTHORIZED)
    };
  }
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
    
    const hasAccess = profile && ["admin", "super_admin", "cfo", "category_manager"].includes(profile.role);
    logger.info("Admin access check", { userId, role: profile?.role, hasAccess });
    return hasAccess;
  } catch (error) {
    logger.error("Error in admin access verification", { error, userId });
    return false;
  }
}

// Fetch all users with profile data
async function fetchAllUsers(supabase: any): Promise<UserData[]> {
  try {
    logger.info("Starting fetchAllUsers function");
    
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
    
    // Get profiles with all columns
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");
    
    if (profilesError) {
      logger.error("Error fetching profiles data", { error: profilesError });
      
      // Try fetching just IDs as a fallback
      const { data: profileIds, error: idsError } = await supabase
        .from("profiles")
        .select("id");
        
      if (idsError) {
        logger.error("Failed to fetch even profile IDs", { error: idsError });
        
        // Last resort: return basic user data from auth
        logger.info("Falling back to basic auth user data");
        return authUsers.users.map((user: any) => ({
          id: user.id,
          email: user.email || '',
          display_name: user.email?.split('@')[0] || 'User',
          role: user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase() ? 'super_admin' : 'player',
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in: user.last_sign_in_at || null
        }));
      }
      
      // Map basic user info if we have IDs
      logger.info(`Retrieved ${profileIds?.length || 0} profile IDs as fallback`);
      const profileMap = new Map();
      profileIds?.forEach((profile: any) => {
        profileMap.set(profile.id, { id: profile.id });
      });
      
      return authUsers.users.map((user: any) => {
        const profile = profileMap.get(user.id) || {};
        return {
          id: user.id,
          email: user.email || '',
          display_name: user.email?.split('@')[0] || 'User',
          role: user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase() ? 'super_admin' : 'player',
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in: user.last_sign_in_at || null
        };
      });
    }

    logger.info(`Retrieved ${profiles?.length || 0} profiles from database`);
    
    // Create maps for efficient lookups
    const profileMap = new Map();
    profiles?.forEach((profile: any) => {
      profileMap.set(profile.id, profile);
    });
    
    // Combine auth users with their profiles and optional fields
    const combinedUsers = authUsers.users.map((user: any) => {
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
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

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
