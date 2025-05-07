
/**
 * @file Security Configuration Service
 * 
 * This edge function serves as a centralized service for security configuration,
 * removing the need for hardcoded security values across the application.
 * 
 * @version 1.0.0
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";
import { errorResponse, successResponse } from "../_shared/response.ts";
import { verifyAuth, PROTECTED_ADMIN_EMAIL } from "../_shared/auth.ts";
import { getEnvVariable } from "../_shared/config.ts";
import { EdgeFunctionLogger } from "../_shared/logging.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("security-config-service");

// Set up a memory cache for frequently accessed configurations
const configCache: Record<string, { data: any, expiresAt: number }> = {};
const CACHE_TTL_MS = 300000; // 5 minutes cache TTL

/**
 * Core security configuration constants
 * These are the centralized security settings used across the application
 */
const SECURITY_CONSTANTS = {
  // Admin role definitions
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    CATEGORY_MANAGER: 'category_manager',
    PLAYER: 'player',
  },
  
  // Authentication levels
  AUTH_LEVELS: {
    PUBLIC: 'public',       // No authentication required
    USER: 'user',           // Basic authenticated user
    ADMIN: 'admin',         // Admin privileges required
    SUPER_ADMIN: 'super_admin', // Super admin privileges required
    MFA: 'mfa'              // Multi-factor authentication required
  },
  
  // Session settings
  SESSION: {
    DEFAULT_TIMEOUT: 3600,  // 1 hour in seconds
    EXTENDED_TIMEOUT: 86400, // 24 hours in seconds
    MFA_REQUIRED_ACTIONS: ['update_security_settings', 'access_financial_data']
  },
  
  // CSRF protection settings
  CSRF: {
    COOKIE_NAME: 'csrf_token',
    HEADER_NAME: 'X-CSRF-Token',
    MAX_AGE: 86400,
    SAME_SITE: 'strict',
    SECURE: true
  },
  
  // Protected admin emails that always have admin access
  PROTECTED_ADMINS: [
    PROTECTED_ADMIN_EMAIL
  ]
};

/**
 * Protected admin configuration that requires database lookups
 * This includes dynamic settings that may change during runtime
 */
const PROTECTED_CONFIG_KEY = 'admin_emails';

/**
 * Get a cached configuration or fetch it from the database
 * 
 * @param supabase - Supabase client
 * @param configKey - Configuration key to fetch
 * @returns Configuration data
 */
async function getCachedConfig(supabase: any, configKey: string): Promise<any> {
  const now = Date.now();
  
  // Check if we have a valid cached value
  if (configCache[configKey] && configCache[configKey].expiresAt > now) {
    logger.info("Config cache hit", { configKey });
    return configCache[configKey].data;
  }
  
  // If not in cache or expired, fetch from the database
  logger.info("Config cache miss, fetching from database", { configKey });
  const { data, error } = await supabase
    .from("security_config")
    .select("config_value")
    .eq("config_key", configKey)
    .single();
    
  if (error) {
    throw error;
  }
  
  // Store in cache
  configCache[configKey] = {
    data: data.config_value,
    expiresAt: now + CACHE_TTL_MS
  };
  
  return data.config_value;
}

/**
 * Remove item from cache
 * 
 * @param configKey - Configuration key to invalidate
 */
function invalidateCache(configKey: string): void {
  delete configCache[configKey];
  logger.info("Cache invalidated", { configKey });
}

