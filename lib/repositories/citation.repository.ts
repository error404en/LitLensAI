import { adminClient } from "../supabase/admin";
import { Citation } from "../ai/orchestrator/CitationResolver";

export const CitationRepository = {
  async saveCitations(executionId: string, citations: Citation[]) {
    if (!citations || citations.length === 0) return;

    const inserts = citations.map(c => ({
      execution_id: executionId,
      paper_id: c.paperId,
      chunk_id: c.chunkId,
      page_number: c.pageNumber,
      text_content: c.snippet,
      confidence_score: c.confidence
    }));

    const { error } = await adminClient
      .from("ai_citations")
      .insert(inserts);

    if (error) throw error;
  }
};
