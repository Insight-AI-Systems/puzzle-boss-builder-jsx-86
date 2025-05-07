
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { verifyAuth } from "../_shared/auth.ts";
import { getEnvVariable } from "../_shared/config.ts";

interface RbacRequest {
  action: 'get_permissions' | 'check_permission' | 'get_role' | 'update_role' | 'get_role_hierarchy' | 'check_inherits_role';
  userId?: string;
  role?: string;
  permission?: string;
  parentRole?: string;
  targetUserId?: string;
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

    // Parse request body
    let data: RbacRequest;
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
      case 'get_permissions':
        return await getUserPermissions(data.userId || user.id, supabaseAdmin);
      
      case 'check_permission':
        return await checkUserPermission(
          data.userId || user.id, 
          data.permission || '',
          supabaseAdmin
        );
      
      case 'get_role':
        return await getUserRole(data.userId || user.id, supabaseAdmin);
      
      case 'update_role':
        return await updateUserRole(
          user.id, 
          data.targetUserId || '', 
          data.role || '',
          supabaseAdmin
        );
      
      case 'get_role_hierarchy':
        return await getRoleHierarchy(supabaseAdmin);
      
      case 'check_inherits_role':
        return await checkRoleInheritance(
          data.role || '',
          data.parentRole || '',
          supabaseAdmin
        );
      
      default:
        return errorResponse(
          "Invalid action specified",
          "invalid_action",
          HttpStatus.BAD_REQUEST
        );
    }
  } catch (error) {
    console.error("Unexpected error in rbac-manager:", error);
    return errorResponse(
      "An unexpected error occurred",
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
});

