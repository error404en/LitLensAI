import { UploadRepository } from "../lib/repositories/upload.repository";
import { UploadFile, UploadStatus, DuplicateCheckResult } from "../lib/types/upload";
import { validateUploadFile } from "../lib/validations/upload";

// Simulate upload progress with realistic timing
function simulateProgress(
  onProgress: (percentage: number) => void,
  durationMs: number = 3000
): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      // Simulate non-linear progress (fast start, slow middle, fast end)
      const remaining = 100 - progress;
      const increment = Math.max(1, Math.floor(remaining * 0.15 + Math.random() * 5));
      progress = Math.min(99, progress + increment);
      onProgress(progress);

      if (progress >= 99) {
        clearInterval(interval);
        // Final jump to 100
        setTimeout(() => {
          onProgress(100);
          resolve();
        }, 300);
      }
    }, durationMs / 20);
  });
}

export const UploadService = {
  /**
   * Validate a file before upload
   */
  validateFile(file: File): { success: boolean; error?: string } {
    return validateUploadFile(file);
  },

  /**
   * Calculate SHA-256 hash of a file
   */
  async calculateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Check if a file is a duplicate by its content hash
   */
  async checkDuplicate(fileName: string, hash?: string, excludeUploadId?: string): Promise<DuplicateCheckResult> {
    try {
      return await UploadRepository.findDuplicates(fileName, hash, excludeUploadId);
    } catch (error) {
      console.error("UploadService.checkDuplicate:", error);
      return { isDuplicate: false };
    }
  },

  /**
   * Upload a single file with progress tracking
   */
  async uploadFile(
    file: File,
    projectId: string | undefined,
    onProgress: (percentage: number) => void,
    onStatusChange: (status: UploadStatus) => void,
    providedUploadId?: string,
    skipDuplicateCheck?: boolean
  ): Promise<UploadFile> {
    const uploadId = providedUploadId || crypto.randomUUID();

    // Create initial record
    const uploadRecord: UploadFile = {
      id: uploadId,
      file,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      status: "validating",
      progress: 0,
      projectId,
      createdAt: new Date().toISOString(),
    };

    try {
      await UploadRepository.saveUpload(uploadRecord);
    } catch (e) {
      console.warn("Initial save failed, proceeding with cache", e);
    }

    // Step 1: Validate
    onStatusChange("validating");
    const validation = this.validateFile(file);
    if (!validation.success) {
      const failed = await UploadRepository.updateStatus(uploadId, "failed", {
        error: validation.error,
      });
      onStatusChange("failed");
      return failed;
    }

    const fileHash = await this.calculateHash(file);

    // Step 2: Check duplicates
    if (!skipDuplicateCheck) {
      onStatusChange("checking_duplicate");
      const duplicateResult = await this.checkDuplicate(file.name, fileHash, uploadId);
      if (duplicateResult.isDuplicate) {
        const duplicate = await UploadRepository.updateStatus(uploadId, "pending", {
          isDuplicate: true,
          duplicatePaperId: duplicateResult.existingPaperId,
        });
        onStatusChange("pending");
        return duplicate;
      }
    }

    // Step 3: Upload
    onStatusChange("uploading");
    await UploadRepository.updateStatus(uploadId, "uploading");

    let fileUrl = "";
    try {
      fileUrl = await UploadRepository.uploadFileToStorage(file);
    } catch (err) {
      const failed = await UploadRepository.updateStatus(uploadId, "failed", { error: "Storage upload failed" });
      onStatusChange("failed");
      return failed;
    }

    await simulateProgress(onProgress);

    // Step 4: Processing (trigger Inngest job)
    onStatusChange("processing");
    await UploadRepository.updateStatus(uploadId, "processing", { progress: 100 });

    // Create the Paper in DB
    let paper;
    try {
      const { PapersRepository } = await import("../lib/repositories/papers.repository");
      paper = await PapersRepository.create({
        projectId: (projectId || null) as unknown as string,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        authors: [],
        abstract: "",
        year: new Date().getFullYear(),
        journal: "",
        tags: [],
        status: "processing", // initial state
        summary: undefined,
        fileUrl: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        isFavorite: false,
        embeddingCreated: false,
        embeddingHash: fileHash,
      });
    } catch (err) {
      console.error("Failed to create paper in DB", err);
      const errMsg = err instanceof Error ? err.message : "Database paper creation failed";
      const failed = await UploadRepository.updateStatus(uploadId, "failed", { error: errMsg });
      onStatusChange("failed");
      return failed;
    }

    // Trigger Pipeline
    try {
      await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id }),
      });
    } catch (err) {
      console.error("Failed to trigger pipeline via API", err);
    }

    // Step 5: Completed
    const completed = await UploadRepository.updateStatus(uploadId, "completed", {
      progress: 100,
      paperId: paper.id,
      completedAt: new Date().toISOString(),
    });
    onStatusChange("completed");

    return completed;
  },

  /**
   * Upload multiple files sequentially
   */
  async uploadMultiple(
    files: File[],
    projectId: string | undefined,
    onFileProgress: (fileIndex: number, percentage: number) => void,
    onFileStatusChange: (fileIndex: number, status: UploadStatus) => void
  ): Promise<UploadFile[]> {
    const results: UploadFile[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(
          files[i],
          projectId,
          (pct) => onFileProgress(i, pct),
          (status) => onFileStatusChange(i, status),
          undefined
        );
        results.push(result);
      } catch (error) {
        console.error(`UploadService.uploadMultiple: File ${i} failed`, error);
      }
    }

    return results;
  },

  /**
   * Cancel an in-progress upload
   */
  async cancelUpload(id: string): Promise<UploadFile> {
    try {
      return await UploadRepository.updateStatus(id, "cancelled");
    } catch (error) {
      console.error("UploadService.cancelUpload:", error);
      throw new Error("Failed to cancel upload");
    }
  },

  /**
   * Retry a failed upload
   */
  async retryUpload(
    id: string,
    onProgress: (percentage: number) => void,
    onStatusChange: (status: UploadStatus) => void
  ): Promise<UploadFile> {
    const upload = await UploadRepository.findUpload(id);
    if (!upload) throw new Error("Upload not found");

    // Reset state and re-upload
    await UploadRepository.updateStatus(id, "queued", { progress: 0, error: undefined });
    onStatusChange("queued");

    return this.uploadFile(upload.file, upload.projectId, onProgress, onStatusChange, id);
  },

  /**
   * Remove an upload from the queue
   */
  async removeUpload(id: string): Promise<void> {
    try {
      await UploadRepository.deleteUpload(id);
    } catch (error) {
      console.error("UploadService.removeUpload:", error);
      throw new Error("Failed to remove upload");
    }
  },

  /**
   * Mark an upload as processing (future: triggered by Inngest)
   */
  async markProcessing(id: string): Promise<UploadFile> {
    return UploadRepository.updateStatus(id, "processing");
  },

  /**
   * Mark an upload as completed
   */
  async markCompleted(id: string, paperId: string): Promise<UploadFile> {
    return UploadRepository.updateStatus(id, "completed", {
      paperId,
      completedAt: new Date().toISOString(),
    });
  },

  /**
   * Mark an upload as failed
   */
  async markFailed(id: string, error: string): Promise<UploadFile> {
    return UploadRepository.updateStatus(id, "failed", { error });
  },
};
