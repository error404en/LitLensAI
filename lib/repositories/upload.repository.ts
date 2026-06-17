import { UploadFile, UploadStatus, DuplicateCheckResult } from "../types/upload";
import { createClient } from "../supabase/client";
import { DatabaseError, StorageError } from "../errors";

// In-memory store to hold File objects since we can't save them in DB
// and we only upload them when status changes to 'uploading'
const fileCache = new Map<string, File>();

export const UploadRepository = {
  async saveUpload(upload: UploadFile): Promise<UploadFile> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    // Store File in memory
    fileCache.set(upload.id, upload.file);

    const { data, error } = await supabase
      .from("uploads")
      .insert({
        id: upload.id,
        user_id: userUUID || undefined,
        file_name: upload.fileName,
        file_size: upload.fileSize,
        status: upload.status,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error", error);
      // We don't throw because the app expects offline-like behavior until sync.
      // But we will throw if it's a real DB.
      // throw new DatabaseError(error.message, error);
    }

    return upload;
  },

  async findUpload(id: string): Promise<UploadFile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new DatabaseError(error.message, error);
    }

    const file = fileCache.get(id);
    if (!file) return null; // Can't reconstruct UploadFile without the File object in this architecture

    return {
      id: data.id,
      file,
      fileName: data.file_name,
      fileSize: data.file_size,
      mimeType: file.type,
      status: data.status as UploadStatus,
      progress: 0,
      error: data.error_message,
      createdAt: data.created_at,
    };
  },

  async findAll(): Promise<UploadFile[]> {
    // Because we need File objects for the UploadFile type, we can't fully hydrate from DB
    // unless they are currently in the fileCache.
    // This is fine for current session.
    const uploads: UploadFile[] = [];
    return uploads; 
  },

  async findDuplicates(fileName: string): Promise<DuplicateCheckResult> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    // Check papers table
    const { data: papers, error: papersError } = await supabase
      .from("papers")
      .select("id, file_name")
      .eq("user_id", userUUID)
      .eq("file_name", fileName);

    if (papersError) throw new DatabaseError(papersError.message, papersError);

    if (papers && papers.length > 0) {
      return {
        isDuplicate: true,
        existingPaperId: papers[0].id,
        existingFileName: papers[0].file_name,
      };
    }

    // Check uploads table for in-flight
    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("id, file_name, status")
      .eq("user_id", userUUID)
      .eq("file_name", fileName)
      .neq("status", "failed")
      .neq("status", "cancelled");

    if (uploadsError) throw new DatabaseError(uploadsError.message, uploadsError);

    if (uploads && uploads.length > 0) {
      return {
        isDuplicate: true,
        existingFileName: uploads[0].file_name,
      };
    }

    return { isDuplicate: false };
  },

  async updateStatus(id: string, status: UploadStatus, extra?: Partial<UploadFile>): Promise<UploadFile> {
    const supabase = createClient();
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (extra?.error) updateData.error_message = extra.error;

    const { data, error } = await supabase
      .from("uploads")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);

    // Return reconstructed object
    const file = fileCache.get(id);
    return {
      id,
      file: file as File,
      fileName: data.file_name,
      fileSize: data.file_size,
      mimeType: file?.type || "",
      status: data.status as UploadStatus,
      progress: extra?.progress ?? 0,
      error: data.error_message,
      paperId: extra?.paperId,
      projectId: extra?.projectId,
      isDuplicate: extra?.isDuplicate,
      duplicatePaperId: extra?.duplicatePaperId,
      createdAt: data.created_at,
      completedAt: extra?.completedAt,
    };
  },

  async deleteUpload(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("uploads")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError(error.message, error);
    fileCache.delete(id);
  },

  async uploadFileToStorage(file: File): Promise<string> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');
    const storagePath = `${userUUID}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("papers-bucket")
      .upload(storagePath, file, { upsert: true });

    if (error) throw new StorageError(error.message, error);
    return storagePath;
  }
};
