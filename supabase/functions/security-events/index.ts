
// Follow Supabase Edge Function Conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Add CORS headers to allow API calls from browser
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecurityEvent {
  event_type: string;
  user_id?: string | null;
  email?: string | null;
  severity: string;
  ip_address?: string | null;
  user_agent?: string | null;
  event_details?: Record<string, any> | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { action, ...eventData } = await req.json();

    if (action === "log") {
      await logSecurityEvent(supabase, eventData);
      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error processing security event:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function logSecurityEvent(supabase, event: SecurityEvent) {
  // Insert directly to the security_audit_logs table
  const { data, error } = await supabase
    .from("security_audit_logs")
    .insert({
      user_id: event.user_id,
      event_type: event.event_type,
      severity: event.severity,
      ip_address: event.ip_address,
      user_agent: event.user_agent,
      details: event.event_details || {},
      email: event.email,
    });

  if (error) {
    console.error("Failed to log security event:", error);
    throw new Error("Failed to log security event");
  }

  return data;
}
