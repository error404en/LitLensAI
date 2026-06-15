import { useCallback, useMemo } from "react";
import { useUploadStore, selectUploadSummary } from "../stores/upload.store";
import { UploadService } from "../services/upload.service";
import { UploadFile, UploadStatus } from "../lib/types/upload";

export function useUpload() {
  const store = useUploadStore();

  const summary = useMemo(
    () => selectUploadSummary(store.uploads),
    [store.uploads]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Validate first
        const validation = UploadService.validateFile(file);
        const uploadId = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        if (!validation.success) {
          // Add as failed immediately
          const failedUpload: UploadFile = {
            id: uploadId,
            file,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            status: "failed",
            progress: 0,
            error: validation.error,
            createdAt: new Date().toISOString(),
          };
          store.addUpload(failedUpload);
          continue;
        }

        // Check for duplicates
        const duplicate = await UploadService.checkDuplicate(file.name);

        if (duplicate.isDuplicate) {
          const dupUpload: UploadFile = {
            id: uploadId,
            file,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            status: "pending",
            progress: 0,
            isDuplicate: true,
            duplicatePaperId: duplicate.existingPaperId,
            createdAt: new Date().toISOString(),
          };
          store.addUpload(dupUpload);
          continue;
        }

        // Add to queue
        const queuedUpload: UploadFile = {
          id: uploadId,
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          status: "queued",
          progress: 0,
          createdAt: new Date().toISOString(),
        };
        store.addUpload(queuedUpload);

        // Start upload
        try {
          await UploadService.uploadFile(
            file,
            undefined,
            (pct) => store.updateUpload(uploadId, { progress: pct }),
            (status) => store.updateUpload(uploadId, { status })
          );
          store.updateUpload(uploadId, {
            status: "completed",
            progress: 100,
            completedAt: new Date().toISOString(),
          });
        } catch (err) {
          store.updateUpload(uploadId, {
            status: "failed",
            error: err instanceof Error ? err.message : "Upload failed",
          });
        }
      }
    },
    [store]
  );

  const retryUpload = useCallback(
    async (id: string) => {
      const upload = store.uploads.find((u) => u.id === id);
      if (!upload) return;

      store.updateUpload(id, { status: "queued", progress: 0, error: undefined });

      try {
        await UploadService.uploadFile(
          upload.file,
          upload.projectId,
          (pct) => store.updateUpload(id, { progress: pct }),
          (status) => store.updateUpload(id, { status })
        );
        store.updateUpload(id, {
          status: "completed",
          progress: 100,
          completedAt: new Date().toISOString(),
        });
      } catch (err) {
        store.updateUpload(id, {
          status: "failed",
          error: err instanceof Error ? err.message : "Upload failed",
        });
      }
    },
    [store]
  );

  const cancelUpload = useCallback(
    async (id: string) => {
      store.updateUpload(id, { status: "cancelled" });
    },
    [store]
  );

  const removeUpload = useCallback(
    (id: string) => {
      store.removeUpload(id);
    },
    [store]
  );

  const resolveDuplicate = useCallback(
    async (id: string, action: "replace" | "cancel") => {
      if (action === "cancel") {
        store.removeUpload(id);
        return;
      }

      // Replace: proceed with upload
      const upload = store.uploads.find((u) => u.id === id);
      if (!upload) return;

      store.updateUpload(id, { isDuplicate: false, status: "queued", progress: 0 });

      try {
        await UploadService.uploadFile(
          upload.file,
          upload.projectId,
          (pct) => store.updateUpload(id, { progress: pct }),
          (status) => store.updateUpload(id, { status })
        );
        store.updateUpload(id, {
          status: "completed",
          progress: 100,
          completedAt: new Date().toISOString(),
        });
      } catch (err) {
        store.updateUpload(id, {
          status: "failed",
          error: err instanceof Error ? err.message : "Upload failed",
        });
      }
    },
    [store]
  );

  return {
    // Data
    uploads: store.uploads,
    selectedUploadId: store.selectedUploadId,
    summary,
    isLoading: store.isLoading,
    error: store.error,
    isDragActive: store.isDragActive,

    // Actions
    handleFiles,
    retryUpload,
    cancelUpload,
    removeUpload,
    resolveDuplicate,
    clearCompleted: store.clearCompleted,
    clearAll: store.clearAll,
    setSelectedUploadId: store.setSelectedUploadId,
    setDragActive: store.setDragActive,
  };
}
