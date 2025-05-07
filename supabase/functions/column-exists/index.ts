
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handleCorsOptions, corsHeaders } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { getSupabaseConfig } from "../_shared/config.ts";
import { EdgeFunctionLogger } from "../_shared/logging.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("column-exists");

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { table_name, column_name } = await req.json();
    
    if (!table_name || !column_name) {
      logger.error("Missing required parameters", { table_name, column_name });
      return errorResponse(
        "Missing required parameters",
        "bad_request",
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Create Supabase client with admin privileges
    const config = getSupabaseConfig();
    const supabase = createClient(config.url, config.serviceRoleKey);
    
    logger.info(`Checking if column ${column_name} exists in table ${table_name}`);
    
    try {
      // Use a simple query to check if the column exists
      // This approach is more reliable than querying information_schema 
      // which might have permission issues
      const { data, error } = await supabase
        .rpc('column_exists', {
          table_name: table_name,
          column_name: column_name
        });
      
      if (error) {
        // If RPC function doesn't exist or fails, try a direct query approach
        logger.warn(`RPC check failed, falling back to direct query: ${error.message}`);
        
        try {
          const { data: testData, error: testError } = await supabase
            .from(table_name)
            .select(column_name)
            .limit(1);
          
          // If we get here without an error, the column exists
          logger.info(`Column ${column_name} exists in ${table_name} (direct query)`);
          return successResponse(true);
        } catch (testQueryError) {
          // If we get an error, the column likely doesn't exist
          logger.info(`Column ${column_name} does not exist in ${table_name} (direct query error)`);
          return successResponse(false);
        }
      }
      
      logger.info(`Column check result: ${data ? 'exists' : 'does not exist'}`);
      return successResponse(!!data);
    } catch (dbError) {
      logger.error(`Database error checking column existence`, { error: dbError });
      return errorResponse(
        `Error checking column existence: ${dbError.message}`,
        "database_error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  } catch (error) {
    logger.error(`Unexpected error`, { error });
    return errorResponse(
      `Unexpected error: ${error.message}`,
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
});
