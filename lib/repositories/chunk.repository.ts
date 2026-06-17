import { adminClient } from "../supabase/admin";
import { ChunkResult } from "../ai/chunker/chunker";

export const ChunkRepository = {
  async insertChunks(paperId: string, chunks: ChunkResult[]) {
    const supabase = adminClient;
    
    const insertData = chunks.map(c => ({
      paper_id: paperId,
      page_number: c.pageNumber,
      content: c.content,
      token_count: c.tokenCount,
      chunk_index: c.chunkIndex,
    }));

    const { data, error } = await supabase
      .from("paper_chunks")
      .insert(insertData)
      .select();

    if (error) throw error;
    return data;
  }
};
