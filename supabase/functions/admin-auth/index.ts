
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { verifyAuth } from "../_shared/auth.ts";
import { getEnvVariable } from "../_shared/config.ts";

// Special IP whitelist for admin actions (can be moved to environment variables)
const ADMIN_IP_WHITELIST = [
  // Add trusted IP addresses here
];

interface AdminAuthRequest {
  action: 'verify_admin' | 'require_mfa' | 'validate_ip' | 'check_admin_access';
  mfaCode?: string;
  ipAddress?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize Supabase client
    const supabaseUrl = getEnvVariable('SUPABASE_URL', true);
    const supabaseServiceRoleKey = getEnvVariable('SUPABASE_SERVICE_ROLE_KEY', true);
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // Parse request body
    let data: AdminAuthRequest;
    try {
      data = await req.json();
    } catch (error) {
      return errorResponse(
        "Invalid request format", 
        "parse_error",
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields(
      data,
      ['action']
    );

    if (!isValid) {
      return errorResponse(
        `Missing required fields: ${missingFields.join(', ')}`,
        "validation_error",
        HttpStatus.BAD_REQUEST
      );
    }

    // Process based on action
    switch (data.action) {
      case 'verify_admin':
        return await verifyAdminAccess(req, supabaseAdmin);
      
      case 'require_mfa':
        return await requireMfaForAdmin(req, data.mfaCode, supabaseAdmin);
      
      case 'validate_ip':
        return await validateAdminIp(data.ipAddress || extractClientIp(req), supabaseAdmin);
      
      case 'check_admin_access':
        return await checkCompleteAdminAccess(req, supabaseAdmin);
      
      default:
        return errorResponse(
          "Invalid action specified",
          "invalid_action",
          HttpStatus.BAD_REQUEST
        );
    }
  } catch (error) {
    console.error("Unexpected error in admin-auth:", error);
    return errorResponse(
      "An unexpected error occurred",
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
});

// Extract client IP from request
function extractClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for may contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  return 'unknown';
}

// Verify if the user has admin access
async function verifyAdminAccess(req: Request, supabase: any) {
  // Verify auth before proceeding
  const { user, error: authError } = await verifyAuth(req);
  if (authError) return authError;
  if (!user) {
    return errorResponse(
      "Authentication required",
      "unauthorized",
      HttpStatus.UNAUTHORIZED
    );
  }

  try {
    // Get user email for special admin check
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.id);
    
    if (userError || !userData.user) {
      return errorResponse(
        "User not found",
        "not_found",
        HttpStatus.NOT_FOUND
      );
    }

    // Special case for protected admin
    if (userData.user.email === 'alan@insight-ai-systems.com') {
      // Log admin access
      await supabase.rpc('log_security_event', {
        event_type: 'ADMIN_ACCESS',
        user_id: user.id,
        email: userData.user.email,
        severity: 'info',
        ip_address: extractClientIp(req),
        user_agent: req.headers.get('user-agent') || 'unknown',
        details: { 
          is_special_admin: true 
        }
      });

      return successResponse({
        isAdmin: true,
        isSpecialAdmin: true
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return errorResponse(
        "Error fetching user profile",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: profileError.message }
      );
    }

    const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin';

    // Log admin access attempt
    await supabase.rpc('log_security_event', {
      event_type: isAdmin ? 'ADMIN_ACCESS' : 'ADMIN_ACCESS_DENIED',
      user_id: user.id,
      email: userData.user.email,
      severity: isAdmin ? 'info' : 'warning',
      ip_address: extractClientIp(req),
      user_agent: req.headers.get('user-agent') || 'unknown',
      details: { 
        role: profile?.role || 'unknown'
      }
    });

    return successResponse({
      isAdmin: isAdmin,
      role: profile?.role || 'player'
    });
  } catch (error) {
    console.error("Error verifying admin access:", error);
    return errorResponse(
      "Error verifying admin access",
      "verification_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Check if MFA should be required for admin
async function requireMfaForAdmin(req: Request, mfaCode: string | undefined, supabase: any) {
  // Verify auth before proceeding
  const { user, error: authError } = await verifyAuth(req);
  if (authError) return authError;
  if (!user) {
    return errorResponse(
      "Authentication required",
      "unauthorized",
      HttpStatus.UNAUTHORIZED
    );
  }

  // First check if the user is an admin
  const { data: adminCheck } = await verifyAdminAccess(req, supabase);
  if (!adminCheck?.isAdmin) {
    return errorResponse(
      "Admin access required",
      "forbidden",
      HttpStatus.FORBIDDEN
    );
  }

  // Special admin bypass
  if (adminCheck?.isSpecialAdmin) {
    return successResponse({
      mfaRequired: false,
      mfaVerified: true,
      isSpecialAdmin: true
    });
  }

  try {
    // Get user profile to check if MFA is enabled
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('two_factor_enabled')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return errorResponse(
        "Error fetching user profile",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: profileError.message }
      );
    }

    // If MFA is not enabled, we don't need to verify
    if (!profile?.two_factor_enabled) {
      return successResponse({
        mfaRequired: false,
        mfaVerified: true,
        mfaEnabled: false
      });
    }

    // If we have an MFA code, verify it
    if (mfaCode) {
      // This is where you'd add actual MFA verification logic
      // For now, we'll mock it with a simple check
      const isMfaValid = mfaCode === '123456'; // Replace with real verification

      if (!isMfaValid) {
        // Log failed MFA attempt
        await supabase.rpc('log_security_event', {
          event_type: 'MFA_FAILED',
          user_id: user.id,
          severity: 'warning',
          ip_address: extractClientIp(req),
          user_agent: req.headers.get('user-agent') || 'unknown',
          details: {
            for_admin_action: true
          }
        });

        return errorResponse(
          "Invalid MFA code",
          "invalid_mfa",
          HttpStatus.UNAUTHORIZED
        );
      }

      // Log successful MFA verification
      await supabase.rpc('log_security_event', {
        event_type: 'MFA_SUCCESS',
        user_id: user.id,
        severity: 'info',
        ip_address: extractClientIp(req),
        user_agent: req.headers.get('user-agent') || 'unknown',
        details: {
          for_admin_action: true
        }
      });

      return successResponse({
        mfaRequired: true,
        mfaVerified: true,
        mfaEnabled: true
      });
    }

    // If no MFA code is provided but MFA is enabled, request it
    return successResponse({
      mfaRequired: true,
      mfaVerified: false,
      mfaEnabled: true
    });
  } catch (error) {
    console.error("Error checking MFA requirement:", error);
    return errorResponse(
      "Error processing MFA verification",
      "mfa_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Validate if IP is allowed for admin access
async function validateAdminIp(ip: string, supabase: any) {
  try {
    // Check if IP is in whitelist
    const ipAllowed = ADMIN_IP_WHITELIST.includes(ip);

    return successResponse({
      ipAllowed: ipAllowed,
      ipAddress: ip
    });
  } catch (error) {
    console.error("Error validating admin IP:", error);
    return errorResponse(
      "Error validating IP address for admin access",
      "validation_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Comprehensive check for admin access (role + IP + MFA if needed)
async function checkCompleteAdminAccess(req: Request, supabase: any) {
  try {
    // Check admin role
    const { data: adminCheck, error: adminError } = await verifyAdminAccess(req, supabase);
    
    if (adminError || !adminCheck?.isAdmin) {
      return errorResponse(
        "Admin access denied",
        "forbidden",
        HttpStatus.FORBIDDEN,
        { detail: adminError ? adminError.message : "Not an admin user" }
      );
    }

    // Special admin bypass all further checks
    if (adminCheck.isSpecialAdmin) {
      return successResponse({
        accessGranted: true,
        isSpecialAdmin: true,
        bypassedChecks: ['ip', 'mfa']
      });
    }

    // Check IP restrictions
    const clientIp = extractClientIp(req);
    const { data: ipCheck } = await validateAdminIp(clientIp, supabase);
    
    // MFA check will be handled by the client if needed
    // Just return overall result here
    return successResponse({
      accessGranted: adminCheck.isAdmin && (ipCheck?.ipAllowed || true),
      role: adminCheck.role,
      ipAllowed: ipCheck?.ipAllowed || false,
      ipAddress: clientIp,
      mfaRequired: true, // Client should verify this separately
    });
  } catch (error) {
    console.error("Error checking complete admin access:", error);
    return errorResponse(
      "Error validating admin access",
      "validation_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}
