
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { getEnvVariable } from "../_shared/config.ts";

interface AuthRequest {
  action: 'validate' | 'refresh' | 'verify_role' | 'check_permission' | 'record_login' | 'invalidate_sessions';
  token?: string;
  user_id?: string;
  role?: string;
  permission?: string;
  session_id?: string;
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
    let data: AuthRequest;
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
      case 'validate':
        return await validateToken(data.token, supabaseAdmin);
      
      case 'refresh':
        return await refreshToken(data.token, supabaseAdmin);
      
      case 'verify_role':
        return await verifyRole(data.user_id, data.role, supabaseAdmin);
      
      case 'check_permission':
        return await checkPermission(data.user_id, data.permission, supabaseAdmin);
      
      case 'record_login':
        return await recordLoginActivity(data.user_id, req, supabaseAdmin);
      
      case 'invalidate_sessions':
        return await invalidateOtherSessions(data.user_id, data.session_id, supabaseAdmin);
      
      default:
        return errorResponse(
          "Invalid action specified",
          "invalid_action",
          HttpStatus.BAD_REQUEST
        );
    }
  } catch (error) {
    console.error("Unexpected error in auth-manager:", error);
    return errorResponse(
      "An unexpected error occurred",
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
});

// Validate a JWT token and return user info
async function validateToken(token: string | undefined, supabase: any) {
  if (!token) {
    return errorResponse(
      "No token provided",
      "invalid_request",
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return errorResponse(
        "Invalid or expired token",
        "invalid_token",
        HttpStatus.UNAUTHORIZED
      );
    }

    // Get additional user information including roles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // Check for special admin case
    const isSpecialAdmin = data.user.email === 'alan@insight-ai-systems.com';
    const role = isSpecialAdmin ? 'super_admin' : (profile?.role || 'player');

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role
      },
      isSpecialAdmin: isSpecialAdmin
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return errorResponse(
      "Error validating authentication token",
      "validation_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Refresh an authentication token
async function refreshToken(token: string | undefined, supabase: any) {
  if (!token) {
    return errorResponse(
      "No token provided",
      "invalid_request",
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    // Extract refresh token if it's a JWT session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession(token);
    
    if (sessionError || !sessionData.session) {
      return errorResponse(
        "Invalid or expired session",
        "invalid_session",
        HttpStatus.UNAUTHORIZED
      );
    }

    // Refresh the token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: sessionData.session.refresh_token,
    });

    if (error || !data.session) {
      return errorResponse(
        "Failed to refresh token",
        "refresh_failed",
        HttpStatus.UNAUTHORIZED,
        { detail: error?.message }
      );
    }

    // Log security event
    await supabase.rpc('log_security_event', {
      event_type: 'TOKEN_REFRESH',
      user_id: data.user.id,
      email: data.user.email,
      severity: 'info',
      event_details: {
        method: 'refresh_token'
      }
    });

    return successResponse({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return errorResponse(
      "Error refreshing authentication token",
      "refresh_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Verify if a user has a specific role
async function verifyRole(userId: string | undefined, role: string | undefined, supabase: any) {
  if (!userId || !role) {
    return errorResponse(
      "User ID and role are required",
      "invalid_request",
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    // Get user email for special admin check
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      return errorResponse(
        "User not found",
        "not_found",
        HttpStatus.NOT_FOUND
      );
    }

    // Special case for protected admin
    if (userData.user.email === 'alan@insight-ai-systems.com' && role === 'super_admin') {
      return successResponse({ 
        hasRole: true,
        isSpecialAdmin: true 
      });
    }

    // Check role using the database function
    const { data, error } = await supabase.rpc('get_role_inherits_from', {
      user_role: userData.user.role,
      parent_role: role
    });

    if (error) {
      return errorResponse(
        "Error checking role",
        "check_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    return successResponse({ hasRole: !!data });
  } catch (error) {
    console.error("Error verifying role:", error);
    return errorResponse(
      "Error verifying user role",
      "verification_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Check if a user has a specific permission
async function checkPermission(userId: string | undefined, permission: string | undefined, supabase: any) {
  if (!userId || !permission) {
    return errorResponse(
      "User ID and permission are required",
      "invalid_request",
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    // Get user email for special admin check
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      return errorResponse(
        "User not found",
        "not_found",
        HttpStatus.NOT_FOUND
      );
    }

    // Special case for protected admin - has all permissions
    if (userData.user.email === 'alan@insight-ai-systems.com') {
      return successResponse({ 
        hasPermission: true,
        isSpecialAdmin: true 
      });
    }

    // Check permission using the database function
    const { data, error } = await supabase.rpc('has_permission', {
      permission_name: permission
    }, {
      headers: {
        Authorization: `Bearer ${userData.user.id}`
      }
    });

    if (error) {
      return errorResponse(
        "Error checking permission",
        "check_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    return successResponse({ hasPermission: !!data });
  } catch (error) {
    console.error("Error checking permission:", error);
    return errorResponse(
      "Error checking user permission",
      "check_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Record user login activity
async function recordLoginActivity(userId: string | undefined, request: Request, supabase: any) {
  if (!userId) {
    return errorResponse(
      "User ID is required",
      "invalid_request",
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    // Extract IP and user agent from request
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Update last_sign_in in profiles
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        last_sign_in: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    // Log security event
    await supabase.rpc('log_security_event', {
      event_type: 'LOGIN',
      user_id: userId,
      ip_address: ip,
      user_agent: userAgent,
      severity: 'info',
      event_details: {
        method: 'password',
        timestamp: new Date().toISOString()
      }
    });

    if (error) {
      return errorResponse(
        "Error recording login activity",
        "record_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    return successResponse(data);
  } catch (error) {
    console.error("Error recording login activity:", error);
    return errorResponse(
      "Error recording user login activity",
      "record_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Invalidate all other sessions for a user
async function invalidateOtherSessions(userId: string | undefined, sessionId: string | undefined, supabase: any) {
  if (!userId) {
    return errorResponse(
      "User ID is required",
      "invalid_request",
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    // Update user_sessions table to mark other sessions as inactive
    const { data, error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .neq('id', sessionId || 'no-session-provided')
      .eq('is_active', true)
      .select();

    if (error) {
      return errorResponse(
        "Error invalidating other sessions",
        "invalidate_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    // Log security event
    await supabase.rpc('log_security_event', {
      event_type: 'SESSION_TERMINATED',
      user_id: userId,
      severity: 'warning',
      event_details: {
        action: 'invalidate_other_sessions',
        sessions_terminated: data.length
      }
    });

    return successResponse({
      invalidatedSessions: data.length
    });
  } catch (error) {
    console.error("Error invalidating other sessions:", error);
    return errorResponse(
      "Error invalidating other user sessions",
      "invalidate_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}
