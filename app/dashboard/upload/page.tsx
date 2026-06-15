"use client";

import * as React from "react";
import { useUpload } from "../../../hooks/useUpload";
import { useUploadQueue } from "../../../hooks/useUploadQueue";
import { UploadDropzone } from "../../../components/upload/UploadDropzone";
import { UploadToolbar } from "../../../components/upload/UploadToolbar";
import { UploadQueue } from "../../../components/upload/UploadQueue";
import { UploadSummary } from "../../../components/upload/UploadSummary";
import { UploadSuccess } from "../../../components/upload/UploadSuccess";
import { UploadError } from "../../../components/upload/UploadError";
import { UploadEmpty } from "../../../components/upload/UploadEmpty";
import { DuplicateDialog } from "../../../components/upload/DuplicateDialog";

export default function UploadPage() {
  const {
    uploads,
    summary,
    isDragActive,
    handleFiles,
    retryUpload,
    cancelUpload,
    removeUpload,
    resolveDuplicate,
    clearCompleted,
    clearAll,
    setDragActive,
  } = useUpload();

  const {
    queue,
    completedUploads,
    failedUploads,
    pendingDuplicates,
  } = useUploadQueue();

  // File input ref for browse button
  const browseRef = React.useRef<HTMLInputElement>(null);

  // Active duplicate dialog
  const [activeDuplicate, setActiveDuplicate] = React.useState<string | null>(null);
  const duplicateUpload = React.useMemo(
    () => uploads.find((u) => u.id === activeDuplicate),
    [uploads, activeDuplicate]
  );

  // Auto-show duplicate dialog
  React.useEffect(() => {
    if (pendingDuplicates.length > 0 && !activeDuplicate) {
      setActiveDuplicate(pendingDuplicates[0].id);
    }
  }, [pendingDuplicates, activeDuplicate]);

  // Active queue items (non-completed, non-cancelled)
  const activeQueue = React.useMemo(
    () => uploads.filter((u) => !["completed", "cancelled"].includes(u.status) && !u.isDuplicate),
    [uploads]
  );

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Papers</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Add research papers to your library for AI-powered analysis, summaries, and semantic search.
        </p>
      </div>

      <UploadToolbar
        hasCompleted={completedUploads.length > 0}
        hasUploads={uploads.length > 0}
        onClearCompleted={clearCompleted}
        onClearAll={clearAll}
        onBrowse={() => browseRef.current?.click()}
      />

      {/* Hidden browse input */}
      <input
        ref={browseRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
        {/* Left: Dropzone + Completed */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <UploadDropzone
            onFiles={handleFiles}
            isDragActive={isDragActive}
            onDragActiveChange={setDragActive}
          />

          {/* Completed Uploads */}
          {completedUploads.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Recently Completed ({completedUploads.length})
              </h3>
              {completedUploads.slice(0, 5).map((u) => (
                <UploadSuccess
                  key={u.id}
                  upload={u}
                  onViewPaper={() => console.log("View paper:", u.paperId)}
                  onAddToProject={() => console.log("Add to project:", u.paperId)}
                  onUploadMore={() => browseRef.current?.click()}
                />
              ))}
            </div>
          )}

          {/* Failed Uploads */}
          {failedUploads.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-destructive">
                Failed ({failedUploads.length})
              </h3>
              {failedUploads.map((u) => (
                <UploadError
                  key={u.id}
                  fileName={u.fileName}
                  error={u.error || "Unknown error"}
                  onRetry={() => retryUpload(u.id)}
                  onRemove={() => removeUpload(u.id)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {uploads.length === 0 && <UploadEmpty />}
        </div>

        {/* Right: Queue + Summary */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UploadSummary summary={summary} />

          <UploadQueue
            uploads={activeQueue}
            onRetry={retryUpload}
            onCancel={cancelUpload}
            onRemove={removeUpload}
          />
        </div>
      </div>

      {/* Duplicate Dialog */}
      {duplicateUpload && (
        <DuplicateDialog
          isOpen={!!activeDuplicate}
          fileName={duplicateUpload.fileName}
          onOpenExisting={() => {
            removeUpload(duplicateUpload.id);
            setActiveDuplicate(null);
          }}
          onReplace={() => {
            resolveDuplicate(duplicateUpload.id, "replace");
            setActiveDuplicate(null);
          }}
          onCancel={() => {
            resolveDuplicate(duplicateUpload.id, "cancel");
            setActiveDuplicate(null);
          }}
        />
      )}
    </div>
  );
}
