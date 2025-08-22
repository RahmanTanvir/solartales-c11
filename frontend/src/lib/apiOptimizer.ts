// API optimization and caching service for space weather data
import { spaceWeatherAPI } from './spaceWeatherAPI';
import { supabase } from './supabase';

// Enable database operations now that migration has been applied
const ENABLE_DATABASE_OPERATIONS = true;

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

export class SpaceWeatherAPIOptimizer {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor() {
    // Clear expired cache entries every 5 minutes
    setInterval(() => this.clearExpiredCache(), 5 * 60 * 1000);
  }

  // Get space weather data with caching and error handling
  async getOptimizedSpaceWeatherData(): Promise<any> {
    const cacheKey = 'space-weather-complete';
    
    // Check cache first
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Fetch fresh data with retry logic
      const data = await this.fetchWithRetry(async () => {
        return await spaceWeatherAPI.getCompleteSpaceWeatherData();
      });

      // Cache the successful response
      this.setCache(cacheKey, data);
      
      // Store in Supabase for persistence
      await this.storeCachedData(data);

      return data;

    } catch (error) {
      console.error('Failed to fetch space weather data:', error);
      
      // Try to get data from Supabase as fallback
      const fallbackData = await this.getFallbackData();
      if (fallbackData) {
        return fallbackData;
      }

      throw new Error('All data sources unavailable');
    }
  }

  // Rate-limited API calls with intelligent batching
  async batchedDataFetch(): Promise<any> {
    const cacheKey = 'batched-data';
    
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Use the main API method to get all data at once
      const completeData = await this.fetchWithRetry(() => 
        spaceWeatherAPI.getCompleteSpaceWeatherData()
      );

      // Extract the specific components for compatibility
      const results = {
        solarFlares: completeData.events?.solarFlares || [],
        cmes: completeData.events?.coronalMassEjections || [],
        storms: completeData.events?.geomagneticStorms || [],
        kIndex: completeData.currentConditions?.kIndex || {},
        complete: completeData
      };

      this.setCache(cacheKey, results);
      return results;

    } catch (error) {
      console.error('Batched data fetch failed:', error);
      throw error;
    }
  }

  // Intelligent cache management
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache(key: string, data: any): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Retry logic with exponential backoff
  private async fetchWithRetry<T>(
    fetchFn: () => Promise<T>,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      return await fetchFn();
    } catch (error) {
      if (retries > 0) {
        await this.delay(this.RETRY_DELAY * (this.MAX_RETRIES - retries + 1));
        return this.fetchWithRetry(fetchFn, retries - 1);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Store data in Supabase for persistence and fallback
  private async storeCachedData(data: any): Promise<void> {
    if (!ENABLE_DATABASE_OPERATIONS) {
      return;
    }

    try {
      const cacheRecord = {
        cache_key: 'latest-space-weather',
        endpoint: 'complete-space-weather',
        response_data: data,
        expires_at: new Date(Date.now() + this.CACHE_DURATION).toISOString(),
        metadata: { 
          cached_at: new Date().toISOString(),
          source: 'api-optimizer' 
        }
      };

      const { error } = await supabase
        .from('api_cache')
        .upsert(cacheRecord, { onConflict: 'cache_key' });

      if (error) {
        // Silently fail cache storage
      }
    } catch (error) {
      // Silently fail cache storage
    }
  }

  // Get fallback data from Supabase when APIs are down
  private async getFallbackData(): Promise<any | null> {
    if (!ENABLE_DATABASE_OPERATIONS) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('api_cache')
        .select('*')
        .eq('cache_key', 'latest-space-weather')
        .single();

      if (error || !data) {
        return null;
      }

      // Check if cached data is not too old (max 1 hour)
      const cacheAge = Date.now() - new Date(data.metadata?.cached_at || data.created_at).getTime();
      const maxAge = 60 * 60 * 1000; // 1 hour

      if (cacheAge > maxAge) {
        return null;
      }

      console.log('Using fallback data from Supabase cache');
      return data.response_data;

    } catch (error) {
      console.error('Failed to get fallback data:', error);
      return null;
    }
  }

  // CORS optimization for production
  setupCORSOptimization(): void {
    // This would be implemented in production with proper CORS headers
    // and API endpoint configuration for optimal performance
  }

  // Rate limiting protection
  private rateLimitTracker = new Map<string, number[]>();

  isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.rateLimitTracker.get(endpoint) || [];
    
    // Clean old requests (older than 1 hour)
    const recentRequests = requests.filter(time => now - time < 3600000);
    
    // Check if we're approaching rate limits (NASA: 1000/hour)
    if (recentRequests.length >= 950) {
      return true;
    }

    // Update tracker
    recentRequests.push(now);
    this.rateLimitTracker.set(endpoint, recentRequests);
    
    return false;
  }

  // Performance monitoring
  async monitorAPIPerformance(operation: string, fn: () => Promise<any>): Promise<any> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      // Log performance metrics
      console.log(`API Operation ${operation}: ${duration.toFixed(2)}ms`);
      
      // Store performance data in Supabase for monitoring
      await this.logPerformanceMetric(operation, duration, 'success');
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Log error metrics
      console.error(`API Operation ${operation} failed after ${duration.toFixed(2)}ms:`, error);
      
      await this.logPerformanceMetric(operation, duration, 'error');
      
      throw error;
    }
  }

  private async logPerformanceMetric(operation: string, duration: number, status: string): Promise<void> {
    if (!ENABLE_DATABASE_OPERATIONS) {
      console.log(`Performance metric [${operation}]: ${duration.toFixed(2)}ms - ${status}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('api_performance')
        .insert({
          endpoint: operation,
          method: 'GET', // Default method, could be parameterized
          response_time_ms: Math.round(duration),
          status_code: status === 'success' ? 200 : 500,
          error_message: status === 'error' ? 'API operation failed' : null,
          metadata: { operation, status }
        });

      if (error) {
        console.warn('Failed to log performance metric:', error);
      }
    } catch (error) {
      // Silently fail performance logging to not affect main functionality
      console.debug('Performance logging failed:', error);
    }
  }
}

// Export singleton instance
export const apiOptimizer = new SpaceWeatherAPIOptimizer();
