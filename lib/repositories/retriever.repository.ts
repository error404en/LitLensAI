import { adminClient } from "../supabase/admin";
import { QdrantRepository } from "../ai/vector/qdrant.client";

export const RetrieverRepository = {
  async searchSimilarChunks(vector: number[], filter?: any, limit: number = 5) {
    const qdrant = new QdrantRepository();
    // Similarity search in Qdrant
    const points = await qdrant.similaritySearch(vector, filter, limit);

    if (!points || points.length === 0) return [];

    // Optionally hydrate from Postgres if we need full Chunk data that isn't in Qdrant payload
    // However, our Qdrant payload contains content, pageNumber, paperId, chunkId.
    // That is sufficient for retrieval.
    return points.map(p => ({
      score: p.score,
      chunkId: p.payload?.chunkId as string,
      paperId: p.payload?.paperId as string,
      pageNumber: p.payload?.pageNumber as number,
      content: p.payload?.content as string,
    }));
  },

  async getPaperIdsForProject(projectId: string): Promise<string[]> {
    const { data, error } = await adminClient
      .from("papers")
      .select("id")
      .eq("project_id", projectId)
      .is("deleted_at", null);

    if (error) throw error;
    return data.map(d => d.id);
  }
};
