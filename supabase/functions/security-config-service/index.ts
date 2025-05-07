
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
import { verifyAuth } from "../_shared/auth.ts";
import { getEnvVariable } from "../_shared/config.ts";

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
  }
};

/**
 * Protected admin configuration that requires database lookups
 * This includes dynamic settings that may change during runtime
 */
const PROTECTED_CONFIG_KEY = 'admin_emails';

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
      return errorResponse("Invalid JSON body", "invalid_request", 400);
    }
    
    const { action, params } = reqBody || {};
    
    if (!action) {
      return errorResponse("Missing required 'action' parameter", "invalid_request", 400);
    }
    
    // Get user's role if authenticated
    let userRole = null;
    let isAdmin = false;
    
    if (user) {
      // Get user's role
      const { data: profileData } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      userRole = profileData?.role || 'player';
      isAdmin = userRole === SECURITY_CONSTANTS.ROLES.ADMIN || 
                userRole === SECURITY_CONSTANTS.ROLES.SUPER_ADMIN;
      
      // Log access attempt
      await supabaseAdmin.from("security_audit_logs").insert({
        user_id: user.id,
        event_type: "SECURITY_CONFIG_ACCESS",
        ip_address: req.headers.get("x-forwarded-for") || "unknown",
        user_agent: req.headers.get("user-agent") || "unknown",
        details: { action, params },
        severity: "info"
      });
    }
    
    // Handle different actions
    switch (action) {
      case "getSecurityConstants": {
        // Remove sensitive parts of the config based on role
        const filteredConfig = filterConfigByRole(SECURITY_CONSTANTS, userRole);
        return successResponse({ config: filteredConfig });
      }
        
      case "getAdminEmails": {
        // Only admins can access protected admin emails
        if (!isAdmin) {
          return errorResponse(
            "Insufficient permissions to access admin emails", 
            "permission_denied", 
            403
          );
        }
        
        // Retrieve protected admin emails from secure storage
        const { data: configData, error: configError } = await supabaseAdmin
          .from("security_config")
          .select("config_value")
          .eq("config_key", PROTECTED_CONFIG_KEY)
          .single();
        
        if (configError) {
          console.error("Error fetching admin emails:", configError);
          return errorResponse(
            "Failed to retrieve admin configuration", 
            "database_error", 
            500
          );
        }
        
        return successResponse({ adminEmails: configData.config_value || [] });
      }
        
      case "validateAdminAccess": {
        if (!user) {
          return errorResponse("Authentication required", "unauthorized", 401);
        }
        
        // This endpoint checks if a user is an admin either by role or protected email
        // 1. First check if user has admin/super_admin role
        const isRoleAdmin = userRole === SECURITY_CONSTANTS.ROLES.ADMIN || 
                           userRole === SECURITY_CONSTANTS.ROLES.SUPER_ADMIN;
        
        // 2. If not admin by role, check if email is in protected list
        let isProtectedAdmin = false;
        
        if (!isRoleAdmin) {
          // Get protected admin emails list
          const { data: configData } = await supabaseAdmin
            .from("security_config")
            .select("config_value")
            .eq("config_key", PROTECTED_CONFIG_KEY)
            .single();
          
          const adminEmails = configData?.config_value || [];
          isProtectedAdmin = user.email && Array.isArray(adminEmails) && 
                            adminEmails.includes(user.email);
        }
        
        const isAdmin = isRoleAdmin || isProtectedAdmin;
        
        // Log validation attempt for audit purposes
        await supabaseAdmin.from("security_audit_logs").insert({
          user_id: user.id,
          event_type: "ADMIN_ACCESS_VALIDATION",
          ip_address: req.headers.get("x-forwarded-for") || "unknown",
          user_agent: req.headers.get("user-agent") || "unknown",
          details: { 
            result: isAdmin ? "granted" : "denied",
            isRoleAdmin,
            isProtectedAdmin,
            email: user.email
          },
          severity: isAdmin ? "info" : "warning"
        });
        
        return successResponse({ 
          isAdmin,
          details: {
            byRole: isRoleAdmin,
            byEmail: isProtectedAdmin
          }
        });
      }
      
      case "getPermissionsForRole": {
        const roleToCheck = params?.role || userRole;
        
        if (!roleToCheck) {
          return errorResponse("No role specified", "invalid_request", 400);
        }
        
        // Only admins can check permissions for roles other than their own
        if (roleToCheck !== userRole && !isAdmin) {
          return errorResponse(
            "Insufficient permissions to access role information", 
            "permission_denied", 
            403
          );
        }
        
        // Get permissions for the specified role
        const { data: permissions, error: permError } = await supabaseAdmin
          .from("role_permissions")
          .select("permissions(name, description)")
          .eq("role", roleToCheck);
        
        if (permError) {
          console.error("Error fetching permissions:", permError);
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
        
        return successResponse({ 
          role: roleToCheck,
          permissions: permissionList
        });
      }
      
      case "addProtectedAdmin": {
        // Only super admins can add protected admins
        if (userRole !== SECURITY_CONSTANTS.ROLES.SUPER_ADMIN) {
          return errorResponse(
            "Only super admins can modify protected admin list", 
            "permission_denied", 
            403
          );
        }
        
        const email = params?.email;
        if (!email || typeof email !== 'string') {
          return errorResponse("Valid email is required", "invalid_request", 400);
        }
        
        // Get current admin emails
        const { data: configData, error: configError } = await supabaseAdmin
          .from("security_config")
          .select("config_value")
          .eq("config_key", PROTECTED_CONFIG_KEY)
          .single();
        
        if (configError) {
          console.error("Error fetching admin emails:", configError);
          return errorResponse(
            "Failed to retrieve admin configuration", 
            "database_error", 
            500
          );
        }
        
        // Add email if not already in the list
        let adminEmails = configData.config_value || [];
        if (!Array.isArray(adminEmails)) adminEmails = [];
        
        if (!adminEmails.includes(email)) {
          adminEmails.push(email);
          
          // Update the config
          const { error: updateError } = await supabaseAdmin
            .from("security_config")
            .update({ config_value: adminEmails })
            .eq("config_key", PROTECTED_CONFIG_KEY);
          
          if (updateError) {
            console.error("Error updating admin emails:", updateError);
            return errorResponse(
              "Failed to update admin configuration", 
              "database_error", 
              500
            );
          }
        }
        
        return successResponse({ 
          message: "Protected admin added successfully",
          adminEmails
        });
      }
      
      case "removeProtectedAdmin": {
        // Only super admins can remove protected admins
        if (userRole !== SECURITY_CONSTANTS.ROLES.SUPER_ADMIN) {
          return errorResponse(
            "Only super admins can modify protected admin list", 
            "permission_denied", 
            403
          );
        }
        
        const email = params?.email;
        if (!email || typeof email !== 'string') {
          return errorResponse("Valid email is required", "invalid_request", 400);
        }
        
        // Get current admin emails
        const { data: configData, error: configError } = await supabaseAdmin
          .from("security_config")
          .select("config_value")
          .eq("config_key", PROTECTED_CONFIG_KEY)
          .single();
        
        if (configError) {
          console.error("Error fetching admin emails:", configError);
          return errorResponse(
            "Failed to retrieve admin configuration", 
            "database_error", 
            500
          );
        }
        
        // Remove email if in the list
        let adminEmails = configData.config_value || [];
        if (!Array.isArray(adminEmails)) adminEmails = [];
        
        const initialLength = adminEmails.length;
        adminEmails = adminEmails.filter(e => e !== email);
        
        if (adminEmails.length < initialLength) {
          // Update the config if there was a change
          const { error: updateError } = await supabaseAdmin
            .from("security_config")
            .update({ config_value: adminEmails })
            .eq("config_key", PROTECTED_CONFIG_KEY);
          
          if (updateError) {
            console.error("Error updating admin emails:", updateError);
            return errorResponse(
              "Failed to update admin configuration", 
              "database_error", 
              500
            );
          }
        }
        
        return successResponse({ 
          message: "Protected admin removed successfully",
          adminEmails
        });
      }
        
      default:
        return errorResponse(`Unknown action: ${action}`, "invalid_action", 400);
    }
    
  } catch (error) {
    console.error("Unexpected error in security config service:", error);
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
  }
  
  return configCopy;
}
