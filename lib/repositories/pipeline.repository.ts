import { adminClient } from "../supabase/admin";

export const PipelineRepository = {
  async upsertJob(paperId: string, status: string, error?: string) {
    const supabase = adminClient;
    
    // First try to find existing job
    const { data: existing } = await supabase
      .from("pipeline_jobs")
      .select("id")
      .eq("paper_id", paperId)
      .single();

    if (existing) {
      await supabase
        .from("pipeline_jobs")
        .update({ status, error, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("pipeline_jobs")
        .insert({ paper_id: paperId, status, error });
    }
  },

  async log(paperId: string, step: string, message: string) {
    const supabase = adminClient;
    
    const { data: job } = await supabase
      .from("pipeline_jobs")
      .select("id")
      .eq("paper_id", paperId)
      .single();

    if (job) {
      await supabase
        .from("processing_logs")
        .insert({ job_id: job.id, step, message });
    }
  }
};
