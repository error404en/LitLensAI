import { CostEstimator } from "./CostEstimator";
import { ProviderType } from "../providers/registry";
import { UsageRepository } from "../../repositories/usage.repository";

export interface UsageMetrics {
  userId: string;
  orgId?: string;
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

      if (metrics.orgId) {
        const { adminClient } = await import("../../supabase/admin");
        // We use RPC for atomic increment, but for simplicity here we just call a standard update or do it via edge function.
        // As a fallback, doing a read-then-write if RPC is not available.
        // A real implementation would use a supabase function.
        const { data } = await adminClient.from("org_usage").select("monthly_generations").eq("org_id", metrics.orgId).single();
        if (data) {
          await adminClient.from("org_usage").update({ monthly_generations: data.monthly_generations + 1 }).eq("org_id", metrics.orgId);
        } else {
          await adminClient.from("org_usage").insert({ org_id: metrics.orgId, monthly_generations: 1 });
        }
      }
    } catch (error) {
      console.error("Failed to track usage:", error);
    }
  }
}
