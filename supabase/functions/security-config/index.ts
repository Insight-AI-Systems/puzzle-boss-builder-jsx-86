
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Security constants
const ADMIN_ROLE = 'super_admin';
const PROTECTED_CONFIG_KEY = 'admin_emails';
const DEFAULT_SESSION_TIMEOUT = 3600; // 1 hour in seconds

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Extract JWT token from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request
    const { action } = await req.json();
    
    if (action === "getSecurityConfig") {
      // Retrieve protected admin emails from secure storage
      const { data: configData, error: configError } = await supabaseAdmin
        .from("security_config")
        .select("config_value")
        .eq("config_key", PROTECTED_CONFIG_KEY)
        .single();
      
      if (configError) {
        console.error("Error fetching security config:", configError);
        return new Response(
          JSON.stringify({ error: "Error retrieving security configuration" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if user is requesting sensitive info and has proper permissions
      const isRequestingSensitiveInfo = true; // We're always returning sensitive info in this endpoint
      
      // Get user's role
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Error retrieving user profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Only super admins can access sensitive security configurations
      if (isRequestingSensitiveInfo && profile.role !== ADMIN_ROLE) {
        // Log security event
        await supabaseAdmin.from("security_audit_logs").insert({
          user_id: user.id,
          event_type: "UNAUTHORIZED_CONFIG_ACCESS",
          ip_address: req.headers.get("x-forwarded-for") || "unknown",
          user_agent: req.headers.get("user-agent") || "unknown",
          details: { action: "getSecurityConfig" },
          severity: "warning"
        });
        
        return new Response(
          JSON.stringify({ error: "Unauthorized - insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Return the security configuration
      return new Response(
        JSON.stringify({
          config: {
            adminEmails: configData.config_value || [],
            sessionTimeout: DEFAULT_SESSION_TIMEOUT,
            csrfSettings: {
              cookieMaxAge: 86400, // 24 hours
              sameSite: "strict",
              secure: true,
              httpOnly: true
            }
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (action === "validateAdminAccess") {
      // Retrieve protected admin emails from secure storage
      const { data: configData, error: configError } = await supabaseAdmin
        .from("security_config")
        .select("config_value")
        .eq("config_key", PROTECTED_CONFIG_KEY)
        .single();
      
      if (configError) {
        console.error("Error fetching admin emails:", configError);
        // Default to role-based check only if config can't be retrieved
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        const isAdmin = profile && profile.role === ADMIN_ROLE;
        
        return new Response(
          JSON.stringify({ isAdmin }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if user's email is in protected admin list or has admin role
      const adminEmails = configData.config_value || [];
      const isProtectedAdmin = Array.isArray(adminEmails) && adminEmails.includes(user.email);
      
      // Also check role-based admin
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        
      const isRoleAdmin = profile && profile.role === ADMIN_ROLE;
      
      // User is admin if either protected by email or has admin role
      const isAdmin = isProtectedAdmin || isRoleAdmin;
      
      // Log validation attempt
      await supabaseAdmin.from("security_audit_logs").insert({
        user_id: user.id,
        event_type: "ADMIN_ACCESS_CHECK",
        ip_address: req.headers.get("x-forwarded-for") || "unknown",
        user_agent: req.headers.get("user-agent") || "unknown",
        details: { 
          result: isAdmin ? "granted" : "denied",
          email: user.email,
          isProtectedAdmin,
          isRoleAdmin
        },
        severity: isAdmin ? "info" : "warning"
      });
      
      return new Response(
        JSON.stringify({ isAdmin }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid action specified" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
