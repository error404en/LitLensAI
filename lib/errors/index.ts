export class LitLensError extends Error {
  constructor(message: string, public readonly code: string, public readonly details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AIError extends LitLensError {
  constructor(message: string, code: string = 'AI_ERROR', details?: unknown) {
    super(message, code, details);
  }
}

export class ProviderError extends AIError {
  constructor(message: string, details?: unknown) {
    super(message, 'PROVIDER_ERROR', details);
  }
}

export class RetrieverError extends AIError {
  constructor(message: string, details?: unknown) {
    super(message, 'RETRIEVER_ERROR', details);
  }
}

export class PipelineError extends LitLensError {
  constructor(message: string, details?: unknown) {
    super(message, 'PIPELINE_ERROR', details);
  }
}

export class StreamingError extends AIError {
  constructor(message: string, details?: unknown) {
    super(message, 'STREAMING_ERROR', details);
  }
}

export class ValidationError extends LitLensError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class RepositoryError extends LitLensError {
  constructor(message: string, details?: unknown) {
    super(message, 'REPOSITORY_ERROR', details);
  }
}
