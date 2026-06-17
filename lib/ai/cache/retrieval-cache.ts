import { ICache } from "./index";
import { MemoryCache } from "./memory-cache";
import { RankedChunk } from "../ranking/ranker";

export class RetrievalCache {
  private static instance: ICache<string, RankedChunk[]>;

  static getCache(): ICache<string, RankedChunk[]> {
    if (!this.instance) {
      this.instance = new MemoryCache<string, RankedChunk[]>();
    }
    return this.instance;
  }

  static async get(query: string, scopeId?: string): Promise<RankedChunk[] | null> {
    const key = this.hash(query, scopeId);
    return this.getCache().get(key);
  }

  static async set(query: string, chunks: RankedChunk[], scopeId?: string): Promise<void> {
    const key = this.hash(query, scopeId);
    await this.getCache().set(key, chunks);
  }

  private static hash(query: string, scopeId?: string): string {
    return Buffer.from(`${query}:${scopeId || "global"}`).toString("base64");
  }
}
