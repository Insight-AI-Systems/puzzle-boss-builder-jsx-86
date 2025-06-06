
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing admin-email-users request');
    
    // Create a Supabase client with the Admin API key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get JWT token and verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User authenticated:', user.email);

    // Check if user has admin privileges
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const adminRoles = ["admin", "super_admin", "cfo", "category_manager", "social_media_manager", "partner_manager"];
    const isProtectedAdmin = user.email === 'alantbooth@xtra.co.nz';
    const hasAdminRole = profile && adminRoles.includes(profile.role);
    
    if (!isProtectedAdmin && !hasAdminRole) {
      console.error("Access denied - not an admin");
      return new Response(
        JSON.stringify({ error: "Unauthorized - admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { userIds, subject, body } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userIds (array), subject, and body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending email to ${userIds.length} users with subject: ${subject}`);

    // Get user emails from auth.users for the specified user IDs
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      return new Response(
        JSON.stringify({ error: "Error fetching user data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetUsers = authUsers.users.filter(authUser => userIds.includes(authUser.id));
    const emailAddresses = targetUsers.map(user => user.email).filter(Boolean);

    console.log(`Found ${emailAddresses.length} email addresses to send to`);

    // For now, we'll simulate sending emails since we don't have SendGrid configured
    // In a real implementation, you would use SendGrid API here
    const emailResults = emailAddresses.map(email => ({
      email,
      status: 'queued', // Would be 'sent' or 'failed' in real implementation
      timestamp: new Date().toISOString()
    }));

    // Log the email campaign for audit purposes
    console.log(`Email campaign logged: ${emailResults.length} emails queued`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email queued for ${emailResults.length} recipients`,
        results: emailResults,
        note: "Email sending is currently simulated - SendGrid integration needed for actual delivery"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error in admin-email-users:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
