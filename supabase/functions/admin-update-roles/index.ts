
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoleUpdateRequest {
  userIds: string[];
  newRole: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify that the request is from an admin user
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Check if the user is an admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profileData || !['super_admin', 'admin'].includes(profileData.role)) {
      return new Response(
        JSON.stringify({ error: 'Only admins can update user roles' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Parse request body
    const { userIds, newRole }: RoleUpdateRequest = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No user IDs provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    if (!newRole) {
      return new Response(
        JSON.stringify({ error: 'New role is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Prevent changing super_admin roles unless the requester is a super_admin
    if (newRole === 'super_admin' && profileData.role !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Only super admins can assign the super_admin role' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Update roles in batches to avoid timeouts on large updates
    const batchSize = 50;
    const results = [];
    
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      // For each user in the batch, check if their profile exists
      const { data: existingProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', batch);
      
      if (profilesError) {
        console.error('Error checking profiles:', profilesError);
        continue;
      }
      
      // Get existing profile IDs
      const existingIds = existingProfiles.map(p => p.id);
      
      // For existing profiles, update the role
      if (existingIds.length > 0) {
        const { data: updated, error: updateError } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .in('id', existingIds)
          .select('id');
        
        if (updateError) {
          console.error('Error updating profiles:', updateError);
          results.push({ success: false, ids: existingIds, error: updateError.message });
        } else {
          results.push({ success: true, ids: updated.map(p => p.id) });
        }
      }
      
      // For users without profiles, create new profile records
      const missingIds = batch.filter(id => !existingIds.includes(id));
      
      if (missingIds.length > 0) {
        const profileRows = missingIds.map(id => ({
          id,
          role: newRole,
          created_at: new Date(),
          updated_at: new Date()
        }));
        
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert(profileRows)
          .select('id');
        
        if (insertError) {
          console.error('Error creating profiles:', insertError);
          results.push({ success: false, ids: missingIds, error: insertError.message });
        } else {
          results.push({ success: true, ids: inserted.map(p => p.id) });
        }
      }
    }
    
    // Determine if any operations succeeded
    const anySuccess = results.some(r => r.success);
    const anyFailure = results.some(r => !r.success);
    
    return new Response(
      JSON.stringify({ 
        success: anySuccess,
        partial: anySuccess && anyFailure,
        message: `Role updates ${anySuccess ? 'completed' : 'failed'}${anyFailure ? ' with some errors' : ''}`,
        results
      }),
      { status: anySuccess ? 200 : 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in admin-update-roles function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
