export class ApiError extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public errors: Record<string, string[]>;
  
  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export class DatabaseError extends Error {
  public originalError: unknown;
  
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

export class StorageError extends Error {
  public originalError: unknown;
  
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = "StorageError";
    this.originalError = originalError;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthenticationError";
  }
}
