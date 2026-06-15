import { useMemo } from "react";
import { useUploadStore } from "../stores/upload.store";
import { UploadQueueItem } from "../lib/types/upload";

export function useUploadQueue() {
  const uploads = useUploadStore((state) => state.uploads);

  const queue = useMemo((): UploadQueueItem[] => {
    return uploads
      .filter((u) => u.status !== "completed" && u.status !== "cancelled")
      .map((u, i) => ({
        id: u.id,
        fileName: u.fileName,
        fileSize: u.fileSize,
        status: u.status,
        progress: u.progress,
        error: u.error,
        position: i + 1,
      }));
  }, [uploads]);

  const completedUploads = useMemo(() => {
    return uploads.filter((u) => u.status === "completed");
  }, [uploads]);

  const failedUploads = useMemo(() => {
    return uploads.filter((u) => u.status === "failed");
  }, [uploads]);

  const activeUploads = useMemo(() => {
    return uploads.filter(
      (u) => u.status === "uploading" || u.status === "processing" || u.status === "validating"
    );
  }, [uploads]);

  const pendingDuplicates = useMemo(() => {
    return uploads.filter((u) => u.isDuplicate && u.status === "pending");
  }, [uploads]);

  const hasActiveUploads = activeUploads.length > 0;
  const hasPendingDuplicates = pendingDuplicates.length > 0;

  return {
    queue,
    completedUploads,
    failedUploads,
    activeUploads,
    pendingDuplicates,
    hasActiveUploads,
    hasPendingDuplicates,
    queueCount: queue.length,
  };
}
