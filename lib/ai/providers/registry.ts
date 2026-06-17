import { AIProvider } from "./ai-provider.interface";
import { OpenAIProvider } from "./openai.provider";

export type ProviderType = "openai" | "claude" | "gemini" | "local";

export class ProviderRegistry {
  private providers: Map<ProviderType, AIProvider> = new Map();

  constructor() {
    // Register default providers
    this.register("openai", new OpenAIProvider());
    // ClaudeProvider and GeminiProvider would be added here
  }

  register(name: ProviderType, provider: AIProvider) {
    this.providers.set(name, provider);
  }

  getProvider(name: ProviderType = "openai"): AIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found`);
    }
    return provider;
  }
}

// Singleton export
export const providerRegistry = new ProviderRegistry();
