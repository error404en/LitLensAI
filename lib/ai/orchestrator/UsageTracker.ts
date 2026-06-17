import { CostEstimator } from "./CostEstimator";
import { ProviderType } from "../providers/registry";
import { UsageRepository } from "../../repositories/usage.repository";

export interface UsageMetrics {
  userId: string;
  executionId: string;
  promptTokens: number;
  completionTokens: number;
  provider: ProviderType;
}

export class UsageTracker {
  static async track(metrics: UsageMetrics) {
    const totalTokens = metrics.promptTokens + metrics.completionTokens;
    const estimatedCostUsd = CostEstimator.estimate(metrics.provider, metrics.promptTokens, metrics.completionTokens);
    
    try {
      await UsageRepository.trackUsage({
        executionId: metrics.executionId,
        userId: metrics.userId,
        promptTokens: metrics.promptTokens,
        completionTokens: metrics.completionTokens,
        totalTokens,
        estimatedCostUsd
      });
    } catch (error) {
      console.error("Failed to track usage:", error);
    }
  }
}
