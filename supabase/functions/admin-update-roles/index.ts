
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";
import { successResponse, errorResponse, forbiddenResponse, validationErrorResponse } from "../_shared/response.ts";
import { validateRequiredFields, isValidUuid } from "../_shared/validation.ts";

// Valid roles that can be assigned
const VALID_ROLES = ["super_admin", "admin", "category_manager", "social_media_manager", "partner_manager", "cfo", "player"];

// Rate limiting state (in production, use a persistent store)
const rateLimitState: Record<string, { count: number; resetTime: number }> = {};

// Check if request is rate limited
function isRateLimited(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const state = rateLimitState[identifier] || { count: 0, resetTime: now + windowMs };
  
  // Reset counter if window expired
  if (now > state.resetTime) {
    state.count = 1;
    state.resetTime = now + windowMs;
    rateLimitState[identifier] = state;
    return false;
  }
  
  // Increment and check
  state.count++;
  rateLimitState[identifier] = state;
  return state.count > maxRequests;
}

// Fetch protected admin emails from security-config-service
async function getProtectedAdminEmails(supabaseAdmin: any): Promise<string[]> {
  try {
    // Call the security-config-service to get protected admin emails
    const { data, error } = await supabaseAdmin.functions.invoke('security-config-service', {
      body: {
        action: 'getAdminEmails'
      }
    });
    
    if (error) {
      console.error('Error fetching protected admin emails:', error);
      return ['alan@insight-ai-systems.com']; // Fallback to hardcoded value for safety
    }
    
    return data.adminEmails || ['alan@insight-ai-systems.com'];
  } catch (err) {
    console.error('Exception fetching protected admin emails:', err);
    return ['alan@insight-ai-systems.com']; // Fallback to hardcoded value for safety
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin API key for full access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return errorResponse("No authorization header provided", "unauthorized", 401);
    }

    // Get JWT token from header and verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return errorResponse("Unauthorized - invalid token", "unauthorized", 401);
    }

    // Rate limiting check (using IP and user ID)
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `role-update:${user.id}:${clientIp}`;
    
    if (isRateLimited(rateLimitKey)) {
      return errorResponse("Too many requests, please try again later", "rate_limit_exceeded", 429);
    }

    // Log user trying to perform action
    console.log(`User ${user.id} (${user.email}) attempting to update roles`);

    // Fetch protected admin emails
    const protectedAdminEmails = await getProtectedAdminEmails(supabaseAdmin);

    // Check if user is super_admin or in protected emails list
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return errorResponse("Unauthorized - profile not found", "profile_not_found", 403);
    }

    // Special case for protected admin emails
    const isProtectedAdminEmail = protectedAdminEmails.includes(user.email || '');
    const isSuperAdmin = profile.role === "super_admin" || isProtectedAdminEmail;
    const isAdmin = isSuperAdmin || profile.role === "admin";

    if (!isAdmin) {
      // Log security event
      await supabaseAdmin.from("security_audit_logs").insert({
        user_id: user.id,
        event_type: "PERMISSION_DENIED",
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent") || "unknown",
        details: { action: "update_roles", requesterRole: profile.role },
        severity: "warning"
      });

      return forbiddenResponse("Unauthorized - not an admin");
    }

    // Validate CSRF token for sensitive operations if appropriate
    // This implementation will depend on your CSRF protection strategy
    const csrfToken = req.headers.get("X-CSRF-Token");
    if (!csrfToken) {
      // In production, this should be enforced for non-GET requests
      console.warn("CSRF token missing but not enforced in this implementation");
    }

    // Parse and validate the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      return validationErrorResponse("Invalid JSON body", { body: "Could not parse JSON body" });
    }
    
    const { userIds, newRole } = requestBody;
    
    // Validate required fields
    const validation = validateRequiredFields(requestBody, ["userIds", "newRole"]);
    if (!validation.isValid) {
      return validationErrorResponse("Missing required fields", 
        validation.missingFields.reduce((acc, field) => ({...acc, [field]: "This field is required"}), {})
      );
    }

    // Validate userIds is an array
    if (!Array.isArray(userIds)) {
      return validationErrorResponse("Invalid request format", { userIds: "Must be an array" });
    }
    
    // Validate that newRole is a valid role
    if (!VALID_ROLES.includes(newRole)) {
      return validationErrorResponse("Invalid role specified", { newRole: `Must be one of: ${VALID_ROLES.join(", ")}` });
    }

    // Only super admins can assign super_admin role
    if (newRole === "super_admin" && !isSuperAdmin) {
      return forbiddenResponse("Permission denied: Only super_admin can assign super_admin role");
    }

    // Update roles with upsert in case profiles don't exist yet
    const results = [];
    for (const userId of userIds) {
      // Special protection for protected admins
      const isTargetProtectedAdmin = protectedAdminEmails.some(email => 
        email === userId || // If userIds contains email directly
        await isUserEmailProtected(supabaseAdmin, userId, protectedAdminEmails)
      );

      if (isTargetProtectedAdmin && !isProtectedAdminEmail) {
        results.push({
          id: userId,
          success: false,
          error: "Cannot modify protected admin account",
          data: null
        });
        continue;
      }
      
      try {
        const { data, error } = await supabaseAdmin
          .from("profiles")
          .upsert({
            id: userId,
            role: newRole,
          })
          .select("id, role");

        results.push({
          id: userId,
          success: !error,
          error: error ? error.message : null,
          data
        });

        // Log success/failure
        if (error) {
          console.error(`Error updating role for user ${userId}:`, error);
        } else {
          console.log(`Successfully updated role for user ${userId} to ${newRole}`);
          
          // Log security audit event for successful role change
          await supabaseAdmin.from("security_audit_logs").insert({
            user_id: user.id,
            event_type: "ROLE_CHANGED",
            ip_address: clientIp,
            user_agent: req.headers.get("user-agent") || "unknown",
            details: { 
              action: "update_roles",
              target_user: userId, 
              new_role: newRole,
              changed_by: user.email
            },
            severity: "info"
          });
        }
      } catch (err) {
        console.error(`Exception updating role for user ${userId}:`, err);
        results.push({
          id: userId,
          success: false, 
          error: err.message || "Unknown error",
          data: null
        });
      }
    }

    return successResponse(
      {
        message: `Updated ${results.filter(r => r.success).length} users to role: ${newRole}`,
        results
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return errorResponse(error.message || "An unexpected error occurred");
  }
});

// Helper function to check if a user ID's email is in the protected admin list
async function isUserEmailProtected(supabaseAdmin: any, userId: string, protectedEmails: string[]): Promise<boolean> {
  try {
    // Get the user's email from auth.users using the admin API
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error || !data || !data.user || !data.user.email) {
      return false;
    }
    
    return protectedEmails.includes(data.user.email);
  } catch (err) {
    console.error('Error checking if user email is protected:', err);
    return false;
  }
}
