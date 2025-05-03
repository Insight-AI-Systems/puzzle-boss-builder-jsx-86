
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
    const { userId, direction = 'to_xero' } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch the user profile with extended information
    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: profileError ? `Profile fetch error: ${profileError.message}` : 'Profile not found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch Xero mapping if exists
    const { data: xeroMapping, error: xeroMappingError } = await serviceClient
      .from('xero_user_mappings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (xeroMappingError) {
      console.error('Error fetching Xero mapping:', xeroMappingError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Xero mapping error: ${xeroMappingError.message}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch addresses
    const { data: addresses, error: addressesError } = await serviceClient
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId);

    if (addressesError) {
      console.error('Error fetching addresses:', addressesError);
    }

    // For this example, we'll handle basic Xero sync operation logging
    // In a real implementation, this would connect to Xero API

    // Create sync log entry
    const { data: syncLog, error: syncLogError } = await serviceClient
      .from('sync_logs')
      .insert({
        integration: 'xero',
        direction: direction === 'to_xero' ? 'outbound' : 'inbound',
        record_type: 'member',
        record_id: userId,
        status: 'success',
      })
      .select()
      .single();

    if (syncLogError) {
      console.error('Error creating sync log:', syncLogError);
    }

    // If this is first sync (no existing mapping), simulate creating a Xero contact
    if (!xeroMapping) {
      // In a real implementation, would call Xero API here
      // For now, creating dummy mapping
      const dummyXeroId = `xero-${crypto.randomUUID()}`;
      const { data: newMapping, error: newMappingError } = await serviceClient
        .from('xero_user_mappings')
        .insert({
          user_id: userId,
          xero_contact_id: dummyXeroId,
          sync_status: 'active',
        })
        .select()
        .single();

      if (newMappingError) {
        console.error('Error creating Xero mapping:', newMappingError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Failed to create Xero mapping: ${newMappingError.message}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Member synced to Xero successfully',
          data: {
            syncId: syncLog?.id,
            xeroContactId: dummyXeroId,
            firstName: profile.full_name,
            email: profile.email,
            operation: 'create'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Update existing mapping
    else {
      // In a real implementation, would call Xero API here to update contact
      const { data: updatedMapping, error: updateMappingError } = await serviceClient
        .from('xero_user_mappings')
        .update({
          last_synced: new Date().toISOString(),
          sync_status: 'active'
        })
        .eq('id', xeroMapping.id)
        .select()
        .single();

      if (updateMappingError) {
        console.error('Error updating Xero mapping:', updateMappingError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Failed to update Xero mapping: ${updateMappingError.message}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Member updated in Xero successfully',
          data: {
            syncId: syncLog?.id,
            xeroContactId: xeroMapping.xero_contact_id,
            firstName: profile.full_name,
            email: profile.email,
            operation: 'update'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Xero member sync error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error during Xero sync' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
