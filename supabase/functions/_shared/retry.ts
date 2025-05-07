
/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param options Retry options
 * @returns Result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>, 
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    shouldRetry?: (error: any) => boolean;
    onRetry?: (error: any, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 200,
    maxDelayMs = 10000,
    shouldRetry = () => true,
    onRetry = () => {}
  } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      onRetry(error, attempt + 1);
      
      // Calculate delay with exponential backoff and jitter
      const delayWithJitter = Math.min(
        maxDelayMs,
        initialDelayMs * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4)
      );
      
      await new Promise(resolve => setTimeout(resolve, delayWithJitter));
    }
  }
  
  throw lastError;
}
