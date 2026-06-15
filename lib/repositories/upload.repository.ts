import { UploadFile, UploadStatus, DuplicateCheckResult } from "../types/upload";
import { MOCK_PAPERS } from "../mock-data";

// In-memory upload storage
let uploadsData: UploadFile[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const UploadRepository = {
  async saveUpload(upload: UploadFile): Promise<UploadFile> {
    await delay(100);
    const index = uploadsData.findIndex((u) => u.id === upload.id);
    if (index >= 0) {
      uploadsData[index] = upload;
    } else {
      uploadsData = [upload, ...uploadsData];
    }
    return upload;
  },

  async findUpload(id: string): Promise<UploadFile | null> {
    await delay(50);
    return uploadsData.find((u) => u.id === id) || null;
  },

  async findAll(): Promise<UploadFile[]> {
    await delay(100);
    return [...uploadsData];
  },

  async findDuplicates(fileName: string): Promise<DuplicateCheckResult> {
    await delay(200);
    const existing = MOCK_PAPERS.find(
      (p) => p.fileName.toLowerCase() === fileName.toLowerCase()
    );

    if (existing) {
      return {
        isDuplicate: true,
        existingPaperId: existing.id,
        existingFileName: existing.fileName,
      };
    }

    // Also check in-flight uploads
    const existingUpload = uploadsData.find(
      (u) =>
        u.fileName.toLowerCase() === fileName.toLowerCase() &&
        u.status !== "failed" &&
        u.status !== "cancelled"
    );

    if (existingUpload) {
      return {
        isDuplicate: true,
        existingPaperId: existingUpload.paperId,
        existingFileName: existingUpload.fileName,
      };
    }

    return { isDuplicate: false };
  },

  async updateStatus(id: string, status: UploadStatus, extra?: Partial<UploadFile>): Promise<UploadFile> {
    await delay(50);
    const index = uploadsData.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Upload not found");

    const updated: UploadFile = {
      ...uploadsData[index],
      ...extra,
      status,
    };
    uploadsData[index] = updated;
    return updated;
  },

  async deleteUpload(id: string): Promise<void> {
    await delay(50);
    uploadsData = uploadsData.filter((u) => u.id !== id);
  },
};
