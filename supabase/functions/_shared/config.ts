
/**
 * Configuration utilities for edge functions
 */

// Get environment variable with optional error handling
export function getEnvVariable(name: string, throwOnMissing = false): string {
  const value = Deno.env.get(name);
  if (!value && throwOnMissing) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

// Get Supabase configuration
export function getSupabaseConfig(): { url: string; serviceRoleKey: string } {
  return {
    url: getEnvVariable('SUPABASE_URL', true),
    serviceRoleKey: getEnvVariable('SUPABASE_SERVICE_ROLE_KEY', true)
  };
}
