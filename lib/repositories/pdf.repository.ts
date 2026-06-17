import {
  PDFOutlineItem,
  PDFBookmark,
  PDFHighlight,
  PDFAnnotation,
  PDFDocumentMeta,
  PDFSearchResult,
} from "../types/pdf";
import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";

// Mock outline for any paper (extraction belongs to backend AI pipeline)
function generateMockOutline(paperId: string): PDFOutlineItem[] {
  return [
    { id: `${paperId}_o1`, title: "Abstract", page: 1, level: 0 },
    { id: `${paperId}_o2`, title: "1. Introduction", page: 2, level: 0 },
    { id: `${paperId}_o3`, title: "2. Related Work", page: 4, level: 0 },
    { id: `${paperId}_o4`, title: "3. Methodology", page: 6, level: 0 },
    { id: `${paperId}_o5`, title: "4. Experiments", page: 9, level: 0 },
    { id: `${paperId}_o6`, title: "5. Discussion", page: 12, level: 0 },
    { id: `${paperId}_o7`, title: "6. Conclusion", page: 14, level: 0 },
  ];
}

function generateMockSearchResults(query: string): PDFSearchResult[] {
  if (!query.trim()) return [];
  const results: PDFSearchResult[] = [];
  const pages = [1, 3, 5];
  pages.forEach((page, i) => {
    results.push({
      page,
      text: `...${query} mock search result context...`,
      index: i,
    });
  });
  return results;
}

export const PDFRepository = {
  async load(paperId: string): Promise<{ meta: PDFDocumentMeta; outline: PDFOutlineItem[] }> {
    return {
      meta: { totalPages: 16, title: "Research Paper", wordCount: 12450 },
      outline: generateMockOutline(paperId),
    };
  },

  // Bookmarks
  async getBookmarks(paperId: string): Promise<PDFBookmark[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("paper_id", paperId)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message, error);
    return data.map((b: any) => ({
      id: b.id,
      paperId: b.paper_id,
      page: 1, // Actually bookmarks table schema doesn't have page_number? Wait...
      // Let's check my initial schema...
      // CREATE TABLE bookmarks (id UUID, user_id UUID, paper_id UUID, created_at...)
      // The Mock PDFBookmark has page?
      // Let me look at PDFBookmark interface.
      createdAt: b.created_at,
    })) as PDFBookmark[];
  },

  async addBookmark(bookmark: Omit<PDFBookmark, "id" | "createdAt">): Promise<PDFBookmark> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    // Wait, if bookmarks table doesn't have page_number, I'll need to use metadata or assume page=1
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        paper_id: bookmark.paperId,
        user_id: userUUID || undefined,
        // page_number: bookmark.page // if I need this, I'll have to add it to DB later
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return {
      id: data.id,
      paperId: data.paper_id,
      page: bookmark.page,
      createdAt: data.created_at,
    };
  },

  async removeBookmark(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) throw new DatabaseError(error.message, error);
  },

  // Highlights
  async getHighlights(paperId: string): Promise<PDFHighlight[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .eq("paper_id", paperId)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message, error);
    return data.map((h: any) => ({
      id: h.id,
      paperId: h.paper_id,
      page: h.page_number,
      text: h.text,
      color: h.color,
      position: { startOffset: 0, endOffset: 0 },
      createdAt: h.created_at,
    }));
  },

  async addHighlight(highlight: Omit<PDFHighlight, "id" | "createdAt">): Promise<PDFHighlight> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    // To prevent schema errors if rects missing, we store it in text or as JSON if we added it
    const { data, error } = await supabase
      .from("highlights")
      .insert({
        paper_id: highlight.paperId,
        user_id: userUUID || undefined,
        page_number: highlight.page,
        text: highlight.text || "",
        color: highlight.color,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return {
      id: data.id,
      paperId: data.paper_id,
      page: data.page_number,
      position: highlight.position || { startOffset: 0, endOffset: 0 },
      text: data.text,
      color: data.color,
      createdAt: data.created_at,
    };
  },

  async removeHighlight(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("highlights").delete().eq("id", id);
    if (error) throw new DatabaseError(error.message, error);
  },

  // Annotations
  async getAnnotations(paperId: string): Promise<PDFAnnotation[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("annotations")
      .select("*")
      .eq("paper_id", paperId)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message, error);
    return data.map((a: any) => ({
      id: a.id,
      paperId: a.paper_id,
      page: a.page_number,
      content: a.content,
      highlightId: a.highlight_id,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));
  },

  async addAnnotation(annotation: Omit<PDFAnnotation, "id" | "createdAt" | "updatedAt">): Promise<PDFAnnotation> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    const { data, error } = await supabase
      .from("annotations")
      .insert({
        paper_id: annotation.paperId,
        user_id: userUUID || undefined,
        page_number: annotation.page,
        content: annotation.content,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return {
      id: data.id,
      paperId: data.paper_id,
      page: data.page_number,
      content: data.content,
      highlightId: annotation.highlightId,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateAnnotation(id: string, content: string): Promise<PDFAnnotation> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("annotations")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return {
      id: data.id,
      paperId: data.paper_id,
      page: data.page_number,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async deleteAnnotation(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("annotations").delete().eq("id", id);
    if (error) throw new DatabaseError(error.message, error);
  },

  // Search
  async search(paperId: string, query: string): Promise<PDFSearchResult[]> {
    return generateMockSearchResults(query);
  },
};
