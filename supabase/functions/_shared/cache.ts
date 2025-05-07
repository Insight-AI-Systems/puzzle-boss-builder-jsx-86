
/**
 * Simple in-memory cache implementation with expiration
 */
export class MemoryCache<T> {
  private cache: Map<string, { value: T; expiresAt: number }> = new Map();
  private defaultTtlMs: number;

  /**
   * Create a new memory cache
   * @param defaultTtlMs Default time-to-live in milliseconds
   */
  constructor(defaultTtlMs: number = 60000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    const now = Date.now();
    if (now > item.expiresAt) {
      this.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttlMs Time-to-live in milliseconds (defaults to constructor value)
   */
  set(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs || this.defaultTtlMs);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Delete a value from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired items from the cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get or set a value using a callback function
   * @param key Cache key
   * @param loadFn Function to call if value is not in cache
   * @param ttlMs Optional custom TTL for this item
   * @returns The cached or newly loaded value
   */
  async getOrSet(key: string, loadFn: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cachedValue = this.get(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = await loadFn();
    this.set(key, value, ttlMs);
    return value;
  }
}