// Get all permissions for a user
async function getUserPermissions(userId: string, supabase: any) {
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
      // Get all permissions in the system
      const { data: allPermissions, error: permError } = await supabase
        .from('permissions')
        .select('name, description');
      
      if (permError) {
        return errorResponse(
          "Error fetching permissions",
          "fetch_error",
          HttpStatus.INTERNAL_SERVER_ERROR,
          { detail: permError.message }
        );
      }

      return successResponse({
        permissions: allPermissions,
        isSpecialAdmin: true
      });
    }

    // Get user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      return errorResponse(
        "Error fetching user profile",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: profileError.message }
      );
    }

    const role = profile?.role || 'player';

    // Get permissions for the role
    const { data: permissions, error: permError } = await supabase
      .from('permissions')
      .select(`
        name,
        description,
        role_permissions!inner(role)
      `)
      .eq('role_permissions.role', role);

    if (permError) {
      return errorResponse(
        "Error fetching permissions",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: permError.message }
      );
    }

    return successResponse({
      permissions,
      role
    });
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return errorResponse(
      "Error fetching user permissions",
      "fetch_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Check if a user has a specific permission
async function checkUserPermission(userId: string, permission: string, supabase: any) {
  try {
    if (!permission) {
      return errorResponse(
        "Permission name is required",
        "invalid_request",
        HttpStatus.BAD_REQUEST
      );
    }

    // Special admin check
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      return errorResponse(
        "Error fetching user profile",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: profileError.message }
      );
    }

    const role = profile?.role || 'player';

    // Super admin has all permissions
    if (role === 'super_admin') {
      return successResponse({
        hasPermission: true,
        isSuperAdmin: true
      });
    }

    // Check if role has the permission
    const { data: permissionCheck, error: checkError } = await supabase
      .from('permissions')
      .select(`
        name,
        role_permissions!inner(role)
      `)
      .eq('role_permissions.role', role)
      .eq('name', permission)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Not found error is expected
      return errorResponse(
        "Error checking permission",
        "check_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: checkError.message }
      );
    }

    return successResponse({
      hasPermission: !!permissionCheck,
      role
    });
  } catch (error) {
    console.error("Error checking user permission:", error);
    return errorResponse(
      "Error checking user permission",
      "check_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Get a user's role
async function getUserRole(userId: string, supabase: any) {
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
    if (userData.user.email === 'alan@insight-ai-systems.com') {
      return successResponse({
        role: 'super_admin',
        isSpecialAdmin: true
      });
    }

    // Get user role from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      return errorResponse(
        "Error fetching user profile",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: profileError.message }
      );
    }

    return successResponse({
      role: profile?.role || 'player'
    });
  } catch (error) {
    console.error("Error getting user role:", error);
    return errorResponse(
      "Error fetching user role",
      "fetch_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Update a user's role (admin only)
async function updateUserRole(currentUserId: string, targetUserId: string, newRole: string, supabase: any) {
  try {
    if (!targetUserId || !newRole) {
      return errorResponse(
        "Target user ID and new role are required",
        "invalid_request",
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if current user has permission to update roles
    const { data: currentUserData, error: currentUserError } = await supabase.auth.admin.getUserById(currentUserId);
    
    if (currentUserError || !currentUserData.user) {
      return errorResponse(
        "Current user not found",
        "not_found",
        HttpStatus.NOT_FOUND
      );
    }

    // Special case for protected admin
    const isSpecialAdmin = currentUserData.user.email === 'alan@insight-ai-systems.com';

    if (!isSpecialAdmin) {
      // Check if current user is super_admin
      const { data: currentProfile, error: currentProfileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single();

      if (currentProfileError) {
        return errorResponse(
          "Error fetching current user profile",
          "fetch_error",
          HttpStatus.INTERNAL_SERVER_ERROR,
          { detail: currentProfileError.message }
        );
      }

      if (currentProfile.role !== 'super_admin' && currentProfile.role !== 'admin') {
        return errorResponse(
          "Only admins can update user roles",
          "permission_denied",
          HttpStatus.FORBIDDEN
        );
      }

      // Admin can only assign certain roles
      if (currentProfile.role === 'admin' && (newRole === 'super_admin' || newRole === 'admin')) {
        return errorResponse(
          "Regular admins cannot assign super_admin or admin roles",
          "permission_denied",
          HttpStatus.FORBIDDEN
        );
      }
    }

    // Target user cannot be the protected admin
    const { data: targetUserData, error: targetUserError } = await supabase.auth.admin.getUserById(targetUserId);
    
    if (targetUserError) {
      return errorResponse(
        "Target user not found",
        "not_found",
        HttpStatus.NOT_FOUND
      );
    }

    if (targetUserData.user?.email === 'alan@insight-ai-systems.com' && !isSpecialAdmin) {
      return errorResponse(
        "Cannot modify protected admin account",
        "permission_denied",
        HttpStatus.FORBIDDEN
      );
    }

    // Update the user's role
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUserId)
      .select();

    if (error) {
      return errorResponse(
        "Error updating user role",
        "update_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    // Log role change
    await supabase.rpc('log_security_event', {
      event_type: 'ROLE_CHANGE',
      user_id: currentUserId,
      severity: 'warning',
      details: {
        target_user_id: targetUserId,
        new_role: newRole,
        by_special_admin: isSpecialAdmin
      }
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error updating user role:", error);
    return errorResponse(
      "Error updating user role",
      "update_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Get the entire role hierarchy
async function getRoleHierarchy(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('role_hierarchy')
      .select('parent_role, child_role');

    if (error) {
      return errorResponse(
        "Error fetching role hierarchy",
        "fetch_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    // Transform the flat list into a hierarchy
    const hierarchy: Record<string, string[]> = {};
    
    for (const relation of data) {
      if (!hierarchy[relation.parent_role]) {
        hierarchy[relation.parent_role] = [];
      }
      hierarchy[relation.parent_role].push(relation.child_role);
    }

    return successResponse({ hierarchy });
  } catch (error) {
    console.error("Error getting role hierarchy:", error);
    return errorResponse(
      "Error fetching role hierarchy",
      "fetch_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}

// Check if one role inherits from another
async function checkRoleInheritance(role: string, parentRole: string, supabase: any) {
  try {
    if (!role || !parentRole) {
      return errorResponse(
        "Role and parent role are required",
        "invalid_request",
        HttpStatus.BAD_REQUEST
      );
    }

    const { data, error } = await supabase.rpc('get_role_inherits_from', {
      user_role: role,
      parent_role: parentRole
    });

    if (error) {
      return errorResponse(
        "Error checking role inheritance",
        "check_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        { detail: error.message }
      );
    }

    return successResponse({ inherits: !!data });
  } catch (error) {
    console.error("Error checking role inheritance:", error);
    return errorResponse(
      "Error checking role inheritance",
      "check_error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      { detail: error.message }
    );
  }
}
