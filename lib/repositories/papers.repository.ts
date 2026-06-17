import { Paper, PaperStatus, Author, PaperSummary } from "../types";
import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";

export interface PaperRow {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  authors: Author[] | string;
  abstract: string;
  year: number;
  journal?: string;
  tags: string[] | string;
  status: string;
  summary?: PaperSummary | string;
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  is_favorite: boolean;
  embedding_created: boolean;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

function mapPaper(row: PaperRow): Paper {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    title: row.title,
    authors: typeof row.authors === 'string' ? JSON.parse(row.authors) : row.authors,
    abstract: row.abstract,
    year: row.year,
    journal: row.journal,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    status: row.status as PaperStatus,
    summary: typeof row.summary === 'string' ? JSON.parse(row.summary) : row.summary,
    fileUrl: row.file_url,
    fileName: row.file_name,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    isFavorite: row.is_favorite,
    embeddingCreated: row.embedding_created,
    uploadedAt: row.uploaded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const PapersRepository = {
  async findAll(): Promise<Paper[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapPaper);
  },

  async findById(id: string): Promise<Paper | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new DatabaseError(error.message, error);
    }
    return mapPaper(data);
  },

  async findByProjectId(projectId: string): Promise<Paper[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .eq("project_id", projectId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapPaper);
  },

  async create(paper: Omit<Paper, "id" | "createdAt" | "updatedAt" | "uploadedAt" | "userId">): Promise<Paper> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    const { data, error } = await supabase
      .from("papers")
      .insert({
        project_id: paper.projectId,
        user_id: userUUID || undefined,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        year: paper.year,
        journal: paper.journal,
        tags: paper.tags,
        status: paper.status,
        summary: paper.summary,
        file_url: paper.fileUrl,
        file_name: paper.fileName,
        file_size: paper.fileSize,
        mime_type: paper.mimeType,
        is_favorite: paper.isFavorite || false,
        embedding_created: paper.embeddingCreated || false,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return mapPaper(data);
  },

  async update(id: string, updates: Partial<Omit<Paper, "id" | "createdAt" | "updatedAt" | "userId">>): Promise<Paper> {
    const supabase = createClient();
    
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.authors !== undefined) updateData.authors = updates.authors;
    if (updates.abstract !== undefined) updateData.abstract = updates.abstract;
    if (updates.year !== undefined) updateData.year = updates.year;
    if (updates.journal !== undefined) updateData.journal = updates.journal;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.summary !== undefined) updateData.summary = updates.summary;
    if (updates.fileUrl !== undefined) updateData.file_url = updates.fileUrl;
    if (updates.fileName !== undefined) updateData.file_name = updates.fileName;
    if (updates.fileSize !== undefined) updateData.file_size = updates.fileSize;
    if (updates.mimeType !== undefined) updateData.mime_type = updates.mimeType;
    if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
    if (updates.embeddingCreated !== undefined) updateData.embedding_created = updates.embeddingCreated;

    const { data, error } = await supabase
      .from("papers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return mapPaper(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("papers")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new DatabaseError(error.message, error);
  }
};
