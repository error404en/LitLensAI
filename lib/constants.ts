export const APP_NAME = "LitLens AI";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROJECTS: "/dashboard/projects",
  PAPERS: "/dashboard/papers",
  UPLOAD: "/dashboard/upload",
} as const;

export const SUPPORTED_FILE_TYPES = [
  "application/pdf"
] as const;

export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB

export const PAPER_STATUS_LABELS: Record<string, string> = {
  queued: "Queued",
  processing: "Processing",
  embedding: "Embedding",
  summarizing: "Summarizing",
  completed: "Completed",
  failed: "Failed",
} as const;

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  archived: "Archived",
  deleted: "Deleted",
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const DEFAULT_SEARCH_DEBOUNCE_TIME = 300; // in milliseconds