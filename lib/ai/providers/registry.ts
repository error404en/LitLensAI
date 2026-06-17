import { AIProvider } from "./ai-provider.interface";
import { OpenAIProvider } from "./openai.provider";
import { ClaudeProvider } from "./claude.provider";
import { GeminiProvider } from "./gemini.provider";
import { LocalProvider } from "./local.provider";

export type ProviderType = "openai" | "claude" | "gemini" | "local";

export class ProviderRegistry {
  private providers: Map<ProviderType, AIProvider> = new Map();

  constructor() {
    this.register("openai", new OpenAIProvider());
    this.register("claude", new ClaudeProvider());
    this.register("gemini", new GeminiProvider());
    this.register("local", new LocalProvider());
  }

  register(name: ProviderType, provider: AIProvider) {
    this.providers.set(name, provider);
  }

  getProvider(name: ProviderType): AIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} is not registered.`);
    }
    return provider;
  }
}

export const providerRegistry = new ProviderRegistry();
