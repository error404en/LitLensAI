import { adminClient } from "../supabase/admin";
import { ProviderType } from "../ai/providers/registry";

export interface UsageMetricInsert {
  executionId: string;
  userId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export const UsageRepository = {
  async trackUsage(metric: UsageMetricInsert) {
    const { error } = await adminClient
      .from("ai_usage_metrics")
      .insert({
        execution_id: metric.executionId,
        user_id: metric.userId,
        prompt_tokens: metric.promptTokens,
        completion_tokens: metric.completionTokens,
        total_tokens: metric.totalTokens,
        estimated_cost_usd: metric.estimatedCostUsd
      });

    if (error) throw error;
  }
};
