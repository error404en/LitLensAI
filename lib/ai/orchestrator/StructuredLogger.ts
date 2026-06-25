export class StructuredLogger {
  static info(event: string, context?: Record<string, unknown>) {
    this.log("INFO", event, context);
  }

  static warn(event: string, context?: Record<string, unknown>) {
    this.log("WARN", event, context);
  }

  static error(event: string, error: Error | unknown, context?: Record<string, unknown>) {
    this.log("ERROR", event, {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }

  static metric(name: string, value: number, tags?: Record<string, string | number | boolean>) {
    this.log("METRIC", name, { value, ...tags });
  }

  private static maskSecrets(obj: unknown): unknown {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return (obj as unknown[]).map(item => this.maskSecrets(item));
    
    const masked = { ...obj as Record<string, unknown> };
    const sensitiveKeys = ['key', 'token', 'password', 'secret', 'prompt', 'authorization', 'cookie'];
    
    for (const key in masked) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        masked[key] = '[REDACTED]';
      } else if (typeof masked[key] === 'object') {
        masked[key] = this.maskSecrets(masked[key]);
      }
    }
    return masked;
  }

  private static log(level: "INFO" | "WARN" | "ERROR" | "METRIC", event: string, context?: Record<string, unknown>) {
    const payload = this.maskSecrets({
      timestamp: new Date().toISOString(),
      level,
      event,
      ...context
    });

    // In a production app, this could stream to DataDog, CloudWatch, or Axiom.
    // For now, we serialize it to stdout to prevent noisy unstructured console.logs
    // We only output it if not in a strict test environment that suppresses logs.
    if (process.env.NODE_ENV !== "test") {
      process.stdout.write(JSON.stringify(payload) + "\n");
    }
  }
}
