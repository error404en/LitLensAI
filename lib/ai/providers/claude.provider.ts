import { AIProvider } from "./ai-provider.interface";
import { Message } from "../prompt/prompt-builder";
import { StreamEvent } from "../stream/stream-handler";

export class ClaudeProvider implements AIProvider {
  async generate(messages: Message[]): Promise<string> {
    throw new Error("ClaudeProvider is a placeholder and not yet implemented.");
  }

  async embed(text: string): Promise<number[]> {
    throw new Error("ClaudeProvider is a placeholder and not yet implemented.");
  }

  async stream(messages: Message[]): Promise<AsyncIterable<string>> {
    throw new Error("ClaudeProvider is a placeholder and not yet implemented.");
  }

  async health(): Promise<boolean> {
    return false;
  }
}
