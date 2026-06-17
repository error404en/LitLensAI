import { ProviderType } from "../providers/registry";

export class CostEstimator {
  private static PRICING: Record<ProviderType, { input: number; output: number }> = {
    openai: { input: 0.0005 / 1000, output: 0.0015 / 1000 }, // gpt-3.5-turbo equivalent prices
    claude: { input: 0.0030 / 1000, output: 0.0150 / 1000 },
    gemini: { input: 0.0000 / 1000, output: 0.0000 / 1000 },
    local: { input: 0, output: 0 },
  };

  static estimate(provider: ProviderType, promptTokens: number, completionTokens: number): number {
    const pricing = this.PRICING[provider] || this.PRICING.openai;
    return (promptTokens * pricing.input) + (completionTokens * pricing.output);
  }
}
