import { create } from "zustand";
import { UploadFile, UploadStatus, UploadSummary } from "../lib/types/upload";

interface UploadState {
  // Data
  uploads: UploadFile[];
  selectedUploadId: string | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  isDragActive: boolean;

  // Actions: Data
  addUpload: (upload: UploadFile) => void;
  updateUpload: (id: string, updates: Partial<UploadFile>) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;

  // Actions: UI
  setSelectedUploadId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDragActive: (active: boolean) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploads: [],
  selectedUploadId: null,
  isLoading: false,
  error: null,
  isDragActive: false,

  addUpload: (upload) =>
    set((state) => ({ uploads: [upload, ...state.uploads] })),

  updateUpload: (id, updates) =>
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, ...updates } : u
      ),
    })),

  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((u) => u.id !== id),
    })),

  clearCompleted: () =>
    set((state) => ({
      uploads: state.uploads.filter((u) => u.status !== "completed"),
    })),

  clearAll: () => set({ uploads: [] }),

  setSelectedUploadId: (id) => set({ selectedUploadId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDragActive: (isDragActive) => set({ isDragActive }),
}));

// Selector: Compute upload summary from store state
export function selectUploadSummary(uploads: UploadFile[]): UploadSummary {
  return {
    total: uploads.length,
    queued: uploads.filter((u) => u.status === "queued" || u.status === "pending").length,
    uploading: uploads.filter((u) => u.status === "uploading").length,
    processing: uploads.filter((u) => u.status === "processing" || u.status === "validating" || u.status === "checking_duplicate").length,
    completed: uploads.filter((u) => u.status === "completed").length,
    failed: uploads.filter((u) => u.status === "failed").length,
    cancelled: uploads.filter((u) => u.status === "cancelled").length,
    totalBytes: uploads.reduce((sum, u) => sum + u.fileSize, 0),
    uploadedBytes: uploads
      .filter((u) => u.status === "completed")
      .reduce((sum, u) => sum + u.fileSize, 0),
  };
}
