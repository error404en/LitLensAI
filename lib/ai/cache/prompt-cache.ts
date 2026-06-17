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

  static async get(messages: Message[]): Promise<string | null> {
    const key = this.hash(messages);
    return this.getCache().get(key);
  }

  static async set(messages: Message[], response: string): Promise<void> {
    const key = this.hash(messages);
    await this.getCache().set(key, response);
  }

  private static hash(messages: Message[]): string {
    // Basic structural hashing for caching exact prompts
    return Buffer.from(JSON.stringify(messages)).toString("base64");
  }
}
