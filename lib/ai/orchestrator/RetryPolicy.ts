export class RetryPolicy {
  static async executeWithRetries<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        
        // Wait exponentially longer before retrying
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(`Retry attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error("Max retries exceeded");
  }
}
