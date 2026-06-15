// ============================================================
// Upload Domain Types
// ============================================================

export type UploadStatus =
  | "pending"
  | "validating"
  | "checking_duplicate"
  | "queued"
  | "uploading"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface UploadFile {
  readonly id: string;
  readonly file: File;
  readonly fileName: string;
  readonly fileSize: number;
  readonly mimeType: string;
  readonly status: UploadStatus;
  readonly progress: number;
  readonly error?: string;
  readonly paperId?: string; // Linked paper ID after successful upload
  readonly projectId?: string;
  readonly isDuplicate?: boolean;
  readonly duplicatePaperId?: string;
  readonly createdAt: string;
  readonly completedAt?: string;
}

export interface UploadProgress {
  readonly uploadId: string;
  readonly percentage: number;
  readonly bytesUploaded: number;
  readonly bytesTotal: number;
  readonly estimatedTimeRemaining?: number; // seconds
}

export interface UploadQueueItem {
  readonly id: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly status: UploadStatus;
  readonly progress: number;
  readonly error?: string;
  readonly position: number;
}

export interface UploadSummary {
  readonly total: number;
  readonly queued: number;
  readonly uploading: number;
  readonly processing: number;
  readonly completed: number;
  readonly failed: number;
  readonly cancelled: number;
  readonly totalBytes: number;
  readonly uploadedBytes: number;
}

export interface DuplicateCheckResult {
  readonly isDuplicate: boolean;
  readonly existingPaperId?: string;
  readonly existingFileName?: string;
}