/**
 * Handle incoming requests to the security configuration service
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      getEnvVariable("SUPABASE_URL"),
      getEnvVariable("SUPABASE_SERVICE_ROLE_KEY"),
    );
    
    // Verify authentication (will return error response if unauthorized)
    const { user, error: authError } = await verifyAuth(req);
    if (authError) return authError;
    
    // Parse request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (e) {
      logger.error("Invalid JSON request body", { error: e });
      return errorResponse("Invalid JSON body", "invalid_request", 400);
    }
    
    const { action, params } = reqBody || {};
    
    if (!action) {
      logger.warn("Missing required action parameter");
      return errorResponse("Missing required 'action' parameter", "invalid_request", 400);
    }
    
    // Get user's role if authenticated
    let userRole = null;
    let isAdmin = false;
    
    if (user) {
      // Special case for protected admin
      if (user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase()) {
        userRole = SECURITY_CONSTANTS.ROLES.SUPER_ADMIN;
        isAdmin = true;
        
        logger.info("Protected admin accessing security config service", { email: user.email });
      } else {
        // Get user's role from database
        const { data: profileData } = await supabaseAdmin
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        userRole = profileData?.role || 'player';
        isAdmin = userRole === SECURITY_CONSTANTS.ROLES.ADMIN || 
                  userRole === SECURITY_CONSTANTS.ROLES.SUPER_ADMIN;
      }
      
      // Log access attempt
      await supabaseAdmin.from("security_audit_logs").insert({
        user_id: user.id,
        event_type: "SECURITY_CONFIG_ACCESS",
        ip_address: req.headers.get("x-forwarded-for") || "unknown",
        user_agent: req.headers.get("user-agent") || "unknown",
        details: { action, params, userRole },
        severity: "info",
        email: user.email
      });
    }
    
    // Handle different actions
    switch (action) {
      case "getSecurityConstants": {
        logger.info("Processing getSecurityConstants request", { userRole });
        
        // Remove sensitive parts of the config based on role
        const filteredConfig = filterConfigByRole(SECURITY_CONSTANTS, userRole);
        return successResponse({ config: filteredConfig });
      }
        
      case "getAdminEmails": {
        logger.info("Processing getAdminEmails request", { isAdmin });
        
        // Only admins can access protected admin emails
        if (!isAdmin) {
          logger.warn("Permission denied for getAdminEmails", { userRole });
          return errorResponse(
            "Insufficient permissions to access admin emails", 
            "permission_denied", 
            403
          );
        }
        
        try {
          // Retrieve protected admin emails from secure storage
          const configData = await getCachedConfig(supabaseAdmin, PROTECTED_CONFIG_KEY);
          return successResponse({ adminEmails: configData || [] });
        } catch (error) {
          logger.error("Error fetching admin emails", { error });
          return errorResponse(
            "Failed to retrieve admin configuration", 
            "database_error", 
            500
          );
        }
      }
        
      case "validateAdminAccess": {
        if (!user) {
          logger.warn("Unauthenticated user attempted to validate admin access");
          return errorResponse("Authentication required", "unauthorized", 401);
        }
        
        logger.info("Processing validateAdminAccess request", { 
          userId: user.id, 
          email: user.email,
          userRole
        });
        
        // This endpoint checks if a user is an admin either by role or protected email
        // 1. First check if this is the protected admin email
        const isProtectedAdminUser = user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
        
        // 2. If not protected admin, check if user has admin/super_admin role
        const isRoleAdmin = !isProtectedAdminUser && (
          userRole === SECURITY_CONSTANTS.ROLES.ADMIN || 
          userRole === SECURITY_CONSTANTS.ROLES.SUPER_ADMIN
        );
        
        // 3. If not admin by role or protected email, check if email is in protected list
        let isProtectedAdmin = isProtectedAdminUser;
        
        if (!isRoleAdmin && !isProtectedAdmin) {
          try {
            // Get protected admin emails list from cache/db
            const adminEmails = await getCachedConfig(supabaseAdmin, PROTECTED_CONFIG_KEY);
            isProtectedAdmin = user.email && Array.isArray(adminEmails) && 
                              adminEmails.includes(user.email.toLowerCase());
          } catch (error) {
            logger.error("Error checking admin email list", { error });
            // Default to false on error
            isProtectedAdmin = false;
          }
        }
        
        const userIsAdmin = isRoleAdmin || isProtectedAdmin;
        
        // Log validation attempt for audit purposes
        await supabaseAdmin.from("security_audit_logs").insert({
          user_id: user.id,
          event_type: "ADMIN_ACCESS_VALIDATION",
          ip_address: req.headers.get("x-forwarded-for") || "unknown",
          user_agent: req.headers.get("user-agent") || "unknown",
          details: { 
            result: userIsAdmin ? "granted" : "denied",
            isRoleAdmin,
            isProtectedAdmin,
            email: user.email
          },
          severity: userIsAdmin ? "info" : "warning",
          email: user.email
        });
        
        return successResponse({ 
          isAdmin: userIsAdmin,
          details: {
            byRole: isRoleAdmin,
            byEmail: isProtectedAdmin
          }
        });
      }
      
      case "getPermissionsForRole": {
        const roleToCheck = params?.role || userRole;
        
        if (!roleToCheck) {
          logger.warn("Missing role in getPermissionsForRole request");
          return errorResponse("No role specified", "invalid_request", 400);
        }
        
        logger.info("Processing getPermissionsForRole request", { roleToCheck, userRole });
        
        // Only admins can check permissions for roles other than their own
        if (roleToCheck !== userRole && !isAdmin) {
          logger.warn("Permission denied for getPermissionsForRole", { 
            requestedRole: roleToCheck, 
            userRole 
          });
          
          return errorResponse(
            "Insufficient permissions to access role information", 
            "permission_denied", 
            403
          );
        }
        
        try {
          // Check cache first
          const cacheKey = `permissions_${roleToCheck}`;
          if (configCache[cacheKey] && configCache[cacheKey].expiresAt > Date.now()) {
            return successResponse({ 
              role: roleToCheck,
              permissions: configCache[cacheKey].data
            });
          }
          
          // Get permissions for the specified role from DB
          const { data: permissions, error: permError } = await supabaseAdmin
            .from("role_permissions")
            .select("permissions(name, description)")
            .eq("role", roleToCheck);
          
          if (permError) {
            logger.error("Error fetching permissions", { error: permError });
            return errorResponse(
              "Failed to retrieve permissions", 
              "database_error", 
              500
            );
          }
          
          // Extract permission names from the nested query results
          const permissionList = permissions.map(
            (p: any) => ({ 
              name: p.permissions.name,
              description: p.permissions.description
            })
          );
          
          // Cache the results
          configCache[cacheKey] = {
            data: permissionList,
            expiresAt: Date.now() + CACHE_TTL_MS
          };
          
          return successResponse({ 
            role: roleToCheck,
            permissions: permissionList
          });
        } catch (error) {
          logger.error("Exception in getPermissionsForRole", { error });
          return errorResponse(
            "Error retrieving permissions", 
            "server_error", 
            500
          );
        }
      }
      
      case "addProtectedAdmin": {
        // Only super admins can add protected admins
        if (userRole !== SECURITY_CONSTANTS.ROLES.SUPER_ADMIN) {
          logger.warn("Permission denied for addProtectedAdmin", { userRole });
          return errorResponse(
            "Only super admins can modify protected admin list", 
            "permission_denied", 
            403
          );
        }
        
        const email = params?.email;
        if (!email || typeof email !== 'string') {
          logger.warn("Invalid email in addProtectedAdmin request");
          return errorResponse("Valid email is required", "invalid_request", 400);
        }
        
        logger.info("Processing addProtectedAdmin request", { email });
        
        try {
          // Get current admin emails
          const configData = await getCachedConfig(supabaseAdmin, PROTECTED_CONFIG_KEY);
          
          // Add email if not already in the list
          let adminEmails = configData || [];
          if (!Array.isArray(adminEmails)) adminEmails = [];
          
          const normalizedEmail = email.toLowerCase();
          if (!adminEmails.includes(normalizedEmail)) {
            adminEmails.push(normalizedEmail);
            
            // Update the config
            const { error: updateError } = await supabaseAdmin
              .from("security_config")
              .update({ config_value: adminEmails })
              .eq("config_key", PROTECTED_CONFIG_KEY);
            
            if (updateError) {
              logger.error("Error updating admin emails", { error: updateError });
              return errorResponse(
                "Failed to update admin configuration", 
                "database_error", 
                500
              );
            }
            
            // Invalidate cache
            invalidateCache(PROTECTED_CONFIG_KEY);
          }
          
          return successResponse({ 
            message: "Protected admin added successfully",
            adminEmails
          });
        } catch (error) {
          logger.error("Exception in addProtectedAdmin", { error });
          return errorResponse(
            "Error updating protected admin list", 
            "server_error", 
            500
          );
        }
      }
      
      case "removeProtectedAdmin": {
        // Only super admins can remove protected admins
        if (userRole !== SECURITY_CONSTANTS.ROLES.SUPER_ADMIN) {
          logger.warn("Permission denied for removeProtectedAdmin", { userRole });
          return errorResponse(
            "Only super admins can modify protected admin list", 
            "permission_denied", 
            403
          );
        }
        
        const email = params?.email;
        if (!email || typeof email !== 'string') {
          logger.warn("Invalid email in removeProtectedAdmin request");
          return errorResponse("Valid email is required", "invalid_request", 400);
        }
        
        // Prevent removing the hardcoded protected admin
        if (email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase()) {
          logger.warn("Attempted to remove built-in protected admin", { email });
          return errorResponse(
            "Cannot remove built-in protected admin", 
            "forbidden_operation", 
            403
          );
        }
        
        logger.info("Processing removeProtectedAdmin request", { email });
        
        try {
          // Get current admin emails
          const configData = await getCachedConfig(supabaseAdmin, PROTECTED_CONFIG_KEY);
          
          // Remove email if in the list
          let adminEmails = configData || [];
          if (!Array.isArray(adminEmails)) adminEmails = [];
          
          const normalizedEmail = email.toLowerCase();
          const initialLength = adminEmails.length;
          adminEmails = adminEmails.filter(e => e !== normalizedEmail);
          
          if (adminEmails.length < initialLength) {
            // Update the config if there was a change
            const { error: updateError } = await supabaseAdmin
              .from("security_config")
              .update({ config_value: adminEmails })
              .eq("config_key", PROTECTED_CONFIG_KEY);
            
            if (updateError) {
              logger.error("Error updating admin emails", { error: updateError });
              return errorResponse(
                "Failed to update admin configuration", 
                "database_error", 
                500
              );
            }
            
            // Invalidate cache
            invalidateCache(PROTECTED_CONFIG_KEY);
          }
          
          return successResponse({ 
            message: "Protected admin removed successfully",
            adminEmails
          });
        } catch (error) {
          logger.error("Exception in removeProtectedAdmin", { error });
          return errorResponse(
            "Error updating protected admin list", 
            "server_error", 
            500
          );
        }
      }
      
      case "clearCache": {
        // Only admins can clear cache
        if (!isAdmin) {
          logger.warn("Permission denied for clearCache", { userRole });
          return errorResponse(
            "Insufficient permissions to clear cache", 
            "permission_denied", 
            403
          );
        }
        
        logger.info("Processing clearCache request");
        
        // Clear all cache entries
        Object.keys(configCache).forEach(key => {
          delete configCache[key];
        });
        
        return successResponse({ 
          message: "Cache cleared successfully",
          entriesCleared: Object.keys(configCache).length
        });
      }
        
      default:
        logger.warn("Unknown action requested", { action });
        return errorResponse(`Unknown action: ${action}`, "invalid_action", 400);
    }
    
  } catch (error) {
    logger.error("Unexpected error in security config service", { error });
    return errorResponse(
      "An unexpected error occurred", 
      "server_error", 
      500, 
      { error: String(error) }
    );
  }
});

/**
 * Filter the security configuration based on user role
 * This ensures users only see configuration relevant to their access level
 * 
 * @param config - The full configuration object
 * @param role - User role to filter for
 * @returns Filtered configuration object
 */
function filterConfigByRole(config: any, role: string | null): any {
  // Deep copy to avoid modifying the original
  const configCopy = JSON.parse(JSON.stringify(config));
  
  // If not authenticated or no role, return only public config
  if (!role) {
    return {
      AUTH_LEVELS: configCopy.AUTH_LEVELS,
      CSRF: configCopy.CSRF
    };
  }
  
  // If not admin, remove sensitive settings
  if (role !== SECURITY_CONSTANTS.ROLES.ADMIN && 
      role !== SECURITY_CONSTANTS.ROLES.SUPER_ADMIN) {
    // Remove admin-specific settings
    delete configCopy.SESSION.MFA_REQUIRED_ACTIONS;
    delete configCopy.PROTECTED_ADMINS;
  }
  
  return configCopy;
}
