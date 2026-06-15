"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Upload, FileText } from "lucide-react";
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from "../../lib/validations/upload";
import { safeFileSize } from "../../lib/utils";

interface UploadDropzoneProps {
  onFiles: (files: FileList | File[]) => void;
  isDragActive: boolean;
  onDragActiveChange: (active: boolean) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onFiles, isDragActive, onDragActiveChange, disabled }: UploadDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) onDragActiveChange(true);
    },
    [disabled, onDragActiveChange]
  );

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragActiveChange(false);
    },
    [onDragActiveChange]
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragActiveChange(false);
      if (!disabled && e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files);
      }
    },
    [disabled, onFiles, onDragActiveChange]
  );

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload files by dropping or clicking"
      onClick={handleClick}
      onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer group",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragActive && "border-primary bg-primary/10 scale-[1.02] shadow-lg",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />

      <div
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300",
          isDragActive
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}
      >
        {isDragActive ? (
          <FileText className="h-8 w-8" />
        ) : (
          <Upload className="h-8 w-8" />
        )}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">
          {isDragActive ? "Drop your PDFs here" : "Drag & drop research papers"}
        </h3>
        <p className="text-sm text-muted-foreground">
          or <span className="text-primary font-medium underline-offset-2 hover:underline">browse files</span>
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
        <span>PDF only</span>
        <span>•</span>
        <span>Max {safeFileSize(MAX_FILE_SIZE)}</span>
        <span>•</span>
        <span>Multiple files</span>
      </div>
    </div>
  );
}
