
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

// Fetch all users with profile data - with robust column detection
async function fetchAllUsers(supabase: any): Promise<UserData[]> {
  try {
    // First, let's get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      logger.error("Error fetching auth users", { error: authError });
      throw new Error("Error fetching users: " + authError.message);
    }
    
    // Get profiles with only guaranteed fields
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, role, username, created_at, updated_at");
    
    if (profilesError) {
      logger.error("Error fetching base profiles data", { error: profilesError });
      throw new Error("Error fetching profiles: " + profilesError.message);
    }

    // Attempt to get additional optional fields separately to avoid column errors
    let countryData = [];
    try {
      const { data, error } = await supabase.from("profiles").select("id, country").is("country", null).limit(1);
      if (!error) countryData = await supabase.from("profiles").select("id, country");
    } catch (e) {
      logger.warn("Country column not available", { error: e });
    }
    
    let lastSignInData = [];
    try {
      const { data, error } = await supabase.from("profiles").select("id, last_sign_in").is("last_sign_in", null).limit(1);
      if (!error) lastSignInData = await supabase.from("profiles").select("id, last_sign_in");
    } catch (e) {
      logger.warn("last_sign_in column not available", { error: e });
    }
    
    let creditsData = [];
    try {
      const { data, error } = await supabase.from("profiles").select("id, credits").is("credits", null).limit(1);
      if (!error) creditsData = await supabase.from("profiles").select("id, credits");
    } catch (e) {
      logger.warn("credits column not available", { error: e });
    }
    
    let avatarUrlData = [];
    try {
      const { data, error } = await supabase.from("profiles").select("id, avatar_url").is("avatar_url", null).limit(1);
      if (!error) avatarUrlData = await supabase.from("profiles").select("id, avatar_url");
    } catch (e) {
      logger.warn("avatar_url column not available", { error: e });
    }
    
    let categoriesPlayedData = [];
    try {
      const { data, error } = await supabase.from("profiles").select("id, categories_played").is("categories_played", null).limit(1);
      if (!error) categoriesPlayedData = await supabase.from("profiles").select("id, categories_played");
    } catch (e) {
      logger.warn("categories_played column not available", { error: e });
    }

    // Create maps for efficient lookups
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    const countryMap = new Map();
    countryData?.data?.forEach(item => {
      countryMap.set(item.id, item.country);
    });
    
    const lastSignInMap = new Map();
    lastSignInData?.data?.forEach(item => {
      lastSignInMap.set(item.id, item.last_sign_in);
    });
    
    const creditsMap = new Map();
    creditsData?.data?.forEach(item => {
      creditsMap.set(item.id, item.credits);
    });
    
    const avatarUrlMap = new Map();
    avatarUrlData?.data?.forEach(item => {
      avatarUrlMap.set(item.id, item.avatar_url);
    });
    
    const categoriesPlayedMap = new Map();
    categoriesPlayedData?.data?.forEach(item => {
      categoriesPlayedMap.set(item.id, item.categories_played);
    });

    // Combine auth users with their profiles and optional fields
    const combinedUsers = authUsers.users.map(user => {
      const profile = profileMap.get(user.id) || {};
      
      const lastSignIn = lastSignInMap.get(user.id) || user.last_sign_in_at || null;
      
      // Build the user data object with available fields
      const userData: UserData = {
        id: user.id,
        email: user.email || '',
        display_name: profile.username || user.email?.split('@')[0] || 'N/A',
        role: profile.role || 'player',
        created_at: user.created_at || profile.created_at || new Date().toISOString(),
        last_sign_in: lastSignIn,
      };
      
      // Add optional fields if they exist in the maps
      if (countryMap.has(user.id)) userData.country = countryMap.get(user.id);
      if (avatarUrlMap.has(user.id)) userData.avatar_url = avatarUrlMap.get(user.id);
      if (creditsMap.has(user.id)) userData.credits = creditsMap.get(user.id);
      if (categoriesPlayedMap.has(user.id)) userData.categories_played = categoriesPlayedMap.get(user.id);
      
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
