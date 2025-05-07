
// Follow Supabase Edge Function Conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { EdgeFunctionLogger, LogLevel } from "../_shared/logging.ts";
import { getSupabaseConfig } from "../_shared/config.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("security-events");

interface SecurityEvent {
  event_type: string;
  user_id?: string | null;
  email?: string | null;
  severity: string;
  ip_address?: string | null;
  user_agent?: string | null;
  event_details?: Record<string, any> | null;
}

async function logSecurityEvent(supabase: any, event: SecurityEvent) {
  try {
    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields(event, ['event_type', 'severity']);
    
    if (!isValid) {
      logger.error("Invalid security event data", { missingFields });
      return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
    }

    // Insert security event to the database with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
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
          throw error;
        }

        logger.info("Security event logged successfully", { eventType: event.event_type });
        return { success: true, data };
      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts < maxAttempts) {
          logger.warn(`Retry attempt ${attempts} for logging security event`, { error });
          // Exponential backoff
          await new Promise(r => setTimeout(r, Math.pow(2, attempts) * 100));
        }
      }
    }

    logger.error("Failed to log security event after retries", { 
      error: lastError, 
      attempts 
    });
    throw new Error("Failed to log security event");
  } catch (error) {
    logger.error("Exception in logSecurityEvent", { error });
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize Supabase client
    const { url: supabaseUrl, serviceRoleKey: supabaseServiceRoleKey } = getSupabaseConfig();
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Parse request body
    const { action, ...eventData } = await req.json();

    if (action === "log") {
      logger.info("Processing security event log action", { 
        eventType: eventData.event_type 
      });
      
      try {
        const result = await logSecurityEvent(supabase, eventData);
        return successResponse(result);
      } catch (error) {
        return errorResponse(
          "Error processing security event", 
          "process_error", 
          500, 
          { error: error.message }
        );
      }
    } else {
      logger.warn("Invalid action requested", { action });
      return errorResponse("Invalid action", "invalid_action", 400);
    }
  } catch (error) {
    logger.error("Unexpected error in security-events function", { error });
    return errorResponse(
      "Internal server error", 
      "server_error", 
      500, 
      { message: error.message }
    );
  }
});
