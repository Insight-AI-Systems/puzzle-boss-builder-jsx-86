
// Helper for safely getting environment variables with fallbacks and validation
export function getEnvVariable(name: string, required = true, defaultValue?: string): string {
  const value = Deno.env.get(name) || defaultValue;
  
  if (required && !value) {
    throw new Error(`Required environment variable "${name}" is not set`);
  }
  
  return value || '';
}

// Get required Supabase configuration
export function getSupabaseConfig() {
  try {
    const supabaseUrl = getEnvVariable('SUPABASE_URL', true);
    const supabaseAnonKey = getEnvVariable('SUPABASE_ANON_KEY', true);
    const supabaseServiceRoleKey = getEnvVariable('SUPABASE_SERVICE_ROLE_KEY', true);
    
    return {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      serviceRoleKey: supabaseServiceRoleKey,
    };
  } catch (error) {
    console.error('Error getting Supabase configuration:', error);
    throw error;
  }
}

// Initialize config with retries
export async function initializeConfig<T>(
  configFn: () => Promise<T> | T,
  maxRetries = 3,
  retryDelay = 500
): Promise<T> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await configFn();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`Failed to initialize config after ${maxRetries} attempts:`, error);
        throw error;
      }
      
      console.warn(`Config initialization failed, retrying (${retries}/${maxRetries})`);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This shouldn't be reached due to throw in the loop, but TypeScript needs a return
  throw new Error('Failed to initialize configuration');
}
