import { AIProvider } from "./ai-provider.interface";
import { Message } from "../prompt/prompt-builder";

export class LocalProvider implements AIProvider {
  async generate(messages: Message[]): Promise<string> {
    throw new Error("LocalProvider is a placeholder and not yet implemented.");
  }

  async embed(text: string): Promise<number[]> {
    throw new Error("LocalProvider is a placeholder and not yet implemented.");
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    throw new Error("LocalProvider is a placeholder and not yet implemented.");
  }

  async *stream(messages: Message[]): AsyncIterable<string> {
    throw new Error("LocalProvider is a placeholder and not yet implemented.");
  }

  async health(): Promise<boolean> {
    return false;
  }
}
