
// Follow Supabase Edge Function Conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { EdgeFunctionLogger, LogLevel } from "../_shared/logging.ts";
import { getSupabaseConfig } from "../_shared/config.ts";
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from "../_shared/auth.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("security-events");

// Cache for recently seen events to prevent duplicates
const recentEventsCache = new Map<string, number>();
const CACHE_TTL_MS = 60000; // 1 minute TTL for cached events

interface SecurityEvent {
  event_type: string;
  user_id?: string | null;
  email?: string | null;
  severity: string;
  ip_address?: string | null;
  user_agent?: string | null;
  event_details?: Record<string, any> | null;
}

// Function to clean up expired cache entries
function cleanupCache() {
  const now = Date.now();
  for (const [key, timestamp] of recentEventsCache.entries()) {
    if (now - timestamp > CACHE_TTL_MS) {
      recentEventsCache.delete(key);
    }
  }
}

/**
 * Log a security event to the database
 * 
 * @param supabase - Supabase client
 * @param event - Security event to log
 * @returns Result object with success flag and data or error
 */
async function logSecurityEvent(supabase: any, event: SecurityEvent) {
  try {
    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields(event, ['event_type', 'severity']);
    
    if (!isValid) {
      logger.error("Invalid security event data", { missingFields });
      return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
    }

    // Special handling for protected admin
    if (event.email && isProtectedAdmin(event.email)) {
      event.event_details = {
        ...event.event_details,
        is_protected_admin: true
      };
    }

    // Create a cache key to detect duplicate events
    const cacheKey = JSON.stringify({
      event_type: event.event_type,
      user_id: event.user_id,
      severity: event.severity
    });
    
    // Check if this is a duplicate event within the TTL window
    if (recentEventsCache.has(cacheKey)) {
      logger.warn("Duplicate event detected, skipping", { 
        eventType: event.event_type,
        userId: event.user_id 
      });
      return { success: true, skipped: true, reason: 'duplicate' };
    }
    
    // Add event to cache
    recentEventsCache.set(cacheKey, Date.now());
    
    // Clean up expired cache entries periodically
    if (recentEventsCache.size > 100) {
      cleanupCache();
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

/**
 * Get recent security events
 * 
 * @param supabase - Supabase client
 * @param limit - Maximum number of events to retrieve
 * @param severityFilter - Optional severity filter
 * @returns Recent security events
 */
async function getRecentEvents(supabase: any, limit: number = 50, severityFilter?: string) {
  try {
    let query = supabase
      .from("security_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
      
    if (severityFilter) {
      query = query.eq("severity", severityFilter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return { success: true, events: data };
  } catch (error) {
    logger.error("Failed to get recent security events", { error });
    throw error;
  }
}

/**
 * Get security event statistics
 * 
 * @param supabase - Supabase client
 * @param days - Number of days to include in statistics
 * @returns Event statistics by type and severity
 */
async function getSecurityStats(supabase: any, days: number = 7) {
  try {
    // Get counts by severity
    const { data: severityCounts, error: severityError } = await supabase
      .from("security_audit_logs")
      .select("severity, count")
      .gte("created_at", new Date(Date.now() - days * 86400000).toISOString())
      .group("severity");
      
    if (severityError) {
      throw severityError;
    }
    
    // Get counts by event type
    const { data: typeCounts, error: typeError } = await supabase
      .from("security_audit_logs")
      .select("event_type, count")
      .gte("created_at", new Date(Date.now() - days * 86400000).toISOString())
      .group("event_type");
      
    if (typeError) {
      throw typeError;
    }
    
    return { 
      success: true, 
      stats: {
        by_severity: severityCounts,
        by_type: typeCounts,
        period_days: days
      }
    };
  } catch (error) {
    logger.error("Failed to get security statistics", { error });
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
    const requestData = await req.json();
    const { action, ...eventData } = requestData;

    switch (action) {
      case "log":
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
      
      case "getRecent":
        logger.info("Processing get recent events action", { 
          limit: eventData.limit || 50,
          severity: eventData.severity || "all"
        });
        
        try {
          const result = await getRecentEvents(
            supabase, 
            eventData.limit || 50,
            eventData.severity
          );
          return successResponse(result);
        } catch (error) {
          return errorResponse(
            "Error retrieving recent events", 
            "retrieval_error", 
            500, 
            { error: error.message }
          );
        }
        
      case "getStats":
        logger.info("Processing get security stats action", { 
          days: eventData.days || 7
        });
        
        try {
          const result = await getSecurityStats(
            supabase,
            eventData.days || 7
          );
          return successResponse(result);
        } catch (error) {
          return errorResponse(
            "Error retrieving security statistics", 
            "stats_error", 
            500, 
            { error: error.message }
          );
        }
        
      default:
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
