export type PaperStatus = "queued" | "processing" | "embedding" | "summarizing" | "completed" | "failed";

export type ProjectStatus = "active" | "archived" | "deleted";

export interface Author {
  readonly id?: string;
  readonly name: string;
  readonly affiliation?: string;
}

export interface PaperSummary {
  readonly abstract: string;
  readonly methodology?: string;
  readonly datasets?: readonly string[];
  readonly limitations?: string;
  readonly keyFindings?: readonly string[];
  readonly conclusion?: string;
}

export interface Paper {
  readonly id: string;
  readonly projectId: string;
  readonly userId: string;
  readonly title: string;
  readonly authors: readonly Author[];
  readonly abstract: string;
  readonly year: number;
  readonly journal?: string;
  readonly tags: readonly string[];
  readonly status: PaperStatus;
  readonly summary?: PaperSummary;
  readonly fileUrl: string;
  readonly fileName: string;
  readonly fileSize?: number;
  readonly mimeType?: string;
  readonly uploadedAt: string;
  readonly isFavorite?: boolean;
  readonly embeddingCreated?: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Project {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description?: string;
  readonly status: ProjectStatus;
  readonly isFavorite?: boolean;
  readonly stats?: ProjectStats;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProjectStats {
  readonly paperCount: number;
  readonly completionPercentage: number;
  readonly aiStatus: "idle" | "processing" | "ready";
  readonly activityCount: number;
}

export type ActivityType = "project_created" | "paper_added" | "paper_removed" | "summary_generated" | "review_generated" | "chat_started";

export interface ProjectActivity {
  readonly id: string;
  readonly projectId: string;
  readonly type: ActivityType;
  readonly description: string;
  readonly createdAt: string;
}

export interface ChatMessage {
  readonly id: string;
  readonly projectId: string;
  readonly role: "user" | "assistant" | "system";
  readonly content: string;
  readonly createdAt: string;
}

export interface ComparisonResult {
  readonly id: string;
  readonly projectId: string;
  readonly paperIds: readonly string[];
  readonly theme: string;
  readonly commonFindings: readonly string[];
  readonly contrastingResults: readonly string[];
  readonly researchGaps: readonly string[];
  readonly createdAt: string;
}
