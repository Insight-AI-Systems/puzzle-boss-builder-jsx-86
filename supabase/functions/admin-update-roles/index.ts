
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { successResponse, errorResponse, forbiddenResponse } from '../_shared/response.ts';
import { validateRequiredFields, isValidUuid } from '../_shared/validation.ts';

type UserRole = 'super_admin' | 'admin' | 'category_manager' | 'social_media_manager' | 'partner_manager' | 'cfo' | 'player';

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  // Supabase API URL - env var exported by default.
  Deno.env.get('SUPABASE_URL') ?? '',
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  // Create client with Auth context of the user that called the function.
  {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  }
);

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorized user from the request
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return forbiddenResponse('Unauthorized access');
    }

    // Check if the user has admin privileges
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return forbiddenResponse('Unable to verify user role');
    }

    const isAdmin = userProfile.role === 'admin' || userProfile.role === 'super_admin';
    
    if (!isAdmin) {
      return forbiddenResponse('Only administrators can update user roles');
    }

    // Get the request body
    const requestData = await req.json();

    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields(requestData, ['userIds', 'newRole']);

    if (!isValid) {
      return errorResponse(`Missing required fields: ${missingFields.join(', ')}`, 'validation_error', 400);
    }

    const { userIds, newRole } = requestData;

    // Validate user IDs
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return errorResponse('No user IDs provided or invalid format', 'validation_error', 400);
    }

    // Validate all UUIDs
    const invalidIds = userIds.filter(id => !isValidUuid(id));
    if (invalidIds.length > 0) {
      return errorResponse(`Invalid user IDs: ${invalidIds.join(', ')}`, 'validation_error', 400);
    }

    // Check if the new role is valid
    const validRoles = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo', 'player'];
    if (!validRoles.includes(newRole)) {
      return errorResponse('Invalid role specified', 'validation_error', 400);
    }

    // Check if user is super_admin when assigning super_admin roles
    if (newRole === 'super_admin' && userProfile.role !== 'super_admin') {
      return forbiddenResponse('Only super admins can assign super admin roles');
    }

    // Get emails of users to be updated to check for protected admins
    const { data: targetUsersData, error: targetUsersError } = await supabaseClient
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (targetUsersError) {
      return errorResponse('Error fetching user data', 'database_error', 500);
    }

    // Filter out protected admins
    const protectedAdmins = targetUsersData?.filter(user => 
      user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase()
    ) || [];
    
    // Remove protected admins from the list
    const filteredUserIds = userIds.filter(id => 
      !protectedAdmins.some(admin => admin.id === id)
    );
    
    if (filteredUserIds.length === 0) {
      return errorResponse('Cannot update roles. All selected users are protected admins.', 'forbidden', 403);
    }

    // Update roles in the database
    const { data: updateData, error: updateError } = await supabaseClient
      .from('profiles')
      .update({ role: newRole })
      .in('id', filteredUserIds);

    if (updateError) {
      return errorResponse(`Error updating roles: ${updateError.message}`, 'database_error', 500);
    }

    // Log the role changes for audit
    const auditEntries = filteredUserIds.map(targetId => ({
      event_type: 'role_change',
      user_id: user.id,
      severity: 'medium',
      details: {
        target_user_id: targetId,
        new_role: newRole,
        timestamp: new Date().toISOString(),
        source: 'bulk_update'
      }
    }));

    await supabaseClient.from('security_audit_logs').insert(auditEntries);

    // Return success response
    return successResponse({
      success: true, 
      updatedCount: filteredUserIds.length,
      message: `Successfully updated ${filteredUserIds.length} user roles to ${newRole}`,
      skippedCount: protectedAdmins.length
    });

  } catch (error) {
    console.error('Error in admin-update-roles function:', error);
    return errorResponse('Internal server error', 'server_error', 500);
  }
});
