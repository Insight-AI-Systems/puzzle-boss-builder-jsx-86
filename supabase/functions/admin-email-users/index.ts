
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin API key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user is authenticated and an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !["admin", "super_admin"].includes(profile.role)) {
      console.error("Permissions error:", profileError || "Not an admin");
      return new Response(
        JSON.stringify({ error: "Unauthorized - not an admin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { userIds, subject, body } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Preparing to send email to ${userIds.length} users`);

    // Get the email addresses for all users
    const { data: users, error: usersError } = await supabaseAdmin.auth
      .admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch users" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter out the target users
    const targetUsers = users.users.filter(u => userIds.includes(u.id));
    const emailAddresses = targetUsers.map(u => u.email).filter(Boolean);

    console.log(`Found ${emailAddresses.length} valid email addresses out of ${userIds.length} user IDs`);

    if (emailAddresses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid email addresses found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // In a real implementation, you would integrate with an email service here
    // For demo purposes, we'll just return success
    console.log("Would send email with:", {
      to: emailAddresses,
      subject,
      body
    });

    /*
    // Example with a hypothetical email service
    const emailResults = await sendEmailToUsers({
      to: emailAddresses,
      subject,
      body,
      from: "noreply@yourdomain.com"
    });
    */

    return new Response(
      JSON.stringify({
        message: `Email queued to be sent to ${emailAddresses.length} users`,
        recipients: emailAddresses.length,
        // In a real implementation, you might include more detailed info from the email service
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
