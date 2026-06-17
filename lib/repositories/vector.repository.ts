import { adminClient } from "../supabase/admin";

interface VectorMetadataParams {
  chunkId: string;
  qdrantPointId: string;
}

export const VectorRepository = {
  async insertMetadata(paperId: string, metadata: VectorMetadataParams[]) {
    const supabase = adminClient;
    
    const insertData = metadata.map(m => ({
      paper_id: paperId,
      chunk_id: m.chunkId,
      qdrant_point_id: m.qdrantPointId,
    }));

    const { data, error } = await supabase
      .from("vector_metadata")
      .insert(insertData)
      .select();

    if (error) throw error;
    return data;
  }
};
