
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { getSupabaseConfig } from "../_shared/config.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { table_name, column_name } = await req.json();
    
    if (!table_name || !column_name) {
      return errorResponse(
        "Missing required parameters",
        "bad_request",
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Create Supabase client with admin privileges
    const config = getSupabaseConfig();
    const supabase = createClient(config.url, config.serviceRoleKey);
    
    // Query information_schema to check if the column exists
    const { data, error } = await supabase.from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', table_name)
      .eq('column_name', column_name);
    
    if (error) {
      return errorResponse(
        `Error checking column existence: ${error.message}`,
        "database_error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
    // If data exists and has length, the column exists
    const columnExists = data && data.length > 0;
    
    return successResponse(columnExists);
  } catch (error) {
    return errorResponse(
      `Unexpected error: ${error.message}`,
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
});
