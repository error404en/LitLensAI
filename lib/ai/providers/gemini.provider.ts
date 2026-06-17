import { AIProvider } from "./ai-provider.interface";
import { Message } from "../prompt/prompt-builder";

export class GeminiProvider implements AIProvider {
  async generate(messages: Message[]): Promise<string> {
    throw new Error("GeminiProvider is a placeholder and not yet implemented.");
  }

  async embed(text: string): Promise<number[]> {
    throw new Error("GeminiProvider is a placeholder and not yet implemented.");
  }

  async stream(messages: Message[]): Promise<AsyncIterable<string>> {
    throw new Error("GeminiProvider is a placeholder and not yet implemented.");
  }

  async health(): Promise<boolean> {
    return false;
  }
}
