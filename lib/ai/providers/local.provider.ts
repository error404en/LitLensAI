import { AIProvider } from "./ai-provider.interface";
import { Message } from "../prompt/prompt-builder";

export class LocalProvider implements AIProvider {
  async generate(messages: Message[]): Promise<string> {
    return "[Local] I am currently operating in mock mode. Please configure your local LLM (e.g. Ollama) to enable full responses.";
  }

  async embed(text: string): Promise<number[]> {
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return texts.map(() => new Array(1536).fill(0).map(() => Math.random() - 0.5));
  }

  async *stream(messages: Message[]): AsyncIterable<string> {
    const response = "[Local] I am currently operating in mock mode. Please configure your local LLM (e.g. Ollama) to enable full responses.";
    for (const char of response) {
      yield char;
      await new Promise(r => setTimeout(r, 10));
    }
  }

  async health(): Promise<boolean> {
    return false;
  }
}
