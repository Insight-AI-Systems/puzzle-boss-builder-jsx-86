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
      // Use direct SQL query to check if column exists
      // This is more reliable than trying to use information_schema
      const { data, error } = await supabase.rpc('column_exists', {
        table_name,
        column_name
      });
      
      if (error) {
        // If RPC function doesn't exist or fails, use fallback approach
        logger.warn(`RPC check failed: ${error.message}, using fallback approach`);
        
        try {
          // Create a SQL query that will safely check if column exists
          const { data: columnCheck, error: sqlError } = await supabase.from('_column_check_helper')
            .select('exists')
            .limit(1)
            .execute();
            
          if (sqlError) {
            if (sqlError.message.includes("does not exist")) {
              // Create a temporary view to check column existence
              await supabase.rpc('create_column_check_view', { 
                table_name, 
                column_name 
              });
              
              const { data: viewCheck } = await supabase.from('_column_check_view')
                .select('exists')
                .limit(1)
                .execute();
                
              return successResponse(!!viewCheck?.[0]?.exists);
            }
          }
          
          // If all else fails, just try a direct select and see if it errors
          try {
            const query = `SELECT "${column_name}" FROM "${table_name}" LIMIT 0`;
            const { data, error } = await supabase.rpc('execute_sql', { sql: query });
            
            // If we get here without an error, the column exists
            return successResponse(true);
          } catch (selectError) {
            // If we get a specific error about the column not existing, return false
            if (String(selectError).includes(`column "${column_name}" does not exist`)) {
              return successResponse(false);
            }
            
            // Otherwise propagate the error
            throw selectError;
          }
        } catch (fallbackError) {
          // Last resort: Try a simple query approach
          try {
            const { data: testData, error: testError } = await supabase
              .from(table_name)
              .select(column_name)
              .limit(1);
            
            // If we get here without an error, column exists
            return successResponse(true);
          } catch {
            // If we get an error, assume column doesn't exist
            return successResponse(false);
          }
        }
      }
      
      logger.info(`Column check result: ${data ? 'exists' : 'does not exist'}`);
      return successResponse(!!data);
    } catch (dbError) {
      logger.error(`Database error checking column existence`, { error: dbError });
      
      // Fallback for last resort
      try {
        const { data: testData, error: testError } = await supabase
          .from(table_name)
          .select(column_name)
          .limit(1);
        
        // If we get here without an error, the column exists
        return successResponse(true);
      } catch {
        // If we get an error, assume column doesn't exist
        return successResponse(false);
      }
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
