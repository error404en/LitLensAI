import { ICache } from "./index";
import { MemoryCache } from "./memory-cache";
import { Message } from "../prompt/prompt-builder";

export class PromptCache {
  private static instance: ICache<string, string>;

  static getCache(): ICache<string, string> {
    if (!this.instance) {
      this.instance = new MemoryCache<string, string>();
    }
    return this.instance;
  }

  static async get(messages: Message[], orgId?: string): Promise<string | null> {
    const key = this.hash(messages, orgId);
    return this.getCache().get(key);
  }

  static async set(messages: Message[], response: string, orgId?: string): Promise<void> {
    const key = this.hash(messages, orgId);
    await this.getCache().set(key, response);
  }

  private static hash(messages: Message[], orgId?: string): string {
    // Basic structural hashing for caching exact prompts
    const base = Buffer.from(JSON.stringify(messages)).toString("base64");
    return orgId ? `org_${orgId}:${base}` : `user:${base}`;
  }
}
