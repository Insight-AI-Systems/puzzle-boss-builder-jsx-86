
/**
 * Gets the Supabase configuration from environment variables
 * @returns Object with Supabase URL and API keys
 */
export function getSupabaseConfig() {
  // For edge functions, these are set in the environment
  const url = Deno.env.get('SUPABASE_URL') || '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!url || !anonKey || !serviceRoleKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return {
    url,
    anonKey,
    serviceRoleKey
  };
}
