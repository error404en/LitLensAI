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
        user_id: (params.userId && params.userId !== "null" && params.userId !== "undefined") ? params.userId : undefined,
        project_id: (params.projectId && params.projectId !== "null" && params.projectId !== "undefined") ? params.projectId : undefined,
        paper_id: (params.paperId && params.paperId !== "null" && params.paperId !== "undefined") ? params.paperId : undefined,
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
