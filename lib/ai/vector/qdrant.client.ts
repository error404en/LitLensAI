import { QdrantClient } from "@qdrant/js-client-rest";

export interface VectorPoint {
  id: string; // UUID
  vector: number[];
  payload: Record<string, unknown>;
}

export class QdrantRepository {
  private client: QdrantClient;
  private collectionName = "litlens_papers_gemini";

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || "http://localhost:6333",
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  /**
   * Ensure the collection exists.
   */
  async initCollection(vectorSize: number = 768) {
    try {
      const exists = await this.client.collectionExists(this.collectionName);
      if (!exists.exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: vectorSize,
            distance: "Cosine",
          },
        });
      }
    } catch (error) {
      console.error("Qdrant init error:", error);
    }
  }

  /**
   * Insert multiple points
   */
  async insertVectors(points: VectorPoint[]) {
    await this.client.upsert(this.collectionName, {
      wait: true,
      points: points.map((p) => ({
        id: p.id,
        vector: p.vector,
        payload: p.payload,
      })),
    });
  }

  /**
   * Search for similar vectors
   */
  async similaritySearch(vector: number[], filter?: Record<string, unknown>, limit: number = 5) {
    return this.client.search(this.collectionName, {
      vector: vector,
      filter: filter,
      limit: limit,
      with_payload: true,
    });
  }

  /**
   * Delete all vectors for a paper
   */
  async deletePaperVectors(paperId: string) {
    await this.client.delete(this.collectionName, {
      wait: true,
      filter: {
        must: [{ key: "paperId", match: { value: paperId } }],
      },
    });
  }
}
