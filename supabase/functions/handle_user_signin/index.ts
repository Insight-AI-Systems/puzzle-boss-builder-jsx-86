
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { EdgeFunctionLogger } from "../_shared/logging.ts";
import { getSupabaseConfig } from "../_shared/config.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("handle_user_signin");

interface SignInRequest {
  userId: string;
}

// Process user sign-in by updating last_sign_in in profiles table
async function processUserSignIn(supabase: any, userId: string): Promise<any> {
  // Validate input
  if (!userId) {
    throw new Error("User ID is required");
  }

  logger.info(`Updating last_sign_in for user ${userId}`);

  // Update the last_sign_in field in the profiles table
  const { data, error } = await supabase
    .from("profiles")
    .update({ last_sign_in: new Date().toISOString() })
    .eq("id", userId)
    .select();

  if (error) {
    logger.error("Error updating last_sign_in", { error, userId });
    throw error;
  }

  logger.info(`Successfully updated last_sign_in for user ${userId}`);
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Get Supabase configuration
    const config = getSupabaseConfig();
    
    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      config.url,
      config.serviceRoleKey
    );

    // Parse and validate request body
    let requestData: SignInRequest;
    try {
      requestData = await req.json();
      
      const { isValid, missingFields } = validateRequiredFields(
        requestData, 
        ['userId']
      );
      
      if (!isValid) {
        return errorResponse(
          `Missing required fields: ${missingFields.join(', ')}`,
          "validation_error",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (parseError) {
      return errorResponse(
        "Invalid request format",
        "parse_error",
        HttpStatus.BAD_REQUEST
      );
    }

    // Process the sign-in
    try {
      const data = await processUserSignIn(supabaseAdmin, requestData.userId);
      return successResponse(
        data,
        "User sign-in recorded successfully",
        HttpStatus.OK
      );
    } catch (processError) {
      return errorResponse(
        processError.message || "Failed to update last sign in time",
        "process_error",
        HttpStatus.INTERNAL_SERVER_ERROR,
        processError
      );
    }
  } catch (error) {
    logger.error("Unexpected error", { error });
    return errorResponse(
      error.message || "An unexpected error occurred",
      "server_error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
});
