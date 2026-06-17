import { adminClient } from "../supabase/admin";

export interface PromptLogParams {
  userId: string;
  feature: string;
  prompt: string;
  response?: string;
  tokensUsed?: number;
  provider?: string;
  model?: string;
  durationMs?: number;
}

export const PromptRepository = {
  async logPrompt(params: PromptLogParams) {
    const { error } = await adminClient
      .from("prompt_logs")
      .insert({
        user_id: params.userId,
        feature: params.feature,
        prompt: params.prompt,
        response: params.response,
        tokens_used: params.tokensUsed,
        provider: params.provider,
        model: params.model,
        duration_ms: params.durationMs,
      });

    if (error) {
      console.error("Failed to log prompt", error);
    }
  }
};
