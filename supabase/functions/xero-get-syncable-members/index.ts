
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Initialize Supabase client with service role key for admin access
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the JWT from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse the request body
    const { limit = 100, offset = 0 } = await req.json();

    // Get count of profiles
    const { count, error: countError } = await serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting count:', countError);
      return new Response(
        JSON.stringify({ success: false, message: `Error getting count: ${countError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Fetch profiles with extended information
    const { data: profiles, error: profilesError } = await serviceClient
      .from('profiles')
      .select('*, auth:id(email)')
      .range(offset, offset + limit - 1);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(
        JSON.stringify({ success: false, message: `Error fetching profiles: ${profilesError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Fetch Xero mappings for these profiles
    const userIds = profiles.map(p => p.id);
    const { data: xeroMappings, error: xeroMappingsError } = await serviceClient
      .from('xero_user_mappings')
      .select('*')
      .in('user_id', userIds);

    if (xeroMappingsError) {
      console.error('Error fetching Xero mappings:', xeroMappingsError);
    }

    // Combine data
    const memberData = profiles.map(profile => {
      // Find Xero mapping if exists
      const xeroMapping = xeroMappings?.find(m => m.user_id === profile.id);
      
      return {
        profile: {
          ...profile,
          email: profile.auth?.email,
          xero_mapping: xeroMapping
        }
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully retrieved syncable members',
        data: memberData,
        count: count
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting syncable members:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error getting syncable members' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
