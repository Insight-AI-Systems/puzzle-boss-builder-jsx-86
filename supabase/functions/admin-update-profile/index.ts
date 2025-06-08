
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-email',
};

// Admin emails - centralized for consistency
const ADMIN_EMAILS = [
  'alan@insight-ai-systems.com',
  'alantbooth@xtra.co.nz',
  'rob.small.1234@gmail.com'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing admin-update-profile request');
    
    // Create a Supabase client with the Admin API key for full access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get user email from custom header (sent by Clerk-authenticated frontend)
    const userEmail = req.headers.get("x-user-email");
    
    if (!userEmail) {
      console.error('No user email provided in headers');
      return new Response(
        JSON.stringify({ error: "No user email provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User email from header:', userEmail);

    // Check if user is admin based on email
    const isAdminEmail = ADMIN_EMAILS.includes(userEmail);
    
    if (!isAdminEmail) {
      console.error("Access denied - not an admin email. User email:", userEmail);
      return new Response(
        JSON.stringify({ error: "Unauthorized - admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Admin access granted for email:', userEmail);

    // Parse request body
    const { userId, updates } = await req.json();
    
    if (!userId || !updates) {
      return new Response(
        JSON.stringify({ error: "Missing userId or updates in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Updating profile for user:', userId, 'with updates:', updates);

    // Update the profile in the database
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        username: updates.display_name,
        bio: updates.bio,
        country: updates.country,
        gender: updates.gender,
        custom_gender: updates.custom_gender,
        age_group: updates.age_group,
        role: updates.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update profile", details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Profile updated successfully:', updatedProfile);

    // Log the profile update for audit purposes
    await supabaseAdmin
      .from("security_audit_logs")
      .insert({
        user_id: userId,
        event_type: 'profile_updated',
        severity: 'info',
        details: {
          updated_by: userEmail,
          fields_updated: Object.keys(updates),
          old_values: {},
          new_values: updates
        }
      });

    return new Response(
      JSON.stringify({ success: true, profile: updatedProfile }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Unexpected error in admin-update-profile:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message,
        stack: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
