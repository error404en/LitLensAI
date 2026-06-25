import { Annotation, Highlight } from "../types";
import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";

export interface AnnotationRow {
  id: string;
  paper_id: string;
  user_id: string;
  page_number: number;
  content: string;
  position_x?: number;
  position_y?: number;
  created_at: string;
  updated_at: string;
}

export interface HighlightRow {
  id: string;
  paper_id: string;
  user_id: string;
  page_number: number;
  text: string;
  color: string;
  created_at: string;
  updated_at: string;
}

function mapAnnotation(row: AnnotationRow): Annotation {
  return {
    id: row.id,
    paperId: row.paper_id,
    userId: row.user_id,
    pageNumber: row.page_number,
    content: row.content,
    positionX: row.position_x !== null ? Number(row.position_x) : undefined,
    positionY: row.position_y !== null ? Number(row.position_y) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapHighlight(row: HighlightRow): Highlight {
  return {
    id: row.id,
    paperId: row.paper_id,
    userId: row.user_id,
    pageNumber: row.page_number,
    text: row.text,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const AnnotationRepository = {
  async getAnnotations(paperId: string): Promise<Annotation[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("annotations")
      .select("*")
      .eq("paper_id", paperId)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapAnnotation);
  },

  async getHighlights(paperId: string): Promise<Highlight[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .eq("paper_id", paperId)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapHighlight);
  },

  async countAnnotationsByProject(projectId: string): Promise<number> {
    const supabase = createClient();
    // Inner join via papers
    const { count, error } = await supabase
      .from("annotations")
      .select("id, papers!inner(project_id)", { count: "exact", head: true })
      .eq("papers.project_id", projectId);

    if (error) throw new DatabaseError(error.message, error);
    return count || 0;
  },

  async countHighlightsByProject(projectId: string): Promise<number> {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("highlights")
      .select("id, papers!inner(project_id)", { count: "exact", head: true })
      .eq("papers.project_id", projectId);

    if (error) throw new DatabaseError(error.message, error);
    return count || 0;
  },

  async createAnnotation(annotation: Omit<Annotation, "id" | "createdAt" | "updatedAt" | "userId">): Promise<Annotation> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    if (!userUUID) {
      throw new DatabaseError("User not authenticated", undefined);
    }

    const { data, error } = await supabase
      .from("annotations")
      .insert({
        paper_id: annotation.paperId,
        user_id: userUUID,
        page_number: annotation.pageNumber,
        content: annotation.content,
        position_x: annotation.positionX,
        position_y: annotation.positionY,
      })
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return mapAnnotation(data);
  },

  async createHighlight(highlight: Omit<Highlight, "id" | "createdAt" | "updatedAt" | "userId">): Promise<Highlight> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    if (!userUUID) {
      throw new DatabaseError("User not authenticated", undefined);
    }

    const { data, error } = await supabase
      .from("highlights")
      .insert({
        paper_id: highlight.paperId,
        user_id: userUUID,
        page_number: highlight.pageNumber,
        text: highlight.text,
        color: highlight.color || "#ffeb3b",
      })
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return mapHighlight(data);
  }
};
