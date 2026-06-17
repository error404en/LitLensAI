import { adminClient } from "../supabase/admin";

export interface CreateExecutionParams {
  userId: string;
  projectId?: string;
  paperId?: string;
  taskName: string;
  featureName: string;
  provider: string;
  model: string;
}

export const AIExecutionRepository = {
  async create(params: CreateExecutionParams) {
    const { data, error } = await adminClient
      .from("ai_executions")
      .insert({
        user_id: params.userId,
        project_id: params.projectId,
        paper_id: params.paperId,
        task_name: params.taskName,
        feature_name: params.featureName,
        provider: params.provider,
        model: params.model,
        status: "running"
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: "completed" | "failed", executionTimeMs?: number, errorMessage?: string) {
    const { error } = await adminClient
      .from("ai_executions")
      .update({
        status,
        execution_time_ms: executionTimeMs,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;
  }
};
