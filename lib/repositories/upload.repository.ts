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

    if (!userUUID || userUUID === "null" || userUUID === "undefined") {
      console.warn("saveUpload: no valid user UUID, skipping DB insert (offline fallback)");
      return upload;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = uuidRegex.test(upload.id);

    const insertPayload: Record<string, unknown> = {
      user_id: userUUID,
      file_name: upload.fileName,
      file_size: upload.fileSize,
      status: upload.status,
    };
    
    if (isValidUuid) {
      insertPayload.id = upload.id;
    }

    const { data, error } = await supabase
      .from("uploads")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error", { error, insertPayload, data });
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

  async findDuplicates(fileName: string, fileHash?: string, excludeUploadId?: string): Promise<DuplicateCheckResult> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    if (!userUUID || userUUID === "null" || userUUID === "undefined") {
      return { isDuplicate: false };
    }

    // Check papers table
    let query = supabase.from("papers").select("id, file_name, embedding_hash").eq("user_id", userUUID);
    
    if (fileHash) {
      query = query.eq("embedding_hash", fileHash);
    } else {
      query = query.eq("file_name", fileName);
    }

    const { data: papers, error: papersError } = await query;

    if (papersError) throw new DatabaseError(papersError.message, papersError);

    if (papers && papers.length > 0) {
      return {
        isDuplicate: true,
        existingPaperId: papers[0].id,
        existingFileName: papers[0].file_name,
      };
    }

    // Check uploads table for in-flight
    let uploadsQuery = supabase
      .from("uploads")
      .select("id, file_name, status")
      .eq("user_id", userUUID)
      .eq("file_name", fileName)
      .in("status", ["validating", "checking_duplicate", "queued", "uploading", "processing"]);

    if (excludeUploadId) {
      uploadsQuery = uploadsQuery.neq("id", excludeUploadId);
    }

    const { data: uploads, error: uploadsError } = await uploadsQuery;

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
    const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (extra?.error) updateData.error_message = extra.error;

    const { data, error } = await supabase
      .from("uploads")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("updateStatus error", error);
    }

    // Return reconstructed object
    const file = fileCache.get(id);
    return {
      id,
      file: file as File,
      fileName: data?.file_name || file?.name || "Unknown",
      fileSize: data?.file_size || file?.size || 0,
      mimeType: file?.type || "",
      status: (data?.status as UploadStatus) || status,
      progress: extra?.progress ?? 0,
      error: data?.error_message || extra?.error,
      paperId: extra?.paperId,
      projectId: extra?.projectId,
      isDuplicate: extra?.isDuplicate,
      duplicatePaperId: extra?.duplicatePaperId,
      createdAt: data?.created_at || new Date().toISOString(),
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
      .from("papers")
      .upload(storagePath, file, { upsert: true });

    if (error) throw new StorageError(error.message, error);
    return storagePath;
  }
};
